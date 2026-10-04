from typing import List, Optional
from pydantic import BaseModel, Field

class StudentProfilePayload(BaseModel):
    name: Optional[str] = "Kandidat Mahasiswa"
    institution: Optional[str] = "Universitas"
    university: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    bio: Optional[str] = ""
    portfolioScore: Optional[int] = 85
    projectsCompleted: Optional[int] = 0

class ProjectDetailsPayload(BaseModel):
    title: Optional[str] = "Proyek Industri UMKM"
    companyName: Optional[str] = "Mitra UMKM"
    category: Optional[str] = "Teknologi & Digital"
    tags: List[str] = Field(default_factory=list)
    required_skills: Optional[List[str]] = None
    overview: Optional[str] = ""
    description: Optional[str] = ""

class AIMatchRequest(BaseModel):
    studentProfile: Optional[StudentProfilePayload] = None
    student_profile: Optional[StudentProfilePayload] = None
    projectDetails: Optional[ProjectDetailsPayload] = None
    project: Optional[ProjectDetailsPayload] = None

class AIMatchResponse(BaseModel):
    matchPercent: int = Field(ge=30, le=99, description="Skor persentase kecocokan")
    match_score: int = Field(ge=30, le=99, description="Alias untuk matchPercent")
    rationale: str = Field(description="2-3 kalimat penjelasan keselarasan profil dan proyek")
    reasoning: str = Field(description="Alias untuk rationale")
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    recommendation: str = "Direkomendasikan"
    recommendedNextSteps: List[str] = Field(default_factory=list)
    modelUsed: str = "gemini-3.8-flash"

class HealthResponse(BaseModel):
    status: str
    service: str
    model: str
