# ⚙️ JobGlow Server

> Backend APIs for the JobGlow job portal.

This repository contains the backend of JobGlow, which serves the [frontend](https://github.com/rezasdsju/jobglow-client) web application.

## 🔗 Links

- **Frontend repo:** [jobglow-client](https://github.com/rezasdsju/jobglow-client)
- **Base API URL:** [https://jobglow-server.vercel.app](https://jobglow-server.vercel.app/)

## ✨ Features

- RESTful API development using Express.js
- MongoDB database integration
- Create and store job postings
- CORS support
- JSON request body parsing

## 🛠️ Tech Stack

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

## 🔌 API Endpoints

**Base URL:** `https://jobglow-server.vercel.app`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Check server status | Public |
| GET | `/jobs` | Retrieve all jobs | Public |
| POST | `/jobs` | Create a new job posting | Public |

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/rezasdsju/jobglow-server.git
cd jobglow-server

# Install dependencies
npm install

# Start the development server
npx nodemon index.js
```

The server runs on `http://localhost:5000` by default.

## 🔑 Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```