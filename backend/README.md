
# Backend - Secure Country Insights API Middleware

This is the backend for the Secure Country Insights API Middleware project. It is built using Node.js, Express, and SQLite. The backend provides authentication, API key management, role-based access, and country data retrieval features.

## Project Structure

```
backend/
├── .env
├── .gitignore
├── database.sqlite
├── package.json
├── package-lock.json
├── server.js
├── logs/
│   └── api_requests.log
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── countryController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── apiKeyMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── logRequest.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── apiKeyModel.js
│   │   ├── countryModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── countryRoutes.js
│   ├── test/
│   │   ├── database.sqlite
│   │   └── testdb.js
│   └── Utils/
│       └── logger.js
```

## Features

- JWT Authentication using HttpOnly cookies
- Role-based access (Admin and User)
- API key generation and usage tracking
- Country and region data retrieval
- Middleware for logging and rate limiting

## Installation

1. Clone the repository and navigate to the backend folder:

```
git clone https://github.com/your-username/project-name.git
cd backend
```

2. Install dependencies:

```
npm install
```

3. Create a `.env` file with the following variables:

```
PORT=5000
JWT_SECRET=your_jwt_secret
```

4. Start the server:

```
node server.js
```

## API Routes Overview

| Method | Endpoint                        | Description                           | Auth | Role  |
|--------|----------------------------------|---------------------------------------|------|-------|
| POST   | /api/register                    | Register new user                     | No   | -     |
| POST   | /api/login                       | Login user                            | No   | -     |
| GET    | /api/countries                   | Get all countries                     | Yes  | Any   |
| GET    | /api/country/:name               | Get country by name                   | Yes  | Any   |
| GET    | /api/countries/region/:region    | Get countries by region               | Yes  | Any   |
| POST   | /api/apikey                      | Generate new API key                  | Yes  | Admin |
| GET    | /api/users                       | Get all users                         | Yes  | Admin |
| PUT    | /api/user/role                   | Update user role                      | Yes  | Admin |
| DELETE | /api/user/:id                    | Delete user                           | Yes  | Admin |

## Docker Setup

To build and run the backend using Docker:

1. Create a `Dockerfile` in the `backend` directory:

```Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["node", "server.js"]
```

2. Build and run the container:

```
docker build -t backend-api .
docker run -p 5000:5000 backend-api
```

## Notes

- Use tools like Postman to test endpoints
- JWT is stored securely using HttpOnly cookies
- Backend must be started before using the frontend
