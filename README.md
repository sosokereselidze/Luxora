# Luxora – Premium Perfume E-Commerce

Luxora is a full-stack e-commerce application for a premium perfume store, built with React (Vite) and Node.js (Express + MongoDB).

## Project Structure

```
Luxora/
├── backend/                 # Express API server
│   ├── config/              # Database & app config
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Auth, validation, etc.
│   ├── models/              # Mongoose models (User, Product, Order)
│   ├── routes/              # API route definitions
│   ├── uploads/             # Product image uploads (multer)
│   ├── .env.example         # Environment template
│   ├── server.js            # Entry point
│   └── seed.js              # Database seeder
│
├── frontend/                # React + Vite SPA
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── api/             # Centralized API client & endpoints
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth & Cart state
│   │   ├── pages/           # Route pages
│   │   └── assets/          # Images, styles
│   ├── .env.example         # Frontend env template
│   └── vite.config.js
│
├── .gitignore
├── package.json             # Root scripts (dev, install-all)
└── README.md
```

## Setup

1. **Install dependencies**
   ```bash
   npm run install-all
   ```

2. **Backend**
   - Copy `backend/.env.example` to `backend/.env`
   - Set `MONGO_URI` and `JWT_SECRET`
   - Run MongoDB locally or use a cloud URI
   ```bash
   npm run backend
   ```

3. **Seed database** (optional)
   ```bash
   npm run seed
   ```

4. **Frontend**
   - Copy `frontend/.env.example` to `frontend/.env` (optional; defaults work with local backend)
   ```bash
   npm run frontend
   ```

5. **Run both**
   ```bash
   npm run dev
   ```

- Backend: http://localhost:5000  
- Frontend: http://localhost:5173  

## Scripts

| Command | Description |
|---------|-------------|
| `npm run install-all` | Install root + backend + frontend deps |
| `npm run dev` | Run backend and frontend concurrently |
| `npm run backend` | Start API server |
| `npm run frontend` | Start Vite dev server |
| `npm run seed` | Seed database with sample products |
