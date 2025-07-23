from passlib.hash import bcrypt
from datetime import datetime, timedelta
from .email import send_email  # type: ignore # sua lógica de envio real

def verify_password(plain, hashed):
    return bcrypt.verify(plain, hashed)

def hash_password(password):
    return bcrypt.hash(password)

def send_email_verification(email, token):
    send_email(email, f"Seu código: {token}")

def token_expired(record):
    return datetime.utcnow() > record.created_at + timedelta(minutes=10)

def save_token(user_id, new_email, token, db):
    from ..models import EmailChangeRequest
    db.add(EmailChangeRequest(user_id=user_id, new_email=new_email, token=token))
    db.commit()
