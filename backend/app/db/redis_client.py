import redis.asyncio as redis
import ssl
from urllib.parse import urlparse
from app.core.config import settings

# 1. Analizamos la URL
url = urlparse(settings.REDIS_URL)

# 2. Configuración SSL manual (El "Pase VIP" de seguridad)
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# 3. Construimos el Pool FORZANDO la clase SSLConnection
# Esto es lo que soluciona el error "unexpected keyword argument".
# Al usar explícitamente SSLConnection, garantizamos que acepte los argumentos SSL.
redis_pool = redis.ConnectionPool(
    host=url.hostname,
    port=url.port,
    password=url.password,
    username=url.username,
    db=0,
    decode_responses=True,
    # --- LA SOLUCIÓN ---
    connection_class=redis.SSLConnection,  # Forzamos conexión segura
    ssl_context=ssl_context                # Le pasamos el contexto permisivo
)

async def get_redis():
    client = redis.Redis(connection_pool=redis_pool)
    try:
        # Hacemos un PING rápido al conectar para validar
        # await client.ping() 
        yield client
    finally:
        await client.close()