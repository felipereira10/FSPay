from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base

class PixTransaction(Base):
    __tablename__ = "pix_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    type = Column(String(20), nullable=False)
    key_used = Column(String(255), nullable=True)
    value = Column(Float, nullable=False)
    scheduled_date = Column(Date, nullable=True)
    status = Column(String(20), default="pendente")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")
