import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StudyResource } from '../types';
import {
  Bot,
  Sparkles,
  X,
  Send,
  GraduationCap,
  BookOpen,
  Star,
  Calendar,
  Download,
  Eye,
  AlertCircle,
  RefreshCw,
  Filter,
  Loader2,
} from 'lucide-react';

interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  recommendedResourceIds?: string[];
  suggestedFollowUps?: string[];
  error?: boolean;
}

interface StudyAiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyResources: StudyResource[];
  initialCourse: string;
  initialDepartment: string;
  userCourse: string;
  userDepartment: string;
  language: 'en' | 'bm';
  onSelectResource: (res: StudyResource) => void;
  onBookTutor: (res: StudyResource) => void;
  onDownloadNotes: (id: string) => void;
  onApplyCourseFilter: (courseQuery: string) => void;
}

const PSAS_COURSE_PRESETS = [
  { code: 'DFC20113', label: 'DFC20113 - Object-Oriented Programming (JTMK)' },
  { code: 'DFC40233', label: 'DFC40233 - Web Programming (JTMK)' },
  { code: 'DBM10013', label: 'DBM10013 - Engineering Mathematics 1 (JKE/JKM)' },
  { code: 'DEP10023', label: 'DEP10023 - Circuit Theory & Digital Logic (JKE)' },
  { code: 'DJJ30103', label: 'DJJ30103 - CAD SolidWorks 3D Modeling (JKM)' },
];

