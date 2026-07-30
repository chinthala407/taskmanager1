# Task Manager Backend

Backend API for the Task Manager application built with Node.js, Express.js, and PostgreSQL.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt
- dotenv

## Project Structure

```
backend/
├── src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── package.json
├── .env
└── server.js
```

## Installation

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=taskmanager
JWT_SECRET=your_secret_key
```

3. Start the server

```bash
npm run dev
```

## API Endpoints

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

## Author

CHINTHALA DILEEP