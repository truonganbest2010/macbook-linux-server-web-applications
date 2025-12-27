from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.db import get_db
from app.models.yt_url import YtURL
from app.models.todo import Todo
from app.schemas.stats import StatsResponse

router = APIRouter(
    prefix="/api/stats",
    tags=["stats"],
)
    
@router.get("", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """Retrieve application statistics."""
    # Todo stats
    total_todos = db.query(Todo).count()
    pending_todos = db.query(Todo).filter(Todo.completed == False).count()
    completed_todos = db.query(Todo).filter(Todo.completed == True).count()

    # YouTube URL stats
    total_yt_urls = db.query(YtURL).count()
    completed_yt_urls = db.query(YtURL).filter(YtURL.complete_status == True).count()
    pending_yt_urls = db.query(YtURL).filter(YtURL.complete_status == False).count()

    return StatsResponse(
        total_todos=total_todos,
        pending_todos=pending_todos,
        completed_todos=completed_todos,
        total_yt_urls=total_yt_urls,
        completed_yt_urls=completed_yt_urls,
        pending_yt_urls=pending_yt_urls
    )