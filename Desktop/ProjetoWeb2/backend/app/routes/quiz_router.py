# backend/app/routes/quiz_router.py
from fastapi import APIRouter, HTTPException
import httpx
from ..models import schema
from ..services import ia_service # Precisaremos para o endpoint de submissão

router = APIRouter()

ENEM_API_BASE_URL = "https://api.enem.dev/v1"
DEFAULT_YEAR = 2020 # Mantenha ou ajuste conforme necessário
DEFAULT_QUESTION_INDEX = 1 # Mantenha ou ajuste

# --- Cache em memória para respostas corretas e detalhes da questão ---
# Chave: ID da questão (int), Valor: Dicionário com detalhes incluindo a letra correta e o texto completo da questão
# Ex: { 1: {"correct_letter": "A", "question_text": "...", "alternatives_map": {"A": "Texto da A", ...}} }
# Este cache é simples e será perdido se o servidor reiniciar. Para produção, um Redis ou DB seria melhor.
questions_details_cache = {}

@router.get("/next-question", response_model=schema.QuizQuestion)
async def get_next_question_endpoint():
    global DEFAULT_QUESTION_INDEX # Para poder incrementar e pegar a próxima

    question_url = f"{ENEM_API_BASE_URL}/exams/{DEFAULT_YEAR}/questions/{DEFAULT_QUESTION_INDEX}"

    async with httpx.AsyncClient() as client:
        try:
            print(f"Buscando pergunta em: {question_url}")
            response = await client.get(question_url)
            response.raise_for_status()
            external_question_data = response.json()
            # print(f"Dados recebidos da API externa: {external_question_data}")

            if not external_question_data or "context" not in external_question_data or "alternatives" not in external_question_data:
                # Se chegarmos ao fim das questões para este índice, tentamos o próximo índice ou resetamos
                DEFAULT_QUESTION_INDEX = 1 # Reset para demonstração
                # Ou você pode lançar um erro aqui se não quiser resetar
                # raise HTTPException(status_code=404, detail="Fim das questões ou formato inesperado.")
                # Por agora, vamos tentar buscar a primeira novamente se a atual falhar
                question_url = f"{ENEM_API_BASE_URL}/exams/{DEFAULT_YEAR}/questions/{DEFAULT_QUESTION_INDEX}"
                print(f"Tentando buscar a primeira pergunta novamente: {question_url}")
                response = await client.get(question_url)
                response.raise_for_status()
                external_question_data = response.json()
                if not external_question_data or "context" not in external_question_data or "alternatives" not in external_question_data:
                     raise HTTPException(status_code=500, detail="Formato inesperado da API externa do ENEM mesmo após tentar a primeira questão.")


            options = []
            alternatives_map = {} # Para guardar o texto de cada alternativa
            for alt_obj in external_question_data.get("alternatives", []):
                letter = alt_obj.get('letter', '')
                text = alt_obj.get('text', '')
                options.append(f"{letter}. {text}")
                alternatives_map[letter] = text

            question_id = external_question_data.get("index", DEFAULT_QUESTION_INDEX)
            question_text = external_question_data.get("context", "Texto da pergunta não encontrado.")
            correct_letter = external_question_data.get("correctAlternative") # Ex: "A"

            # Armazenar detalhes no cache para uso posterior no endpoint de submissão
            if correct_letter:
                questions_details_cache[question_id] = {
                    "correct_letter": correct_letter,
                    "question_text": question_text,
                    "alternatives_map": alternatives_map,
                    "full_data": external_question_data # Opcional, se precisar de mais dados
                }
                print(f"Questão ID {question_id} (correta: {correct_letter}) adicionada ao cache.")
            else:
                print(f"ALERTA: Não foi encontrada 'correctAlternative' para a questão ID {question_id} nos dados da API externa.")
                # Lide com isso: talvez não sirva a pergunta ou use um valor padrão se aplicável
                # Por agora, vamos permitir que a pergunta seja servida, mas a verificação falhará.

            question_to_serve = schema.QuizQuestion(
                id=question_id,
                text=question_text,
                options=options
            )

            DEFAULT_QUESTION_INDEX += 1 # Prepara para a próxima questão da próxima vez

            return question_to_serve

        except httpx.HTTPStatusError as exc:
            print(f"Erro HTTP ao buscar dados do ENEM: {exc.response.status_code} - {exc.response.text}")
            # Se a API externa retornar 404 (Not Found), pode ser que o índice da questão não exista.
            # Vamos tentar resetar o índice para 1 e buscar a primeira questão do ano.
            if exc.response.status_code == 404 and DEFAULT_QUESTION_INDEX > 1:
                print(f"Questão com índice {DEFAULT_QUESTION_INDEX} não encontrada. Tentando índice 1.")
                DEFAULT_QUESTION_INDEX = 1 # Reset
                # Chamada recursiva ou duplicação da lógica para buscar a questão com índice 1
                # Para simplificar, vamos apenas relançar o erro por agora, 
                # mas você pode adicionar lógica para tentar o índice 1 aqui.
                # Para uma implementação mais robusta, você gerenciaria os índices de forma diferente.
            raise HTTPException(status_code=exc.response.status_code, detail=f"Erro ao buscar dados do ENEM: {exc.response.text}")
        except Exception as e:
            print(f"Outro erro ao processar pergunta do ENEM: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Erro interno ao processar pergunta do ENEM: {str(e)}")

