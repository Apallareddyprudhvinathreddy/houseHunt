# 🏠 HouseHunt: Finding Your Perfect Rental Home

A full-stack MERN application for property discovery, booking inquiries, and real-time notifications.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

**1. Clone and install dependencies:**
```bash
# Server
cd server
npm install

# Client
cd client
npm install
```

**2. Configure environment variables:**

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/househunt
JWT_SECRET=your_jwt_secret_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**3. Seed sample data:**
```bash
cd server
npm run seed
```

This creates:
- Admin account: `admin@hh.test` / `password123`
- Owner accounts: `owner@hh.test`, `owner2@hh.test` / `password123`
- Renter account: `renter@hh.test` / `password123`

**4. Start the application:**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

The app will be available at `http://localhost:3000`

## Features

- 🔐 Role-based authentication (Admin, Owner, Renter)
- 🔍 Advanced property search with filters
- 📧 Real-time notifications & email alerts
- 💬 Booking inquiry system
- ⭐ Property reviews and ratings
- 📊 Admin dashboard with statistics
- 🔒 Security with Helmet.js & rate limiting
- 🚀 Production-ready deployment guides

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Socket.IO, Nodemailer
**Frontend:** React, React Router, Axios, Socket.IO Client
**Security:** JWT, bcryptjs, Helmet, express-rate-limit

## Project Structure

```
HouseHunt/
├── server/               # Express.js backend
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── utils/           # Email, helpers
│   ├── tests/           # Jest test files
│   └── index.js         # Express app entry
├── client/              # React frontend
│   ├── public/          # Static files
│   └── src/
│       ├── pages/       # Route pages
│       ├── components/  # Reusable UI
│       ├── context/     # Auth context
│       └── api/         # Axios config
└── docs/                # Deployment & guides
```

## API Documentation

See [README_FULL.md](README_FULL.md) for complete API documentation with examples.

## Deployment

For deployment guides (Heroku, Railway, Vercel), see [DEPLOYMENT.md](DEPLOYMENT.md)

## License

MIT


