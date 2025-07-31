from pydantic import BaseModel

class PixKey(BaseModel):
    key: str
    amount: float

class PixSchedule(BaseModel):
    to_key: str
    amount: float
    date: str
