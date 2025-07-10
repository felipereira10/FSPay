from fastapi import FastAPI
from routes.auth import router as auth_router
from core.database import create_tables
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router as users_router
from dotenv import load_dotenv

import os

app = FastAPI()

load_dotenv()  # Carrega as variáveis de ambiente do arquivo .env

@app.on_event("startup")
def startup():
    create_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou coloca só o IP do app se quiser restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(users_router, prefix="/users", tags=["users"])
