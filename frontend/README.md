
# Frontend - Secure Country Insights API Middleware

This is the frontend of the Secure Country Insights API Middleware project, developed using **React.js** and **TailwindCSS**. It interacts with a backend Node.js API for user authentication, role-based dashboards, and secure data access using API keys.

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── AdminDash/
│   │   │   └── UserDash/
│   │   ├── Login/
│   │   └── Register/
│   ├── App.js
│   ├── MainRoutes.js
│   └── index.js
├── package.json
└── README.md
```

## Features

- Login and Registration using JWT authentication.
- Dashboard for different user roles (Admin/User).
- API Key usage integrated with protected endpoints.
- Region-based and country-based data viewing.
- Axios integration with secure headers (`x-api-key`).
- TailwindCSS for responsive and clean UI.
- Mobile-friendly design.

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/project-name.git
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## Notes

- Ensure the backend is running on the correct port (default: `http://localhost:5000`).
- Configure proxy in `package.json` if needed:
  ```json
  "proxy": "http://localhost:5000"
  ```

## Screens Included

- Login Page
- Register Page
- Admin Dashboard (view API usage, manage users)
- User Dashboard (view countries, search by region)
- Protected Routes with Auth & Role Checks

---

## Contact

For support or issues, contact [sahan.20211200@iit.ac.lk].
