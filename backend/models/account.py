from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base, get_db

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    balance = Column(Integer, default=0)
    account_type = Column(Enum("corrente", "poupanca"), default="corrente")
    created_at = Column(DateTime, default=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    from_account_id = Column(Integer, ForeignKey("accounts.id", ondelete="SET NULL"))
    to_account_id = Column(Integer, ForeignKey("accounts.id", ondelete="SET NULL"))
    amount = Column(Integer, nullable=False)
    type = Column(Enum("pix", "ted", "deposito", "retirada", "investimento"), nullable=False)
    description = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
