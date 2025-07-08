from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import SessionLocal
from models.user import RoleEnum, User
from schemas.user import UserOut, UserUpdate
from middlewares.auth import get_current_user
from typing import List

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
    
    return db.query(User).all()

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
