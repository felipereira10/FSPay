from pydantic import BaseModel, EmailStr
from typing import Literal
from datetime import date

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    cpf: str
    birthdate: date
    phone: str
    role: Literal['admin', 'user', 'employee'] = 'user'

class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True
