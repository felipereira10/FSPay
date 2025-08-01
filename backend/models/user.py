from datetime import datetime
from sqlalchemy import TIMESTAMP, Column, DateTime, Float, Integer, String, Date, Enum
from core.database import Base
from sqlalchemy import Column, Boolean
from sqlalchemy.orm import relationship
from models.pix_transaction import PixTransaction
import enum

class RoleEnum(enum.Enum):
    admin = "admin"
    user = "user"
    employee = "employee"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullName = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False)
    birthdate = Column(Date, nullable=False)
    phone = Column(String(20), nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.user, nullable=False)
    profile_image = Column(String(255), nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(
        TIMESTAMP,
        nullable=True,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    is_approved = Column(Boolean, default=False, nullable=False)
    transactions = relationship(PixTransaction, back_populates="user", cascade="all, delete-orphan")

