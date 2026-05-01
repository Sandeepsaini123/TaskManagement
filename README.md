# TaskFlow — Enterprise Task Management System

A full-stack role-based task management application built with React, Node.js, Express, and MongoDB.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | *(Add Vercel URL after deployment)* |
| Backend API | *(Add Railway URL after deployment)* |

---

## Test Credentials

### Admin Account
> Admin account is auto-assigned when registering with the admin email.

| Field | Value |
|---|---|
| Email | `admin@taskflow.com` |
| Password | Sainiboy123@ |

**To create the admin account:**
1. Go to `/register`
2. Register with email `admin@taskflow.com`
3. Any password you choose (min. 6 characters)
4. You will be automatically redirected to the Admin Dashboard on login

### Regular User Account
Register with any other email at `/register`.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Tailwind CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js v5 | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |

---

## Features

### User
- Register & login with JWT authentication
- Personal dashboard with task stats (Total, Pending, In Progress, Completed)
- Create, edit, delete own tasks
- Set task priority (Low / Medium / High) and due date
- Due date smart labels — Overdue, Due today, X days left
- View tasks assigned by admin
- Update profile name and change password

### Admin
- Separate admin dashboard
- View all tasks across all users
- Assign tasks to any user with priority, status, and due date
- Edit and delete any task
- View all registered users with task counts
- Delete users (cascades to their tasks)

---

## Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, Login
│   │   │   ├── taskController.js   # User & Admin task CRUD
│   │   │   ├── adminController.js  # User management
│   │   │   └── profileController.js# Profile update
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT verification
│   │   │   └── roleMiddleware.js   # Role-based access control
│   │   ├── models/
│   │   │   ├── User.js             # User schema
│   │   │   └── Task.js             # Task schema
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── taskRoutes.js
│   │       ├── adminRoutes.js
│   │       └── profileRoutes.js
│   ├── server.js
│   ├── .env                        # Environment variables (not committed)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── TaskForm.jsx
    │   │   └── TaskList.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx       # User stats overview
    │   │   ├── MyTasks.jsx         # User task management
    │   │   ├── Profile.jsx         # Profile & password update
    │   │   └── AdminDashboard.jsx  # Admin panel
    │   ├── routes/
    │   │   └── PrivateRoute.jsx    # Role-based route protection
    │   └── services/
    │       └── api.js              # Axios instance + auth helpers
    └── package.json
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login, returns JWT token |

### Tasks — `/api/tasks`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | User | Get own tasks |
| POST | `/` | User | Create task |
| PUT | `/:id` | User | Update own task |
| DELETE | `/:id` | User | Delete own task |
| GET | `/admin/all` | Admin | Get all tasks |
| POST | `/admin/assign` | Admin | Assign task to user |
| PUT | `/admin/:id` | Admin | Update any task |
| DELETE | `/admin/:id` | Admin | Delete any task |

### Admin — `/api/admin`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users` | Admin | Get all users |
| DELETE | `/users/:id` | Admin | Delete user + their tasks |

### Profile — `/api/profile`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | User | Get profile |
| PUT | `/` | User | Update name or password |

---

## Local Setup

### Prerequisites
- Node.js v18+
- npm
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@taskflow.com
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## How Role Assignment Works

- When a user registers with the email defined in `ADMIN_EMAIL` (`.env`), they are **automatically assigned the `admin` role**.
- All other registrations get the `user` role.
- On login, the role is included in the JWT token and stored in `localStorage`.
- `PrivateRoute` checks the role and redirects users to their correct dashboard — admin users cannot access the user dashboard and vice versa.

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Backend server port (default: 5000) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `ADMIN_EMAIL` | Email that gets auto-assigned admin role on register |
