from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.schemas.todo import TodoResponse, TodoCreate, TodoUpdate
from app.models.todo import Todo

router = APIRouter(
    prefix="/api/todos",
    tags=["todos"],
)

# Retrieve all todo items
@router.get("", response_model=List[TodoResponse])
def get_todos(
    skip: int = 0,
    limit: int = 100,
    completed: bool = None,
    db: Session = Depends(get_db)
):
    """Retrieve all todo items."""
    query = db.query(Todo)
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    todos = query.offset(skip).limit(limit).all()
    return todos

# Create a new todo item
@router.post("", response_model=TodoResponse, status_code=201)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    """Create a new todo item."""
    db_todo = Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# Retrieve a specific todo item by ID
@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific todo item by ID."""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

# Update a specific todo item by ID
@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db)
):
    """Update a specific todo item by ID."""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    update_data = todo_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(todo, key, value)

    db.commit()
    db.refresh(todo)
    return todo

# Delete a specific todo item by ID
@router.delete("/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """Delete a specific todo item by ID."""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(todo)
    db.commit()
    return None