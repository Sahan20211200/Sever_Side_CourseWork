# Sever_Side_CourseWork

A full-stack secure API middleware web application built for 6COSC022W Coursework 1. This system allows users to register, login, generate/manage API keys, and fetch filtered data from the [REST Countries API](https://restcountries.com). The platform provides role-based access control (admin/user), session handling using JWT stored in HttpOnly cookies, and admin-level analytics for API usage.

---

## Features Overview

### Authentication & Authorization
- User registration (role selection: admin/user)
- Login with secure password hashing using bcrypt
- Session managed with JWT (stored in HttpOnly cookies)
- Auto token refresh system implemented

### API Key Management
- Generate and delete API keys
- Select an active API key to fetch country data
- Track unused API keys

### Country Search
- Search countries using RESTCountries API via your middleware
- Filtered response includes:
    - Country name
    - Capital
    - Currency
    - Languages
    - National flag

### Admin Dashboard
- View all registered users with last login + API key count
- View and revoke unused API keys (not used in over 2 days)
- View risky API key owners and total search counts
- Audit actions are logged for transparency

### Frontend Features (React)
- Beautiful and responsive UI for login, registration, and dashboards
- Toast notifications using react-toastify (no default alert popups)
- User-friendly experience with proper loading states and input validations

---

## Project Setup

### 1. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=3000
JWT_SECRET="blablablacksheepapachaapacheramericangottallent"
ADMIN_SECRET_KEY="2025superadmin123456789v1"
```

Start the backend:
```bash
node server.js
```

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

frontend runs at http://localhost:3002 by default.

---

## Directory Structure

```
📦 backend
 ┣ 📂controllers
 ┣ 📂models
 ┣ 📂routes
 ┣ 📂middleware
 ┣ 📂utils
 ┣ 📜server.js

📦 frontend
 ┣ 📂components
 ┣ 📜App.js
 ┣ 📜MainRoutes.js
```

---

## API Endpoints Summary

| Method | Endpoint                        | Role       | Description                          |
|--------|----------------------------------|------------|--------------------------------------|
| POST   | /auth/register                   | Public     | Register as user or admin            |
| POST   | /auth/login                      | Public     | Login and start secure session       |
| GET    | /auth/get-api-keys              | User       | View generated API keys              |
| POST   | /auth/generate-api-key          | User       | Create new API key                   |
| DELETE | /auth/delete-api-key/:apiKey    | User       | Delete an API key                    |
| GET    | /countries/:country             | User       | Fetch country data (with API key)    |
| GET    | /admin/users                    | Admin      | View all users                       |
| GET    | /admin/unused-api-keys         | Admin      | View unused API keys (2+ days)       |
| POST   | /admin/api-key-owners          | Admin      | View risky API key owners            |
| DELETE | /admin/api-key/:userId         | Admin      | Revoke a user's API key              |

---

## Security Highlights

- JWT stored securely in HttpOnly cookies
- Automatic session refresh on token expiration
- Role-based access protection (admin vs user)
- API key-based route validation
- Admin logs for key revocations and usage

---

# Testing Instructions – Step by Step

This guide helps you test your Secure Country Insights API Middleware project. You can test as a *normal user* or an *admin*. These steps are easy to follow and perfect for viva or manual testing.

---

## Before You Start

Make sure:
- Backend is running on http://localhost:3000
- Frontend is running on http://localhost:3002
- You have registered both a user and an admin account

---

## Testing as a User

### 1. Register a New User
- Go to http://localhost:3002/register
- Fill in a username, password, and choose *User*
- Click Register

### 2. Login as User
- Go to http://localhost:3002/login
- Enter your user login details
- Click Login
- You should be redirected to the *User Dashboard*

### 3. Generate an API Key
- Click *Generate API Key*
- You will see a new key added below

### 4. Search for a Country
- Select your API key from the dropdown
- Enter a country name (example: Japan)
- Click *Fetch Country Info*
- Country information will appear if the key is valid

---

## Testing as an Admin

### 1. Register a New Admin
- Go to http://localhost:3002/register
- Choose a username, password, and select *Admin*
- Click Register

### 2. Login as Admin
- Go to http://localhost:3002/login
- Enter your admin details and click Login
- You should see the *Admin Dashboard*

### 3. View Users
- On the left panel, all registered users are listed
- You can see usernames, login dates, and key counts

### 4. View Risky API Keys
- On the right, see which keys were not used for over 2 days
- Revoke any unused keys using the *Revoke* button

### 5. Check Risky API Owners
- The table below shows users with risky API usage
- You can track their search counts

---

## Docker Setup (optional enhancement)

A Dockerfile and docker-compose setup can be added to containerize both frontend and backend for production.

---

## Acknowledgments

Created for 6COSC022W – Web & API Development coursework at the University of Westminster.

---

## Contact

Maintainer: Sahan Prabuddha 
Student ID: 20211200  
Email: sahan.20211200@iit.ac.lk
