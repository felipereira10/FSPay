from pydantic import BaseModel, EmailStr, ConfigDict
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
    updatedAt: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, extra="ignore")

class UserUpdate(BaseModel):
    fullName: Optional[str]
    cpf: Optional[str]
    birthdate: Optional[date]
    phone: Optional[str]
    role: Optional[Literal['admin', 'user', 'employee']]

class UserUpdateSchema(BaseModel):
    fullName: str
    cpf: str
    birthdate: date
    phone: str

class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str

class EmailChangeRequestSchema(BaseModel):
    new_email: EmailStr