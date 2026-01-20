from redis.asyncio import Redis
from sqlalchemy.orm import Session

from app.services.traffic_generator import TrafficGenerator
from app.services.dos_detector import check_ip_traffic
from app.crud.threat import create_threat_log
from app.schemas.packet import TrafficPacket

class SimulationOrchestrator:
    """
    Clase encargada de coordinar el flujo completo de la simulación:
    Generación -> Detección -> Persistencia.
    """

    @staticmethod
    async def run_simulation_step(db: Session, redis: Redis) -> TrafficPacket:
        """
        Ejecuta un ciclo completo de simulación.
        Retorna el paquete procesado para ser enviado al cliente.
        """
        # 1. SERVICIO: Generar tráfico sintético
        packet = TrafficGenerator.generate_packet()

        # 2. REGLA DE NEGOCIO: ¿Debemos gastar recursos en analizar este paquete?
        if TrafficGenerator.should_analyze_with_redis(packet):
            
            # 3. SERVICIO: Detección de anomalías con Redis
            is_attack = await check_ip_traffic(redis, packet.src_ip)
            
            if is_attack:
                packet.is_anomaly = True
                
                # 4. CRUD: Persistencia de la amenaza en SQL
                create_threat_log(db, packet)

        return packet

    @staticmethod
    def process_command(message: str, current_state: bool) -> bool:
        """
        Procesa los comandos de texto del WebSocket (START/STOP).
        Retorna el nuevo estado de la simulación (True=Activo, False=Pausado).
        """
        if message == "START":
            return True
        elif message == "STOP":
            return False
        return current_state