import React, { useState } from "react";
import { EDUCATIONAL_MODULES } from "../data/educationalContent";
import { EducationModule, EducationLesson } from "../types";
import {
  BookOpen,
  Disc,
  Music,
  Sliders,
  Users,
  Share2,
  CheckCircle2,
  HelpCircle,
  Award,
  Search,
  ChevronRight,
  ArrowLeft,
  Lightbulb
} from "lucide-react";

const GLOSSARY_TERMS = [
  { term: "Master Recording", category: "Recording", definition: "The original sound recording audio file. Master rights generate royalties whenever tracks are streamed, downloaded, or sampled." },
  { term: "Composition Rights", category: "Publishing", definition: "The underlying music notes, melody, and lyric copyright written by songwriters and beatmakers." },
  { term: "Recoupment", category: "Financial", definition: "The process where a label or publisher retains 100% of an artist's royalties to recover upfront advances and studio production costs." },
  { term: "Cross-Collateralization", category: "Financial", definition: "A clause connecting multiple agreements or albums so profits from a hit record pay off debts from an unrecouped flop." },
  { term: "Sunset Clause", category: "Management", definition: "A contract provision allowing a former manager to collect diminishing percentages of an artist's income for 1-3 years after termination." },
  { term: "Letter of Direction (LOD)", category: "Production", definition: "A document signed by an artist instructing record labels or distributors to send producer royalty points directly to the producer." },
  { term: "Master Reversion", category: "Recording", definition: "A negotiated clause where master sound recording ownership automatically reverts back to the artist after a set number of years (e.g., 10-15 years)." }
];

export const LearningHub: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<EducationModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<EducationLesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [glossaryQuery, setGlossaryQuery] = useState<string>("");

  const getModuleIcon = (name: string) => {
    switch (name) {
      case "Disc": return <Disc className="w-5 h-5 text-amber-400" />;
      case "Music": return <Music className="w-5 h-5 text-emerald-400" />;
      case "Sliders": return <Sliders className="w-5 h-5 text-purple-400" />;
      case "Users": return <Users className="w-5 h-5 text-blue-400" />;
      default: return <Share2 className="w-5 h-5 text-rose-400" />;
    }
  };

  const handleStartQuiz = (module: EducationModule) => {
    setSelectedModule(module);
    setActiveQuiz(true);
    setQuizAnswers(new Array(module.quiz.length).fill(-1));
    setQuizScore(null);
  };

  const handleSelectQuizAnswer = (qIdx: number, aIdx: number) => {
    const updated = [...quizAnswers];
    updated[qIdx] = aIdx;
    setQuizAnswers(updated);
  };

  const handleCompleteQuiz = () => {
    if (!selectedModule) return;
    let correct = 0;
    selectedModule.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    setQuizScore(correct);
  };

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (item) =>
      item.term.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossaryQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 sm:p-8 rounded-2xl border border-amber-500/20 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Music Business Learning Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
          Master the Business Behind Your Music.
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Comprehensive educational modules, real clause breakdowns, plain-English explanations, and interactive quizzes covering Recording Deals, Publishing, Producer Agreements, Management, and Distribution.
        </p>
      </div>

      {/* Main Content Area */}
      {!selectedLesson && !activeQuiz ? (
        <div className="space-y-10">
          
          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EDUCATIONAL_MODULES.map((module) => (
              <div
                key={module.id}
                className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {getModuleIcon(module.iconName)}
                    </div>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                      {module.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-mono">
                      {module.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{module.lessons.length} Lessons</span>
                    <span>Quiz Included</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedModule(module);
                        setSelectedLesson(module.lessons[0]);
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold font-mono flex items-center justify-center space-x-1 transition-all"
                    >
                      <span>Start Lessons</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleStartQuiz(module)}
                      className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold font-mono flex items-center justify-center space-x-1 transition-all border border-amber-500/30"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Take Quiz</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Music Business Glossary Search Section */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Music Business Rights Glossary</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant definitions for contract legalese and industry terms.
                </p>
              </div>

              {/* Glossary Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={glossaryQuery}
                  onChange={(e) => setGlossaryQuery(e.target.value)}
                  placeholder="Search glossary..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGlossary.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 font-mono">{item.term}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : activeQuiz && selectedModule ? (
        
        /* Interactive Quiz View */
        <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-6 max-w-3xl mx-auto">
          <button
            onClick={() => {
              setActiveQuiz(false);
              setQuizScore(null);
            }}
            className="text-xs text-amber-400 hover:underline flex items-center space-x-1 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Learning Hub</span>
          </button>

          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase">{selectedModule.title}</span>
            <h2 className="text-xl font-bold text-slate-100 font-mono mt-1">Knowledge Assessment Quiz</h2>
          </div>

          {quizScore === null ? (
            <div className="space-y-6">
              {selectedModule.quiz.map((q, qIdx) => (
                <div key={qIdx} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-200 font-mono">
                    Question {qIdx + 1}: {q.question}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSelectQuizAnswer(qIdx, aIdx)}
                        className={`w-full p-3 rounded-lg text-left text-xs font-mono transition-all border ${
                          quizAnswers[qIdx] === aIdx
                            ? "bg-amber-500/20 border-amber-500 text-amber-300"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleCompleteQuiz}
                disabled={quizAnswers.includes(-1)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50"
              >
                Submit Answers & Grade
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center py-6">
              <Award className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black font-mono text-slate-100">
                  Score: {quizScore} / {selectedModule.quiz.length}
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {quizScore === selectedModule.quiz.length
                    ? "Perfect score! You have mastered these music contract concepts."
                    : "Great effort! Review the lesson material to strengthen your understanding."}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveQuiz(false);
                  setQuizScore(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono transition-all"
              >
                Return to Learning Hub
              </button>
            </div>
          )}
        </div>

      ) : (

        /* Lesson Detailed Reader View */
        selectedModule && selectedLesson && (
          <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-6 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedLesson(null)}
              className="text-xs text-amber-400 hover:underline flex items-center space-x-1 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Modules</span>
            </button>

            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">{selectedModule.title}</span>
              <h2 className="text-xl font-bold text-slate-100 font-mono mt-1">{selectedLesson.title}</h2>
            </div>

            {/* Lesson Content Sections */}
            <div className="space-y-6">
              
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {selectedLesson.summary}
              </div>

              {/* Key Takeaways */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Key Principles</span>
                </h3>
                <div className="space-y-2">
                  {selectedLesson.keyPoints.map((pt, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Contract Clause Example & Plain English Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Actual Contract Clause:</span>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{selectedLesson.clauseExample}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">Plain English Translation:</span>
                  <p className="text-xs text-amber-200 leading-relaxed">
                    {selectedLesson.plainEnglishExplanation}
                  </p>
                </div>

              </div>

              {/* Questions To Ask */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Questions to Ask Before You Sign:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc">
                  {selectedLesson.questionsToAsk.map((q, idx) => (
                    <li key={idx}>"{q}"</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        )

      )}

    </div>
  );
};
