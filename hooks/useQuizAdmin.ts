import { useState, useCallback, useEffect } from 'react';
import type { Question, AnswerOption } from '../types';
import { postStateUpdate } from '../quiz-channel';

const QUIZ_STATE_KEY = 'quiz-app-state-storage';

export const useQuizAdmin = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(QUIZ_STATE_KEY);
      if (savedState) {
        const parsedQuestions: Question[] = JSON.parse(savedState);
        setQuestions(parsedQuestions);
      }
    } catch (error) {
      console.error("Failed to load or parse quiz state from localStorage", error);
      localStorage.removeItem(QUIZ_STATE_KEY);
    }
  }, []);

  const updateStateAndBroadcast = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    try {
      localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(newQuestions));
    } catch (error) {
       console.error("Failed to save quiz state to localStorage", error);
    }
    postStateUpdate(newQuestions);
  };

  const setTotalQuestions = useCallback((count: number) => {
    if (count > 0 && count <= 1000) {
      const newQuestions: Question[] = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        answer: [],
      }));
      updateStateAndBroadcast(newQuestions);
    } else {
      updateStateAndBroadcast([]);
    }
  }, []);

  const updateAnswer = useCallback((questionId: number, answerOption: AnswerOption) => {
    setQuestions(currentQuestions => {
      const newQuestions = currentQuestions.map(q => {
        if (q.id === questionId) {
          const newAnswer = q.answer.includes(answerOption)
            ? q.answer.filter(a => a !== answerOption)
            : [...q.answer, answerOption];
          return { ...q, answer: newAnswer.sort() };
        }
        return q;
      });
      // The broadcast happens in a separate effect to ensure it sends the updated state.
      return newQuestions;
    });
  }, []);

  // Effect to broadcast changes after state update
  useEffect(() => {
    // This effect ensures that we broadcast the state *after* it has been updated.
    // It's a reliable way to handle the async nature of setState.
    // We skip the initial empty state on mount.
    if (questions.length > 0 || localStorage.getItem(QUIZ_STATE_KEY)) {
        updateStateAndBroadcast(questions);
    }
  }, [questions]);


  return {
    questions,
    setTotalQuestions,
    updateAnswer,
  };
};
