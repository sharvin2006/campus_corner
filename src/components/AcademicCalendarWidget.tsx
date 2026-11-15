import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  CalendarDays,
  MapPin,
  ExternalLink,
  Bell,
  BookOpen,
  Home
} from 'lucide-react';
import { AcademicEvent, PSAS_ACADEMIC_CALENDAR_EVENTS } from '../data/academicCalendar';
import { Language } from '../types';

interface Props {
  language: Language;
  onNavigateTab?: (tab: string) => void;
}

export const AcademicCalendarWidget: React.FC<Props> = ({
  language,
  onNavigateTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(
    PSAS_ACADEMIC_CALENDAR_EVENTS[0]
  );

  // Compute countdown in days relative to current simulated app date: 2026-10-11
  const todayDate = new Date('2026-10-11T00:00:00');

  const categories = [
    { id: 'all', label: 'All Dates', icon: CalendarDays },
    { id: 'exam', label: 'Exams & Quizzes', icon: GraduationCap },
    { id: 'break', label: 'Semester Breaks', icon: CalendarIcon },
    { id: 'event', label: 'Campus Events', icon: Sparkles },
    { id: 'deadline', label: 'Deadlines', icon: AlertCircle },
  ];

  const processedEvents = useMemo(() => {
    return PSAS_ACADEMIC_CALENDAR_EVENTS.map((event) => {
      const eventStart = new Date(`${event.startDate}T00:00:00`);
      const diffMs = eventStart.getTime() - todayDate.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        ...event,
        countdownDays: diffDays
      };
    });
  }, []);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'all') return processedEvents;
    return processedEvents.filter((ev) => ev.category === selectedCategory);
  }, [processedEvents, selectedCategory]);

  const getCategoryTheme = (cat: AcademicEvent['category']) => {
    switch (cat) {
      case 'exam':
        return {
          badge: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-500',
          border: 'hover:border-rose-500/50',
          accent: 'text-rose-400'
        };
      case 'break':
        return {
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-500',
          border: 'hover:border-emerald-500/50',
          accent: 'text-emerald-400'
        };
      case 'event':
        return {
          badge: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
          dot: 'bg-purple-500',
          border: 'hover:border-purple-500/50',
          accent: 'text-purple-400'
        };
      case 'deadline':
        return {
          badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-500',
          border: 'hover:border-amber-500/50',
          accent: 'text-amber-400'
        };
      default:
        return {
          badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
          dot: 'bg-cyan-500',
          border: 'hover:border-cyan-500/50',
          accent: 'text-cyan-400'
        };
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0C152E] via-slate-900 to-[#0F1D38] border border-cyan-500/30 shadow-2xl space-y-5">
      {/* Widget Header Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-cyan-400" />
              Sesi II 2026 Academic Calendar
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Live SPMP Milestone Tracker
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1 flex items-center gap-2">
            <span>Upcoming Academic Milestones & Key Dates</span>
          </h3>
          <p className="text-xs text-slate-300">
            Official Politeknik Sultan Azlan Shah semester schedule for exams, project exhibitions, submissions, and breaks.
          </p>
        </div>

        {/* Quick External SPMP portal reference */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Ref: Takwim PSAS 2026</span>
          <a
            href="https://spmp.psas.edu.my"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-cyan-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>SPMP Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dual Column Layout: Left Events Timeline List & Right Active Spotlight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Timeline Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {filteredEvents.map((ev) => {
            const isSelected = selectedEvent?.id === ev.id;
            const theme = getCategoryTheme(ev.category);
            const isTodayOrOngoing = ev.countdownDays !== undefined && ev.countdownDays <= 0;

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-900/95 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                    : `bg-slate-900/60 border-slate-800/90 ${theme.border} hover:bg-slate-900/80`
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${theme.badge}`}>
                      {ev.categoryLabel}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300 font-bold">
                      {ev.dateDisplay}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                    {language === 'bm' ? ev.titleBm : ev.title}
                  </h4>

                  {ev.location && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  )}
                </div>

                {/* Countdown Badge */}
                <div className="text-right shrink-0 flex flex-col items-end justify-center">
                  {ev.countdownDays !== undefined && (
                    <div
                      className={`px-2.5 py-1 rounded-xl text-center border font-mono ${
                        isTodayOrOngoing
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 animate-pulse'
                          : ev.countdownDays <= 7
                          ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                          : 'bg-slate-950/80 text-slate-300 border-slate-800'
                      }`}
                    >
                      <span className="text-[11px] font-bold block">
                        {isTodayOrOngoing ? 'THIS WEEK' : `In ${ev.countdownDays}d`}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase">
                        {isTodayOrOngoing ? 'Ongoing' : 'Countdown'}
                      </span>
                    </div>
                  )}
                  <ChevronRight className={`w-4 h-4 mt-2 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Spotlight Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          {selectedEvent ? (
            <div className="h-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getCategoryTheme(selectedEvent.category).badge}`}>
                    {selectedEvent.categoryLabel}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">
                    📅 {selectedEvent.dateDisplay}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  {language === 'bm' ? selectedEvent.titleBm : selectedEvent.title}
                </h4>

                {/* Details Breakdown */}
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {language === 'bm' ? selectedEvent.descriptionBm : selectedEvent.description}
                </div>

                <div className="space-y-2 text-xs">
                  {selectedEvent.location && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/40 border border-slate-850">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">VENUE / LOCATION:</span>
                        <strong className="text-white text-xs">{selectedEvent.location}</strong>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/40 border border-slate-850">
                    <GraduationCap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">TARGET STUDENTS:</span>
                      <span className="text-slate-300 text-xs">{selectedEvent.targetAudience}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons based on event type */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
                {selectedEvent.category === 'exam' && onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('study')}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Get Solved Past Papers & Notes</span>
                  </button>
                )}

                {selectedEvent.category === 'break' && onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('utilities')}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Find / Offer KTM Carpool for Break</span>
                  </button>
                )}

                {selectedEvent.category === 'deadline' && onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('rentals')}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Browse Off-Campus House Rentals</span>
                  </button>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    Synchronized with SPMP
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">
                    PSAS Academic Affairs
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full rounded-2xl bg-slate-950/60 border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
              <CalendarIcon className="w-8 h-8 text-slate-600" />
              <p className="text-xs">Select any academic milestone to inspect details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
