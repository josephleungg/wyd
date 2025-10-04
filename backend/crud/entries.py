from sqlalchemy.orm import Session
from db import models

def get_conversation_id_with_id(db: Session, entry_id: int):
    entry = db.query(models.Entries).filter(models.Entries.id == entry_id).first()
    return entry.conversation_id if entry else None

def create_entry(db: Session, conversation_id: str, content: str, sentiment: str | None, type: str, owner_id: int | None = None, imgur_url: str | None = None):
    new_entry = models.Entries(
        content=content,
        conversation_id=conversation_id,
        sentiment=sentiment,
        type=type,
        owner_id=owner_id,
        imgur_url=imgur_url
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

def list_entries(db: Session):
    return db.query(models.Entries).all()

def get_summary_with_id(db: Session, entry_id: int):
    entry = db.query(models.Entries).filter(models.Entries.id == entry_id).first()
    return entry.content if entry else None