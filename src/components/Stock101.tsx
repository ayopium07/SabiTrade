import React, { useState } from 'react';
import { BookOpen, CheckCircle, GraduationCap, Award, HelpCircle, ArrowRight, RefreshCw, Check, X } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Experienced';
  readTime: string;
  analogy: string;
  content: string;
  keyTakeaway: string;
}

const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Welcome to the NGX (Nigerian Exchange Group)',
    level: 'Beginner',
    readTime: '3 min read',
    analogy: 'Mile 12 or Alaba Market',
    content: 'Think of the NGX as a massive digital Mile 12 Market. But instead of sellers trading bags of onions or electronics, they are buying and selling tiny pieces (shares) of giant companies like MTN Nigeria, Zenith Bank, and Dangote Cement. When the companies make money, your share becomes more valuable!',
    keyTakeaway: 'Investing in a stock means you own a tiny piece of a real, income-generating business in Nigeria.'
  },
  {
    id: 'lesson-2',
    title: 'The P/E Ratio Explained Simply',
    level: 'Intermediate',
    readTime: '4 min read',
    analogy: 'A Local Food Stall (Mama Put)',
    content: 'P/E (Price-to-Earnings) is how many years it takes to get your money back. Imagine buying a local food stall for ₦500,000. If that stall makes ₦100,000 clear profit every year, the P/E ratio is 5 (₦500k cost / ₦100k earnings). If the owner wants ₦2,000,000 for the same stall (P/E of 20), it is much more expensive!',
    keyTakeaway: 'A lower P/E ratio usually means a stock is cheaper relative to the profits it generates.'
  },
  {
    id: 'lesson-3',
    title: 'Understanding Dividends',
    level: 'Beginner',
    readTime: '2 min read',
    analogy: 'Rent from a Tenant',
    content: 'When a company makes a profit, it can choose to share some of that cash directly with shareholders. This is called a dividend. For example, if Zenith Bank pays ₦1.00 dividend per share, and you own 5,000 shares, they will pay ₦5,000 cash straight into your brokerage account.',
    keyTakeaway: 'Dividends are cash rewards paid to you just for holding onto a company’s shares.'
  },
  {
    id: 'lesson-4',
    title: 'Sovereign Yields & Banking Capital Adequacy',
    level: 'Experienced',
    readTime: '5 min read',
    analogy: 'A Bank’s Vault Safety Buffer',
    content: 'In high-interest rate environments, banks profit by investing deposits in risk-free government treasury bills yielding >20%. However, regulatory bodies require banks to maintain a Capital Adequacy Ratio (CAR) to absorb sudden loan defaults. High CAR banks are safer compounders.',
    keyTakeaway: 'Experienced investors check Capital Adequacy to ensure banks can survive macro economic stress.'
  }
];

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIdx: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: 'If you buy shares in Dangote Cement, what do you actually own?',
    options: [
      'A certificate that lets you buy cheap bags of cement.',
      'A loan contract where Dangote owes you interest.',
      'A tiny fractional ownership of the real company, its plants, and profits.'
    ],
    correctAnswerIdx: 2,
    explanation: 'Correct! Buying shares means you become a part-owner of the actual business.'
  },
  {
    question: 'A stock is trading at a P/E of 3x, while its peer trades at 15x. Which is cheaper relative to earnings?',
    options: [
      'The stock at 3x P/E.',
      'The stock at 15x P/E.',
      'They are both the same price.'
    ],
    correctAnswerIdx: 0,
    explanation: 'Exactly! A 3x P/E means you pay ₦3 for every ₦1 of profit, taking just 3 years to recoup capital, whereas 15x takes 15 years.'
  },
  {
    question: 'How do you receive dividends on the NGX?',
    options: [
      'You must go to the company head office in Lagos to collect cash.',
      'They are paid digitally straight into your CSCS/brokerage account.',
      'They are deducted from your phone airtime balance.'
    ],
    correctAnswerIdx: 1,
    explanation: 'Yes! Dividends are processed by registrars and wired straight into your bank/brokerage account.'
  }
];

