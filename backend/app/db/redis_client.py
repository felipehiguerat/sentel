import redis.asyncio as redis
import ssl
from urllib.parse import urlparse
from app.core.config import settings

# 1. Desarmamos la URL manualmente para evitar errores de parsing automático
url = urlparse(settings.REDIS_URL)

# 2. Creamos el contexto SSL manual
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# 3. Construimos el Pool con parámetros explícitos
# Al no usar 'from_url', evitamos que pase argumentos inválidos
redis_pool = redis.ConnectionPool(
    host=url.hostname,
    port=url.port,
    password=url.password,
    username=url.username, # A veces es 'default' o None
    db=0,
    decode_responses=True,
    # Configuración SSL Explícita
    connection_class=redis.SSLConnection,
    ssl_context=ssl_context
)

async def get_redis():
    client = redis.Redis(connection_pool=redis_pool)
    try:
        yield client
    finally:
        await client.close()