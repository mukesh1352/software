#  Tourism Recommendation Application

The **Tourism Recommendation Application** is a full-stack web application built to help users explore personalized travel destinations, book hotels, and plan their trips efficiently.

---

##  About the Project
This application aims to:

- Provide **personalized travel recommendations**
- Help users **book hotels and accommodations**
- Act as a **comprehensive travel planner**
- Ensure a smooth **user experience across backend and frontend**

---

## Tech Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Backend  | FastAPI                            |
| Frontend | Next.js                            |
| Database | MySQL                              |
| Others   | bcrypt, Uvicorn, SQLAlchemy, Axios |

---

## Getting Started

### Backend Setup (FastAPI)

```bash
cd project/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install uvicorn
pip install bcrypt
uvicorn index:app --reload

```

### FRONTEND SETUP -- NEXT.JS

```bash
cd project/tourism
npm install
npm run dev

```

cd project/tourism
npm install
npm run dev

### DATABASE SETUP

1. USER TABLE

```sql

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

```

2.BOOKING TABLE

```sql
CREATE TABLE bookings (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  hotel_name VARCHAR(255) DEFAULT NULL,
  number_of_rooms INT(11) DEFAULT NULL,
  number_of_adults INT(11) DEFAULT NULL,
  number_of_children INT(11) DEFAULT NULL,
  total_cost FLOAT DEFAULT NULL,
  phone_number VARCHAR(20) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  user_id BIGINT(20) UNSIGNED DEFAULT NULL,
  user_name VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Features

- **User Authentication System**  
  Secure login and registration functionality for travelers.

- **Flight Booking**  
  Users can search and book flights based on their preferences.

- **Tourism Chatbot**  
  An integrated chatbot to answer queries related to travel, destinations, bookings, and more.

- **Room Booking**  
  Hotel room reservation system with details like guest count, stay duration, and more.

- **User-Friendly Interface**  
  A modern, responsive, and intuitive interface to enhance user experience across devices.
