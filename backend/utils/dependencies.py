from fastapi import Request, HTTPException, Depends
from utils.jwt import decode_access_token
from models.user import User
from utils.dependencies import get_db  # cuidado com import circular!
from sqlalchemy.orm import Session

def get_token_from_header(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token não fornecido")
    return auth_header.split(" ")[1]

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = get_token_from_header(request)
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Token inválido")

    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user