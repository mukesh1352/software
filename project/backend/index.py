from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
import bcrypt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            user="mukesh",
            password="mukesh123",
            host="localhost",
            port=3306,
            database="tourism"
        )
        return conn
    except mysql.connector.Error as e:
        print(f"Error connecting to MariaDB: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# Pydantic model for user authentication
class User(BaseModel):
    username: str
    password: str

# Function to hash passwords
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# Function to verify passwords
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

@app.post("/signup")
def signup(user: User):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if the username already exists
        cursor.execute("SELECT username FROM users WHERE username = %s", (user.username,))
        existing_user = cursor.fetchone()

        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        # Hash the password before storing
        hashed_password = hash_password(user.password)

        # Insert new user with hashed password
        cursor.execute(
            "INSERT INTO users (username, password) VALUES (%s, %s)",
            (user.username, hashed_password)
        )
        conn.commit()
    except mysql.connector.Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error inserting data")
    finally:
        cursor.close()
        conn.close()
    return {"message": "User signed up successfully"}

@app.post("/login")
def login(user: User):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT password FROM users WHERE username = %s", (user.username,))
        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        stored_hashed_password = result[0]

        # Verify the password
        if verify_password(user.password, stored_hashed_password):
            return {"message": "Login successful"}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except mysql.connector.Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