export default function Stock101() {
  const [readLessons, setReadLessons] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const toggleLessonRead = (id: string) => {
    if (readLessons.includes(id)) {
      setReadLessons(readLessons.filter((l) => l !== id));
    } else {
      setReadLessons([...readLessons, id]);
    }
  };

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qIdx]: oIdx
    });
    setShowExplanation({
      ...showExplanation,
      [qIdx]: true
    });
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIdx) {
        score += 10;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setQuizScore(0);
    setQuizSubmitted(false);
  };

  const progressPercentage = Math.round((readLessons.length / lessons.length) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 text-left">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-brand-primary/15"
        style={{ background: 'linear-gradient(135deg, rgba(14,13,37,0.9), rgba(7,6,21,0.95))' }}>
        <div className="absolute inset-0 bg-brand-primary/2 opacity-50" />
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <GraduationCap className="h-28 w-28 text-brand-primary" />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border border-brand-primary/30 bg-brand-primary/10 text-brand-primary uppercase">
            <GraduationCap className="h-3.5 w-3.5" />
            Sabi Academy
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary font-sora">
            Stock 101: Learn Investing
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed max-w-xl font-medium font-dm-sans">
            Say goodbye to scary charts and Wall Street grammar. Learn how the Nigerian Exchange (NGX) works using simple, local street market analogies.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-2xl p-4 border border-border"
        style={{ background: 'linear-gradient(145deg, #0E0D25, #070615)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-secondary font-dm-sans">
            Academy Completion Progress
          </span>
          <span className="text-xs font-extrabold text-brand-primary">
            {progressPercentage}% Completed ({readLessons.length}/{lessons.length} lessons)
          </span>
        </div>
        <div className="w-full h-2.5 bg-bg-base border border-border/50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-brand-primary"
            style={{ width: `${progressPercentage}%`, boxShadow: '0 0 12px #6366F1' }}
          />
        </div>
      </div>

      {/* Main Grid: Lessons & Quiz */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Lesson Cards */}
        <div className="md:col-span-8 space-y-4">
          <h3 className="text-sm font-extrabold text-text-primary font-sora flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-brand-primary" />
            Bite-Sized Core Lessons
          </h3>

          <div className="space-y-4">
            {lessons.map((lesson) => {
              const isRead = readLessons.includes(lesson.id);
              const difficultyColors = {
                Beginner: 'text-gain border-gain/20 bg-gain/5',
                Intermediate: 'text-warning border-warning/20 bg-warning/5',
                Experienced: 'text-[#A855F7] border-[#A855F7]/20 bg-[#A855F7]/5'
              };

              return (
                <div
                  key={lesson.id}
                  className="rounded-2xl p-5 border border-border/80 transition-all duration-300 relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(145deg, #0E0D25, #070615)',
                    borderColor: isRead ? 'rgba(16,185,129,0.3)' : '#23214C'
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: isRead ? '#10B981' : 'transparent' }} />

                  {/* Top metadata */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border uppercase ${difficultyColors[lesson.level]}`}>
                        {lesson.level}
                      </span>
                      <span className="text-[10px] font-bold text-text-secondary font-dm-sans">
                        {lesson.readTime}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleLessonRead(lesson.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold transition-all duration-200 border focus:outline-none ${
                        isRead
                          ? 'border-gain/30 bg-gain/10 text-gain'
                          : 'border-border hover:border-brand-primary/40 text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {isRead ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <span>Mark Completed</span>
                      )}
                    </button>
                  </div>

                  {/* Title & Analogy */}
                  <h4 className="text-sm font-extrabold text-text-primary font-sora group-hover:text-brand-primary transition-colors mb-2">
                    {lesson.title}
                  </h4>

                  <div className="px-3 py-1.5 rounded-lg border border-brand-primary/10 bg-brand-primary/5 text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-3 w-max">
                    💡 Analogy: {lesson.analogy}
                  </div>

                  {/* Content */}
                  <p className="text-xs text-text-secondary font-medium leading-relaxed font-dm-sans mb-3.5">
                    {lesson.content}
                  </p>

                  {/* Key Takeaway */}
                  <div className="pt-3 border-t border-border/30 text-xs font-semibold text-text-primary/95 italic font-dm-sans flex items-start gap-1.5">
                    <span className="text-brand-primary font-bold text-sm leading-none">“</span>
                    <span>{lesson.keyTakeaway}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quiz Section */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-sm font-extrabold text-text-primary font-sora flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-brand-primary animate-bounce" />
            Test Your Knowledge
          </h3>

          <div
            className="rounded-2xl p-5 border border-border/80 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #0E0D25, #070615)',
              borderColor: '#23214C'
            }}
          >
            <div className="flex items-center gap-1.5 mb-4 border-b border-border/30 pb-3">
              <HelpCircle className="h-4 w-4 text-brand-primary" />
              <span className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest">
                Quick Market Quiz
              </span>
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => {
                const selectedIdx = selectedAnswers[qIdx];
                const showExpl = showExplanation[qIdx];

                return (
                  <div key={qIdx} className="space-y-2.5 text-left">
                    <span className="text-[10px] font-extrabold text-brand-primary font-sora">
                      QUESTION {qIdx + 1}
                    </span>
                    <p className="text-xs font-bold text-text-primary leading-snug">
                      {q.question}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {q.options.map((option, oIdx) => {
                        const isSelected = selectedIdx === oIdx;
                        const isCorrect = oIdx === q.correctAnswerIdx;

                        let btnBorder = '#23214C';
                        let btnBg = 'rgba(14,13,37,0.4)';
                        let textCls = 'text-text-secondary';
                        let Icon = null;

                        if (showExpl) {
                          if (isCorrect) {
                            btnBorder = 'rgba(16,185,129,0.5)';
                            btnBg = 'rgba(16,185,129,0.08)';
                            textCls = 'text-gain font-semibold';
                            Icon = Check;
                          } else if (isSelected && !isCorrect) {
                            btnBorder = 'rgba(255,77,77,0.5)';
                            btnBg = 'rgba(255,77,77,0.08)';
                            textCls = 'text-danger font-semibold';
                            Icon = X;
                          }
                        } else if (isSelected) {
                          btnBorder = '#6366F1';
                          btnBg = 'rgba(99,102,241,0.08)';
                          textCls = 'text-brand-primary font-semibold';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectOption(qIdx, oIdx)}
                            className="w-full p-2.5 rounded-xl border text-left text-[11px] font-medium transition-all duration-200 focus:outline-none flex items-center justify-between gap-2"
                            style={{
                              borderColor: btnBorder,
                              backgroundColor: btnBg
                            }}
                          >
                            <span className={textCls}>{option}</span>
                            {Icon && (
                              <Icon
                                className="h-4 w-4 flex-shrink-0"
                                style={{ color: isCorrect ? '#10B981' : '#FF4D4D' }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showExpl && (
                      <p className="text-[10px] leading-relaxed text-text-secondary italic bg-bg-base/40 p-2 rounded-lg border border-border/30">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Submit & score */}
              <div className="pt-4 border-t border-border/40 space-y-4">
                {!quizSubmitted ? (
                  <button
                    onClick={calculateScore}
                    disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-brand-primary text-bg-base hover:bg-brand-primary/95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                    style={{ boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}
                  >
                    <span>Check Quiz Score</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-brand-primary/20 text-center space-y-1 bg-brand-primary/5">
                      <span className="block text-[9px] font-bold text-text-secondary uppercase tracking-widest">
                        Quiz Completed!
                      </span>
                      <span className="block text-2xl font-extrabold font-sora text-brand-primary">
                        {quizScore} / 30 Points
                      </span>
                      <span className="block text-[10px] text-text-secondary font-medium">
                        {quizScore === 30
                          ? 'Excellent work! You are a master Sabi trader! 🎓'
                          : 'Not bad! Re-read lessons to aim for 30/30! 📚'}
                      </span>
                    </div>

                    <button
                      onClick={resetQuiz}
                      className="w-full py-2 border border-border hover:border-brand-primary/45 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
