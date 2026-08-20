# DarshanEase - Temple Darshan Booking System

DarshanEase is a modern, full-stack web application designed to simplify the process of booking and managing temple Darshan (visit) slots. The platform provides a seamless booking experience for devotees and an administrative dashboard for temple managers to handle slot availability, bookings, and temple details.

---

## 🚀 Key Features

### Devotee (User) Side:
* **Secure Authentication**: Register and log in securely with JWT-based authentication.
* **Explore Temples**: Browse a list of temples with detailed descriptions, timings, and locations.
* **Real-time Slot Booking**: Choose and book available time slots for specific dates.
* **Manage Bookings**: View, track, or cancel bookings from a personalized "My Bookings" page.
* **Support via Donations**: Securely make donations towards specific temple causes (General, Annadanam, Pooja, Renovation).
* **Financial Ledger**: Track personal donation histories and details.
* **User Profile**: Update profile information.

### Staff/Admin Side (Admins & Organizers):
* **Management Dashboard**: Overview of system statistics (bookings, collections, temples, users).
* **Temple Management**: Add, update, or remove temples from the directory.
* **Slot Management**: Dynamically create and adjust daily Darshan slots (timings and capacity).
* **Booking Oversight**: Monitor, approve, or reject booking records across all temples.
* **Donations Tracker**: Monitor and audit donations, manage payment status, and view total collections.

---

## 🛠️ Tech Stack

### Frontend:
* **React** (v18, Vite build tool)
* **React Router DOM** (v6 for single-page routing)
* **Axios** (API communication)
* **Bootstrap** (Responsive responsive layout and components)
* **React Icons** (Modern iconography)

### Backend:
* **Node.js** & **Express**
* **MongoDB** & **Mongoose** (Database modeling and ODM)
* **JSON Web Tokens (JWT)** (Secure stateless authentication)
* **Bcrypt.js** (Password hashing)

---

## 📂 Directory Structure

```text
DarshanEase/
├── backend/
│   ├── config/             # Database connection setup
│   ├── controllers/        # Express route handlers
│   ├── middleware/         # Auth verification and error handler
│   ├── models/             # Mongoose schemas (User, Temple, Slot, Booking, Donation)
│   ├── routes/             # API endpoint definitions
│   ├── utils/              # Helper utilities
│   ├── server.js           # Express server entrypoint
│   └── .env                # Backend environment configuration
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable layout UI (Navbar, Footer, etc.)
    │   ├── context/        # React Context (Auth State)
    │   ├── pages/          # View components (Home, Dashboard, Details, etc.)
    │   ├── services/       # API call definitions using Axios
    │   ├── styles/         # Custom styling sheets
    │   └── main.jsx        # React entrypoint
    ├── index.html          # Shell template
    └── vite.config.js      # Vite compilation configuration
```

---

## 🛕 Featured Temples Directory

The platform comes pre-configured with a database seeder (`npm run seed`) that loads major shrines across India, including a dedicated collection of Maharashtra's holy pilgrimage sites:

### 🚩 Pan-India Holy Shrines:
1. **Kashi Vishwanath Temple** — Varanasi, Uttar Pradesh (*Deity: Lord Shiva - Jyotirlinga*)
2. **Somnath Temple** — Prabhas Patan, Gujarat (*Deity: Lord Shiva - 1st Jyotirlinga*)
3. **Tirupati Balaji (Venkateswara Temple)** — Tirumala, Andhra Pradesh (*Deity: Lord Venkateswara / Vishnu*)
4. **Meenakshi Amman Temple** — Madurai, Tamil Nadu (*Deity: Goddess Meenakshi / Parvati*)
5. **Kedarnath Temple** — Kedarnath, Uttarakhand (*Deity: Lord Shiva - Himalayan Jyotirlinga*)

