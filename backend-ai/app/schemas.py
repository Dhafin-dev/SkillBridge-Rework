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

class AIBriefSynthesizeRequest(BaseModel):
    business_name: str = Field(..., description="Nama UMKM atau bisnis")
    industry: str = Field(default="Kuliner & Retail", description="Sektor industri atau kategori bisnis")
    goal: str = Field(..., description="Tujuan atau target hasil proyek")
    problem_statement: str = Field(..., description="Masalah atau tantangan yang dihadapi saat ini")
    budget_range: Optional[str] = Field(default="Rp 2.000.000 - Rp 3.000.000", description="Ekspektasi rentang anggaran")

class AIBriefSynthesizeResponse(BaseModel):
    title: str = Field(..., description="Judul proyek yang profesional dan spesifik")
    category: str = Field(default="Web Development", description="Kategori proyek")
    description: str = Field(..., description="Deskripsi lengkap dan latar belakang proyek")
    required_skills: List[str] = Field(default_factory=list, description="Daftar keahlian teknis yang dibutuhkan")
    deliverables: List[str] = Field(default_factory=list, description="Daftar luaran kerja utama")
    timeline_weeks: int = Field(default=4, description="Estimasi durasi pengerjaan dalam minggu")
    estimated_stipend: int = Field(default=2500000, description="Rekomendasi nominal uang saku mahasiswa (IDR)")
    modelUsed: str = Field(default="gemini-3.8-flash", description="Model AI yang digunakan")
