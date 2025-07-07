from sqlalchemy import Column, Integer, String, Date, Enum
from core.database import Base
import enum

class RoleEnum(enum.Enum):
    admin = "admin"
    user = "user"
    employee = "employee"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    cpf = Column(String(14), unique=True)
    birthdate = Column(Date)
    phone = Column(String(20))
    role = Column(Enum(RoleEnum), default=RoleEnum.user, nullable=False)
