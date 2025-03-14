from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncpg
import os
import bcrypt
import uuid
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session storage
sessions = {}

# User model
class User(BaseModel):
    username: str
    password: str

async def get_db_connection():
    """Establish a connection to PostgreSQL"""
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

@app.post("/signup")
async def signup(user: User):
    conn = await get_db_connection()
    if not conn:
        return JSONResponse(status_code=500, content={"detail": "Database connection failed"})

    try:
        existing_user = await conn.fetchval("SELECT username FROM users WHERE username = $1", user.username)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        hashed_password = hash_password(user.password)
        await conn.execute("INSERT INTO users (username, password) VALUES ($1, $2)", user.username, hashed_password)
        return {"message": "User signed up successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Database Error: {str(e)}"})
    finally:
        await conn.close()

@app.post("/login")
async def login(user: User):
    conn = await get_db_connection()
    if not conn:
        return JSONResponse(status_code=500, content={"detail": "Database connection failed"})

    try:
        stored_password = await conn.fetchval("SELECT password FROM users WHERE username = $1", user.username)
        if not stored_password or not verify_password(user.password, stored_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        session_id = str(uuid.uuid4())
        sessions[session_id] = user.username

        return {"message": "Login successful", "session_id": session_id, "username": user.username}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Database Error: {str(e)}"})
    finally:
        await conn.close()

@app.get("/protected")
async def protected_route(request: Request):
    session_id = request.headers.get("session_id")
    if not session_id or session_id not in sessions:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"message": "Access granted", "user": sessions[session_id]}

@app.post("/logout")
async def logout(request: Request):
    session_id = request.headers.get("session_id")
    if session_id in sessions:
        del sessions[session_id]
    return {"message": "Logged out successfully"}

@app.post("/forgot")
async def forgot_password(user: User):
    conn = await get_db_connection()
    if not conn:
        return JSONResponse(status_code=500, content={"detail": "Database connection failed"})

    try:
        existing_hashed_password = await conn.fetchval("SELECT password FROM users WHERE username = $1", user.username)
        if not existing_hashed_password:
            raise HTTPException(status_code=404, detail="User not found")

        if verify_password(user.password, existing_hashed_password):
            return JSONResponse(status_code=400, content={"detail": "The new password is the same as the old password"})

        hashed_password = hash_password(user.password)
        await conn.execute("UPDATE users SET password = $1 WHERE username = $2", hashed_password, user.username)
        return {"message": "Password reset successful"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Database Error: {str(e)}"})
    finally:
        await conn.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
