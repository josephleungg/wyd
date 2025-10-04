from pydantic import BaseModel
from datetime import datetime

class EntriesResponse(BaseModel):
    id: int
    content: str
    timestamp: datetime
    sentiment: str | None
    type: str
    owner_id: int | None
    conversation_id: str
    imgur_url: str | None

    class Config:
        from_attributes = True

class EntriesCreateRequest(BaseModel):
    imgur_url: str | None = None

class TranscriptResponse(BaseModel):
    transcript: list[dict]

    class Config:
        from_attributes = True