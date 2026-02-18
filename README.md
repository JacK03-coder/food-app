# Food App

Full-stack food video ordering app.

## Tech
- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB

## Project Structure
- `frontEnd/` React client
- `backEnd/` Express API

## Local Setup
1. Copy env templates:
   - `backEnd/.env.example` -> `backEnd/.env`
   - `frontEnd/.env.example` -> `frontEnd/.env`
2. Install dependencies:
   - `cd backEnd && npm install`
   - `cd ../frontEnd && npm install`
3. Run backend:
   - `cd backEnd && npm run dev`
4. Run frontend:
   - `cd frontEnd && npm run dev`

## Deploy Notes
- Set backend env vars from `backEnd/.env.example`.
- Set frontend `VITE_API_BASE_URL` to deployed backend URL.
- Configure `CORS_ORIGINS` and `FRONTEND_URL` for production domains.

