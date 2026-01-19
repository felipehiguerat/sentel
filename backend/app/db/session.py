from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Creamos el motor de conexión
# pool_pre_ping=True ayuda a recuperar conexiones perdidas
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Creamos la sesión para hacer consultas
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependencia para inyectar la DB en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()