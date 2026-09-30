Procurement Management System — Frontend

Developed by Sabiha Chikte

The frontend of the Procurement Management System is a React + TypeScript web application built with Vite and Tailwind CSS.

It provides the user interface for procurement operations and communicates with the FastAPI backend through REST APIs.

1. Frontend Technology Stack

React

TypeScript

Vite

Tailwind CSS

Axios / REST API integration

Lucide React

Recharts

2. Frontend Modules

The frontend is organized into modular pages.

src/
├── components/
│
├── pages/
│   ├── Dashboard.tsx
│   ├── PurchaseRequests.tsx
│   ├── PurchaseOrders.tsx
│   ├── Suppliers.tsx
│   ├── Contracts.tsx
│   ├── Transactions.tsx
│   ├── Categories.tsx
│   ├── Departments.tsx
│   └── Approvals.tsx
│
└── App.tsx

Implemented

Dashboard

Purchase Requests

Purchase Orders

Suppliers

Contracts

Transactions

Categories

Departments

In Progress / Placeholder

Approvals — workflow foundation

Analytics — UI placeholder

Settings — UI placeholder

3. Frontend Responsibilities

The frontend is responsible for:

Rendering procurement screens

Managing user interactions

Form handling

Search and filtering

Status updates

Displaying procurement data

Communicating with backend APIs

Presenting procurement summaries and records

Exporting transaction data where supported

Business data is persisted by the backend rather than directly by the frontend.

4. API Integration

The frontend communicates with the FastAPI backend.

Development backend URL:

http://127.0.0.1:8000

Example API areas:

/api/purchase-requests
/api/purchase-orders
/api/suppliers
/api/contracts
/api/transactions
/api/categories
/api/departments

The backend API can be inspected through:

http://127.0.0.1:8000/docs

5. Running the Frontend

Prerequisites

Install:

Node.js

npm

Install Dependencies

From the frontend directory:

npm install

Start Development Server

npm run dev

The Vite development server will normally start at:

http://localhost:5173

6. Running the Complete Application

The frontend requires the backend API to be running for database-backed functionality.

Terminal 1 — Backend

cd C:\Users\Sabiha\procurement-management\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload

Terminal 2 — Frontend

cd C:\Users\Sabiha\procurement-management\frontend
npm run dev

Then open:

http://localhost:5173

7. Frontend Development Workflow

Modify Page / Component
        ↓
Run Development Server
        ↓
Test UI
        ↓
Verify API Interaction
        ↓
Check Browser Console
        ↓
Review Git Changes
        ↓
Commit Changes

Useful commands:

npm install
npm run dev

8. Frontend Project Structure

frontend/
│
├── src/
│   ├── components/
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── PurchaseRequests.tsx
│   │   ├── PurchaseOrders.tsx
│   │   ├── Suppliers.tsx
│   │   ├── Contracts.tsx
│   │   ├── Transactions.tsx
│   │   ├── Categories.tsx
│   │   ├── Departments.tsx
│   │   └── Approvals.tsx
│   │
│   └── App.tsx
│
├── package.json
├── package-lock.json
└── README.md

9. Module Status

Frontend Module

Status

Dashboard

Implemented

Purchase Requests

Implemented

Purchase Orders

Implemented

Suppliers

Implemented

Contracts

Implemented

Transactions

Implemented

Categories

Implemented

Departments

Implemented

Approvals

Foundation / In Progress

Analytics

UI Placeholder

Settings

UI Placeholder

10. UI and Component Approach

The frontend uses reusable UI patterns for:

Navigation

Tables

Forms

Modals

Search controls

Filters

Status controls

Summary cards

Action buttons

Tailwind CSS is used for styling and responsive layouts.

Lucide React provides the interface icons.

Recharts is available for data visualization and dashboard/analytics expansion.

11. Author

Sabiha Chikte

B.E. Information Technology

Procurement Management System — Frontend