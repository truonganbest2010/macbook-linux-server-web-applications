from sqlalchemy import Boolean, Column, DateTime, Integer, String, func
from app.database.db import Base

class URL(Base):
    """URL database table."""

    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(2048), nullable=False)
    description = Column(String(1000), index=True)
    complete_status = Column(Boolean, default=False)
    date_added = Column(DateTime(timezone=True), server_default=func.now())