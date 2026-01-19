import uuid
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base import Base

class ThreatLog(Base):
    __tablename__ = "threat_logs"

    # Usamos uuid.uuid4 en Python para generar el ID, 
    # esto evita errores si la extensión pgcrypto no está activa en tu Postgres local.
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    ip_address = Column(String, nullable=False)
    attack_type = Column(String, nullable=False) # Ej: "DoS", "SQL Injection"
    severity = Column(String, nullable=False)    
    
    # server_default=func.now() hace que la DB ponga la hora si nosotros no la enviamos
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # JSONB es perfecto para guardar metadata extra del paquete
    details = Column(JSONB)