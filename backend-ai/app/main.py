import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .schemas import (
    AIMatchRequest,
    AIMatchResponse,
    HealthResponse,
    StudentProfilePayload,
    ProjectDetailsPayload
)
from .gemini_service import evaluate_match

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("skillbridge.main")

app = FastAPI(
    title="SkillBridge AI Talent Matchmaking Engine",
    description="Microservice evaluasi kecocokan talenta mahasiswa & proyek UMKM bertenaga Google Gemini 3.8 Flash",
    version="2.0.0"
)

# Konfigurasi CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def root():
    return {
        "service": "SkillBridge AI Talent Matchmaking Microservice",
        "version": "2.0.0",
        "model": settings.gemini_model,
        "docs": "/docs"
    }

@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    return HealthResponse(
        status="ok",
        service="SkillBridge AI Engine",
        model=settings.gemini_model
    )

@app.post("/api/ai-match", response_model=AIMatchResponse, tags=["AI Matchmaking"])
async def match_candidate(payload: AIMatchRequest):
    try:
        student = payload.studentProfile or StudentProfilePayload()
        project = payload.projectDetails or ProjectDetailsPayload()
        
        result = await evaluate_match(student, project)
        return result
    except Exception as exc:
        logger.error(f"Error saat memproses matchmaking: {exc}")
        raise HTTPException(status_code=500, detail=f"Gagal memproses evaluasi AI: {str(exc)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
