from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.email_change import EmailChangeRequest
from schemas.user import UserUpdateSchema, ChangePasswordSchema, EmailChangeRequestSchema
from models.user import User
from utils.dependencies import get_db, get_current_user
from utils.security import verify_password, hash_password, send_email_verification, save_token, token_expired
import secrets

router = APIRouter()

@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UserUpdateSchema,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.id != user_id:
        raise HTTPException(status_code=403, detail="Acesso negado")

    user.fullName = data.fullName
    user.cpf = data.cpf
    user.birthdate = data.birthdate
    user.phone = data.phone

    db.commit()
    return {"status": "updated"}

@router.get("/me")
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/users/change-password")
def change_password(payload: ChangePasswordSchema, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if not verify_password(payload.old_password, user.password_hash):
        raise HTTPException(status_code=403, detail="Senha atual inválida")
    
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"msg": "Senha alterada com sucesso"}

@router.get("/teste-token")
def teste_token(user=Depends(get_current_user)):
    return {"msg": f"Usuário autenticado: {user.email}"}



# @router.post("/users/request-email-change")
# def request_email_change(data: EmailChangeRequestSchema, db: Session = Depends(get_db), user=Depends(get_current_user)):
#     token = secrets.token_urlsafe(32)
#     save_token(user.id, data.new_email, token, db)
#     send_email_verification(data.new_email, token)
#     return {"msg": "Verificação enviada para o novo email"}


# @router.post("/users/confirm-email-change")
# def confirm_email_change(token: str, db: Session = Depends(get_db)):
#     record = db.query(EmailChangeRequest).filter_by(token=token).first()
#     if not record or token_expired(record):
#         raise HTTPException(status_code=400, detail="Token inválido ou expirado")

#     user = db.query(User).filter(User.id == record.user_id).first()
#     user.email = record.new_email
#     db.commit()
#     return {"msg": "Email atualizado com sucesso"}