// frontend/src/components/QuizInterface.js
import React, { useState, useEffect, useCallback } from 'react';
import './QuizInterface.css';
// Atualize para usar a nova função do serviço
import { submitUserAnswer, fetchNextQuestion as apiFetchNextQuestion } from '../services/apiService';

function QuizInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(''); // Esta será a letra, ex: "A"
  const [feedback, setFeedback] = useState(''); // Mensagem como "Correto!" ou "Incorreto..."
  const [explanation, setExplanation] = useState(''); // Explicação da IA
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNextQuestionCallback = useCallback(async () => {
    setLoading(true);
    setError('');
    setFeedback('');
    setExplanation('');
    setSelectedAnswer('');
    setCurrentQuestion(null);

    try {
      const questionData = await apiFetchNextQuestion();
      setCurrentQuestion(questionData);
    } catch (err) {
      setError(`Falha ao buscar a pergunta: ${err.message}. Tente recarregar a página.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) {
      alert("Por favor, selecione uma resposta.");
      return;
    }
    setLoading(true);
    setError('');
    setFeedback('');
    setExplanation('');

    try {
      // Chama a nova função do serviço, enviando apenas ID da pergunta e a letra da resposta
      const result = await submitUserAnswer(currentQuestion.id, selectedAnswer);
      // result agora é o schema.SubmissionResult do backend:
      // { question_id, is_correct, user_answer_letter, 
      //   correct_answer_letter, correct_answer_text, question_text, explanation }

      if (result.is_correct) {
        setFeedback("Correto!");
      } else {
        setFeedback(`Incorreto. A resposta correta era: ${result.correct_answer_letter}) ${result.correct_answer_text}`);
      }
      setExplanation(result.explanation); // Explicação da IA (ainda mock do backend)

    } catch (err) {
      setError(`Erro ao submeter resposta: ${err.message || 'Verifique sua conexão.'}`);
      console.error(err);
      setFeedback('Falha ao obter resposta do servidor.'); // Pode personalizar esta mensagem
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextQuestionCallback();
  }, [fetchNextQuestionCallback]);

  if (loading && !currentQuestion && !error) {
    return <p className="quiz-loading">Carregando quiz...</p>;
  }
  if (error) {
    return (
      <div className="quiz-interface">
        <p className="quiz-error">Erro: {error}</p>
      </div>
    );
  }
  if (!currentQuestion) {
    return (
      <div className="quiz-interface">
        <p>Nenhuma pergunta disponível no momento.</p>
        <button onClick={fetchNextQuestionCallback} className="quiz-next-button">Carregar Pergunta</button>
      </div>
    );
  }

  // O valor de 'option' nos botões deve ser a letra da alternativa.
  // Vamos assumir que as options vêm como "A. Texto...", "B. Texto..."
  // e precisamos extrair a letra. Ou melhor, o backend pode enviar as opções
  // como objetos { letter: "A", text: "..." } para ser mais fácil.
  // Por agora, vamos assumir que currentQuestion.options são strings como "A. Opção de texto"
  // E que selectedAnswer será a letra "A", "B", etc.

  // Para pegar a letra da opção:
  const getOptionLetter = (optionString) => {
    return optionString.substring(0, optionString.indexOf('.')).trim();
  };

  return (
    <div className="quiz-interface">
      <h2>Pergunta {currentQuestion.id}:</h2>
      <p className="quiz-question-text">{currentQuestion.text}</p>
      
      <div className="quiz-options">
        {currentQuestion.options.map((optionString) => {
          const letter = getOptionLetter(optionString);
          return (
            <button
              key={letter} // Usar a letra como chave
              className={`quiz-option-button ${selectedAnswer === letter ? 'selected' : ''}`}
              onClick={() => setSelectedAnswer(letter)} // Define selectedAnswer como a letra
              disabled={loading || !!feedback}
            >
              {optionString}
            </button>
          );
        })}
      </div>

      {!feedback && selectedAnswer && (
        <button onClick={handleSubmitAnswer} className="quiz-submit-button" disabled={loading}>
          {loading ? 'Enviando...' : 'Responder'}
        </button>
      )}

      {feedback && (
        <div className="quiz-feedback">
          <p>{feedback}</p>
        </div>
      )}

      {explanation && (
        <div className="quiz-explanation">
          <h3>Explicação da IA:</h3>
          <p>{explanation}</p>
        </div>
      )}

      {feedback && !loading && (
        <button onClick={fetchNextQuestionCallback} className="quiz-next-button">
          Próxima Pergunta
        </button>
      )}
    </div>
  );
}

export default QuizInterface;