export const StudyAiChatModal: React.FC<StudyAiChatModalProps> = ({
  isOpen,
  onClose,
  studyResources,
  initialCourse,
  initialDepartment,
  userCourse,
  userDepartment,
  language,
  onSelectResource,
  onBookTutor,
  onDownloadNotes,
  onApplyCourseFilter,
}) => {
  const courseOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const preset of PSAS_COURSE_PRESETS) {
      map.set(preset.code, preset.label);
    }
    for (const res of studyResources) {
      const code = res.courseCode.trim().toUpperCase();
      if (code && !map.has(code)) {
        map.set(code, `${code} - ${res.title.slice(0, 38)}${res.title.length > 38 ? '...' : ''} (${res.department})`);
      }
    }
    if (userCourse && userCourse.trim() && userCourse !== 'Diploma Program PSAS') {
      const clean = userCourse.trim();
      if (!map.has(clean)) {
        map.set(clean, `${clean} (My Program)`);
      }
    }
    return Array.from(map.entries()).map(([code, label]) => ({ code, label }));
  }, [studyResources, userCourse]);

  const [selectedCourse, setSelectedCourse] = useState<string>('All Courses');
  const [customCourse, setCustomCourse] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);

  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync initial course & department when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const trimmedQuery = initialCourse.trim();
    const matchedCode = courseOptions.find(
      (c) =>
        c.code.toLowerCase() === trimmedQuery.toLowerCase() ||
        trimmedQuery.toLowerCase().includes(c.code.toLowerCase())
    );

    const resolvedCourse = matchedCode
      ? matchedCode.code
      : trimmedQuery || (userCourse && userCourse !== 'Diploma Program PSAS' ? userCourse : 'All Courses');

    if (matchedCode || resolvedCourse === 'All Courses') {
      setSelectedCourse(resolvedCourse);
      setCustomCourse('');
    } else {
      setSelectedCourse('__custom__');
      setCustomCourse(resolvedCourse);
    }

    const validDepts = ['All', 'JTMK', 'JKE', 'JKM', 'JP', 'JPA'];
    if (validDepts.includes(initialDepartment)) {
      setSelectedDept(initialDepartment);
    } else if (validDepts.includes(userDepartment)) {
      setSelectedDept(userDepartment);
    } else {
      setSelectedDept('All');
    }

    setMessages((prev) => {
      if (prev.length > 0) return prev;
      const welcomeText =
        language === 'bm'
          ? 'Hai! Saya pembantu Study AI Campus Corner untuk pelajar PSAS. Pilih kod kursus di atas dan tanya saya untuk mencari tutor sebaya, nota kuliah, atau koleksi soalan tahun lepas.'
          : 'Hi! I am the Campus Corner PSAS Study AI. Choose your course above and ask me to find matching peer tutors, past year papers, or lecture notes.';
      return [
        {
          id: 'ai_welcome',
          role: 'assistant',
          text: welcomeText,
          suggestedFollowUps: [],
        },
      ];
    });

    setTimeout(() => inputRef.current?.focus(), 120);
  }, [isOpen, initialCourse, initialDepartment, userCourse, userDepartment, courseOptions, language]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const activeCourseLabel =
    selectedCourse === '__custom__'
      ? customCourse.trim() || 'All Courses'
      : selectedCourse;

  const starterPrompts =
    language === 'bm'
      ? [
          activeCourseLabel !== 'All Courses'
            ? `Cari tutor sebaya terbaik untuk ${activeCourseLabel}`
            : 'Cadangkan tutor sebaya aktif di PSAS',
          activeCourseLabel !== 'All Courses'
            ? `Ada nota atau past year paper untuk ${activeCourseLabel}?`
            : 'Nota & past year percuma untuk semester ini',
          'Cari sesi skill exchange percuma',
        ]
      : [
          activeCourseLabel !== 'All Courses'
            ? `Find peer tutors for ${activeCourseLabel}`
            : 'Recommend available PSAS peer tutors',
          activeCourseLabel !== 'All Courses'
            ? `Best past year papers & notes for ${activeCourseLabel}`
            : 'Show free lecture notes & past year papers',
          'Any free skill exchange or revision tips?',
        ];

  const sendMessage = async (promptText: string) => {
    const cleanText = promptText.trim();
    if (!cleanText || isLoading) return;

    setLastFailedPrompt(null);

    const userMsg: AiMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: cleanText,
    };

    const historyPayload = messages
      .filter((m) => m.id !== 'ai_welcome' && !m.error)
      .slice(-8)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/study-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          course: activeCourseLabel,
          department: selectedDept,
          language,
          history: historyPayload,
          resources: studyResources.map((r) => ({
            id: r.id,
            title: r.title,
            department: r.department,
            courseCode: r.courseCode,
            resourceType: r.resourceType,
            price: r.price,
            rating: r.rating,
            authorOrTutor: r.authorOrTutor,
            authorSemester: r.authorSemester,
            description: r.description,
            status: r.status,
            tutoringMode: r.tutoringMode,
            availabilitySchedule: r.availabilitySchedule,
            keyTopics: r.keyTopics,
            downloadsCount: r.downloadsCount,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to get AI response.');
      }

      const aiMsg: AiMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Here are my recommendations for your course.',
        recommendedResourceIds: Array.isArray(data.recommendedResourceIds)
          ? data.recommendedResourceIds
          : [],
        suggestedFollowUps: Array.isArray(data.suggestedFollowUps)
          ? data.suggestedFollowUps
          : [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : 'Something went wrong contacting the AI assistant.';
      setLastFailedPrompt(cleanText);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: errMsg,
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleResetChat = () => {
    setLastFailedPrompt(null);
    setMessages([
      {
        id: 'ai_welcome',
        role: 'assistant',
        text:
          language === 'bm'
            ? 'Sesi sembang dimulakan semula. Pilih kursus anda dan tanya saya tentang tutor atau bahan belajar PSAS!'
            : 'Chat cleared. Select your course above and ask me about PSAS peer tutors or study materials!',
        suggestedFollowUps: [],
      },
    ]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Ask an AI Study Assistant"
    >
      <div className="relative w-full max-w-2xl h-[88vh] sm:h-[82vh] max-h-[760px] flex flex-col bg-[#0B1522] border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-950/50 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white truncate">
                  {language === 'bm' ? 'Tanya Study AI' : 'Ask an AI • Study Finder'}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  PSAS Smart Match
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {language === 'bm'
                  ? 'Cari tutor sebaya & bahan ulang kaji ikut kod kursus'
                  : 'Find peer tutors, past papers & notes tailored to your course'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleResetChat}
              title="New chat"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close AI chat"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Course & Department Context Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/70 border-b border-slate-800/90 space-y-2.5 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
            <div className="sm:col-span-7">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                {language === 'bm' ? 'Kursus / Subjek Pilihan' : 'Selected Course / Subject'}
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="All Courses">All PSAS Courses (General Search)</option>
                {courseOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
                <option value="__custom__">Enter another course code...</option>
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {language === 'bm' ? 'Jabatan PSAS' : 'PSAS Department'}
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Departments</option>
                  <option value="JTMK">JTMK (IT & Digital)</option>
                  <option value="JKE">JKE (Electrical)</option>
                  <option value="JKM">JKM (Mechanical)</option>
                  <option value="JP">JP (Commerce)</option>
                  <option value="JPA">JPA (Civil Eng.)</option>
                </select>
                {activeCourseLabel !== 'All Courses' && (
                  <button
                    type="button"
                    onClick={() => {
                      onApplyCourseFilter(activeCourseLabel);
                      onClose();
                    }}
                    title="Filter Study Hub list by this course"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 shrink-0 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {selectedCourse === '__custom__' && (
            <input
              type="text"
              value={customCourse}
              onChange={(e) => setCustomCourse(e.target.value)}
              placeholder="Type your PSAS course code or name (e.g. DFC30133, Database, Calculus)"
              className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          )}
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const matchedResources = (msg.recommendedResourceIds || [])
              .map((id) => studyResources.find((r) => r.id === id))
              .filter((r): r is StudyResource => Boolean(r));

            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2.5`}>
                <div
                  className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%] ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {!isUser && (
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.error
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {msg.error ? <AlertCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                  )}

                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                        : msg.error
                        ? 'bg-rose-950/60 text-rose-200 border border-rose-500/40 rounded-tl-sm'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}

                    {msg.error && lastFailedPrompt && index === messages.length - 1 && (
                      <div className="mt-2 pt-2 border-t border-rose-500/30">
                        <button
                          type="button"
                          onClick={() => sendMessage(lastFailedPrompt)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retry</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Resource / Peer Tutor Cards */}
                {!isUser && matchedResources.length > 0 && (
                  <div className="w-full pl-0 sm:pl-9 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>
                        {language === 'bm'
                          ? `Padanan Ditemui (${matchedResources.length})`
                          : `Matched Tutors & Materials (${matchedResources.length})`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {matchedResources.map((res) => {
                        const isTutoring =
                          res.resourceType === 'Peer Tutoring' || res.resourceType === 'Skill Exchange';
                        return (
                          <div
                            key={res.id}
                            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                                  {res.department} • {res.courseCode}
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                  {res.resourceType}
                                </span>
                                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  {res.rating.toFixed(1)}
                                </span>
                              </div>

                              <h4 className="text-xs font-bold text-white line-clamp-1">{res.title}</h4>

                              <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span>
                                  {isTutoring ? 'Tutor:' : 'By:'}{' '}
                                  <strong className="text-slate-200">{res.authorOrTutor}</strong>
                                </span>
                                <span>•</span>
                                <span className="font-mono font-bold text-emerald-400">
                                  {res.price === 0
                                    ? 'FREE'
                                    : `RM ${res.price.toFixed(2)}${res.resourceType === 'Peer Tutoring' ? '/hr' : ''}`}
                                </span>
                                {res.tutoringMode && (
                                  <>
                                    <span>•</span>
                                    <span>{res.tutoringMode}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectResource(res);
                                  onClose();
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Details</span>
                              </button>

                              {isTutoring ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onBookTutor(res);
                                    onClose();
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-colors"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>Book Tutor</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => onDownloadNotes(res.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Get Notes</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dynamic Follow-up Chips on latest assistant message */}
                {!isUser &&
                  index === messages.length - 1 &&
                  !isLoading &&
                  msg.suggestedFollowUps &&
                  msg.suggestedFollowUps.length > 0 && (
                    <div className="pl-0 sm:pl-9 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((followUp, fIdx) => (
                        <button
                          key={fIdx}
                          type="button"
                          onClick={() => sendMessage(followUp)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium text-left transition-colors"
                        >
                          {followUp}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}

          {/* Starter Quick Prompts when chat only has welcome message */}
          {messages.length <= 1 && !isLoading && (
            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {language === 'bm'
                    ? `Cadangan Soalan Pantas (${activeCourseLabel})`
                    : `Quick Prompts for ${activeCourseLabel}`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {starterPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-xs font-semibold text-left transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                {language === 'bm'
                  ? `Mencari tutor & nota untuk ${activeCourseLabel}...`
                  : `Searching PSAS tutors & study materials for ${activeCourseLabel}...`}
              </div>
            </div>
          )}

          <div ref={scrollEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 shrink-0"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder={
                language === 'bm'
                  ? `Tanya tentang tutor atau nota ${activeCourseLabel}...`
                  : `Ask about tutors, past papers, or study help for ${activeCourseLabel}...`
              }
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'bm' ? 'Hantar' : 'Ask'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
