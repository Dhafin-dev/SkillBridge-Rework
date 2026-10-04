from typing import List, Optional
from pydantic import BaseModel, Field

class StudentProfilePayload(BaseModel):
    name: Optional[str] = "Kandidat Mahasiswa"
    institution: Optional[str] = "Universitas"
    skills: List[str] = Field(default_factory=list)
    portfolioScore: Optional[int] = 85
    projectsCompleted: Optional[int] = 0

class ProjectDetailsPayload(BaseModel):
    title: Optional[str] = "Proyek Industri UMKM"
    companyName: Optional[str] = "Mitra UMKM"
    category: Optional[str] = "Teknologi & Digital"
    tags: List[str] = Field(default_factory=list)
    overview: Optional[str] = ""

class AIMatchRequest(BaseModel):
    studentProfile: Optional[StudentProfilePayload] = None
    projectDetails: Optional[ProjectDetailsPayload] = None

class AIMatchResponse(BaseModel):
    matchPercent: int = Field(ge=50, le=99, description="Skor persentase kecocokan 50-99")
    rationale: str = Field(description="2-3 kalimat penjelasan keselarasan profil dan proyek")
    recommendedNextSteps: List[str] = Field(min_length=1, description="3 langkah rekomendasi tindak lanjut")
    modelUsed: str = "gemini-3.8-flash"

class HealthResponse(BaseModel):
    status: str
    service: str
    model: str
