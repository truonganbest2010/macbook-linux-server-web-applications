# 🍗 MeatBird - Personal Dashboard Application

A full-stack web application for managing todos and bookmarking URLs, built with Vue.js and FastAPI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

---

## Overview

MeatBird is a self-hosted personal dashboard that provides:

- **Dashboard** - Overview of your todos and URLs with statistics
- **Todo Manager** - Create, complete, and delete tasks
- **URL Manager** - Save, organize, and access your bookmarked URLs

```
┌─────────────────────────────────────────────────────────────┐
│  🍗 MeatBird           [Dashboard] [Todos] [URLs]           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────────────┐  ┌──────────────────────┐       │
│   │  📝 Todos            │  │  🔗 URLs             │       │
│   │   5 Total            │  │   12 Saved           │       │
│   │   3 Done | 2 Pending │  │                      │       │
│   │   ████████░░ 60%     │  │                      │       │
│   └──────────────────────┘  └──────────────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          YOUR SERVER                                    │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                         DOCKER                                  │   │
│   │                                                                 │   │
│   │   ┌──────────────┐     ┌──────────────┐      ┌────────────┐    │   │
│   │   │  FRONTEND    │     │   BACKEND    │      │  DATABASE  │    │   │
│   │   │   Vue.js     │────►│   FastAPI    │─────►│   SQLite   │    │   │
│   │   │   Nginx      │◄────│   Python     │◄─────│            │    │   │
│   │   │   :3000      │     │   :3030      │      │            │    │   │
│   │   └──────────────┘     └──────────────┘      └────────────┘    │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
              │
              │  Browser (HTTP)
              ▼
        ┌───────────┐
        │    YOU    │
        └───────────┘
```

### Request Flow

When you interact with the application, here's what happens:

```
    YOU                    FRONTEND                 BACKEND                DATABASE
     │                        │                        │                      │
     │  1. Click "Add Todo"   │                        │                      │
     │───────────────────────►│                        │                      │
     │                        │                        │                      │
     │                        │  2. POST /api/todos    │                      │
     │                        │───────────────────────►│                      │
     │                        │                        │                      │
     │                        │                        │  3. INSERT INTO DB   │
     │                        │                        │─────────────────────►│
     │                        │                        │                      │
     │                        │                        │  4. Success          │
     │                        │                        │◄─────────────────────│
     │                        │                        │                      │
     │                        │  5. Return new todo    │                      │
     │                        │◄───────────────────────│                      │
     │                        │                        │                      │
     │  6. Display todo       │                        │                      │
     │◄───────────────────────│                        │                      │
```

### Docker Container Communication

```
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Network                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Browser ──► :3000 ──► Nginx (frontend container)              │
│                           │                                     │
│                           ├── /           → Vue app (static)    │
│                           │                                     │
│                           └── /api/*      → Proxy to backend    │
│                                                │                │
│                                                ▼                │
│                                 Backend container (:3030)       │
│                                                │                │
│                                                ▼                │
│                                        SQLite (./data/)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| Vue.js 3 | Reactive UI framework |
| Vue Router | Client-side navigation |
| Pinia | State management |
| Bootstrap 5 | CSS framework |
| Axios | HTTP client |
| Vite | Build tool |
| Nginx | Static file server (production) |

### Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | Python web framework |
| SQLAlchemy | Database ORM |
| Pydantic | Data validation |
| Uvicorn | ASGI server |
| SQLite | Database |

### DevOps

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Container orchestration |

---

## Project Structure

```
meatbird-server/
│
├── backend/                      # Python FastAPI Backend
│   ├── app/
│   │   ├── database/             # Database connection
│   │   │   └── db.py
│   │   ├── models/               # SQLAlchemy models (DB tables)
│   │   │   ├── todo.py
│   │   │   └── url.py
│   │   ├── schemas/              # Pydantic schemas (validation)
│   │   │   ├── todo.py
│   │   │   └── url.py
│   │   ├── routers/              # API endpoints
│   │   │   ├── todos.py
│   │   │   ├── urls.py
│   │   │   └── stats.py
│   │   └── main.py               # FastAPI application entry
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                     # Vue.js Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/           # Navbar, Sidebar
│   │   ├── views/
│   │   │   ├── dashboard/        # Dashboard page
│   │   │   ├── todos/            # Todo management
│   │   │   └── urls/             # URL management
│   │   ├── stores/               # Pinia state stores
│   │   ├── services/             # API service
│   │   ├── router/               # Vue Router config
│   │   ├── App.vue
│   │   └── main.js
│   ├── nginx.conf
│   ├── package.json
│   └── Dockerfile
│
├── data/                         # SQLite database (Docker volume)
├── docker-compose.yml
└── README.md
```

---

## How It Works

### Backend Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         main.py                                 │
│                    (Application Entry)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
           ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │  routers/   │    │  routers/   │    │  routers/   │
    │  todos.py   │    │  urls.py    │    │  stats.py   │
    │             │    │             │    │             │
    │ /api/todos  │    │ /api/urls   │    │ /api/stats  │
    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
           │                  │                  │
           │    Uses          │    Uses          │
           ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │  schemas/   │    │  schemas/   │    │  (uses both │
    │  todo.py    │    │  url.py     │    │   models)   │
    │             │    │             │    │             │
    │ Validation  │    │ Validation  │    │             │
    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
           │                  │                  │
           │    Queries       │    Queries       │
           ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐          │
    │  models/    │    │  models/    │◄─────────┘
    │  todo.py    │    │  url.py     │
    │             │    │             │
    │  DB Table   │    │  DB Table   │
    └──────┬──────┘    └──────┬──────┘
           │                  │
           └────────┬─────────┘
                    │
                    ▼
           ┌─────────────────┐
           │   database/     │
           │   db.py         │
           │                 │
           │   SQLite        │
           └─────────────────┘
```

