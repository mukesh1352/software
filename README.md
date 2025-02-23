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

- nextjs
`cd project/tourism`
`npm i`
`npm run dev`
