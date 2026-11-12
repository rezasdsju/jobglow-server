# ⚙️ JobGlow Server

> Backend APIs for the JobGlow job portal.

This repository contains the backend of JobGlow, which serves the [frontend](https://github.com/rezasdsju/jobglow-client) web application.

## 🔗 Links

- **Frontend repo:** [jobglow-client](https://github.com/rezasdsju/jobglow-client)
- **Base API URL:** [https://jobglow-server.vercel.app](https://jobglow-server.vercel.app/)

## 🛠️ Tech Stack

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)

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

```
PORT=5000
```