### Frontend Components

```
┌─────────────────────────────────────────────────────────────────┐
│                          App.vue                                │
│                     (Root Component)                            │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                      NavBar                              │   │
│   │        [Dashboard]  [Todos]  [URLs]                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                   RouterView                             │   │
│   │         (Displays current page based on URL)            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
           ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │  Dashboard  │    │  TodoList   │    │  UrlList    │
    │   View      │    │   View      │    │   View      │
    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
           │                  │                  │
           │    Uses          │    Uses          │
           ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │   api.js    │    │ todoStore   │    │ urlStore    │
    │  (service)  │    │  (Pinia)    │    │  (Pinia)    │
    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
           │                  │                  │
           └────────────────────┬────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │   Backend API       │
                    │   /api/*            │
                    └─────────────────────┘
```

---

## Running the Application

### Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)

### Option 1: Docker (Recommended for Production)

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd meatbird-server
   ```

2. **Start the application**
   ```
   docker-compose up -d --build
   ```

3. **Access the application**
   - Web App: http://localhost:3000
   - API Docs: http://localhost:3030/docs

4. **Stop the application**
   ```
   docker-compose down
   ```

### Option 2: Local Development

**Backend:**
1. Navigate to backend folder
2. Create Python virtual environment
3. Activate virtual environment
4. Install dependencies from requirements.txt
5. Run uvicorn on port 3030

**Frontend:**
1. Navigate to frontend folder
2. Install npm dependencies
3. Run development server

### Useful Docker Commands

| Action | Command |
|--------|---------|
| Start (background) | `docker-compose up -d` |
| Start (with logs) | `docker-compose up` |
| Stop | `docker-compose down` |
| Rebuild | `docker-compose up --build -d` |
| View all logs | `docker-compose logs -f` |
| View backend logs | `docker-compose logs -f backend` |
| View frontend logs | `docker-compose logs -f frontend` |
| Check status | `docker-compose ps` |

---

## API Endpoints

### Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | List all todos |
| POST | /api/todos | Create a new todo |
| GET | /api/todos/{id} | Get a specific todo |
| PUT | /api/todos/{id} | Update a todo |
| DELETE | /api/todos/{id} | Delete a todo |

### URLs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/urls | List all URLs |
| POST | /api/urls | Create a new URL |
| GET | /api/urls/{id} | Get a specific URL |
| PUT | /api/urls/{id} | Update a URL |
| DELETE | /api/urls/{id} | Delete a URL |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stats | Get dashboard statistics |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | API info |
| GET | /api/health | Health check |

---

## Deployment

### Deploy to Linux Server

1. **SSH into your server**

2. **Install Docker** (if not installed)

3. **Clone the repository**
   ```
   git clone <repository-url>
   cd meatbird-server
   ```

4. **Start the application**
   ```
   docker-compose up -d --build
   ```

5. **Configure firewall** (if needed)
   - Allow port 3000 for web access
   - Optionally allow port 3030 for direct API access

### Security Considerations (Local Network Only)

Since this application is intended for local network use:

- Bind to your LAN IP or localhost only
- Use firewall rules to restrict access to your network
- The application does not include authentication by default

---

## Database

The application uses SQLite for simplicity. The database file is stored in the `./data/` directory, which is mounted as a Docker volume for persistence.

### Database Schema

**Todos Table:**
- id (Primary Key)
- title
- description
- completed (boolean)
- category
- created_at
- updated_at

**URLs Table:**
- id (Primary Key)
- url
- description
- complete_status (boolean)
- date_added

---

## Development Notes

### Adding New Features

1. **Backend**: Create new model → schema → router → include in main.py
2. **Frontend**: Create new store → view → add route

### Database Changes

During development, if you modify database models:
1. Delete the SQLite database file
2. Restart the application (tables will be recreated)

For production, consider using Alembic for database migrations.

---

## License

This project is for personal use.

---

Built with ❤️ using Vue.js and FastAPI

