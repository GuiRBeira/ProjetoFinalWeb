from fastapi import APIRouter, HTTPException
from ..services import ia_service # Importa o nosso serviço de IA
from ..models import schema # Importa nossos modelos Pydantic

router = APIRouter()

@router.post("/gerar", response_model=schema.ExplanationResponse)
async def gerar_explicacao_endpoint(request_data: schema.ExplanationRequest):
    """
    Endpoint para gerar uma explicação baseada em uma pergunta,
    resposta do usuário e resposta correta.
    """
    try:
        # Aqui, o 'prompt' dentro de request_data.prompt pode ser usado diretamente,
        # ou você pode construir um prompt mais complexo no ia_service
        # usando question_text, user_answer, e correct_answer.
        # Por simplicidade, vamos passar todos os dados para o serviço.
        
        explicacao_gerada = await ia_service.generate_explanation_with_flan_t5(
            prompt=request_data.prompt,
            question_text=request_data.question_text,
            user_answer=request_data.user_answer,
            correct_answer=request_data.correct_answer
        )
        
        if not explicacao_gerada:
            raise HTTPException(status_code=500, detail="Falha ao gerar explicação.")

        return schema.ExplanationResponse(
            question_text=request_data.question_text,
            user_answer=request_data.user_answer,
            correct_answer=request_data.correct_answer,
            explanation=explicacao_gerada
        )
    except Exception as e:
        # Em um ambiente de produção, você pode querer logar o erro 'e'
        print(f"Erro no endpoint /gerar: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno ao processar a solicitação: {str(e)}")