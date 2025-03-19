import pytest
from fastapi.testclient import TestClient
from index import app
import uuid

# Setup TestClient
client = TestClient(app)

# Fixture for unique mock user
@pytest.fixture
def mock_user():
    return {
        "username": f"testuser_{uuid.uuid4()}",  # Generate unique username
        "password": "testpassword"
    }

# Fixture for mock booking
@pytest.fixture
def mock_booking():
    return {
        "hotel_name": "Test Hotel",
        "number_of_rooms": 2,
        "number_of_adults": 4,
        "number_of_children": 2,
        "cost_per_room": 100.0,
        "user_id": 1,
        "user_name": "testuser"
    }

# Test signup endpoint
def test_signup(mock_user):
    response = client.post("/signup", json=mock_user)
    print(response.status_code)
    print(response.json())  # Debugging the response message
    assert response.status_code == 200
    assert response.json() == {"message": "User signed up successfully"}

# Test login endpoint
def test_login(mock_user):
    # First, ensure the user is created
    client.post("/signup", json=mock_user)
    
    # Now test login
    response = client.post("/login", json=mock_user)
    assert response.status_code == 200
    assert "session_id" in response.json()
    assert response.json()["username"] == mock_user["username"]

# Test login with invalid credentials
def test_login_invalid(mock_user):
    response = client.post("/login", json={"username": "wronguser", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}

# Test create booking endpoint
def test_create_booking(mock_booking):
    response = client.post("/bookings", json=mock_booking)
    assert response.status_code == 200
    assert response.json()["message"] == "Booking created successfully"
    assert "total_cost" in response.json()

# Test create booking with missing field (optional)
def test_create_booking_missing_field(mock_booking):
    # Remove user_name to simulate missing field
    del mock_booking["user_name"]
    response = client.post("/bookings", json=mock_booking)
    assert response.status_code == 422  # Unprocessable Entity

# Test database connection error handling (simulate failure)
from unittest.mock import patch

@patch("index.get_db_connection", return_value=None)  # Simulate a DB connection failure by returning None
def test_database_error_handling(mock_db):
    mock_user = {
        "username": f"testuser_{uuid.uuid4()}",  # Use unique username
        "password": "testpassword"
    }
    
    # Simulating DB failure by mocking the connection to return None
    response = client.post("/signup", json=mock_user)
    
    assert response.status_code == 500  # Internal Server Error
    assert response.json() == {"detail": "Database connection failed"}
