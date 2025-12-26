from sqlalchemy import Boolean, Column, DateTime, Integer, String, func, Text
from app.database.db import Base

class YtURL(Base):
    """YouTube URL database table."""

    __tablename__ = "yt_urls"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(2048), nullable=False)
    description = Column(Text, nullable=True)
    complete_status = Column(Boolean, default=False)
    date_added = Column(DateTime(timezone=True), server_default=func.now())