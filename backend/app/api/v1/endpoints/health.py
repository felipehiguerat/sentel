from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from redis.asyncio import Redis

from app.db.session import get_db
from app.db.redis_client import get_redis

router = APIRouter()

@router.get("/health")
async def health_check(
    db: Session = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    status = {
        "status": "ok",
        "services": {
            "database": "unknown",
            "redis": "unknown"
        }
    }

    try:
        db.execute(text("SELECT 1"))
        status["services"]["database"] = "up"
    except Exception as e:
        status["status"] = "degraded"
        status["services"]["database"] = f"down: {str(e)}"

    try:
        await redis.ping()
        status["services"]["redis"] = "up"
    except Exception as e:
        status["status"] = "degraded"
        status["services"]["redis"] = f"down: {str(e)}"

    return status