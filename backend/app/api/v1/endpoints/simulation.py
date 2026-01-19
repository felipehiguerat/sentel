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
DEMO_LIMIT = 150  # safety limit

async def _send_control(websocket: WebSocket, code: str, message: str):
    await websocket.send_json({"type": "CONTROL", "code": code, "message": message})

@router.websocket("/ws/traffic")
async def websocket_simulation(
    websocket: WebSocket,
    redis: Redis = Depends(get_redis),
    db: Session = Depends(get_db)
):
    await websocket.accept()

    is_running = False
    session_anomalies = 0
    print("[WS] Client connected. Waiting for START...")

    try:
        while True:
            # 1) escuchar comandos sin bloquear
            try:
                cmd = await asyncio.wait_for(websocket.receive_text(), timeout=0.02)
                if cmd == "START":
                    is_running = True
                    session_anomalies = 0
                    print("[WS] ▶ START received")
                    await _send_control(websocket, "START_ACK", "Simulation started")
                elif cmd == "STOP":
                    is_running = False
                    print("[WS] ⏸ STOP received")
                    await _send_control(websocket, "STOP_ACK", "Simulation stopped")
                else:
                    print(f"[WS] Unknown command: {cmd}")
                    await _send_control(websocket, "UNKNOWN_CMD", f"Unknown: {cmd}")
            except asyncio.TimeoutError:
                pass

            # 2) lógica principal
            if is_running:

                # límite de demo
                if session_anomalies >= DEMO_LIMIT:
                    is_running = False
                    print(f"[WS] Limit {DEMO_LIMIT} reached. Pausing.")
                    await _send_control(websocket, "LIMIT_REACHED",
                                        f"Demo stopped at {DEMO_LIMIT} threats for safety.")
                    continue

                packet = TrafficGenerator.generate_packet()

                if TrafficGenerator.should_analyze_with_redis(packet):
                    is_attack = await check_ip_traffic(redis, packet.src_ip)
                    if is_attack:
                        packet.is_anomaly = True
                        create_threat_log(db, packet)
                        session_anomalies += 1

                await websocket.send_json(packet.model_dump())
                await asyncio.sleep(SIMULATION_SPEED)
            else:
                await asyncio.sleep(0.4)

    except WebSocketDisconnect:
        print("[WS] Client disconnected")
    except Exception as e:
        print(f"[WS] Error: {e}")
        try:
            await websocket.close()
        except:
            pass