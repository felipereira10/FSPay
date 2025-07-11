from fastapi import UploadFile, File, APIRouter, Depends, HTTPException
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

router = APIRouter()

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
        print(u.id, u.fullName, u.cpf, u.phone, u.birthdate, u.is_approved)
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

