import random
import time
# Asegúrate de que este import no tenga errores (necesitas el archivo schemas/packet.py)
from app.schemas.packet import TrafficPacket

# Configuración de negocio
ATTACKER_IP = "192.168.1.5"
TARGET_IP = "10.0.0.1"
FAKE_IPS = [f"192.168.1.{i}" for i in range(1, 15)]
ATTACK_PROBABILITY = 0.3

class TrafficGenerator:
    """Servicio encargado de generar tráfico sintético para la simulación."""

    @staticmethod
    def generate_packet() -> TrafficPacket:
        """Crea un paquete nuevo basado en probabilidades."""
        is_attacker = random.random() < ATTACK_PROBABILITY
        src_ip = ATTACKER_IP if is_attacker else random.choice(FAKE_IPS)

        return TrafficPacket(
            src_ip=src_ip,
            dst_ip=TARGET_IP,
            size_bytes=random.randint(100, 1500),
            timestamp=time.time(),
            is_anomaly=False
        )

    @staticmethod
    def should_analyze_with_redis(packet: TrafficPacket) -> bool:
        """
        Regla de Negocio: Optimización de Costos.
        Solo analizamos en Redis si la IP es sospechosa (la del atacante).
        """
        return packet.src_ip == ATTACKER_IP