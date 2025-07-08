📁 .env (colocar na raiz do projeto backend)
```env
# Define se o backend usará Docker ou não
USE_DOCKER=false

# Se quiser sobrescrever a URL do banco, coloque aqui:
DATABASE_URL=

# Chave usada para geração de tokens JWT
SECRET_KEY=coloque-uma-chave-secreta-aqui

# Tempo de expiração dos tokens em minutos
ACCESS_TOKEN_EXPIRE_MINUTES=60

```

🐍 Arquivo core/database.py
O código detecta se o Docker está sendo usado via .env e configura automaticamente a URL do banco:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

use_docker = os.getenv("USE_DOCKER", "false").lower() == "true"

if use_docker:
    default_url = "mysql+pymysql://fspayadmin:102030%40Flp@localhost:3306/FSPay"
else:
    default_url = "mysql+pymysql://root:SENHA_LOCAL@localhost:3306/FSPay"

DATABASE_URL = os.getenv("DATABASE_URL", default_url)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()
```

🐳 Docker
Se quiser usar com Docker, edite o .env:

```env
USE_DOCKER=true
```

Suba o container:

```bash
docker compose up -d
```

🔒 Autenticação JWT
- Os tokens JWT usam o SECRET_KEY do .env

- Todos os endpoints protegidos usam Bearer Token

🌍 Acesso via celular (Expo Go)
Certifique-se que seu backend esteja rodando com IP local, ex:

```ts
API_BASE_URL = "http://192.168.0.53:8000";
```

O celular e o PC precisam estar na mesma rede.