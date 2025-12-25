from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class URLBase(BaseModel):
    """Base schema for a URL item."""
    url: str

class URLCreate(URLBase):
    """Schema for creating a new URL item."""
    pass  # Inherits all fields from URLBase

class URLUpdate(BaseModel):
    """Schema for updating an existing URL item."""
    description: Optional[str] = None
    complete_status: Optional[bool] = None

class URLDelete(BaseModel):
    """Schema for deleting a URL item."""
    id: int

class URLResponse(URLBase):
    """Schema for responding with a URL item."""
    id: int
    url: str
    description: Optional[str] = None
    complete_status: bool
    date_added: datetime

    class Config:
        from_attributes = True