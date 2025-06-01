# backend/app/services/ia_service.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
model = None

def load_model_on_startup():
    global model
    if not GEMINI_API_KEY:
        print("ALERTA: Chave da API Gemini (GEMINI_API_KEY) não encontrada nas variáveis de ambiente.")
        print("As explicações da IA não funcionarão até que a chave seja configurada.")
        return

    print(f"Tentando configurar Gemini. Chave API (parcial): {GEMINI_API_KEY[:5]}...{GEMINI_API_KEY[-5:] if GEMINI_API_KEY and len(GEMINI_API_KEY) > 10 else 'CHAVE_CURTA_DEMAIS_OU_INVALIDA'}") # Para verificar se a chave está sendo lida

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        print("`genai.configure` executado com sucesso.") # Confirmação

        # Escolha o modelo. 'gemini-1.5-flash-latest' é rápido e eficiente.
        print("Tentando instanciar o modelo 'gemini-1.5-flash-latest'...")
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        print("Modelo Gemini ('gemini-1.5-flash-latest') configurado com sucesso.")
    except Exception as e:
        print(f"--- ERRO DETALHADO AO CONFIGURAR MODELO GEMINI ---") # Mais destaque
        print(f"Erro: {e}")
        print(f"Tipo do erro: {type(e)}")
        # Se o erro tiver atributos adicionais, você pode tentar imprimi-los
        # if hasattr(e, 'response'):
        #     print(f"Resposta do erro (se houver): {e.response}")
        # if hasattr(e, 'message'):
        #     print(f"Mensagem do erro (se houver): {e.message}")
        print(f"--- FIM DO ERRO DETALHADO ---")
        model = None
        
async def generate_explanation_with_flan_t5(prompt: str, question_text: str, user_answer: str, correct_answer: str) -> str:
    """
    Gera uma explicação usando a API Gemini.
    Os parâmetros question_text, user_answer, correct_answer são agora usados principalmente
    para construir o prompt, que é o parâmetro mais importante para esta função.
    """
    global model
    if not model:
        print("Modelo Gemini não carregado. Retornando explicação mock.")
        return "Explicação mock: Modelo de IA não disponível no momento."

    # O prompt já é construído de forma detalhada no quiz_router.py.
    # Podemos usá-lo diretamente.
    # Exemplo de prompt que o quiz_router está enviando:
    # prompt = (
    #     f"Pergunta: \"{question_text}\"\n"
    #     f"Usuário respondeu: \"{user_answer}\" (Correto: {is_correct})\n" # `is_correct` não está aqui, mas o prompt pode ser ajustado
    #     f"Resposta correta: \"{correct_answer}\"\n"
    #     f"Por favor, forneça uma explicação educacional detalhada sobre o tema da pergunta e por que a resposta correta é essa."
    # )

    print(f"Enviando prompt para Gemini: {prompt[:200]}...") # Log do início do prompt

    try:
        # Para modelos Gemini mais recentes, a API pode ser um pouco diferente
        # ou pode haver configurações de segurança a ajustar.
        # Configurações de geração (opcional, ajuste conforme necessário)
        generation_config = {
            "temperature": 0.7, # Controla a criatividade. Mais baixo = mais determinístico.
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 512, # Limite o tamanho da resposta
        }
        
        # Configurações de segurança (ajuste para evitar bloqueios por conteúdo sensível se seu quiz for geral)
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]

        response = await model.generate_content_async(
            prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
            )
        
        # Verifica se há texto na resposta
        if response.parts:
            explanation = "".join(part.text for part in response.parts)
        elif response.candidates and response.candidates[0].content.parts: # Estrutura alternativa de resposta
             explanation = "".join(part.text for part in response.candidates[0].content.parts)
        else:
            # Tenta acessar o texto diretamente se a estrutura acima falhar
            try:
                explanation = response.text
            except ValueError: # Se response.text não estiver disponível ou der erro (ex: prompt bloqueado)
                print(f"Resposta da API Gemini não continha texto ou foi bloqueada. Detalhes: {response.prompt_feedback}")
                explanation = "Não foi possível gerar a explicação desta vez. Feedback do prompt: " + str(response.prompt_feedback)


        print("Explicação recebida da API Gemini.")
        return explanation
    except Exception as e:
        print(f"Erro durante a chamada à API Gemini: {e}")
        # Você pode inspecionar `e` para ver se há detalhes específicos do erro da API
        # Por exemplo, e.response.json() se for um erro HTTP específico da API
        return f"Desculpe, ocorreu um erro ao gerar a explicação com a IA: {str(e)}"