import { useState, useCallback, useEffect, useRef } from 'react';
import type { Question, ChannelMessage } from '../types';
import { getQuizChannel } from '../quiz-channel';

const QUIZ_STATE_KEY = 'quiz-app-state-storage';

export const useQuizDisplay = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [displayOrder, setDisplayOrder] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const hasNavigated = useRef<boolean>(false);
  const questionsRef = useRef<Question[]>([]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    const channel = getQuizChannel();

    const handleMessage = (event: MessageEvent<ChannelMessage>) => {
      if (event.data?.type === 'state_update') {
        const newQuestions: Question[] = event.data.payload;
        const oldQuestions = questionsRef.current;
        
        let updatedQuestionId: number | null = null;
        if (oldQuestions.length === newQuestions.length) {
          for (let i = 0; i < newQuestions.length; i++) {
             // A simple JSON diff is reliable for comparing answer arrays
            if (JSON.stringify(oldQuestions[i]?.answer) !== JSON.stringify(newQuestions[i]?.answer)) {
              updatedQuestionId = newQuestions[i].id;
              break;
            }
          }
        }
        
        if (hasNavigated.current && updatedQuestionId !== null) {
          setDisplayOrder(prevOrder => {
            if (prevOrder[currentIndex] === updatedQuestionId) {
              return prevOrder; // Don't reorder if we are viewing the updated question
            }
            const newOrder = prevOrder.filter(id => id !== updatedQuestionId);
            newOrder.splice(currentIndex + 1, 0, updatedQuestionId);
            return newOrder;
          });
        } else if (!hasNavigated.current) {
          setDisplayOrder(newQuestions.map(q => q.id));
        }

        setQuestions(newQuestions);
      }
    };

    channel.addEventListener('message', handleMessage);

    // Load initial state from localStorage
     try {
      const savedState = localStorage.getItem(QUIZ_STATE_KEY);
      if (savedState) {
        const initialQuestions: Question[] = JSON.parse(savedState);
        setQuestions(initialQuestions);
        setDisplayOrder(initialQuestions.map(q => q.id));
      }
    } catch (error) {
      console.error("Failed to load or parse quiz state from localStorage", error);
    }

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [currentIndex]);

  const nextQuestion = useCallback(() => {
    if (!hasNavigated.current) hasNavigated.current = true;
    setCurrentIndex(prev => Math.min(prev + 1, displayOrder.length - 1));
  }, [displayOrder.length]);

  const prevQuestion = useCallback(() => {
    if (!hasNavigated.current) hasNavigated.current = true;
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  return {
    questions,
    displayOrder,
    currentIndex,
    nextQuestion,
    prevQuestion,
  };
};
