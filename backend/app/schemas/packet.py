from pydantic import BaseModel

class TrafficPacket(BaseModel):
    src_ip: str
    dst_ip: str
    size_bytes: int
    timestamp: float
    is_anomaly: bool = False