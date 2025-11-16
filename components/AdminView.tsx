import React, { useState } from 'react';
import type { Question, AnswerOption } from '../types';

interface AdminViewProps {
  questions: Question[];
  setTotalQuestions: (count: number) => void;
  updateAnswer: (questionId: number, answer: AnswerOption) => void;
}

const ANSWER_OPTIONS: AnswerOption[] = ['A', 'B', 'C', 'D'];

export const AdminView: React.FC<AdminViewProps> = ({
  questions,
  setTotalQuestions,
  updateAnswer,
}) => {
  const [numQuestionsInput, setNumQuestionsInput] = useState<string>(questions.length > 0 ? String(questions.length) : '10');

  const handleSetQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(numQuestionsInput, 10);
    if (!isNaN(count)) {
      setTotalQuestions(count);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Q&A Control Panel
          </h1>
          <a
            href="#/display"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-colors duration-200"
          >
            Open Display
          </a>
        </div>

        <form onSubmit={handleSetQuestions} className="mb-8">
          <label
            htmlFor="numQuestions"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Number of Questions
          </label>
          <div className="flex items-center gap-3">
            <input
              id="numQuestions"
              type="number"
              min="1"
              max="1000"
              value={numQuestionsInput}
              onChange={(e) => setNumQuestionsInput(e.target.value)}
              className="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 transition-colors duration-200"
            >
              Set
            </button>
          </div>
        </form>

        {questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Answers
            </h2>
            <div className="max-h-[50vh] overflow-y-auto pr-2">
              <ul className="space-y-3">
                {questions.map((q) => (
                  <li
                    key={q.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      Question {q.id}
                    </p>
                    <div className="flex items-center gap-2">
                      {ANSWER_OPTIONS.map((option) => (
                        <button
                          key={option}
                          onClick={() => updateAnswer(q.id, option)}
                          className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-200 ${
                            q.answer.includes(option)
                              ? 'bg-indigo-600 text-white scale-110 shadow-lg'
                              : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};