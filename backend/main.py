from fastapi import FastAPI
from routes.auth import router as auth_router
from core.database import create_tables

app = FastAPI()

@app.on_event("startup")
def startup():
    create_tables()

app.include_router(auth_router, prefix="/auth")
