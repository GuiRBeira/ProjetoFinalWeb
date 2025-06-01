from pydantic import BaseModel
from typing import List, Optional

class ExplanationRequest(BaseModel):
    prompt: Optional[str] = "Por favor, me dê uma explicação." # Default prompt
    question_text: str
    user_answer: str
    correct_answer: str

class ExplanationResponse(BaseModel):
    question_text: str
    user_answer: str
    correct_answer: str
    explanation: str

# --- Modelos para o Quiz (a serem usados depois) ---
class QuizQuestionBase(BaseModel):
    text: str
    options: List[str]

class QuizQuestionCreate(QuizQuestionBase):
    correct_answer: str # A resposta correta é necessária ao criar, mas não sempre enviada ao frontend

class QuizQuestion(QuizQuestionBase): # O que é enviado para o frontend
    id: int

    class Config:
        orm_mode = True # Para compatibilidade com ORMs, se usado no futuro

class QuizAnswerPayload(BaseModel):
    question_id: int
    answer: str

class QuizAnswerResponse(BaseModel):
    question_id: int
    is_correct: bool
    correct_answer: Optional[str] = None # Pode ou não revelar a resposta correta aqui
    explanation: Optional[str] = None # A explicação virá da IA
    
class UserSubmission(BaseModel):
    question_id: int
    user_answer_letter: str # Ex: "A", "B", etc.

class SubmissionResult(BaseModel):
    question_id: int
    is_correct: bool
    user_answer_letter: str
    correct_answer_letter: str
    correct_answer_text: Optional[str] = None # Texto completo da alternativa correta
    question_text: str # Texto da pergunta original
    explanation: str