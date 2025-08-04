from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AccountCreate(BaseModel):
    user_id: int
    account_type: Optional[str] = "corrente"

class AccountResponse(BaseModel):
    id: int
    user_id: int
    balance: int
    account_type: str
    created_at: datetime

    class Config:
        orm_mode = True

class TransactionCreate(BaseModel):
    from_account_id: int
    to_account_id: int
    amount: int
    type: str
    description: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    from_account_id: Optional[int]
    to_account_id: Optional[int]
    amount: int
    type: str
    description: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
