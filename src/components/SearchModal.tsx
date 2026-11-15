import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import {
  Search,
  X,
  ShoppingBag,
  Home,
  BookOpen,
  Briefcase,
  Store,
  Layers,
  ArrowRight
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    language,
    marketplaceItems,
    rentals,
    studyResources,
    jobs,
    utilities,
    stores,
    setCurrentTab
  } = useApp();

  const [term, setTerm] = useState('');
  const t = translations[language];

  if (!isSearchModalOpen) return null;

  const normalized = term.trim().toLowerCase();

  const matchedMarketplace = normalized
    ? marketplaceItems.filter(
        (i) =>
          i.title.toLowerCase().includes(normalized) ||
          i.category.toLowerCase().includes(normalized) ||
          i.description.toLowerCase().includes(normalized)
      )
    : [];

  const matchedRentals = normalized
    ? rentals.filter(
        (r) =>
          r.title.toLowerCase().includes(normalized) ||
          r.locationArea.toLowerCase().includes(normalized)
      )
    : [];

  const matchedStudy = normalized
    ? studyResources.filter(
        (s) =>
          s.title.toLowerCase().includes(normalized) ||
          s.courseCode.toLowerCase().includes(normalized) ||
          s.department.toLowerCase().includes(normalized)
      )
    : [];

  const matchedJobs = normalized
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(normalized) ||
          j.employer.toLowerCase().includes(normalized)
      )
    : [];

  const matchedUtilities = normalized
    ? utilities.filter(
        (u) =>
          u.title.toLowerCase().includes(normalized) ||
          u.description.toLowerCase().includes(normalized)
      )
    : [];

  const matchedStores = normalized
    ? stores.filter(
        (s) =>
          s.name.toLowerCase().includes(normalized) ||
          s.description.toLowerCase().includes(normalized)
      )
    : [];

  const totalResults =
    matchedMarketplace.length +
    matchedRentals.length +
    matchedStudy.length +
    matchedJobs.length +
    matchedUtilities.length +
    matchedStores.length;

  const handleSelect = (tab: string) => {
    setCurrentTab(tab);
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0D1527] border border-cyan-500/30 rounded-2xl shadow-2xl p-5 text-slate-100">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={t.actions.searchPlaceholder}
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {term && (
            <button
              onClick={() => setTerm('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4 pr-1">
          {!normalized ? (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-400">
                Type keywords like <span className="text-cyan-400 font-semibold">"Casio"</span>, <span className="text-cyan-400 font-semibold">"Behrang"</span>, <span className="text-cyan-400 font-semibold">"C++"</span>, or <span className="text-cyan-400 font-semibold">"Koperasi"</span>
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['Textbooks', 'Calculators', 'Single Rooms', 'Carpool', 'Lab Coat', 'FYP Slides'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTerm(tag)}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No campus listings matching "{term}". Try searching across other categories.
            </div>
          ) : (
            <>
              {/* Marketplace Items */}
              {matchedMarketplace.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Marketplace ({matchedMarketplace.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedMarketplace.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect('marketplace')}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {item.category} • {item.pickupLocation}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-cyan-300">
                            RM {item.price.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                            Go <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodations */}
              {matchedRentals.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" />
                    Accommodations ({matchedRentals.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedRentals.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect('rentals')}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-purple-500/40 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {item.locationArea} • {item.type}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-purple-300">
                            RM {item.pricePerMonth} / mo
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                            Go <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Study Resources */}
              {matchedStudy.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Study & Peer Tutors ({matchedStudy.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedStudy.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect('study')}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.department} • {item.courseCode} • {item.resourceType}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-400">
                            {item.price === 0 ? 'FREE' : `RM ${item.price.toFixed(2)}`}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                            Go <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs */}
              {matchedJobs.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    Campus Jobs ({matchedJobs.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedJobs.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect('jobs')}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.employer} • {item.payRate}
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-amber-300">
                          Apply <ArrowRight className="w-3 h-3 inline ml-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Stores */}
              {matchedStores.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" />
                    Student Storefronts ({matchedStores.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedStores.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect('stores')}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-pink-500/40 cursor-pointer transition-all"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.category} • by {item.ownerName}
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-pink-300">
                          Visit <ArrowRight className="w-3 h-3 inline ml-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
