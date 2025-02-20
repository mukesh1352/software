from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import mysql.connector
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

        # Insert new user if username doesn't exist
        cursor.execute(
            "INSERT INTO users (username, password) VALUES (%s, %s)",
            (user.username, user.password)
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
        cursor.execute(
            "SELECT * FROM users WHERE username = %s AND password = %s",
            (user.username, user.password)
        )
        result = cursor.fetchone()
        if result:
            return {"message": "Login successful"}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except mysql.connector.Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        cursor.close()
        conn.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Tourism API"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
