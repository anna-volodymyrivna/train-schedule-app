# RailPlan — Train Schedule Management System

A full-stack web application designed for viewing and administering train schedules. Developed as a technical assessment (test assignment).

## 🛠️ Tech Stack

### Frontend (`client`)
* **Framework:** Next.js (App Router, TypeScript)
* **Styling:** CSS
* **HTTP Client:** Axios (with custom JWT interceptors)
* **Icons:** FontAwesome

### Backend (`server`)
* **Framework:** NestJS (TypeScript, REST API)
* **Database:** Neon (PostgreSQL Cloud)
* **ORM:** Prisma
* **Authentication:** JWT (JSON Web Tokens), `bcrypt` for password hashing
* **Mail Service:** Account verification via SMTP (Nodemailer)

---

## ⚙️ Key Features
1. **Complete Auth Flow:** User registration, login, and route protection using JWT tokens.
2. **Email Verification:** Upon registration, users receive a real verification email with a token. Accounts remain locked until activated.
3. **Role-Based Access Control (RBAC):** Distinct permissions for regular users (read-only schedule view) and administrators (full CRUD operations for trains).

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/anna-volodymyrivna/train-schedule-app.git
cd train-schedule-app
```

### 2. Backend Setup (server)
Navigate to the server directory and install dependencies:
```bash
cd server
npm install --legacy-peer-deps
```
Create a .env file in the server/ directory and add the following environment variables:
```bash
DATABASE_URL="your_neon_postgresql_connection_string"
JWT_SECRET="your_secret_key"
FRONTEND_URL="http://localhost:3001"
MAIL_USER="your_email@ukr.net"
MAIL_PASSWORD="your_app_specific_password"
```
Synchronize the Prisma database schema and start the development server:
```bash
npx prisma db push
npm run start:dev
```
The server will be running at http://localhost:3000.

### 3. Frontend Setup (client)
Open a new terminal window in the project root, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```
Create a .env.local file in the client/ directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```
Start the frontend development server:
```bash
npm run dev
```
The user interface will be available at http://localhost:3001.

## Author
Anna Lytvynova 2026