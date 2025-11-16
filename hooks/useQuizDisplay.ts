import { useState, useCallback, useEffect, useRef } from 'react';
import type { Question, ChannelMessage } from '../types';
import { getQuizChannel } from '../quiz-channel';

const QUIZ_STATE_KEY = 'quiz-app-state-storage';

export const useQuizDisplay = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [displayOrder, setDisplayOrder] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const hasNavigated = useRef<boolean>(false);
  
  // Refs to avoid stale closures in the message handler
  const questionsRef = useRef<Question[]>([]);
  const currentIndexRef = useRef<number>(0);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // When displayOrder changes (e.g., an item is removed), ensure currentIndex is valid.
  useEffect(() => {
    if (displayOrder.length > 0) {
        setCurrentIndex(prev => Math.max(0, Math.min(prev, displayOrder.length - 1)));
    } else {
        setCurrentIndex(0);
    }
  }, [displayOrder]);


  useEffect(() => {
    const channel = getQuizChannel();

    const handleMessage = (event: MessageEvent<ChannelMessage>) => {
      if (event.data?.type === 'state_update') {
        const newQuestions: Question[] = event.data.payload;
        const oldQuestions = questionsRef.current;
        const localCurrentIndex = currentIndexRef.current;
        
        const isReset = oldQuestions.length !== newQuestions.length;
        let updatedQuestionId: number | null = null;

        if (!isReset) {
          for (let i = 0; i < newQuestions.length; i++) {
             // A simple JSON diff is reliable for comparing answer arrays
            if (JSON.stringify(oldQuestions[i]?.answer) !== JSON.stringify(newQuestions[i]?.answer)) {
              updatedQuestionId = newQuestions[i].id;
              break;
            }
          }
        }
        
        const newAnsweredIds = newQuestions.filter(q => q.answer.length > 0).map(q => q.id);

        if (isReset || !hasNavigated.current) {
          setDisplayOrder(newAnsweredIds);
        } else if (updatedQuestionId !== null) {
          const isNowAnswered = newQuestions.find(q => q.id === updatedQuestionId)!.answer.length > 0;

          setDisplayOrder(prevOrder => {
            // If we're on the question that was updated and it still has an answer, do nothing to the order.
            if (prevOrder[localCurrentIndex] === updatedQuestionId && isNowAnswered) {
              return prevOrder;
            }

            // Remove the updated question from its current position (if it exists).
            let newOrder = prevOrder.filter(id => id !== updatedQuestionId);

            // If the question now has an answer, add it after the current index.
            if (isNowAnswered) {
              newOrder.splice(localCurrentIndex + 1, 0, updatedQuestionId);
            }
            
            return newOrder;
          });
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
        // On initial load, only show questions with answers.
        const answeredIds = initialQuestions.filter(q => q.answer.length > 0).map(q => q.id);
        setDisplayOrder(answeredIds);
      }
    } catch (error) {
      console.error("Failed to load or parse quiz state from localStorage", error);
    }

    return () => {
      channel.removeEventListener('message', handleMessage);
    };
  }, []); // This effect should only run once on mount

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
