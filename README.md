# 🛠️ My Fullstack E-Commerce App (Self-Hosted!)

Welcome! This is my personal, self-hosted fullstack e-commerce project, built from scratch and running on my own server. I designed, coded, and deployed everything myself—from the backend API to the modern frontend, all the way to Dockerized production on my Synology NAS. If you want to see what a solo developer can do with open source tools, this is it!

---

## 🚦 What’s Inside?

- **Backend:** Python Flask REST API, SQLAlchemy ORM, MySQL database
- **Frontend:** React 19 + TypeScript, Redux Toolkit, React Query, Vite, TailwindCSS
- **API Auth:** JWT-based authentication, secure endpoints
- **DevOps:** Dockerized, Nginx reverse proxy, full deployment scripts
- **Theme:** Catppuccin Mocha palette for a beautiful, modern look
- **Self-Hosting:** Deployed and running on my own Synology NAS (not a cloud service!)

---

## 🏗️ Project Structure

```file-structure
/ (project root)
├── ecommerce-flaskapi/   # Flask backend (API, DB models, auth, etc)
├── ecom-front/           # React + TS frontend (SPA, state, UI)
└── nginx/                # Nginx
```

---

## ✨ Features

- User registration, login, JWT auth
- Profile management (edit/delete)
- Product browsing, search, and detail pages
- Shopping cart with localStorage persistence
- Checkout and order history
- Protected routes for logged-in users
- Admin endpoints for product management
- Responsive, mobile-first UI
- Optimistic UI updates, error handling, and loading states
- Full REST API with Postman collection

---

## 🧑‍💻 Tech Stack

### Frontend

- React 19, TypeScript 5
- Redux Toolkit, React Query, React Router
- Axios, TailwindCSS, Vite

### Backend

- Python 3.10+, Flask 3, SQLAlchemy, Marshmallow
- MySQL 8+, Flask-JWT-Extended, Flask-CORS

### DevOps

- Docker, Docker Compose
- Nginx (reverse proxy)
- Deployed on Synology NAS (my own hardware!)

---

## 🚀 How I Run It (Quick Start)

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0+

---

## 🐳 Docker & Self-Hosting

I run everything in Docker containers on my Synology NAS, but I do NOT use docker-compose for deployment. Instead, I built each container separately from its own Dockerfile using the Synology Docker Manager UI. I set all environment variables (like secrets, DB credentials, API URLs) directly in the Docker Manager for each container. Once all containers were running, I set up Nginx (also in its own container) as a reverse proxy to route traffic to the frontend and backend containers. SSL and domain config were handled via Nginx and Let's Encrypt.

### My Deployment Process

1. Build each container (backend, frontend, nginx) separately from their Dockerfiles using Synology Docker Manager
2. Set environment variables for each container in the Docker Manager UI
3. Start backend, frontend, and MySQL containers
4. Start Nginx container and configure it as a reverse proxy for the app
5. Set up SSL and domain (Let's Encrypt)
6. Done! No docker-compose, no cloud—just my code, my server, and my config

---

## 🔌 API Overview

- `POST /register` — Register new user
- `POST /login` — Login, get JWT
- `GET /products` — List products (paginated)
- `GET /products/:id` — Product details
- `POST /orders` — Place order
- `GET /orders` — List orders
- `GET /users/me` — Get current user
- ...and more! (see Postman collection)

---

## 🎨 Catppuccin Theme

I love the Catppuccin Mocha palette, so the whole UI uses it:

| Color   | Hex      | Usage           |
|---------|----------|-----------------|
| Base    | #1e1e2e  | Background      |
| Text    | #cdd6f4  | Main text       |
| Mauve   | #cba6f7  | Primary actions |
| Pink    | #f5c2e7  | Secondary       |
| Blue    | #89b4fa  | Info            |
| Green   | #a6e3a1  | Success         |
| Red     | #f38ba8  | Error           |

---

## 🧪 Testing & Troubleshooting

- Manual test checklist in this repo
- Linting: `npm run lint` (frontend)
- Backend: add your own tests (pytest recommended)
- CORS, DB, and port troubleshooting tips included

---

## 🔒 Security & Production Notes

- JWT secret is hardcoded for dev—**change for prod!**
- CORS is localhost-only by default
- Debug mode is on for dev
- See checklist for production hardening

---

## 🚧 Roadmap & Ideas

- Product search, filters, and sorting
- Reviews, ratings, wishlists
- Admin dashboard, inventory, Stripe payments
- Email notifications, order tracking
- PWA support, image optimization, i18n

---

## 👋 About Me

I’m Sys-Redux, and this is my solo fullstack project—designed, built, and hosted by me. If you have questions, want to contribute, or just want to chat about self-hosting, open an issue or reach out!

---

**Thanks for checking out my project!**

*Built with ❤️, React, Flask, and a lot of coffee, running on my own hardware.*
