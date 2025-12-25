from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import urls, todos, stats
from app.database.db import engine, Base

# Create all database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Meatbird Server API",
    description="A FastAPI application running on a MacBook Linux server.",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(urls.router)
app.include_router(todos.router)
app.include_router(stats.router)


@app.get("/")
def read_root():
    """Root endpoint."""
    return {
        "message": "Welcome to the Meatbird Server API!",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy"
    }