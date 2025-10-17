# 💳 FSPay

<p align="center">
  <img src="https://github.com/user-attachments/assets/7202b9da-1f99-4e8c-b7d7-0f93c25c9301" alt="FSPay Logo" width="300"/>
</p>

**FSPay** é uma aplicação mobile de conta digital construída com React Native, que oferece funcionalidades como transferências, gestão de cartões e integração com dados de investimentos da bolsa brasileira (B3). O projeto visa unir segurança, modernidade e performance num ambiente intuitivo e funcional.


---

## 🚀 Funcionalidades

- Autenticação com segurança JWT + biometria
- Painel com saldo, extrato e movimentações
- Transferência bancária (PIX/DOC/TED simulados)
- Gestão de cartões virtuais e físicos
- Acompanhamento de investimentos (ações da B3)

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- React Native + Expo
- TypeScript
- React Navigation
- Styled Components
- Axios

### Backend
- Python + FastAPI
- MySQL
- Docker
- Redis (para cache/sessão)
- JWT Authentication

### Integrações
- Brapi (dados da bolsa) -- ainda em teste
- Firebase ou serviços de email/SMS
- Open Finance (em desenvolvimento)

---

## 📦 Como rodar o projeto

### Backend

```bash
cd backend
docker-compose up -d
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
