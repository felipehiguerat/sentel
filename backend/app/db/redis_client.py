import redis.asyncio as redis
from urllib.parse import urlparse
from app.core.config import settings

# 1. Desarmamos la URL para tener los datos limpios
url = urlparse(settings.REDIS_URL)

# 2. Creamos la función generadora
async def get_redis():
    # 3. Instanciamos Redis DIRECTAMENTE (Sin ConnectionPool manual)
    # Esto deja que la librería gestione la piscina internamente.
    client = redis.Redis(
        host=url.hostname,
        port=url.port,
        password=url.password,
        username=url.username, # Puede ser None, no importa
        db=0,
        decode_responses=True,
        # --- CONFIGURACIÓN SSL CRÍTICA ---
        ssl=True,                  # Activamos SSL explícitamente
        ssl_cert_reqs="none"       # Le decimos que ignore certificados (String "none")
    )
    
    try:
        # Probamos conexión (Opcional, pero recomendado para debug)
        # await client.ping()
        yield client
    finally:
        await client.close()