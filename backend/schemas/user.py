from pydantic import BaseModel, EmailStr
from typing import Literal, Optional
from datetime import date, datetime

class UserCreate(BaseModel):
    fullName: str
    email: EmailStr
    password: str
    cpf: str
    birthdate: date
    phone: str
    role: Literal['admin', 'user', 'employee'] = 'user'

class UserOut(BaseModel):
    id: int
    fullName: str
    email: EmailStr
    role: str
    cpf: str
    phone: str
    birthdate: date
    is_approved: Optional[bool] = None
    createdAt: datetime
    updatedAt: Optional[datetime]

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    fullName: Optional[str]
    email: Optional[EmailStr]
    cpf: Optional[str]
    birthdate: Optional[date]
    phone: Optional[str]
    role: Optional[Literal['admin', 'user', 'employee']]