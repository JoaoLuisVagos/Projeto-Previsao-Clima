from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import weather

app = FastAPI(title="fullstack-job-backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router, prefix="/api")

@app.get("/api/health")
async def health():
    return {"status": "ok"}
