# Taskly Frontend

A React-based frontend for the Taskly Task Management application.

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- React Router DOM v6
- Axios
- React Context API
- Lucide React (icons)
- date-fns (date formatting)
- Vitest + React Testing Library (unit/integration)
- Playwright (E2E)

## Prerequisites
- Node.js 18+
- npm
- Backend running on http://localhost:3000

## Quick Start

```bash
# 1. Start the backend first (from project root)
cd taskly-api && npm install && npm run dev

# 2. In a new terminal, start the frontend
cd taskly-frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000` | Backend API base URL |

Edit `.env` if your backend runs on a different port or URL.

## Available Scripts

```bash
npm run dev          # Start dev server with HMR (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run unit & integration tests
npm run test:coverage # Run tests with coverage report
npm run test:e2e     # Run Playwright E2E tests (needs backend + frontend running)
```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/
│   ├── common/      # ProtectedRoute, AdminRoute, Navbar, Sidebar, Pagination, SearchBar
│   ├── tasks/       # TaskCard, TaskForm, TaskFilters
│   ├── categories/  # CategoryForm
│   └── admin/       # AdminTabs
├── context/
│   └── AuthContext.jsx  # Auth state, user, token, login, logout, register
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx     # Tasks + search + pagination + filters
│   ├── Categories.jsx    # CRUD (manager/admin only)
│   └── Admin.jsx         # Users tab + categories tab
├── services/
│   └── api.js       # Axios instance + interceptors + all API functions
├── utils/
│   └── helpers.js   # Role-based permission checks (canEditTask, canDeleteTask, etc.)
├── App.jsx          # Router + AuthProvider
├── main.jsx         # React entry point
└── index.css        # Tailwind CSS imports
tests/
├── Login.test.jsx
├── RoleBased.test.jsx
└── e2e/
    ├── auth.spec.js
    ├── dashboard.spec.js
    ├── categories.spec.js
    ├── admin.spec.js
    └── search-pagination.spec.js
```

## Features
- JWT authentication (register/login/logout with token in localStorage)
- Role-aware UI (different views for user/manager/admin)
- Task management with search, status filter, categories filter, pagination (client-side)
- Categories management (create/edit/delete — manager/admin only)
- Admin panel for user management (view/delete users — admin only)
- Responsive design (mobile-first with collapsible sidebar)
- Protected routes (redirect to login if not authenticated)
- Global error handling (401 auto-logout)

## API Integration

All API calls go through `src/services/api.js` which uses:
- Axios instance with base URL from `VITE_API_URL`
- Request interceptor to attach JWT from localStorage
- Response interceptor to handle 401 (auto logout + redirect to login)

## Authentication Flow

1. User registers or logs in via the API
2. Server returns a JWT token
3. Token + user data stored in localStorage
4. AuthContext provides auth state to all components
5. API interceptor attaches token to every request
6. On 401, token is cleared and user is redirected to login

## Role Permissions

| Feature | User | Manager | Admin |
|---------|------|---------|-------|
| View own tasks | Yes | Yes | Yes |
| View all tasks | No | Yes | Yes |
| Create task | Yes | Yes | Yes |
| Edit own task | Yes | Yes | Yes |
| Edit any task | No | Status only | Yes |
| Delete own task | Yes | Yes | Yes |
| Delete any task | No | No | Yes |
| Manage categories | No | Yes | Yes |
| Manage users | No | No | Yes |

## Running Tests

### Unit & Integration Tests
```bash
npm test
```
No backend needed — API calls are mocked.

### E2E Tests (Playwright)
```bash
# Make sure both backend (port 3000) and frontend (port 5173) are running
npm run test:e2e
```

## Running the Full Stack

1. **Terminal 1 — Backend:**
   ```bash
   cd taskly-api
   npm install
   npm run dev
   ```

2. **Terminal 2 — Frontend:**
   ```bash
   cd taskly-frontend
   npm install
   npm run dev
   ```

3. **Open browser:** http://localhost:5173

4. **Default login:** `admin@taskly.local` / `admin123`
