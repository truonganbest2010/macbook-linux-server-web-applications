from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from app.schemas.yt_url import YtURLResponse, YtURLCreate, YtURLUpdate
from app.models.yt_url import YtURL
from app.database.db import get_db

router = APIRouter(
    prefix="/api/yt-urls",
    tags=["yt-urls"],
)

# Retrieve all URL items
@router.get("", response_model=List[YtURLResponse])
def get_yt_urls(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Retrieve all Youtube URL items."""
    query = db.query(YtURL)
    yt_urls = query.offset(skip).limit(limit).all()
    return yt_urls

# Create a new URL item
@router.post("", response_model=YtURLResponse, status_code=201)
def create_yt_url(url: YtURLCreate, db: Session = Depends(get_db)):
    """Create a new URL item."""
    db_yt_url = YtURL(**url.model_dump())
    db.add(db_yt_url)
    db.commit()
    db.refresh(db_yt_url)
    return db_yt_url

# Retrieve a specific URL item by ID
@router.get("/{url_id}", response_model=YtURLResponse)
def get_yt_url(url_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific URL item by ID."""
    yt_url = db.query(YtURL).filter(YtURL.id == url_id).first()
    if not yt_url:
        raise HTTPException(status_code=404, detail="Youtube URL not found")
    return yt_url

# Update a specific URL description by ID
@router.put("/{url_id}", response_model=YtURLResponse)
def update_yt_url_item(
    url_id: int,
    url_update: YtURLUpdate,
    db: Session = Depends(get_db)
):
    """Update a specific URL by ID."""
    yt_url = db.query(YtURL).filter(YtURL.id == url_id).first()
    if not yt_url:
        raise HTTPException(status_code=404, detail="Youtube URL not found")
    
    update_data = url_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(yt_url, key, value)
    
    db.commit()
    db.refresh(yt_url)
    return yt_url

# Delete a specific URL item by ID
@router.delete("/{url_id}", status_code=204)
def delete_yt_url(url_id: int, db: Session = Depends(get_db)):
    """Delete a specific URL item by ID."""
    yt_url = db.query(YtURL).filter(YtURL.id == url_id).first()
    if not yt_url:
        raise HTTPException(status_code=404, detail="Youtube URL not found")

    db.delete(yt_url)
    db.commit()
    return