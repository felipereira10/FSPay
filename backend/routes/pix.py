from fastapi import APIRouter, HTTPException
from schemas.pix import PixKey, PixSchedule

router = APIRouter()

@router.post("/copy-paste")
def pix_copia_cola(data: dict):
    return {"msg": "Pix Copia e Cola processado", "data": data}

@router.post("/read-qrcode")
def ler_qrcode(image_data: dict):
    return {"msg": "QR Code lido com sucesso", "info": image_data}

@router.post("/pix-key")
def usar_chave_pix(pix: PixKey):
    return {"msg": "Transferência via chave Pix iniciada", "chave": pix.key}

@router.post("/schedule")
def agendar_pix(schedule: PixSchedule):
    return {"msg": "Pix agendado", "detalhes": schedule}

@router.post("/charge")
def cobrar_pix(data: dict):
    return {"msg": "Cobrança Pix criada", "info": data}

@router.post("/deposit")
def depositar_pix(data: dict):
    return {"msg": "Depósito via Pix concluído", "info": data}