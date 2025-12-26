from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class YtURLBase(BaseModel):
    """Base schema for a YouTube URL item."""
    url: str

class YtURLCreate(YtURLBase):
    """Schema for creating a new YouTube URL item."""
    pass  # Inherits all fields from YtURLBase

class YtURLUpdate(BaseModel):
    """Schema for updating an existing YouTube URL item."""
    description: Optional[str] = None
    complete_status: Optional[bool] = None

class YtURLDelete(BaseModel):
    """Schema for deleting a YouTube URL item."""
    id: int

class YtURLResponse(YtURLBase):
    """Schema for responding with a YouTube URL item."""
    id: int
    url: str
    description: Optional[str] = None
    complete_status: bool
    date_added: datetime

    class Config:
        from_attributes = True