import redis.asyncio as redis
from app.core.config import settings

# Crear el pool de conexiones
redis_pool = redis.ConnectionPool.from_url(
    settings.REDIS_URL, 
    decode_responses=True 
)

# --- ESTA ES LA FUNCIÓN QUE FALTABA ---
async def get_redis():
    client = redis.Redis(connection_pool=redis_pool)
    try:
        yield client
    finally:
        await client.close()