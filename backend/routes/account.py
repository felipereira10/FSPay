from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from models import account as models_account
from schemas import account as schemas_account
from core.database import get_db
from datetime import datetime
import random

router = APIRouter(prefix="/account", tags=["Account/Transfers"])

@router.post("/create-account", response_model=schemas_account.AccountResponse)
def create_account(account: schemas_account.AccountCreate, db: Session = Depends(get_db)):
    db_account = models_account.Account(user_id=account.user_id, account_type=account.account_type)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@router.get("/balance/{user_id}", response_model=List[schemas_account.AccountResponse])
def get_balance(user_id: int, db: Session = Depends(get_db)):
    accounts = db.query(models_account.Account).filter(models_account.Account.user_id == user_id).all()
    return accounts

@router.post("/transaction", response_model=schemas_account.TransactionResponse)
def make_transaction(tx: schemas_account.TransactionCreate, db: Session = Depends(get_db)):
    from_account = db.query(models_account.Account).filter(models_account.Account.id == tx.from_account_id).first()
    to_account = db.query(models_account.Account).filter(models_account.Account.id == tx.to_account_id).first()

    if not from_account or not to_account:
        raise HTTPException(status_code=404, detail="Conta não encontrada")

    if from_account.balance < tx.amount:
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    # Atualiza saldos
    from_account.balance -= tx.amount
    to_account.balance += tx.amount
 
    transaction = models_account.Transaction(**tx.dict())
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction

@router.post("/simulate", summary="Simula transações aleatórias")
def simulate_transactions(db: Session = Depends(get_db)):
    contas = db.query(models_account.Account).all()
    if len(contas) < 2:
        raise HTTPException(status_code=400, detail="Precisa de pelo menos 2 contas")

    for _ in range(10):  # Cria 10 transações aleatórias
        from_acc, to_acc = random.sample(contas, 2)
        valor = random.randint(1, 100)

        if from_acc.balance < valor:
            continue  # Pula se não tem saldo

        from_acc.balance -= valor
        to_acc.balance += valor

        tx = models_account.Transaction(
            from_account_id=from_acc.id,
            to_account_id=to_acc.id,
            amount=valor,
            type=random.choice(["pix", "ted"]),
            description=f"Transferência simulada de R${valor}"
        )
        db.add(tx)

    db.commit()
    return {"message": "Transações simuladas com sucesso!"}

@router.get("/statement/{account_id}", response_model=List[schemas_account.TransactionResponse])
def get_account_statement(
    account_id: int,
    start: Optional[str] = Query(None),
    end: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    account = db.query(models_account.Account).filter(models_account.Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Conta não encontrada")

    query = db.query(models_account.Transaction).filter(
        (models_account.Transaction.from_account_id == account_id) |
        (models_account.Transaction.to_account_id == account_id)
    )

    if start:
        try:
            start_date = datetime.strptime(start, "%Y-%m-%d")
            query = query.filter(models_account.Transaction.created_at >= start_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de data inválido para 'start'. Use AAAA-MM-DD.")

    if end:
        try:
            end_date = datetime.strptime(end, "%Y-%m-%d")
            query = query.filter(models_account.Transaction.created_at <= end_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de data inválido para 'end'. Use AAAA-MM-DD.")

    transactions = query.order_by(models_account.Transaction.created_at.desc()).all()
    return transactions