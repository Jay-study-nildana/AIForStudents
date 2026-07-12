# Taskly Frontend - Project Outline & Specification - 1.2

> **Purpose**: This document is a companion specification to the **Taskly API Backend Specification v1.0**. It defines a clean, minimal viable, functional, and responsive frontend for the Taskly task management application.
>
> The frontend must work **seamlessly** with the existing backend (public Categories CRUD + JWT auth + role-based Tasks CRUD).
>
> This specification is designed to be fed directly to an AI coding agent.

---

## Project Goal

Build a **Minimum Viable Product (MVP)** frontend for Taskly that is:

- Fully functional
- Responsive (mobile + desktop)
- Role-aware (different UI/features for `user`, `manager`, and `admin`)
- Clean and simple (no over-engineering)

**Must-have features**:
- Complete authentication flow (Register + Login)
- Task management with role-based permissions
- Categories management
- **Admin Panel** (user management + category management)
- **Pagination** (client-side)
- **Search / Filter** functionality (client-side)
- Protected routes based on authentication and role

---

## Tech Stack (Mandatory)

| Category              | Technology                    | Purpose                              | Notes |
|-----------------------|-------------------------------|--------------------------------------|-------|
| Framework             | React 18+                     | UI library                           | - |
| Build Tool            | Vite                          | Fast development & bundling          | - |
| Styling               | Tailwind CSS                  | Utility-first CSS                    | - |
| Routing               | React Router DOM v6+          | Client-side routing                  | - |
| HTTP Client           | Axios                         | API calls + interceptors             | Recommended |
| State Management      | React Context API             | Auth state + user role               | Keep simple (no Redux/Zustand) |
| Icons                 | Lucide React (or Heroicons)   | Clean icons                          | Optional but recommended |
| Date handling         | date-fns or native            | Format dates                         | Keep minimal |
| Testing (Unit + Integration) | Vitest + React Testing Library | Fast component & integration tests   | **Mandatory** |
| E2E Testing           | Playwright                    | End-to-end testing across all pages  | **Mandatory** |

**Strict Rules**:
- **No TypeScript** (plain JavaScript only, matching backend style)
- No heavy state management libraries
- Keep dependencies minimal
- Testing is a **minimum expectation** for this project

---

## Testing Strategy

### Testing Philosophy
This project treats **testing as a core deliverable**, not an afterthought. The goal is to ensure every major page and critical user flow works correctly.

### Recommended Testing Tools (Mandatory)
- **Vitest** + **@testing-library/react** → For unit and integration/component tests
- **Playwright** → For End-to-End (E2E) testing

### Testing Requirements

**1. Component & Integration Tests (Vitest + React Testing Library)**
- Write tests for all major reusable components
- Test key business logic (role-based rendering, form validation, etc.)
- Mock API calls where appropriate using `vi.mock()` or MSW (optional but recommended)

**2. End-to-End Testing (Playwright) — Critical Requirement**
- Every major page **must** have at least one E2E test that covers its primary functionality.
- The agent should test pages in a logical flow before moving to the next page.
- Required E2E test coverage (minimum):
  - Authentication flow (Register → Login → Logout)
  - Tasks Dashboard (view tasks, create task, edit own task, delete own task)
  - Role-based behavior (user vs manager vs admin views)
  - Categories management
  - Admin Panel (view users + delete user)
  - Search and Pagination on the Tasks page
  - Protected route redirection (unauthenticated access)

**3. Code Coverage**
- Generate coverage reports using Vitest (`vitest --coverage`)
- **Target**: Reasonable coverage on critical paths (aim for **70%+** overall if possible)
- 100% coverage is **not required**
- Focus coverage on:
  - Auth logic and role checks
  - Task and Category CRUD operations
  - Admin functionality

**4. Test Organization**
- Co-locate tests next to components (`ComponentName.test.jsx`)
- Create a dedicated `tests/e2e/` folder for Playwright tests
- Use descriptive test names that explain the user flow being tested

**5. Running Tests**
The final project must support:
```bash
npm test                 # Run all unit/integration tests
npm run test:coverage    # Run tests with coverage report
npm run test:e2e         # Run Playwright E2E tests
```

---

## Authentication Strategy

- Use **JWT** returned from `POST /api/auth/login`
- Store JWT in **`localStorage`** under key `token`
- Store user info (including `role`) in `localStorage` or React Context
- Create an **Auth Context** that provides:
  - `user` object
  - `token`
  - `login()`, `logout()`, `register()` functions
  - `isAuthenticated`, `userRole`
- Attach `Authorization: Bearer <token>` header on all protected requests using Axios interceptors
- On app load, check `localStorage` and restore auth state
- Redirect unauthenticated users to `/login`
- On logout: clear localStorage + redirect to login

---

## Role-Based Frontend Permissions

The frontend **must** respect the same RBAC rules defined in the backend.

### Frontend Role Permissions Matrix

| Feature                        | `user`     | `manager`     | `admin`      | Notes |
|--------------------------------|------------|---------------|--------------|-------|
| View own tasks                 | Yes        | Yes           | Yes          | - |
| View all tasks                 | No         | Yes           | Yes          | - |
| Create task                    | Yes        | Yes           | Yes          | - |
| Edit own task                  | Yes        | Yes           | Yes          | - |
| Edit any task (including status) | No      | Yes           | Yes          | - |
| Delete own task                | Yes        | Yes           | Yes          | - |
| Delete any task                | No         | No            | Yes          | - |
| Manage Categories (CRUD)       | No         | Yes           | Yes          | Public in backend, but UI restricted |
| Access Admin Panel             | No         | No            | Yes          | User management + full category control |
| View all users                 | No         | No            | Yes          | - |
| Delete users                   | No         | No            | Yes          | - |

