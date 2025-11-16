import React from 'react';
import type { Question } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, AdminPanelIcon } from '../icons';

interface DisplayViewProps {
  questions: Question[];
  displayOrder: number[];
  currentIndex: number;
  nextQuestion: () => void;
  prevQuestion: () => void;
}

export const DisplayView: React.FC<DisplayViewProps> = ({
  questions,
  displayOrder,
  currentIndex,
  nextQuestion,
  prevQuestion,
}) => {
  const currentQuestionId = displayOrder[currentIndex];
  const currentQuestion = questions.find(q => q.id === currentQuestionId);

  const displayedAnswer =
    currentQuestion?.answer && currentQuestion.answer.length > 0
      ? currentQuestion.answer.join('')
      : '-';

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < displayOrder.length - 1;

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center select-none overflow-hidden group">
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-row items-baseline justify-center text-center gap-2 sm:gap-4 md:gap-6 px-4 pointer-events-none">
        {currentQuestion ? (
          <>
            <div className="text-[15vw] md:text-[10rem] font-bold leading-none tracking-tight text-gray-500">
              {currentQuestion.id}
            </div>
            <div className="text-[35vw] md:text-[28rem] font-black leading-none tracking-tighter text-white">
              {displayedAnswer}
            </div>
          </>
        ) : (
          <div className="text-4xl sm:text-6xl font-bold text-gray-600">
            Waiting for Questions...
          </div>
        )}
      </div>

      {/* Navigation Overlays */}
      {hasPrev && (
        <div
          onClick={prevQuestion}
          className="absolute left-0 top-0 h-full w-1/2 z-20 flex items-center justify-start p-4 sm:p-8 cursor-pointer text-gray-700 hover:text-white transition-colors duration-300"
          aria-label="Previous Question"
        >
          <ChevronLeftIcon className="w-10 h-10 sm:w-16 sm:h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {hasNext && (
        <div
          onClick={nextQuestion}
          className="absolute right-0 top-0 h-full w-1/2 z-20 flex items-center justify-end p-4 sm:p-8 cursor-pointer text-gray-700 hover:text-white transition-colors duration-300"
          aria-label="Next Question"
        >
          <ChevronRightIcon className="w-10 h-10 sm:w-16 sm:h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Center Divider */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-gray-800 opacity-0 group-hover:opacity-50 transition-opacity duration-300 z-20 pointer-events-none" />


      {/* Admin Panel Button */}
      <a
        href="#/admin"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-gray-900/50 hover:bg-gray-800/70 transition-colors duration-200 z-30"
        aria-label="Go to Admin Panel"
      >
        <AdminPanelIcon className="w-6 h-6 sm:w-8 sm:h-8" />
      </a>

      {/* Footer Progress */}
      {displayOrder.length > 0 && (
         <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-gray-600 font-mono text-sm z-30 pointer-events-none">
             {currentIndex + 1} / {displayOrder.length}
         </div>
      )}
    </div>
  );
};
