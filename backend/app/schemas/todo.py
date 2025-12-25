from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None

class TodoCreate(TodoBase):
    """Schema for creating a new to-do item."""
    pass # Inherits all fields from TodoBase

class TodoUpdate(TodoBase):
    """Schema for updating an existing to-do item."""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    completed: Optional[bool] = None

class TodoDelete(BaseModel):
    """Schema for deleting a to-do item."""
    id: int

class TodoResponse(TodoBase):
    """Schema for responding with a to-do item."""
    id: int
    completed: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True