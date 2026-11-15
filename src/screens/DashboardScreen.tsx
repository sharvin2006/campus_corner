import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { CAMPUS_ANNOUNCEMENTS } from '../data/initialData';
import { AcademicCalendarWidget } from '../components/AcademicCalendarWidget';
import {
  ShoppingBag,
  Home,
  BookOpen,
  Briefcase,
  Layers,
  Store,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  TrendingUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    user,
    language,
    setCurrentTab,
    setIsSearchModalOpen,
    setIsSosModalOpen,
    marketplaceItems,
    rentals,
    transactions,
    toggleSavedItem
  } = useApp();

  const t = translations[language];

  // Interest-based recommendations:
  // Match items that fall into user's configured interests or department
  const recommendedItems = marketplaceItems.filter((item) =>
    user.interests.includes(item.category) ||
    item.description.toLowerCase().includes(user.department.toLowerCase().split(' ')[0]) ||
    item.title.toLowerCase().includes('calculator') ||
    item.category === 'Textbooks & Academic'
  ).slice(0, 4);

  // Active ongoing transaction for quick preview
  const activeDeal = transactions.find(
    (tx) => tx.status === 'offer_made' || tx.status === 'pickup_scheduled' || tx.status === 'accepted'
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C152E] via-[#101F42] to-[#0A1A35] border border-cyan-500/20 p-6 sm:p-8 shadow-xl">
        {/* Subtle decorative tech lines */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-8 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                {user.department} • Semester {user.semester}
              </span>
              <span className="text-xs text-slate-400">
                Politeknik Sultan Azlan Shah
              </span>
              {!user.isVerified && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
                  Demo Student Profile
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.sections.welcomeTitle}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {user.name}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your unified campus trading, hostel rental, peer-tutoring, and student entrepreneurship platform. Everything verified for PSAS students.
            </p>

            {/* Quick search input shortcut */}
            <div className="pt-2 max-w-lg">
              <div
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 cursor-pointer text-slate-400 text-xs transition-colors shadow-inner"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400 truncate">
                  Search across textbooks, rooms, tutors, jobs, carpools...
                </span>
                <span className="ml-auto text-[10px] text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/50">
                  Find
                </span>
              </div>
            </div>
          </div>

          {/* Quick SOS & FYP highlights box */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 hover:bg-red-900/40 text-red-200 text-left transition-all shadow-md group"
            >
              <div className="p-2 rounded-lg bg-red-600/30 text-red-400 border border-red-500/40 group-hover:scale-110 transition-transform">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  Campus SOS & Safety
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                    DEMO
                  </span>
                </div>
                <div className="text-[11px] text-red-300/80">
                  Quick security & medical response center
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab('study')}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 hover:bg-purple-900/30 text-purple-200 text-left transition-all"
            >
              <div className="p-2 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  FYP & Exam Resource Hub
                </div>
                <div className="text-[11px] text-purple-300/80">
                  Solved past exams & CAD peer tutoring
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Active Deal / Meetup Arrangement Notification Card */}
      {activeDeal && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                Active Deal in Progress: {activeDeal.itemTitle}
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  {activeDeal.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Location: <strong className="text-white">{activeDeal.pickupLocation}</strong> • Agreed Price: <strong className="text-cyan-400">RM {activeDeal.offerAmount.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('marketplace')}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            <span>View Deal Arrangement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Category Shortcuts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            {t.sections.quickShortcuts}
          </h2>
          <span className="text-xs text-cyan-400 font-medium">PSAS Core Services</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              id: 'marketplace',
              title: 'Marketplace',
              subtitle: 'Books, tools & tech',
              icon: ShoppingBag,
              color: 'text-cyan-400',
              bg: 'hover:border-cyan-500/40',
            },
            {
              id: 'rentals',
              title: 'Accommodations',
              subtitle: 'Rooms & houses',
              icon: Home,
              color: 'text-purple-400',
              bg: 'hover:border-purple-500/40',
            },
            {
              id: 'study',
              title: 'Study & Tutors',
              subtitle: 'Past years & notes',
              icon: BookOpen,
              color: 'text-emerald-400',
              bg: 'hover:border-emerald-500/40',
            },
            {
              id: 'jobs',
              title: 'Campus Jobs',
              subtitle: 'Koperasi & cafe shifts',
              icon: Briefcase,
              color: 'text-amber-400',
              bg: 'hover:border-amber-500/40',
            },
            {
              id: 'utilities',
              title: 'Utilities',
              subtitle: 'Carpool & lost items',
              icon: Layers,
              color: 'text-blue-400',
              bg: 'hover:border-blue-500/40',
            },
            {
              id: 'stores',
              title: 'Student Stores',
              subtitle: 'Local student businesses',
              icon: Store,
              color: 'text-pink-400',
              bg: 'hover:border-pink-500/40',
            },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCurrentTab(cat.id)}
                className={`p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col text-left transition-all ${cat.bg} group`}
              >
                <div className={`p-2 rounded-lg bg-slate-800/80 w-fit mb-2 group-hover:scale-105 transition-transform ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {cat.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {cat.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Campus Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              {t.sections.featuredPicks}
            </h2>
            <p className="text-xs text-slate-400">
              Most requested supplies and student listings this week
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('marketplace')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            Explore All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketplaceItems.slice(0, 3).map((item) => {
            const isSaved = user.savedItemIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col transition-all group"
              >
                <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                      {item.condition}
                    </span>
                    {item.status === 'reserved' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/30">
                        RESERVED
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleSavedItem(item.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-rose-400 transition-colors"
                    aria-label="Save item"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span className="truncate">{item.pickupLocation}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Student Price</span>
                      <span className="text-base font-extrabold text-cyan-400">
                        RM {item.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => setCurrentTab('marketplace')}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-semibold transition-all"
                    >
                      View & Offer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations based on Selected Interests */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 to-slate-900 border border-purple-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              {t.sections.recommendations}
            </h3>
            <p className="text-xs text-slate-400">
              Tailored for {user.course} (Semester {user.semester})
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900/40 border border-purple-500/30 text-purple-300 font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recommendedItems.map((rec) => (
            <div
              key={rec.id}
              onClick={() => setCurrentTab('marketplace')}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] text-purple-300 font-medium">{rec.category}</div>
                <div className="text-xs font-bold text-white line-clamp-1 mt-0.5">{rec.title}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{rec.description}</div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">RM {rec.price.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400">Pickup @ {rec.pickupLocation.split('/')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Academic Calendar Milestone Widget */}
      <AcademicCalendarWidget
        language={language}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Two Column Section: Academic Season & Official Campus Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Academic Season Opportunities */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              {t.sections.academicSeason}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              OCT 2026
            </span>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => setCurrentTab('study')}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer text-xs space-y-1 transition-all"
            >
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span>Final Exam Packs, Solved Papers & Peer Tutoring</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">Browse & Post</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Senior student revision notes, DFC/DBM formula cheat sheets, and 1-on-1 peer tutor bookings. Students can upload revision materials and advertise tutor sessions with photos.
              </p>
            </div>

            <div
              onClick={() => setCurrentTab('rentals')}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/40 cursor-pointer text-xs space-y-1 transition-all"
            >
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span>Off-Campus Room Hunting & Landlord Hub</span>
                <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">View & Advertise</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Taman Behrang 2020 and Taman Bahtera landlord rooms verified for semester 2026/2027 intake. Rental owners can advertise vacancies and receive viewing requests.
              </p>
            </div>

            <div
              onClick={() => setCurrentTab('stores')}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-pink-500/40 cursor-pointer text-xs space-y-1 transition-all"
            >
              <div className="font-bold text-pink-300 flex items-center justify-between">
                <span>PSAS Student Entrepreneurship Stores & Catalogs</span>
                <span className="text-[10px] text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded border border-pink-500/30">Post & Shop</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Student culinary snacks, brownies, tech repairs, printing services & crafts. Students can post products with multi-photo galleries directly into store catalogs!
              </p>
            </div>

            <div
              onClick={() => setCurrentTab('jobs')}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer text-xs space-y-1 transition-all"
            >
              <div className="font-bold text-amber-300 flex items-center justify-between">
                <span>Koperasi & Cafeteria Student Shifts</span>
                <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">Part-Time Jobs</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Apply for flexible 12-hour shifts between classes. Wages starting from RM 8.00/hr with lunch allowance.
              </p>
            </div>
          </div>
        </div>

        {/* Right: PSAS Campus Bulletins */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-purple-400" />
              {t.sections.campusAnnouncements}
            </h3>
            <span className="text-xs text-slate-400">PSAS Administration</span>
          </div>

          <div className="space-y-3">
            {CAMPUS_ANNOUNCEMENTS.map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{ann.title}</span>
                  <span className="text-[10px] text-purple-300 font-mono px-1.5 py-0.2 rounded bg-purple-950">
                    {ann.category}
                  </span>
                </div>
                <div className="text-[11px] text-cyan-400 flex items-center gap-2">
                  <span>📅 {ann.date}</span>
                  <span>·</span>
                  <span>📍 {ann.venue}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {ann.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
