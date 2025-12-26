from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.db import get_db
from app.models.yt_url import YtURL
from app.models.todo import Todo

router = APIRouter(
    prefix="/api/stats",
    tags=["stats"],
)

class StatsResponse(BaseModel):
    total_urls: int
    total_todos: int
    pending_todos: int
    completed_todos: int

@router.get("", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """Retrieve application statistics."""
    total_urls = db.query(YtURL).count()
    total_todos = db.query(Todo).count()
    pending_todos = db.query(Todo).filter(Todo.completed == False).count()
    completed_todos = db.query(Todo).filter(Todo.completed == True).count()

    return StatsResponse(
        total_urls=total_urls,
        total_todos=total_todos,
        pending_todos=pending_todos,
        completed_todos=completed_todos
    )