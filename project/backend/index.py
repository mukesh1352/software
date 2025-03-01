from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import bcrypt
from mysql.connector import pooling
import jwt
import datetime

# Secret key for JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

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

class User(BaseModel):
    username: str
    password: str

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_jwt_token(username: str):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=12)  # Token valid for 12 hours
    payload = {"sub": username, "exp": expiration}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

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
        
        token = create_jwt_token(user.username)
        return {"message": "Login successful", "token": token, "username": user.username}
    except mysql.connector.Error as e:
        return JSONResponse(status_code=500, content={"detail": f"Database Error: {str(e)}"})
    finally:
        cursor.close()
        conn.close()

@app.get("/protected")
def protected_route(token: str):
    username = decode_jwt_token(token)
    return {"message": "Access granted", "user": username}

@app.post("/logout")
def logout():
    return {"message": "Logged out successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)