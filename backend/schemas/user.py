from pydantic import BaseModel, EmailStr
from typing import Literal
from datetime import date

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

    class Config:
        from_attributes = True
