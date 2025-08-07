from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import SessionLocal
from schemas.user import UserCreate, UserOut
from services.auth_service import create_user, authenticate_user
from utils.jwt import create_access_token
from pydantic import BaseModel
from routes.account import create_account

import os

router = APIRouter(prefix="/auth", tags=["Autentication"])

class LoginData(BaseModel):
    email: str
    password: str

router = APIRouter()
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    new_user = create_user(db, user)

    # Cria a conta padrão (corrente) com saldo 0 p/ novo user
    create_account(db, user_id=new_user.id)

    return {"message": "Cadastro enviado para análise, aguarde aprovação."}

@router.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = authenticate_user(db, data.email, data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if not user.is_approved:
        raise HTTPException(status_code=403, detail="Usuário ainda não aprovado pelo admin")

    token = create_access_token({"sub": user.email}, ACCESS_TOKEN_EXPIRE_MINUTES)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "fullName": user.fullName,
            "cpf": user.cpf,
            "email": user.email,
            "role": user.role.value if hasattr(user.role, 'value') else user.role,
        }
    }