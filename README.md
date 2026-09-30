Procurement Management System

Developed by Sabiha Chikte
B.E. Information Technology

A full-stack procurement management system designed to centralize and streamline procurement operations across purchase requests, purchase orders, suppliers, contracts, transactions, departments, and categories.

1. Project Overview

The Procurement Management System provides a centralized platform for managing procurement activities through a modular web application.

The project is divided into two main layers:

Frontend — React + TypeScript application for the user interface

Backend — FastAPI application providing REST APIs and database operations

Main procurement flow

Purchase Request
       ↓
   Approval
       ↓
Approved Request
       ↓
Purchase Order
       ↓
Supplier
       ↓
Contract / Transaction
       ↓
Procurement Records

2. Technology Stack

Frontend

React

TypeScript

Vite

Tailwind CSS

Axios / REST API integration

Lucide React

Recharts

Backend

Python

FastAPI

SQLAlchemy

Pydantic

Uvicorn

Database

SQLite

Development & Version Control

Visual Studio Code

Git

GitHub

FastAPI Swagger / OpenAPI

3. Application Modules

Module

Current Status

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

Dashboard

Provides the main procurement overview and navigation into the application's modules.

Purchase Requests

Supports creation and management of procurement requests, including department, amount, description, and request status.

Purchase Orders

Supports purchase orders created from approved purchase requests, including supplier, amount, and order status.

Suppliers

Provides centralized supplier records including contact details, address, and supplier status.

Contracts

Supports supplier contract management, including:

Contract creation

Contract editing

Supplier

Contract title

Contract value

Start and end dates

Description

Contract status

Search and filtering

Total contract value

Active and draft contract counts

Contract statuses currently include:

Draft

Active

Expired

Terminated

Transactions

Supports procurement transaction tracking, including:

Purchase order association

Supplier

Amount

Payment method

Reference number

Transaction status

Search and filtering

CSV export

Categories

Provides management of procurement categories and their status.

Departments

Provides management of organizational departments and their status.

Approvals

The application contains the foundation for procurement approval workflows. Further workflow functionality is still under development.

Analytics

Analytics is currently a UI placeholder. Planned reporting capabilities include procurement spending, supplier performance, department-wise spending, procurement trends, and KPIs.

Settings

Settings is currently a UI placeholder for future system and user configuration.

4. System Architecture

                    PROCUREMENT MANAGEMENT SYSTEM
                               │
               ┌───────────────┴───────────────┐
               │                               │
           FRONTEND                         BACKEND
        React + TypeScript                  FastAPI
             Vite                          Python
               │                               │
               │          REST API             │
               └───────────────┬───────────────┘
                               │
                         SQLAlchemy ORM
                               │
                            SQLite

5. Project Structure

procurement-management/
│
├── README.md
├── .gitignore
│
├── backend/
│   └── app/
│       ├── database.py
│       ├── main.py
│       ├── models.py
│       └── ...
│
└── frontend/
    ├── README.md
    ├── package.json
    └── src/
        ├── components/
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
        └── App.tsx

6. How to Run the Project

The frontend and backend run as two separate development processes.

Prerequisites

Install:

Node.js

npm

Python 3.x

Git

6.1 Start the Backend

Open Terminal 1.

From the project root:

cd C:\Users\Sabiha\procurement-management\backend

Activate the existing virtual environment:

.\.venv\Scripts\Activate.ps1

If the virtual environment has not been created yet:

python -m venv .venv
.\.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Start FastAPI:

uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs

Keep this terminal running.

6.2 Start the Frontend

Open Terminal 2.

From the project root:

cd C:\Users\Sabiha\procurement-management\frontend

Install frontend dependencies:

npm install

Start the Vite development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173

Keep this terminal running.

6.3 Open the Application

After both servers are running:

Frontend:
http://localhost:5173

Backend:
http://127.0.0.1:8000

API Documentation:
http://127.0.0.1:8000/docs

The frontend communicates with the backend through REST APIs.

7. Backend API Areas

Current API areas include:

/api/purchase-requests
/api/purchase-orders
/api/suppliers
/api/contracts
/api/transactions
/api/categories
/api/departments

FastAPI Swagger can be used to inspect and test the available endpoints.

8. Database

The local development environment uses SQLite with SQLAlchemy.

The local database file is intentionally excluded from Git through .gitignore.

This keeps the repository focused on source code rather than machine-specific development data.

9. Development Workflow

Start Backend
     ↓
Start Frontend
     ↓
Develop / modify module
     ↓
Test API through Swagger
     ↓
Test frontend workflow
     ↓
Review Git changes
     ↓
Commit
     ↓
Push to GitHub

Example:

git status
git add .
git commit -m "Update procurement module"
git push

10. Repository Hygiene

The repository uses .gitignore to prevent local and sensitive development files from being committed.

Examples include:

node_modules/
.venv/
*.db
.env

Do not commit passwords, API keys, secret credentials, local databases, or virtual environments.

11. Current Development Status

The core procurement management workflow is implemented across the main procurement modules.

The application currently has working frontend/backend integration for the implemented modules, while Approvals, Analytics, and Settings contain areas that are still under development or represented as UI placeholders.

12. Future Development

Planned extensions include:

Expanded approval workflows

Procurement analytics and reporting

Advanced dashboard KPIs

Authentication and authorization

Role-based access control

Supplier performance analytics

Contract expiry notifications

Notification workflows

Advanced reporting

Production database configuration

Deployment infrastructure

13. Author

Sabiha Chikte
B.E. Information Technology

Procurement Management System — Full-Stack Application