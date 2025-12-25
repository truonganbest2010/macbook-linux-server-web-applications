from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

# Use /app/data for Docker, otherwise use the current directory
db_path = os.environ.get('DB_PATH', './macbook-linux-server-web-applications.db')
SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

# SQLite specific argument
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency that provides a database session
def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()