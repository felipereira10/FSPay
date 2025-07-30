from pydantic import BaseModel
from datetime import date

class TransferCreate(BaseModel):
    receiver_id: int
    amount: float
    description: Optional[str]
    type: str = Field(..., regex="^(pix|ted|boleto)$")

class TransferOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    amount: float
    type: str
    description: Optional[str]
    timestamp: datetime

    class Config:
        orm_mode = True

class BalanceOut(BaseModel):
    user_id: int
    balance: float