# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import explicacao, quiz_router
from .services import ia_service

app = FastAPI(
    title="API do Quiz Educacional Interativo",
    description="Esta API fornece perguntas para o quiz e gera explicações usando IA.",
    version="0.1.0"
)

# --- Configuração do CORS ---
origins = [
    "http://localhost:3000",  # Frontend local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- Fim da Configuração do CORS ---

@app.on_event("startup")
async def startup_event():
    print("Aplicação iniciando...")
    ia_service.load_model_on_startup()
    print("Evento de startup finalizado.")

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bem-vindo à API do Quiz Educacional Interativo!"}

app.include_router(explicacao.router, prefix="/api/explicacao", tags=["Explicações IA"])

app.include_router(quiz_router.router, prefix="/api/quiz", tags=["Quiz"])