**Implementation Notes**:
- Use role checks in components and routes
- Hide/show UI elements based on role (buttons, menu items, tabs)
- Still validate on backend — frontend checks are for UX only

---

## Core Pages & Routes

| Route                    | Page                        | Access          | Description |
|--------------------------|-----------------------------|------------------|-----------|
| `/`                      | Landing / Redirect          | Public           | Redirect to dashboard if logged in, else login |
| `/login`                 | Login                       | Public           | Email + password |
| `/register`              | Register                    | Public           | Name, email, password |
| `/dashboard`             | Tasks Dashboard             | Protected        | Main task list + create + search + pagination |
| `/categories`            | Categories Management       | Protected        | CRUD for categories (role restricted) |
| `/admin`                 | Admin Panel                 | Admin only       | User list + delete users, full category control |
| `/profile`               | User Profile (optional)     | Protected        | Simple profile view |

**Recommended Layout**:
- Top navbar with logo, user info, role badge, logout
- Sidebar (collapsible on mobile) for navigation
- Main content area

---

## Key Features to Implement

### 1. Tasks Dashboard (`/dashboard`)
- List all tasks (filtered by role)
- **Search** by title/description (client-side)
- **Filter** by status (`todo`, `in_progress`, `done`) and category
- **Pagination** (10 tasks per page, client-side)
- Create new task (title, description, category, status)
- Edit task (respect role permissions)
- Delete task (respect role permissions)
- Show task owner name (when viewing all tasks)

### 2. Categories Management (`/categories`)
- List all categories
- Create, Update, Delete categories (only for `manager` and `admin`)
- Simple form modal or inline editing

### 3. Admin Panel (`/admin`)
- **Users tab**: List all users with role, created date. Allow delete (admin only)
- **Categories tab**: Full CRUD (already covered but accessible here too)
- Clean tabbed interface

### 4. General Requirements
- **Responsive design** (mobile-first with Tailwind)
- Loading states and error messages
- Success/error toasts or alerts (simple implementation)
- Consistent JSON error handling from backend
- Clean, readable code with comments where helpful

---

## Recommended Project Structure

```
taskly-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/              # Button, Modal, Navbar, Sidebar, Pagination, SearchBar
│   │   ├── tasks/               # TaskCard, TaskForm, TaskList, TaskFilters
│   │   ├── categories/          # CategoryList, CategoryForm
│   │   └── admin/               # UserList, AdminTabs
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Categories.jsx
│   │   └── Admin.jsx
│   ├── services/
│   │   └── api.js               # Axios instance + interceptors + all API calls
│   ├── utils/
│   │   └── helpers.js           # formatDate, role checks, etc.
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## API Integration Layer

Create a centralized `src/services/api.js`:

- Create Axios instance with base URL from environment variable
- Request interceptor to attach JWT from localStorage
- Response interceptor to handle 401 (auto logout) and common errors
- Export clean functions:
  - `login(credentials)`
  - `register(userData)`
  - `getTasks()`
  - `createTask(taskData)`
  - `updateTask(id, data)`
  - `deleteTask(id)`
  - `getCategories()`
  - `createCategory(...)`
  - `getUsers()` (admin)
  - `deleteUser(id)` (admin)
  - etc.

**Base URL**: Use environment variable `VITE_API_URL`

---

## Environment Variables

`.env.example`:
```env
VITE_API_URL=http://localhost:3000
```

- Backend is expected to run on port `3000` by default (from backend spec)
- Frontend runs on Vite default port `5173`

---

## Development & Build Instructions (for README)

The final README should include:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Also include:
- How to point frontend to different backend URL
- How to run backend + frontend together

---

## Success Criteria

- [ ] Project initializes cleanly with `npm run dev`
- [ ] User can register and login (JWT stored in localStorage)
- [ ] Protected routes redirect unauthenticated users to login
- [ ] Role-based UI works correctly (user sees limited actions, admin sees full Admin Panel)
- [ ] Tasks page supports search + pagination + filters
- [ ] Full CRUD works for Tasks and Categories (respecting roles)
- [ ] Admin Panel allows viewing and deleting users
- [ ] Application is responsive on mobile and desktop
- [ ] All API calls go through centralized service with proper error handling
- [ ] Logout clears token and redirects to login
- [ ] README contains clear setup and run instructions

**Testing Requirements (Mandatory)**
- [ ] All unit and integration tests pass (`npm test`)
- [ ] Code coverage report generates successfully (`npm run test:coverage`)
- [ ] Playwright E2E tests exist and pass for all major pages and critical flows (`npm run test:e2e`)
- [ ] E2E tests cover authentication, task management, categories, admin panel, search, and pagination flows

---

## Additional Notes for the AI Coding Agent

- Prioritize **functionality over polish**
- Use simple, readable JavaScript
- Prefer composition over complex abstractions
- Make role checks reusable (create a `useRole` hook or helper functions)
- Handle loading and error states consistently across the app
- Do **not** add unnecessary libraries
- Follow the backend response format exactly (success/error structure)

**Testing Guidance**:
- Write E2E tests that simulate real user flows across pages
- Test role-based behavior thoroughly (especially what a `user` cannot do vs `admin`)
- Keep E2E tests focused on happy paths + key error cases
- Aim for practical coverage rather than chasing 100%

---

**This frontend specification is intentionally kept minimal and focused** so it can be built efficiently while still delivering a usable, role-aware Taskly experience.

It is designed to pair directly with the Taskly API Backend Specification v1.0.
```
