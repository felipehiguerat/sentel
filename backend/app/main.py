from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.simulation import router as simulation_router
from app.db.session import engine
from app.db.base import Base
from app.models.threat import ThreatLog
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Esto creará la tabla 'threat_logs' en tu Postgres Local automáticamente
    Base.metadata.create_all(bind=engine)
    print("🚀 Network Watcher Iniciado")
    yield
    print("🛑 Network Watcher Detenido")

app = FastAPI(title="Network Watcher", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1", tags=["System"])
app.include_router(simulation_router, prefix="/api/v1", tags=["Simulation"])

@app.get("/")
def read_root():
    return {"message": "Network Watcher Online"}