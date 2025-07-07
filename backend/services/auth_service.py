from sqlalchemy.orm import Session
from models.user import User, RoleEnum
from schemas.user import UserCreate
from passlib.hash import bcrypt

def create_user(db: Session, user: UserCreate):
    hashed_pw = bcrypt.hash(user.password)
    db_user = User(
        fullName=user.fullName,
        email=user.email,
        password_hash=hashed_pw,
        cpf=user.cpf,
        birthdate=user.birthdate,
        phone=user.phone,
        role=RoleEnum(user.role)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not bcrypt.verify(password, user.password_hash):
        return None
    return user
