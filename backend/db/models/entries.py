from sqlalchemy import Column, Integer, String, ForeignKey , DateTime, func
from db.conn import Base

class Entries(Base):
    __tablename__ = 'entries'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    owner_id = Column(Integer, ForeignKey('users.id'))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())