### 🚩 Maharashtra Sacred Shrines:
6. **Shri Saibaba Sansthan Temple** — Shirdi, Ahmednagar, Maharashtra (*Deity: Shirdi Sai Baba*)
7. **Shree Siddhivinayak Temple** — Prabhadevi, Mumbai, Maharashtra (*Deity: Lord Ganesha*)
8. **Trimbakeshwar Shiva Temple** — Trimbak, Nashik, Maharashtra (*Deity: Lord Shiva - Jyotirlinga*)
9. **Shree Mahalakshmi Temple (Ambabai)** — Kolhapur, Maharashtra (*Deity: Goddess Mahalakshmi - Shakti Peetha*)
10. **Bhimashankar Jyotirlinga Temple** — Bhimashankar, Pune, Maharashtra (*Deity: Lord Shiva - Jyotirlinga*)
11. **Shree Vitthal-Rukmini Mandir** — Pandharpur, Solapur, Maharashtra (*Deity: Lord Vitthal / Krishna*)
12. **Grishneshwar Jyotirlinga Temple** — Ellora, Chhatrapati Sambhajinagar, Maharashtra (*Deity: Lord Shiva - 12th Jyotirlinga*)

> **Database Seeding Tip**: Run `npm run seed` inside the `backend/` folder to populate all 12 temples and 288 pre-scheduled darshan slots into MongoDB automatically.

---

## ⚙️ Getting Started

Follow these steps to run the application locally.

### Prerequisites:
* **Node.js** (v16.x or higher)
* **MongoDB** (Local instance running on port `27017` or a MongoDB Atlas cloud URI)
* **npm** or **yarn**

---

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository (or navigate to the workspace directory)
cd "Final Project"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2: Configure Environment Variables

Create a file named `.env` in the `backend/` directory (if it doesn't already exist) and populate it with the following configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection (Replace with MongoDB Atlas connection string if running in cloud)
MONGO_URI=mongodb://localhost:27017/darshanease

# JWT Authentication Secret Key
JWT_SECRET=darshanease_super_secure_secret_key_987654321
```

---

### Step 3: Run the Application

#### Run the Backend:
```bash
cd backend
npm run dev
```
The server will start, connect to MongoDB, and run on `http://localhost:5000`.

#### Run the Frontend:
```bash
cd frontend
npm run dev
```
The Vite development server will spin up and run on `http://localhost:3000`. Open this URL in your web browser.

---

## 🌐 API Endpoints Summary

| Feature | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/api/users/register` | Register a new user |
| | `POST` | `/api/users/login` | Log in and receive JWT |
| | `GET` | `/api/users/profile` | Get logged-in user profile (Auth required) |
| **Temples** | `GET` | `/api/temples` | Get all temples |
| | `GET` | `/api/temples/:id` | Get single temple details |
| | `POST` | `/api/temples` | Add a new temple (Admin/Organizer required) |
| **Slots** | `GET` | `/api/slots/temple/:templeId` | Get available slots for a temple |
| | `POST` | `/api/slots` | Create a new slot (Admin/Organizer required) |
| **Bookings** | `POST` | `/api/bookings` | Create a new Darshan booking |
| | `GET` | `/api/bookings/my-bookings` | Retrieve user bookings (Auth required) |
| | `DELETE` | `/api/bookings/:id` | Cancel an existing booking |
| **Donations** | `POST` | `/api/donations` | Make a donation to a temple (Auth required) |
| | `GET` | `/api/donations/my-donations` | Get devotee's donation history (Auth required) |
| | `GET` | `/api/donations` | Get all donations ledger (Admin/Organizer required) |
| | `PUT` | `/api/donations/:id` | Update donation record (Admin/Organizer required) |
| | `DELETE` | `/api/donations/:id` | Delete donation record (Admin/Organizer required) |

---

## 🔒 Security Measures
* **Stateless Auth**: User sessions are handled with JWT.
* **Password Hashing**: Devotee passwords are secure using `bcryptjs` before database storage.
* **Route Protection & Roles**: JWT checking middleware validates logins, and role-based controls (USER, ADMIN, ORGANIZER) regulate dashboard operations.
* **Central Error Handler**: Node.js centralized middleware filters errors, ensuring no critical stack traces are leaked to clients in production mode.
