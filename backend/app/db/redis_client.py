import redis.asyncio as redis
import ssl  # <--- IMPORTANTE: Agrega esto
from app.core.config import settings

# 1. Creamos un contexto SSL que no verifique certificados ("Inseguro" pero funciona)
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# 2. Pasamos ese contexto explícitamente
redis_pool = redis.ConnectionPool.from_url(
    settings.REDIS_URL, 
    decode_responses=True,
    ssl_context=ssl_context  # <--- AQUÍ ESTÁ LA SOLUCIÓN
)

async def get_redis():
    client = redis.Redis(connection_pool=redis_pool)
    try:
        yield client
    finally:
        await client.close()