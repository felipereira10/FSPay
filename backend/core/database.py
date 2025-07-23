from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

use_docker = os.getenv("USE_DOCKER", "false").lower() == "true"

# Define o valor base
if use_docker:
    default_url = "mysql+pymysql://fspayadmin:102030%40Flp@localhost:3306/FSPay"
else:
    default_url = "mysql+pymysql://root:redencao@localhost:3306/FSPay"

# Usa .env se tiver, senão vai pro default
DATABASE_URL = os.getenv("DATABASE_URL", default_url)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def create_tables():
    from models.user import User
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()