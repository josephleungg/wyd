from sqlalchemy import Column, Integer, String, ForeignKey , DateTime, func
from db.conn import Base

class Entries(Base):
    __tablename__ = 'entries'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    sentiment = Column(String, nullable=True)
    type = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    conversation_id = Column(String, nullable=False)