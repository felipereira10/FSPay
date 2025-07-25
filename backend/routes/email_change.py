from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.email_change import EmailChangeRequest
from models.user import User
from schemas.user import EmailChangeRequestSchema
import uuid
from datetime import datetime, timedelta

router = APIRouter(prefix="/email-change")

@router.post("/request")
def request_email_change(
    payload: EmailChangeRequestSchema,
    db: Session = Depends(get_db)
):
    # lógica para gerar token
    token = str(uuid.uuid4())
    expiration = datetime.utcnow() + timedelta(hours=1)

    req = EmailChangeRequest(
        user_id=payload.user_id,
        new_email=payload.new_email,
        token=token,
        expires_at=expiration
    )

    db.add(req)
    db.commit()
    return {"msg": "Email change requested", "token": token}

@router.post("/confirm")
def confirm_email_change(token: str, db: Session = Depends(get_db)):
    req = db.query(EmailChangeRequest).filter_by(token=token).first()
    if not req or req.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")

    user = db.query(User).filter_by(id=req.user_id).first()
    user.email = req.new_email
    db.delete(req)
    db.commit()
    return {"msg": "Email atualizado com sucesso"}