# Rota para consultar saldo do usuário
@router.get("/balance", response_model=BalanceOut)
def get_balance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {"user_id": current_user.id, "balance": current_user.balance}

# Transferência Pix/TED/Boleto
@router.post("/transfer", response_model=TransferOut)
def create_transfer(transfer: TransferCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sender = current_user
    receiver = db.query(User).filter(User.id == transfer.receiver_id).first()

    if not receiver:
        raise HTTPException(status_code=404, detail="Destinatário não encontrado")

    if sender.id == receiver.id:
        raise HTTPException(status_code=400, detail="Você não pode transferir para si mesmo")

    if sender.balance < transfer.amount:
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    # Atualiza os saldos
    sender.balance -= transfer.amount
    receiver.balance += transfer.amount

    # Cria a transferência
    db_transfer = Transfer(
        sender_id=sender.id,
        receiver_id=receiver.id,
        amount=transfer.amount,
        description=transfer.description,
        type=transfer.type,
    )

    db.add(db_transfer)
    db.commit()
    db.refresh(db_transfer)

    return db_transfer

# Histórico
@router.get("/transfers", response_model=List[TransferOut])
def get_user_transfers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Transfer).filter(
        (Transfer.sender_id == current_user.id) |
        (Transfer.receiver_id == current_user.id)
    ).order_by(Transfer.timestamp.desc()).all()
