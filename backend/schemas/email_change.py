from pydantic import BaseModel, EmailStr

class EmailChangeRequestSchema(BaseModel):
    user_id: int
    new_email: EmailStr