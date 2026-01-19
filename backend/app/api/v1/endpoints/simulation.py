import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from redis.asyncio import Redis
from sqlalchemy.orm import Session

from app.db.redis_client import get_redis
from app.db.session import get_db
from app.services.dos_detector import check_ip_traffic
from app.services.traffic_generator import TrafficGenerator
from app.crud.threat import create_threat_log

router = APIRouter()

SIMULATION_SPEED = 0.1
DEMO_LIMIT = 150  # Límite de seguridad

@router.websocket("/ws/traffic")
async def websocket_simulation(
    websocket: WebSocket,
    redis: Redis = Depends(get_redis),
    db: Session = Depends(get_db)
):
    await websocket.accept()
    
    # Variables de estado
    is_running = False
    session_anomalies = 0
    
    # Asegúrate de que esta línea esté al mismo nivel que las variables de arriba
    print("[WS] Cliente conectado. Esperando comando START...")
    
    try:
        while True:
            # --- 1. ESCUCHAR COMANDOS ---
            try:
                message = await asyncio.wait_for(websocket.receive_text(), timeout=0.01)
                
                if message == "START":
                    is_running = True
                    session_anomalies = 0
                    print("[WS] Simulación INICIADA ▶")
                elif message == "STOP":
                    is_running = False
                    print("[WS] Simulación DETENIDA MANUALMENTE ⏸")
            except asyncio.TimeoutError:
                pass

            # --- 2. LÓGICA DE SIMULACIÓN ---
            if is_running:
                
                # A. Verificar Límite de Demo
                if session_anomalies >= DEMO_LIMIT:
                    is_running = False
                    print(f"[WS] Límite de demo alcanzado ({DEMO_LIMIT}). Deteniendo.")
                    
                    await websocket.send_json({
                        "type": "CONTROL",
                        "code": "LIMIT_REACHED",
                        "message": f"Demo stopped: Limit of {DEMO_LIMIT} threats reached for safety."
                    })
                    continue

                # B. Generar y Procesar
                packet = TrafficGenerator.generate_packet()

                if TrafficGenerator.should_analyze_with_redis(packet):
                    is_attack = await check_ip_traffic(redis, packet.src_ip)
                    
                    if is_attack:
                        packet.is_anomaly = True
                        create_threat_log(db, packet)
                        session_anomalies += 1

                # C. Enviar paquete normal
                await websocket.send_json(packet.model_dump())
                
                await asyncio.sleep(SIMULATION_SPEED)
            
            else:
                # Pausa activa (ahorro de CPU)
                await asyncio.sleep(0.5)

    except WebSocketDisconnect:
        print("[WS] Cliente desconectado")
    except Exception as e:
        print(f"[WS] Error crítico: {e}")
        try:
            await websocket.close()
        except:
            pass