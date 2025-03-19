from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector import pooling
import bcrypt
import uuid

app = FastAPI()

# Allow frontend requests (Update for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection pool
db_config = {
    "user": "mukesh",
    "password": "mukesh123",
    "host": "localhost",
    "port": 3306,
    "database": "tourism",
}
connection_pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=10, **db_config)

def get_db_connection():
    """Get a database connection from the pool."""
    try:
        return connection_pool.get_connection()
    except mysql.connector.Error as e:
        print(f"Database connection error: {e}")
        return None

# User model
class User(BaseModel):
    username: str
    password: str

# Booking model
class Booking(BaseModel):
    hotel_name: str
    number_of_rooms: int
    number_of_adults: int
    number_of_children: int
    cost_per_room: float 
    user_id: int
    user_name: str

# Hash password function
def hash_password(password: str) -> str:
    """Hash password securely using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

# Verify password function
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hashed version."""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# Signup endpoint
@app.post("/signup")
def signup(user: User):
    conn = get_db_connection()
    if conn is None:
        return JSONResponse(status_code=500, content={"detail": "Database connection failed"})

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT username FROM users WHERE username = %s", (user.username,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username already exists")

        hashed_password = hash_password(user.password)
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (user.username, hashed_password))
        conn.commit()
        return {"message": "User signed up successfully"}
    except mysql.connector.Error as e:
        return JSONResponse(status_code=500, content={"detail": f"Database Error: {str(e)}"})
    finally:
        cursor.close()
        conn.close()

# Session storage
sessions = {}

# Login endpoint
@app.post("/login")
def login(user: User):
    conn = get_db_connection()
    if conn is None:
        return JSONResponse(status_code=500, content={"detail": "Database connection failed"})

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, password FROM users WHERE username = %s", (user.username,))
        result = cursor.fetchone()
        if not result or not verify_password(user.password, result[1]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user_id = result[0]
        
        # Create a session
        session_id = str(uuid.uuid4())
        sessions[session_id] = user.username

        return {"message": "Login successful", "session_id": session_id, "username": user.username, "user_id": user_id}
    except mysql.connector.Error as e:
        return JSONResponse(status_code=500, content={"detail": f"Database Error: {str(e)}"})
    finally:
        cursor.close()
        conn.close()

# Function to calculate total cost
def calculate_total_cost(number_of_rooms: int, number_of_adults: int, number_of_children: int) -> float:
    """Calculate total cost of booking (aligned with frontend)."""
    return number_of_rooms * 100 + number_of_adults * 50 + number_of_children * 30


@app.post("/bookings")
async def create_booking(booking: Booking):
    conn = get_db_connection()
    if conn is None:
        return JSONResponse(status_code=500, content={"detail": "Database connection failed"})

    cursor = conn.cursor()
    try:
        # Calculate total cost using the correct formula
        total_cost = calculate_total_cost(
            booking.number_of_rooms, booking.number_of_adults, booking.number_of_children
        )
        
        # Insert booking into the database
        cursor.execute(
            "INSERT INTO bookings (hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, user_id, user_name) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (
                booking.hotel_name,
                booking.number_of_rooms,
                booking.number_of_adults,
                booking.number_of_children,
                total_cost,
                booking.user_id,
                booking.user_name,
            )
        )
        conn.commit()
        return JSONResponse(status_code=200, content={"message": "Booking created successfully", "total_cost": total_cost})
    
    except mysql.connector.Error as e:
        return JSONResponse(status_code=500, content={"detail": f"Database Error: {str(e)}"})
    
    finally:
        cursor.close()
        conn.close()


# Start the FastAPI server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
