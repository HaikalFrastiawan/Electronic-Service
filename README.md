# ElektroServ - Electronic Service Booking System

ElektroServ is a modern, full-stack management system designed for electronic repair shops. It streamlines the lifecycle of service records, from customer registration and technician assignment to status tracking and completion.

![Login Page](file:///C:/Users/ASUS/.gemini/antigravity/brain/b1bc9c7b-863c-42c0-87ab-ed1b0471bea5/login_page_full_1774564938318.png)

## 🚀 Tech Stack

### Backend
- **Language:** Go (Golang)
- **Framework:** Gin-Gonic
- **ORM:** GORM (PostgreSQL)
- **Security:** JWT (JSON Web Tokens), Bcrypt for password hashing
- **Environment:** Go-Dotenv

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS (v3)
- **Components:** Headless UI, Heroicons
- **Forms:** React Hook Form
- **State Management:** React Context API
- **Notifications:** React Hot Toast

## ✨ Key Features

- **JWT Authentication:** Secure login and registration with role-based access logic (Admin/Staff).
- **Dashboard Overview:** Real-time metrics for total bookings, active technicians, and operational status.
- **Booking Management:** Create, update, and track service records with unique device details and cost estimates.
- **Customer Directory:** Centralized storage for customer contact information and service history.
- **Technician Tracking:** Manage staff availability and specialties for efficient task assignment.
- **Responsive Dark Mode:** Sleek, high-performance UI built for a premium user experience.

## 🛠️ Installation & Setup

### Prerequisites
- [Go](https://go.dev/dl/) (version 1.20+)
- [Node.js](https://nodejs.org/) (version 18+)
- [PostgreSQL](https://www.postgresql.org/download/)

### 1. Clone the Repository
```bash
git clone https://github.com/HaikalFrastiawan/booking-service-elektronik.git
cd booking-service-elektronik
```

### 2. Backend Setup
1. Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=booking_service
   DB_PORT=5432
   JWT_SECRET=yoursecretkey
   SERVER_PORT=8080
   ```
2. Install dependencies and run:
   ```bash
   go mod tidy
   go run main.go
   ```

### 3. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```text
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── api/            # API services (Axios)
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Main page views
│   │   └── layouts/        # Page layout wrappers
├── config/                 # Database configuration
├── controllers/            # API Route handlers
├── middleware/             # Gin middlewares (Auth, CORS, Logger)
├── models/                 # GORM Database schemas
├── routes/                 # API Route definitions
├── services/               # Main business logic
└── main.go                 # Application entry point
```

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created by [Haikal Frastiawan](https://github.com/HaikalFrastiawan)*