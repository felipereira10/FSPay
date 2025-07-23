from fastapi import FastAPI
from routes.auth import router as auth_router
from core.database import create_tables
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router as users_router
from routes.profile import router as profile_router
from routes.email_change import router as email_change_router
from dotenv import load_dotenv

import os

app = FastAPI()

load_dotenv()  # Carrega as variáveis de ambiente do arquivo .env

@app.on_event("startup")
def startup():
    create_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Pode colocar IPs específicos depois
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(profile_router, prefix="/profile", tags=["profile"])
app.include_router(email_change_router, prefix="/email_change", tags=["email_change"])
