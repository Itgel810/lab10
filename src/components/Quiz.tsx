import React, { useState } from 'react'
import './Quiz.css'
import QuizCore from '../core/QuizCore';

const quizCore = new QuizCore();

interface QuizState {
  selectedAnswer: string | null;
  quizFinished: boolean;
}

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    selectedAnswer: null,
    quizFinished: false,
  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({ ...prevState, selectedAnswer: option }));
  };

  const handleButtonClick = (): void => {
    if (state.selectedAnswer === null) return;

    // Record the answer and update score
    quizCore.answerQuestion(state.selectedAnswer);

    if (quizCore.hasNextQuestion()) {
      // Move to next question, reset selected answer
      quizCore.nextQuestion();
      setState({ selectedAnswer: null, quizFinished: false });
    } else {
      // All questions answered — show final score
      setState({ selectedAnswer: null, quizFinished: true });
    }
  };

  // Quiz finished screen
  if (state.quizFinished) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {quizCore.getScore()} out of {quizCore.getTotalQuestions()}</p>
      </div>
    );
  }

  const currentQuestion = quizCore.getCurrentQuestion();

  if (!currentQuestion) {
    return <div><p>No questions available.</p></div>;
  }

  const isLastQuestion = !quizCore.hasNextQuestion();

  return (
    <div>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion.question}</p>

      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={state.selectedAnswer === option ? 'selected' : ''}
          >
            {option}
          </li>
        ))}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{state.selectedAnswer ?? 'No answer selected'}</p>

      <button onClick={handleButtonClick} disabled={state.selectedAnswer === null}>
        {isLastQuestion ? 'Submit' : 'Next Question'}
      </button>
    </div>
  );
};

export default Quiz;
