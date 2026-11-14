# ⚙️ JobGlow Server

> Backend APIs for the JobGlow job portal.

This repository contains the backend of JobGlow, which serves the
[frontend](https://github.com/rezasdsju/jobglow-client) web application.

## 🔗 Links

- **Frontend repo:** [jobglow-client](https://github.com/rezasdsju/jobglow-client)
- **Base API URL:** [https://jobglow-server.vercel.app](https://jobglow-server.vercel.app/)

## ✨ Features

- RESTful API built with Express.js
- MongoDB integration using the official Node.js driver
- Create, list, and delete job posts
- **Filter jobs** by job type, category, and work mode
- **Case-insensitive search** across title, company, responsibilities, and
  qualifications
- CORS support so the frontend can call the API directly
- JSON request body parsing
- Environment-based configuration with `dotenv`

## 🛠️ Tech Stack

- [Node.js](https://nodejs.org/)
- [Express 5](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (Node.js driver)
- [CORS](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [nodemon](https://www.npmjs.com/package/nodemon) for local development

## 🔌 API Endpoints

**Base URL:** `https://jobglow-server.vercel.app`

| Method   | Endpoint    | Description                  | Access |
| -------- | ----------- | ---------------------------- | ------ |
| `GET`    | `/`         | Check server status          | Public |
| `GET`    | `/jobs`     | List jobs (with filtering)   | Public |
| `POST`   | `/jobs`     | Create a new job post        | Public |
| `GET` | `/jobs/:id` | Retrieve a job post            | Public |
| `DELETE` | `/jobs/:id` | Delete a job post            | Public |
| `POST` | `/applications` | Apply to a job             | Public |


> **Note:** Routes are currently public. Authentication and role checks are on
> the roadmap.

### Query parameters for `GET /jobs`

| Parameter  | Type    | Accepted values                                                                 | Description                                              |
| ---------- | ------- | ------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `jobType`  | string  | `full-time`, `part-time`, `contract`, `internship`                              | Filter by employment type                                |
| `category` | string  | `engineering-tech`, `it-software`, `design-creative`, `marketing-sales`, `accounting-finance`, `education-training`, `customer-support` | Filter by job category |
| `isRemote` | boolean | `true` or `false`                                                               | Filter remote vs on-site roles                           |
| `search`   | string  | any text                                                                        | Case-insensitive regex on title, company, responsibilities, and qualifications |

Parameters can be combined. Example:

```bash
# Remote full-time jobs that mention "react"
curl "http://localhost:5000/jobs?jobType=full-time&isRemote=true&search=react"
```

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/rezasdsju/jobglow-server.git
cd jobglow-server

# Install dependencies
npm install

# Start the development server (recommended)
npx nodemon index.js

# Or run it once
node index.js
```

The server runs on `http://localhost:5000` by default and connects to MongoDB on
startup.

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

| Variable      | Description                                      |
| ------------- | ------------------------------------------------ |
| `PORT`        | Port the Express server listens on (default 5000) |
| `MONGODB_URI` | MongoDB connection string used by the server      |

## 🗄️ Database

The server connects to the `jobglow` database:

- `jobs` — job posts (title, company, category, jobType, isRemote, location,
  salary range and frequency, deadline, responsibilities, qualifications,
  status, timestamps)
- `user` — accounts managed by Better Auth in the frontend

## 📁 Project Structure

```
jobglow-server/
├── index.js        # Express app, MongoDB connection, and job routes
├── package.json
├── package-lock.json
└── .env            # Local secrets (git-ignored)
```

## 🚧 Roadmap

- `PATCH` / `PUT /jobs/:id` to update job posts
- `GET /jobs/:id` for a single job lookup
- Server-side pagination and sorting
- Request validation and consistent error responses
- Authentication and role-based authorization for recruiter/admin routes
- Automated tests
