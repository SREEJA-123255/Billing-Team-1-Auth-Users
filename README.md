# Billing System Auth & User Management

This module provides the authentication, user management, and business settings features for the billing application. It handles login, Google sign-in, admin controls, OTP-based password recovery, and business profile updates.

## 1. Highlights
- Authentication with JWT-based login and protected routes.
- Google Sign-In for approved users and the configured admin account.
- OTP password recovery flow for non-admin users.
- Role-based access control for ADMIN, MANAGER, CASHIER, and STAFF.
- User management with create, search, filter, pagination, update, and status control.
- Business settings with profile details and logo upload support.
- Input validation and centralized error handling across the API.

## 2. Tech stack

| Layer | Stack |
|---|---|
| Frontend | React, Vite, React Router, Axios, @react-oauth/google, React Icons |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, multer, nodemailer |
| Auth | JWT, Google OAuth, password hashing |

## 3. Getting started

### Prerequisites
- Node.js and npm installed on your machine.

### Backend
```bash
cd server
npm install
cp .env.example .env    # then fill in your own values
npm run seed
npm start
```
Backend runs on http://localhost:5000.

### Frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on http://localhost:5173.

## 4. Environment variables

### Server
| Variable | Purpose |
|---|---|
| PORT | Backend port |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | JWT signing key |
| JWT_EXPIRES_IN | JWT expiry duration |
| CLIENT_URL | Frontend URL allowed by CORS |
| ADMIN_NAME | Default admin display name |
| ADMIN_EMAIL | Default admin email |
| ADMIN_PASSWORD | Default admin password |
| ADMIN_PHONE | Default admin phone |
| GOOGLE_CLIENT_ID | Google OAuth client ID |
| EMAIL_SERVICE | Email provider used for OTP sending |
| EMAIL_USER | Email account username |
| EMAIL_PASS | Email account password/app password |
| EMAIL_FROM | Sender name and email for OTP emails |
| SMTP_HOST | Custom SMTP host |
| SMTP_PORT | Custom SMTP port |
| SMTP_SECURE | Custom SMTP secure flag |
| SMTP_USER | Custom SMTP username |
| SMTP_PASS | Custom SMTP password |

### Client
| Variable | Purpose |
|---|---|
| VITE_API_URL | Base API path used by the frontend |
| VITE_GOOGLE_CLIENT_ID | Google client ID used by the frontend |

## 5. Demo accounts

| Role | Email | Password |
|---|---|---|
| ADMIN | admin@example.com | Admin@123 |
| MANAGER | manager@example.com | Manager@123 |
| CASHIER | cashier@example.com | Cashier@123 |
| STAFF | staff@example.com | Staff@123 |
| INACTIVE | inactive@example.com | Inactive@123 |

## 6. API overview

| Endpoint | Access |
|---|---|
| POST /api/auth/login | Public |
| POST /api/auth/google | Public |
| POST /api/auth/forgot-password | Public |
| POST /api/auth/verify-otp | Public |
| POST /api/auth/reset-password | Public |
| GET /api/auth/me | Any logged-in user |
| POST /api/users | Admin only |
| GET /api/users | Admin only |
| GET /api/users/:id | Admin only |
| PUT /api/users/:id | Admin only |
| PATCH /api/users/:id/status | Admin only |
| DELETE /api/users/:id | Admin only |
| GET /api/business | Any logged-in user |
| PUT /api/business | Admin only |

## 7. Project structure

```text
client/
  public/
  src/
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  seed/
  uploads/
```

## 8. Team

- Sreeja Kilari — Team Lead, Backend/API
- Kranthi Kumar Mandadi — Database and Backend
- Saiteja — Frontend UI
- Shaik Sharief — Integration, Testing and Documentation
