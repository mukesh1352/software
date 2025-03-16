# Tourism Recommendation Application
## Tourism Recommendation Application

**ABOUT THE PROJECT**
The Tourism Recommendation Application is designed to provide personalized travel recommendations, assist with ticket bookings, and serve as a comprehensive travel planner.

### Database
-To create the database, we have to do the following :
`CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);`
### for the booking system
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

### backend
- fastapi
`cd project/backend`
`python -m  venv venv`
-to enter into the virtual environemnt:
`source venv/bin/activate`
-then we can install the python requirements that are required:
`pip install -r requirements.txt`
`pip install uvicorn`
`pip install bycrypt`
###Frontend 
- nextjs
`cd project/tourism`
`npm i`
`npm run dev`
