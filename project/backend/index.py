from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector import pooling
import uuid
import redis
import bcrypt
import random
from datetime import datetime, timedelta
import json
import logging
import os
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Indian Tourism API", version="1.0.0")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourfrontend.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
class Config:
    REDIS_URL = os.getenv("REDIS_URL")
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")

    DB_CONFIG = {
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT"),
        "database": os.getenv("DB_NAME"),
    }

# Database connection pool
try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="tourism_pool",
        pool_size=10,
        **Config.DB_CONFIG
    )
    logger.info("Database connection pool created successfully")
except mysql.connector.Error as e:
    logger.error(f"Database connection pool creation failed: {e}")
    connection_pool = None

# Redis connection
try:
    redis_client = redis.Redis.from_url(
        Config.REDIS_URL,
        password=Config.REDIS_PASSWORD,
        decode_responses=True,
        socket_timeout=5,
        socket_connect_timeout=5
    )
    redis_client.ping()
    logger.info("Connected to Redis successfully!")
except redis.exceptions.ConnectionError as e:
    logger.error(f"Redis connection error: {e}")
    redis_client = None

# Models
class User(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class Booking(BaseModel):
    hotel_name: str
    number_of_rooms: int
    number_of_adults: int
    number_of_children: int = 0
    cost_per_room: float 
    user_id: int
    user_name: str
    check_in: Optional[str] = None
    check_out: Optional[str] = None

class ChatQuery(BaseModel):
    query: str
    session_id: Optional[str] = None

class DestinationQuery(BaseModel):
    location: str
    interests: Optional[List[str]] = None

class Review(BaseModel):
    destination: str
    rating: int
    comment: str
    user_id: int

# Utility functions
def get_db_connection():
    try:
        return connection_pool.get_connection()
    except mysql.connector.Error as e:
        logger.error(f"Database connection error: {e}")
        return None

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def get_current_user(session_id: str):
    if not redis_client:
        return None
    username = redis_client.get(session_id)
    return username

# Authentication Endpoints
@app.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: User):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failed"
        )

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT username FROM users WHERE username = %s", (user.username,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )

        hashed_password = hash_password(user.password)
        cursor.execute(
            "INSERT INTO users (username, password) VALUES (%s, %s)",
            (user.username, hashed_password)
        )
        conn.commit()
        return {"message": "User created successfully"}
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

