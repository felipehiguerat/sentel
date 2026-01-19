import redis.asyncio as redis
from app.core.config import settings

# Modificamos la conexión para que sea robusta con Upstash en la nube
redis_pool = redis.ConnectionPool.from_url(
    settings.REDIS_URL, 
    decode_responses=True,
    # ESTO ES LO NUEVO: Evita el error "Connection closed"
    ssl_cert_reqs=None 
)

async def get_redis():
    client = redis.Redis(connection_pool=redis_pool)
    try:
        yield client
    finally:
        await client.close()