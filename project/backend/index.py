from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector import pooling
import uuid
from typing import Optional

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for production
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
# Hash password function
def hash_password(password: str) -> str:
    import bcrypt
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

# Verify password function
def verify_password(plain_password: str, hashed_password: str) -> bool:
    import bcrypt
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

# Login endpoint
@app.post("/login")
def login(user: User):
    conn = get_db_connection()
    if conn is None:
        return JSONResponse(status_code=500, content={"detail": "Database connection failed"})

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT password FROM users WHERE username = %s", (user.username,))
        result = cursor.fetchone()
        if not result or not verify_password(user.password, result[0]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create a session
        session_id = str(uuid.uuid4())
        sessions[session_id] = user.username

        return {"message": "Login successful", "session_id": session_id, "username": user.username}
    except mysql.connector.Error as e:
        return JSONResponse(status_code=500, content={"detail": f"Database Error: {str(e)}"})
    finally:
        cursor.close()
        conn.close()

# Function to calculate total cost
def calculate_total_cost(number_of_rooms: int, number_of_adults: int, cost_per_room: float) -> float:
    return number_of_rooms * cost_per_room * number_of_adults

@app.post("/bookings")
async def create_booking(booking: Booking):
    conn = get_db_connection()
    if conn is None:
        return JSONResponse(status_code=500, content={"detail": "Database connection failed"})

    cursor = conn.cursor()
    try:
        # Calculate total cost
        total_cost = calculate_total_cost(booking.number_of_rooms, booking.number_of_adults, booking.cost_per_room)
        
        # Insert booking into the database
        cursor.execute(
            "INSERT INTO bookings (hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, user_id) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (
                booking.hotel_name,
                booking.number_of_rooms,
                booking.number_of_adults,
                booking.number_of_children,
                total_cost,
                booking.user_id,
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
