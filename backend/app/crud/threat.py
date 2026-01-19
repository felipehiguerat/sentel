import random # <--- Importar random
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.threat import ThreatLog
from app.schemas.packet import TrafficPacket

MAX_LOG_RECORDS = 1000

def create_threat_log(db: Session, packet: TrafficPacket) -> None:
    try:
        # 1. INSERTAR (Siempre)
        new_threat = ThreatLog(
            ip_address=packet.src_ip,
            attack_type="DoS Flood",
            severity="High",
            details={
                "packet_size": packet.size_bytes,
                "dst_ip": packet.dst_ip,
                "window_alert": "Threshold Exceeded"
            }
        )
        db.add(new_threat)
        
        # 2. LIMPIEZA OPTIMIZADA (Lazy Pruning)
        # Solo ejecutamos el borrado el 10% de las veces (1 de cada 10 inserts)
        # Esto reduce el uso de CPU de la base de datos en un 90%
        if random.random() < 0.1:
            _prune_old_logs(db)

        db.commit()
    except Exception as e:
        print(f"[CRUD Error] Failed: {e}")
        db.rollback()

def _prune_old_logs(db: Session):
    # (Esta función queda igual que antes)
    count = db.query(ThreatLog).count()
    if count > MAX_LOG_RECORDS:
        excess = count - MAX_LOG_RECORDS
        stmt = text(f"""
            DELETE FROM threat_logs
            WHERE id IN (
                SELECT id FROM threat_logs
                ORDER BY timestamp ASC
                LIMIT {excess}
            )
        """)
        db.execute(stmt) 