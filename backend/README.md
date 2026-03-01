# NIT KKR Mess Management — Backend (MERN)

## Setup (Local Development)

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm run dev
```

Server runs at `http://localhost:5000`

## Deploy on Vercel

1. Push this `backend/` folder to a **separate GitHub repo**
2. Import that repo in Vercel → it auto-detects `vercel.json`
3. Add environment variables in Vercel dashboard:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — any random secret string
4. Deploy!

## Deploy Frontend on Vercel

1. Push the frontend (root of this project minus `backend/`) to a **separate repo**
2. In `src/lib/api.ts`, change `API_BASE` to your deployed backend URL
3. Import in Vercel → build command: `npm run build`, output: `dist`
4. Add env var: `VITE_API_BASE_URL=https://your-backend.vercel.app`

## API Endpoints

| Method | Endpoint                  | Auth     | Description               |
|--------|---------------------------|----------|---------------------------|
| POST   | /api/auth/register        | —        | Register user             |
| POST   | /api/auth/login           | —        | Login, returns JWT        |
| GET    | /api/auth/me              | Token    | Get current user          |
| GET    | /api/users                | Admin    | List all users            |
| GET    | /api/users/students       | Token    | List students             |
| POST   | /api/users                | Admin    | Create user               |
| DELETE | /api/users/:id            | Admin    | Delete user               |
| POST   | /api/attendance/mark      | Admin    | Mark attendance           |
| POST   | /api/attendance/mark-all  | Admin    | Mark all present/absent   |
| GET    | /api/attendance           | Token    | Get attendance records    |
| GET    | /api/attendance/summary   | Token    | Monthly summary           |
| POST   | /api/leaves               | Admin    | Create leave              |
| GET    | /api/leaves               | Token    | List leaves               |
| GET    | /api/bills                | Token    | Get student bill          |
| GET    | /api/bills/all            | Admin    | All students' bills       |
| POST   | /api/notifications        | Admin    | Send notification         |
| GET    | /api/notifications        | Token    | List notifications        |
| GET    | /api/mess-config          | Token    | Get month configs         |
| PUT    | /api/mess-config          | Admin    | Update cost/day           |
