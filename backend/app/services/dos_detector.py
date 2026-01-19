import time
from redis.asyncio import Redis

DOS_THRESHOLD = 10
DOS_WINDOW = 10

async def check_ip_traffic(redis: Redis, ip: str) -> bool:
    key = f"traffic:{ip}"
    now = time.time()
    
    async with redis.pipeline() as pipe:
        pipe.zadd(key, {str(now): now})
        pipe.zremrangebyscore(key, 0, now - DOS_WINDOW)
        pipe.zcard(key)
        pipe.expire(key, DOS_WINDOW + 1)
        results = await pipe.execute()
    
    request_count = results[2]
    return request_count > DOS_THRESHOLD