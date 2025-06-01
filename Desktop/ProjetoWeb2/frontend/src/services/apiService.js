// frontend/src/services/apiService.js

const API_BASE_URL = 'http://localhost:8000/api'; // Verifique se esta é a URL base correta

/**
 * Busca a próxima pergunta do quiz do backend.
 */
export const fetchNextQuestion = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/next-question`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Erro desconhecido ao buscar pergunta.' }));
      console.error("Erro HTTP ao buscar pergunta:", response.status, errorData);
      throw new Error(`Falha ao buscar pergunta: ${errorData.detail || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na função fetchNextQuestion:", error);
    throw error;
  }
};

/**
 * Submete a resposta do usuário para uma pergunta específica.
 * @param {number} questionId - O ID da pergunta.
 * @param {string} userAnswerLetter - A letra da alternativa escolhida pelo usuário (ex: "A").
 */
export const submitUserAnswer = async (questionId, userAnswerLetter) => {
  try {
    const payload = {
      question_id: questionId,
      user_answer_letter: userAnswerLetter,
    };

    const response = await fetch(`${API_BASE_URL}/quiz/submit-answer`, { // Novo endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Erro desconhecido ao processar submissão.' }));
      console.error("Erro HTTP ao submeter resposta:", response.status, errorData);
      throw new Error(`Erro ao submeter resposta: ${errorData.detail || response.statusText}`);
    }
    // A resposta do backend será o schema.SubmissionResult
    // { question_id, is_correct, user_answer_letter, correct_answer_letter, correct_answer_text, question_text, explanation }
    return await response.json(); 
  } catch (error) {
    console.error("Falha ao submeter resposta:", error);
    throw error;
  }
};
