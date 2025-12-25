from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from app.schemas.url import URLResponse, URLCreate, URLUpdate
from app.models.url import URL
from app.database.db import get_db

router = APIRouter(
    prefix="/api/urls",
    tags=["urls"],
)

# Retrieve all URL items
@router.get("", response_model=List[URLResponse])
def get_urls(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Retrieve all URL items."""
    query = db.query(URL)
    urls = query.offset(skip).limit(limit).all()
    return urls

# Create a new URL item
@router.post("", response_model=URLResponse, status_code=201)
def create_url(url: URLCreate, db: Session = Depends(get_db)):
    """Create a new URL item."""
    db_url = URL(**url.model_dump())
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url

# Retrieve a specific URL item by ID
@router.get("/{url_id}", response_model=URLResponse)
def get_url(url_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific URL item by ID."""
    url = db.query(URL).filter(URL.id == url_id).first()
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    return url

# Update a specific URL description by ID
@router.put("/{url_id}", response_model=URLResponse)
def update_url_item(
    url_id: int,
    url_update: URLUpdate,
    db: Session = Depends(get_db)
):
    """Update a specific URL by ID."""
    url = db.query(URL).filter(URL.id == url_id).first()
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    
    update_data = url_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(url, key, value)
    
    db.commit()
    db.refresh(url)
    return url

# Delete a specific URL item by ID
@router.delete("/{url_id}", status_code=204)
def delete_url(url_id: int, db: Session = Depends(get_db)):
    """Delete a specific URL item by ID."""
    url = db.query(URL).filter(URL.id == url_id).first()
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    
    db.delete(url)
    db.commit()
    return