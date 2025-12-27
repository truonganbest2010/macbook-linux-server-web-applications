from pydantic import BaseModel

class StatsResponse(BaseModel):
    # Stats fields for todos
    total_todos: int
    pending_todos: int
    completed_todos: int

    # Stats fields for YouTube URLs
    total_yt_urls: int
    completed_yt_urls: int
    pending_yt_urls: int