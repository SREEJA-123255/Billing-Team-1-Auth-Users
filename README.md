# Multi-Team Billing Software System — Team 1 Deliverable

## Modules Implemented (Team 1 Scope Only):
1. **Authentication** (Login, Session Verification, JWT Token Generation & Refresh, Secure Logout)
2. **User Management & Registration** (User CRUD, Search by Name/Email/Phone, Role Filter, Status Filter, Pagination)
3. **User Roles & Authorization** (`ADMIN`, `MANAGER`, `CASHIER`, `STAFF` with granular route-level and UI-level protection)
4. **Soft Activation / Deactivation** (Status toggle with prevention against self-deactivation)
5. **Business Settings & Profile** (Single business entity, Contact information, GST Number, Logo upload & live preview)
6. **Centralized Error Handling & Validation** (Mongoose schema validation, input regex validation, duplicate email prevention with 409 status code)
7. **Mobile-Responsive UI** (Tailored for 320px, 375px, 390px, 414px, 768px, 1024px, 1280px+)

---

## 1. Quick Start

### Backend (`server/`)
```bash
cd server
npm install
npm run seed     # Seeds default users (Admin, Manager, Cashier, Staff, Inactive) and business settings
npm start        # Runs on http://localhost:5000
```

### Frontend (`client/`)
```bash
cd client
npm install
npm run dev      # Runs Vite dev server on http://localhost:5173
```

---

## 2. Seeded Test Credentials

| Role | Email | Password | Allowed Access |
|---|---|---|---|
| **ADMIN** | `admin@example.com` | `Admin@123` | Full System Access (Users, Settings, & all team modules) |
| **MANAGER** | `manager@example.com` | `Manager@123` | Products, Customers, Sales, Reports |
| **CASHIER** | `cashier@example.com` | `Cashier@123` | Customers, Sales, Billing, Payments |
| **STAFF** | `staff@example.com` | `Staff@123` | Products, Inventory |
| **INACTIVE** | `inactive@example.com` | `Inactive@123` | **BLOCKED** (Login returns 403 Deactivated) |

---

## 3. Team 1 API Endpoints (Postman Ready)

### Authentication
* `POST /api/auth/login`: Authenticate with email & password, returns JWT token + user profile.
* `GET /api/auth/me`: Get current logged-in user profile using Bearer token.

### User Management (Admin Only)
* `POST /api/users`: Create user with name, email, phone, password, role, status.
* `GET /api/users`: Get paginated users with `?search=...`, `?role=...`, `?status=...`, `?page=...`, `?limit=...`.
* `GET /api/users/:id`: Get single user details by ID.
* `PUT /api/users/:id`: Update user info (name, email, phone, role, status, optional password).
* `PATCH /api/users/:id/status`: Soft activate/deactivate user (`{ "status": "INACTIVE" }`).

### Business Settings
* `GET /api/business`: Fetch business profile (Used by Team 1 and Team 4 for invoice generation).
* `PUT /api/business`: Update business name, email, phone, GSTIN, address, and logo file (Admin only).

A ready-to-import Postman Collection is located in `postman/Team1_Billing_System.postman_collection.json`.

---

## 4. Integration Guide for Other Teams
* **Team 2 (Products & Inventory)**: Consume `authenticate` and `authorizeRoles("ADMIN", "MANAGER", "STAFF")` from `server/middleware/authMiddleware.js`.
* **Team 3 (Customers & Suppliers)**: Consume `authenticate` and `authorizeRoles("ADMIN", "MANAGER", "CASHIER")`.
* **Team 4 (Billing, Invoices & Payments)**: Consume `GET /api/business` to print Business Name, Address, GSTIN, Phone, and Logo on invoices.
* **Team 5 (Dashboard & Reports)**: Consume `authenticate` and `authorizeRoles("ADMIN", "MANAGER")`.
