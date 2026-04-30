# Team Task Manager Pro

Production-ready full-stack task management app with JWT authentication, RBAC, activity logging, dashboard analytics, and Railway deployment support.

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React (Vite), Tailwind CSS
- Auth: JWT + bcrypt
- Deployment: Railway-ready

## Folder Structure

```text
.
├── backend
│   ├── package.json
│   ├── .env.example
│   ├── railway.toml
│   └── src
│       ├── app.js
│       ├── server.js
│       ├── config
│       │   └── db.js
│       ├── controllers
│       │   ├── authController.js
│       │   ├── dashboardController.js
│       │   ├── projectController.js
│       │   ├── taskController.js
│       │   └── userController.js
│       ├── middleware
│       │   ├── authMiddleware.js
│       │   ├── errorMiddleware.js
│       │   ├── projectAccess.js
│       │   └── validateRequest.js
│       ├── models
│       │   ├── ActivityLog.js
│       │   ├── Project.js
│       │   ├── Task.js
│       │   └── User.js
│       ├── routes
│       │   ├── authRoutes.js
│       │   ├── dashboardRoutes.js
│       │   ├── projectRoutes.js
│       │   ├── taskRoutes.js
│       │   └── userRoutes.js
│       └── utils
│           ├── activityLogger.js
│           ├── asyncHandler.js
│           └── generateToken.js
├── frontend
│   ├── package.json
│   ├── .env.example
│   ├── railway.toml
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── api
│       │   └── axiosClient.js
│       ├── components
│       │   └── Navbar.jsx
│       ├── context
│       │   └── AuthContext.jsx
│       ├── pages
│       │   ├── DashboardPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── ProjectsPage.jsx
│       │   └── SignupPage.jsx
│       └── routes
│           └── ProtectedRoute.jsx
├── .gitignore
├── railway.json
└── README.md
```

## Core Features

- Signup/Login with hashed passwords and JWT token auth
- RBAC:
  - Admin: create projects, add members, manage all tasks/users
  - Member: view assigned projects/tasks and update assigned tasks
- Full REST APIs with validation and centralized error handling
- Mongoose schemas with proper refs and relationships
- Activity logging for key operations
- Dashboard analytics:
  - total tasks
  - completed tasks
  - overdue tasks
  - completion rate
- Axios auth interceptor + protected frontend routes
- Responsive Tailwind UI with dashboard, projects, and task board

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/projects` (admin)
- `GET /api/projects`
- `POST /api/projects/:id/add-member` (admin)
- `POST /api/tasks`
- `GET /api/tasks/:projectId`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id` (admin)
- `GET /api/dashboard`

## Local Setup

Prerequisites: Node.js 18+, npm, MongoDB.

1. Backend setup
   - `cd backend`
   - `cp .env.example .env` (or create manually on Windows)
   - Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
   - `npm install`
   - `npm run dev`

2. Frontend setup
   - `cd frontend`
   - `cp .env.example .env`
   - `npm install`
   - `npm run dev`

## Railway Deployment

Deploy backend and frontend as separate Railway services.

### Backend service
- Root directory: `backend`
- Add environment variables:
  - `PORT`
  - `MONGO_URI` (Railway Mongo or external)
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CLIENT_URL` (frontend Railway URL)

### Frontend service
- Root directory: `frontend`
- Add env var:
  - `VITE_API_URL` = backend URL + `/api`

## Notes

- The current environment where this project was generated does not have `npm` available, so runtime install/build checks could not be executed here.
- Once Node/npm is available locally, run both apps with the commands above and the project should work end-to-end.
