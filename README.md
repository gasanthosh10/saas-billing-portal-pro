# BillPilot Pro - Role-Based SaaS Billing Portal

BillPilot Pro is a full stack MERN SaaS billing portal with role-based access for Admin, Finance, Support, and Customer users. It is designed to look and feel like a real subscription billing product, with plans, customers, subscriptions, invoices, payments, and analytics.

## Features

- Role-based login with JWT authentication.
- Admin dashboard for revenue, MRR, active subscriptions, overdue invoices, and churn risk.
- Finance workspace for invoices, payments, and collection status.
- Customer portal for viewing subscriptions, invoices, payment history, and account status.
- MongoDB models for users, companies, plans, subscriptions, invoices, payments, audit logs, and support tickets.
- REST API with validation, protected routes, role authorization, centralized errors, and seed data.
- Responsive React interface with charts, invoice tables, plan cards, and role-specific navigation.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Recharts, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Zod
- Architecture: MERN, role-based access control, REST API

## Quick Start

### 1. Install

```bash
npm run install:all
```

### 2. Configure Backend

```bash
cd server
copy .env.example .env
```

Default `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/billpilot_pro
JWT_SECRET=replace-this-with-a-long-secret
CLIENT_URL=http://localhost:5173
```

### 3. Seed Demo Data

Make sure MongoDB is running.

```bash
npm run seed
```

Demo accounts:

```text
Admin: admin@billpilot.dev / password123
Finance: finance@billpilot.dev / password123
Support: support@billpilot.dev / password123
Customer: customer@acme.dev / password123
```

### 4. Run

Terminal 1:

```bash
npm run dev:server
```

Terminal 2:

```bash
npm run dev:client
```

Open `http://localhost:5173`.

## API Summary

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/dashboard/summary`
- `GET /api/plans`
- `POST /api/plans`
- `GET /api/subscriptions`
- `PATCH /api/subscriptions/:id`
- `GET /api/invoices`
- `POST /api/invoices`
- `PATCH /api/invoices/:id/pay`
- `GET /api/audit-logs`