@app.post("/login")
async def login(user: UserLogin):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failed"
        )

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, username, password FROM users WHERE username = %s",
            (user.username,)
        )
        db_user = cursor.fetchone()
        
        if not db_user or not verify_password(user.password, db_user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        session_id = str(uuid.uuid4())
        if redis_client:
            redis_client.setex(session_id, 3600, db_user["username"])
        
        return {
            "message": "Login successful",
            "session_id": session_id,
            "user_id": db_user["id"],
            "username": db_user["username"]
        }
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()


# Booking Endpoints
@app.post("/bookings", status_code=status.HTTP_201_CREATED)
async def create_booking(booking: Booking, request: Request):
    # Verify session
    session_id = request.headers.get("session-id")
    if not session_id or not get_current_user(session_id):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    conn = get_db_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failed"
        )

    try:
        cursor = conn.cursor()
        # Calculate total cost
        total_cost = booking.number_of_rooms * booking.cost_per_room * booking.number_of_adults
        
        cursor.execute(
            """INSERT INTO bookings 
            (hotel_name, number_of_rooms, number_of_adults, number_of_children, 
             total_cost, user_id, user_name, check_in, check_out)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                booking.hotel_name,
                booking.number_of_rooms,
                booking.number_of_adults,
                booking.number_of_children,
                total_cost,
                booking.user_id,
                booking.user_name,
                booking.check_in,
                booking.check_out,
            )
        )
        conn.commit()
        
        # Cache booking in Redis
        if redis_client:
            booking_data = {
                "hotel_name": booking.hotel_name,
                "total_cost": total_cost,
                "check_in": booking.check_in,
                "check_out": booking.check_out
            }
            redis_client.setex(
                f"user:{booking.user_id}:last_booking",
                86400,
                json.dumps(booking_data)
            )
        
        return {
            "message": "Booking created successfully",
            "total_cost": total_cost,
            "booking_id": cursor.lastrowid
        }
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

@app.get("/bookings/{user_id}")
async def get_user_bookings(user_id: int, request: Request):
    # Verify session
    session_id = request.headers.get("session-id")
    if not session_id or not get_current_user(session_id):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    conn = get_db_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failed"
        )

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM bookings WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,)
        )
        bookings = cursor.fetchall()
        return {"bookings": bookings}
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

# Enhanced Chatbot Endpoint
@app.post("/chatbot")
async def chatbot(query: ChatQuery):
    # Expanded knowledge base
    knowledge_base = {
        "general": {
            "contact": [
                "You can contact us at support@indiantourism.com or call +91-9876543210",
                "Our 24/7 helpline numbers: 1800-123-4567 (Domestic), +91-9876543210 (International)"
            ],
            "greetings": [
                "Namaste! Welcome to India Tourism Assistant. How can I help you today?",
                "Hello! I'm here to help with your India travel plans. What would you like to know?"
            ],
            "thank you": [
                "You're welcome! Wishing you wonderful travels in India!",
                "My pleasure! Feel free to ask more about India's incredible destinations."
            ],
            "emergency": [
                "India emergency numbers:",
                "Police: 100 | Ambulance: 102/108 | Fire: 101",
                "Tourist Helpline: 1363 (24/7 multilingual support)"
            ]
        },
        "visa_immigration": {
            "requirements": {
                "text": "Most foreign nationals need a visa for India. Key requirements:",
                "details": [
                    "- Valid passport (6+ months validity)",
                    "- Recent passport-size photo",
                    "- Completed application form",
                    "- Proof of onward travel",
                    "- Sufficient funds for stay"
                ]
            },
            "e-visa": {
                "text": "India e-Visa information:",
                "details": [
                    "Available for 166+ countries at https://indianvisaonline.gov.in/",
                    "Types: Tourist (30/365 days), Business, Medical",
                    "Processing: Usually 3-5 business days",
                    "Fee: Varies by nationality ($10-$100)"
                ]
            },
            "extension": "Visa extensions must be applied for at FRRO offices in India at least 7 days before expiry"
        },
        "currency_finance": {
            "exchange": {
                "text": "Currency exchange in India:",
                "details": [
                    "Official currency: Indian Rupee (₹, INR)",
                    "Best exchange rates at airports/banks/authorized dealers",
                    "ATMs widely available (foreign cards accepted)",
                    "Notify your bank before traveling",
                    "Currency declaration required if carrying >$5,000 or equivalent"
                ]
            },
            "payments": [
                "Credit cards widely accepted (Visa/Mastercard most common)",
                "UPI/mobile payments (Google Pay, PhonePe) very popular",
                "Carry some cash for rural areas and small vendors"
            ]
        },
        "destinations": {
            "popular": {
                "text": "Top destinations in India:",
                "list": [
                    "Goa - Beaches & nightlife",
                    "Kerala - Backwaters & Ayurveda",
                    "Rajasthan - Palaces & deserts",
                    "Himachal - Himalayas & adventure",
                    "Tamil Nadu - Temples & culture",
                    "Varanasi - Spiritual capital",
                    "Andaman - Pristine islands"
                ]
            },
            "goa": {
                "description": "Famous for beaches, Portuguese heritage, and vibrant nightlife",
                "best_time": "November to February (peak), March-May (hot but fewer crowds)",
                "attractions": [
                    "Beaches: Palolem, Anjuna, Vagator",
                    "Heritage: Basilica of Bom Jesus, Fort Aguada",
                    "Activities: Water sports, flea markets, casino cruises"
                ],
                "cuisine": "Must try: Goan fish curry, pork vindaloo, bebinca (layered dessert)",
                "special": "Don't miss: Carnival (Feb), Sunburn Festival (Dec)"
            },
            "kerala": {
                "description": "'God's Own Country' with backwaters, tea estates, and wildlife",
                "best_time": "September to March (pleasant), April-May (hot), June-August (monsoon)",
                "attractions": [
                    "Alleppey houseboat cruises",
                    "Munnar tea plantations",
                    "Periyar Wildlife Sanctuary",
                    "Kathakali dance performances"
                ],
                "cuisine": "Must try: Appam with stew, sadya (banana leaf feast), karimeen pollichathu (pearl spot fish)"
            }
        },
        "transportation": {
            "domestic_flights": [
                "Major airlines: IndiGo, Air India, Vistara, SpiceJet",
                "Book via airline websites or aggregators (MakeMyTrip, Yatra)",
                "Carry valid ID (passport for foreigners)"
            ],
            "trains": {
                "text": "Indian Railways information:",
                "details": [
                    "Book at irctc.co.in (foreign tourists can use special quota)",
                    "Classes: 1AC (luxury), 2AC/3AC (comfortable), Sleeper (budget)",
                    "Must-try routes: Palace on Wheels, Darjeeling Toy Train"
                ]
            },
            "local_transport": [
                "Metros available in Delhi, Mumbai, Bangalore, Chennai, Kolkata",
                "App-based taxis: Uber, Ola (cheaper than hotel taxis)",
                "Auto-rickshaws: Negotiate fare before boarding",
                "Cycle rickshaws good for short distances"
            ]
        },
        "activities": {
            "adventure": {
                "text": "Top adventure activities in India:",
                "list": [
                    "Trekking: Himalayas (Himachal, Uttarakhand, Sikkim)",
                    "Rafting: Rishikesh (Grade III-IV rapids)",
                    "Paragliding: Bir-Billing (world's 2nd best site)",
                    "Scuba: Andamans (coral reefs), Netrani Island",
                    "Desert safari: Jaisalmer (Thar Desert)"
                ]
            },
            "wellness": [
                "Yoga retreats: Rishikesh (world yoga capital)",
                "Ayurveda treatments: Kerala (authentic spas)",
                "Meditation: Dharamshala, Bodh Gaya"
            ],
            "wildlife": [
                "Tiger safaris: Ranthambore, Bandhavgarh, Kanha",
                "Elephant encounters: Corbett, Kaziranga",
                "Birdwatching: Bharatpur, Chilika Lake"
            ]
        },
        "booking_info": {
            "how_to_book": "You can book hotels, tours, and transportation through our website, mobile app, or authorized travel agents. For immediate assistance, call our booking hotline at +91-9390992475.",
            "cancel_policy": "Cancellation policies vary by provider. Generally:\n- Hotels: 24-48 hours notice for full refund\n- Tours: 7 days notice for full refund\n- Flights: Subject to airline policies"
        }
    }

    # Handle query
    query_text = query.query.lower().strip()
    response = "I'm happy to help with your travel questions about India. Could you please clarify?"

    try:
        # Check for greetings
        if any(word in query_text for word in ["hi", "hello", "hey", "namaste"]):
            response = random.choice(knowledge_base["general"]["greetings"])
        
        # Check for thanks
        elif any(word in query_text for word in ["thank", "thanks", "appreciate"]):
            response = random.choice(knowledge_base["general"]["thank you"])
        
        # Check for contact information
        elif "contact" in query_text or "help" in query_text or "support" in query_text:
            response = random.choice(knowledge_base["general"]["contact"])
        
        # Check for destination queries
        elif any(dest in query_text for dest in knowledge_base["destinations"]):
            for dest in knowledge_base["destinations"]:
                if dest in query_text and isinstance(knowledge_base["destinations"][dest], dict):
                    info = knowledge_base["destinations"][dest]
                    response = (f"{dest.capitalize()} travel info:\n"
                              f"Description: {info['description']}\n"
                              f"Best time to visit: {info['best_time']}\n"
                              f"Top attractions: {', '.join(info['attractions'])}\n"
                              f"Local cuisine: {info['cuisine']}")
                    break
        
        # Check for booking queries
        elif "book" in query_text or "reserve" in query_text:
            if "cancel" in query_text:
                response = knowledge_base["booking_info"]["cancel_policy"]
            else:
                response = knowledge_base["booking_info"]["how_to_book"]
        
        # Check for activity queries
        elif "adventure" in query_text or "sports" in query_text:
            response = "\n".join(knowledge_base["activities"]["adventure"]["list"])
        elif "wellness" in query_text or "yoga" in query_text or "ayurveda" in query_text:
            response = "\n".join(knowledge_base["activities"]["wellness"])
        elif "wildlife" in query_text or "animals" in query_text or "safari" in query_text:
            response = "\n".join(knowledge_base["activities"]["wildlife"])

        # Personalize response if session is available
        if query.session_id and redis_client:
            username = redis_client.get(query.session_id)
            if username:
                response = f"{username}, {response}"

    except Exception as e:
        logger.error(f"Error processing chatbot query: {e}")
        response = "I encountered an error processing your request. Please try again."

    return {"response": response}

# Additional Tourism Endpoints
@app.post("/destinations/recommend")
async def recommend_destinations(query: DestinationQuery):
    recommendations = {
        "beach": ["Goa", "Andaman", "Kovalam"],
        "mountain": ["Manali", "Shimla", "Darjeeling"],
        "cultural": ["Jaipur", "Varanasi", "Hampi"],
        "wildlife": ["Ranthambore", "Jim Corbett", "Kaziranga"]
    }
    
    if not query.interests:
        return {"recommendations": ["Goa", "Kerala", "Rajasthan"]}
    
    result = []
    for interest in query.interests:
        if interest.lower() in recommendations:
            result.extend(recommendations[interest.lower()])
    
    return {"recommendations": list(set(result))[:5]}

@app.post("/reviews")
async def add_review(review: Review, request: Request):
    # Verify session
    session_id = request.headers.get("session-id")
    if not session_id or not get_current_user(session_id):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    conn = get_db_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failed"
        )

    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO reviews (destination, rating, comment, user_id) VALUES (%s, %s, %s, %s)",
            (review.destination, review.rating, review.comment, review.user_id)
        )
        conn.commit()
        return {"message": "Review added successfully"}
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

@app.get("/reviews/{destination}")
async def get_reviews(destination: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failed"
        )

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.destination = %s",
            (destination,)
        )
        reviews = cursor.fetchall()
        return {"reviews": reviews}
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

# Health check endpoint
@app.get("/health")
async def health_check():
    db_ok = False
    redis_ok = False
    
    # Check database connection
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            db_ok = True
        except:
            pass
        finally:
            cursor.close()
            conn.close()
    
    # Check Redis connection
    if redis_client:
        try:
            redis_client.ping()
            redis_ok = True
        except:
            pass
    
    return {
        "status": "OK" if db_ok and redis_ok else "Degraded",
        "database": "OK" if db_ok else "Unavailable",
        "redis": "OK" if redis_ok else "Unavailable"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)