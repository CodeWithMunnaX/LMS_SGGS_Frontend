import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export const QuizComponent = ({ quiz = [] }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!quiz || quiz.length === 0) return null;

  const handleSelect = (questionIndex, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswerIndex) {
        score += 1;
      }
    });
    return score;
  };

  const score = calculateScore();

  return (
    <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <h4 className="text-base font-bold text-white">Lecture Knowledge Check</h4>
        </div>
        {submitted && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Score: {score} / {quiz.length}
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {quiz.map((q, qIndex) => {
          const userAnswer = selectedAnswers[qIndex];
          const isCorrect = userAnswer === q.correctAnswerIndex;

          return (
            <div key={qIndex} className="space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                {qIndex + 1}. {q.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((option, optIndex) => {
                  const isSelected = userAnswer === optIndex;
                  let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/60';

                  if (submitted) {
                    if (optIndex === q.correctAnswerIndex) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold';
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => handleSelect(qIndex, optIndex)}
                      className={`p-3 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {submitted && optIndex === q.correctAnswerIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && q.explanation && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                  <span className="font-bold text-indigo-400">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(selectedAnswers).length === 0}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-glow"
        >
          Check Answers
        </button>
      )}
    </div>
  );
};

export default QuizComponent;
