from fastapi import UploadFile, File, APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from core.database import SessionLocal
from models.user import RoleEnum, User
from schemas.user import UserOut, UserUpdate
from middlewares.auth import get_current_user
from typing import List
from fastapi.responses import JSONResponse
from sqlalchemy import Column, Boolean
import shutil
import os
import uuid
from datetime import datetime, timedelta

router = APIRouter()

# Simulação de armazenamento temporário
verification_codes = {}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def is_admin(user: User):
    return user.role == RoleEnum.admin

# GET all users (admin only)
@router.get("/admin", response_model=List[UserOut])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not is_admin(current_user):
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    users = db.query(User).all()
    for u in users:
        print(u.updatedAt, u.id, u.fullName, u.cpf, u.phone, u.birthdate, u.is_approved)
    return users


# GET user by ID
@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if not is_admin(current_user) and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Você não pode visualizar esse usuário")

    return user

# PUT - atualizar um usuário
@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if not is_admin(current_user) and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Você não pode editar esse usuário")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(user, key, value)

    user.updatedAt = datetime.utcnow()

    db.commit()
    db.refresh(user)
    return user

# DELETE - excluir um usuário
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if not is_admin(current_user) and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Você não pode excluir esse usuário")

    db.delete(user)
    db.commit()
    return {"detail": "Usuário excluído com sucesso"}

# Upload profile picture
@router.post("/upload-profile-pic")
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file_dir = "static/profile_pics"
    os.makedirs(file_dir, exist_ok=True)
    file_path = os.path.join(file_dir, f"{current_user.id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Atualiza a URL da imagem no banco
    user = db.query(User).filter(User.id == current_user.id).first()
    if user:
        user.profile_image = file_path
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return JSONResponse(content={"message": "Imagem salva com sucesso", "path": file_path})

# Approve User
@router.put("/{user_id}/approve", response_model=UserOut)
def approve_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if not is_admin(current_user):
        raise HTTPException(status_code=403, detail="Você não tem permissão")

    user.is_approved = True
    db.commit()
    db.refresh(user)
    return user

# Rotas para troca de e-mail e senha com verificação (a implementar)
# @router.post("/request-email-change")
# def request_email_change():
#     pass

# @router.post("/confirm-email-change")
# def confirm_email_change():
#     pass

# # Enviar código de verificação
# @router.post("/{user_id}/request-email-change")
# def request_email_change(user_id: int, new_email: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     if not is_admin(current_user) and current_user.id != user_id:
#         raise HTTPException(status_code=403, detail="Você não pode solicitar alteração desse usuário")
    
#     code = str(uuid.uuid4())[:6]
#     verification_codes[user_id] = {
#         "code": code,
#         "new_email": new_email,
#         "expires_at": datetime.utcnow() + timedelta(minutes=30)
#     }
#     # Simulando envio por print (substituir por e-mail ou SMS real)
#     print(f"Código para {new_email}: {code}")
#     return {"detail": "Código enviado para o e-mail informado"}

# @router.post("/{user_id}/confirm-email-change")
# def confirm_email_change(user_id: int, code: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     if user_id not in verification_codes:
#         raise HTTPException(status_code=400, detail="Nenhum código pendente para esse usuário")
#     data = verification_codes[user_id]

#     if datetime.utcnow() > data["expires_at"]:
#         del verification_codes[user_id]
#         raise HTTPException(status_code=400, detail="Código expirado")

#     if code != data["code"]:
#         raise HTTPException(status_code=400, detail="Código inválido")

#     user = db.query(User).filter(User.id == user_id).first()
#     if user:
#         user.email = data["new_email"]
#         db.commit()
#         db.refresh(user)
#         del verification_codes[user_id]
#         return user
#     else:
#         raise HTTPException(status_code=404, detail="Usuário não encontrado")