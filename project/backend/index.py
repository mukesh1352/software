from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import mysql.connector
import bcrypt
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector import pooling

app = FastAPI()

# Allow frontend requests (replace "*" with actual frontend URL)
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

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

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

        return {"message": "Login successful"}
    except mysql.connector.Error as e:
        return JSONResponse(status_code=500, content={"detail": f"Database Error: {str(e)}"})
    finally:
        cursor.close()
        conn.close()

@app.post("/forgot")
def forgot_password(user: User):
    conn = get_db_connection()
    if conn is None:
        return JSONResponse(status_code=500, content={"detail": "Database connection failed"})

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT username FROM users WHERE username = %s", (user.username,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")

        hashed_password = hash_password(user.password)
        cursor.execute("UPDATE users SET password = %s WHERE username = %s", (hashed_password, user.username))
        conn.commit()
        return {"message": "Password reset successful"}
    except mysql.connector.Error as e:
        return JSONResponse(status_code=500, content={"detail": f"Database Error: {str(e)}"})
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
