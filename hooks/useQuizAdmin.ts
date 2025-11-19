import { useState, useCallback, useEffect, useRef } from 'react';
import type { Question, AnswerOption } from '../types';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export const useQuizAdmin = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL);

    // Listen for state updates from the server
    socketRef.current.on('state_update', (updatedQuestions: Question[]) => {
      setQuestions(updatedQuestions);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const updateStateAndBroadcast = (newQuestions: Question[]) => {
    // Optimistic update
    setQuestions(newQuestions);

    // Send update to server
    if (socketRef.current) {
      socketRef.current.emit('update_state', newQuestions);
    }
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
    // Use functional update to ensure we have the latest state
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

      // Send update to server inside the callback to ensure we send the calculated state
      // Note: This is slightly tricky with the functional update pattern + side effect.
      // A better approach for the socket emit is to do it after state calculation.
      // However, since we need to emit the *new* state, we'll calculate it first.
      return currentQuestions; // Return unchanged here, we'll do the real update below
    });

    // Re-calculate for the actual update (cleaner separation)
    // Or better, just calculate newQuestions first.
    const newQuestions = questions.map(q => {
      if (q.id === questionId) {
        const newAnswer = q.answer.includes(answerOption)
          ? q.answer.filter(a => a !== answerOption)
          : [...q.answer, answerOption];
        return { ...q, answer: newAnswer.sort() };
      }
      return q;
    });

    updateStateAndBroadcast(newQuestions);

  }, [questions]);


  return {
    questions,
    setTotalQuestions,
    updateAnswer,
  };
};