@router.post("/submit-answer", response_model=schema.SubmissionResult)
async def submit_answer_endpoint(submission: schema.UserSubmission):
    question_id = submission.question_id
    user_answer_letter = submission.user_answer_letter.upper() # Garante que seja maiúscula

    cached_data = questions_details_cache.get(question_id)

    if not cached_data:
        raise HTTPException(status_code=404, detail=f"Detalhes da pergunta ID {question_id} não encontrados no cache. A pergunta foi carregada corretamente?")

    correct_letter = cached_data.get("correct_letter")
    question_text = cached_data.get("question_text")
    alternatives_map = cached_data.get("alternatives_map", {})
    
    if not correct_letter or not question_text:
        raise HTTPException(status_code=500, detail=f"Dados cruciais (resposta correta ou texto da pergunta) faltando no cache para ID {question_id}.")

    is_correct = (user_answer_letter == correct_letter)
    
    correct_answer_full_text = alternatives_map.get(correct_letter, "Texto da alternativa correta não encontrado.")

    # Preparar dados para o serviço de IA (que ainda é mock)
    # O prompt pode ser construído aqui ou dentro do ia_service
    ai_prompt = (
        f"Pergunta: \"{question_text}\"\n"
        f"Usuário respondeu: \"{user_answer_letter}) {alternatives_map.get(user_answer_letter, '')}\" (Correto: {is_correct})\n"
        f"Resposta correta: \"{correct_letter}) {correct_answer_full_text}\"\n"
        f"Por favor, forneça uma explicação educacional concisa e clara sobre por que a resposta '{correct_letter}' é a correta para esta pergunta. Evite citar longos trechos do texto original em questões de interpretação; foque no raciocínio."
    )
    
    # Chamada ao ia_service (que ainda retorna um mock)
    # No ia_service.py, a função generate_explanation_with_flan_t5 espera (prompt, question_text, user_answer, correct_answer)
    # Vamos adaptar a chamada ou o ia_service. Por agora, passamos o prompt construído.
    # O `question_text`, `user_answer_letter` (para `user_answer`), `correct_letter` (para `correct_answer`)
    # são mais para o caso do ia_service construir o prompt. Como já construímos, só o prompt é crucial.
    explanation_text = await ia_service.generate_explanation_with_flan_t5(
        prompt=ai_prompt,
        question_text=question_text, # Enviando para caso o ia_service precise
        user_answer=f"{user_answer_letter}) {alternatives_map.get(user_answer_letter, '')}", # Enviando para caso o ia_service precise
        correct_answer=f"{correct_letter}) {correct_answer_full_text}" # Enviando para caso o ia_service precise
    )

    return schema.SubmissionResult(
        question_id=question_id,
        is_correct=is_correct,
        user_answer_letter=user_answer_letter,
        correct_answer_letter=correct_letter,
        correct_answer_text=correct_answer_full_text,
        question_text=question_text,
        explanation=explanation_text
    )
