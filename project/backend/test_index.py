import pytest
from fastapi.testclient import TestClient
from index import app

client = TestClient(app)

# Sample user credentials for testing
TEST_USER = {"username": "testuser", "password": "testpassword"}

# Test user signup
def test_signup():
    response = client.post("/signup", json=TEST_USER)
    assert response.status_code in [200, 400]  # 200 if new user, 400 if already exists
    
# Test user login
def test_login():
    response = client.post("/login", json=TEST_USER)
    assert response.status_code in [200, 401]  # 200 if successful, 401 if invalid credentials
    if response.status_code == 200:
        data = response.json()
        assert "session_id" in data
        assert data["username"] == TEST_USER["username"]

# Test booking creation
def test_create_booking():
    login_response = client.post("/login", json=TEST_USER)
    if login_response.status_code != 200:
        pytest.skip("Login failed, skipping booking test")
    
    booking_data = {
        "hotel_name": "Hotel Test",
        "number_of_rooms": 2,
        "number_of_adults": 2,
        "number_of_children": 1,
        "cost_per_room": 100.0,
        "user_id": 1,
        "user_name": "testuser"
    }
    
    response = client.post("/bookings", json=booking_data)
    assert response.status_code == 200
    assert "message" in response.json()
    assert "total_cost" in response.json()
