import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PlusCircle,
  AlertCircle,
  Eye,
  Tag,
  Flame,
} from 'lucide-react';
import {
  ItemCondition,
  Language,
  MarketplaceCategory,
  MarketplaceItem,
  Transaction,
} from '../types';

export interface HighDemandSuggestion {
  title: string;
  category: MarketplaceCategory;
  recommendedPriceRM: number;
  minPriceRM: number;
  maxPriceRM: number;
  demandLevel: 'Very High' | 'High' | 'Rising';
  suggestedCondition: ItemCondition;
  whyItSells: string;
  starterDescription: string;
}

interface CategoryTrendInsight {
  category: MarketplaceCategory;
  demandScore: number;
  trendDirection: 'rising' | 'steady' | 'cooling';
  avgPriceRM: number;
  insight: string;
}

interface MarketplaceTrendsResponse {
  headlineInsight: string;
  hotCategory: MarketplaceCategory;
  peakPriceSweetSpot: string;
  campusMomentumNote: string;
  categoryTrends: CategoryTrendInsight[];
  highDemandSuggestions: HighDemandSuggestion[];
  analyzedAt?: string;
}

interface MarketplaceTrendsWidgetProps {
  items: MarketplaceItem[];
  transactions: Transaction[];
  language: Language;
  userDepartment: string;
  sellerIsRestricted: boolean;
  onQuickListSuggestion: (suggestion: HighDemandSuggestion) => void;
  onSelectCategoryFilter?: (category: string) => void;
}

const ALL_CATEGORIES: MarketplaceCategory[] = [
  'Engineering Tools',
  'Electronics & Gadgets',
  'Textbooks & Academic',
  'Clothing & Attire',
  'Student Essentials',
  'Student Services',
];

export const MarketplaceTrendsWidget: React.FC<MarketplaceTrendsWidgetProps> = ({
  items,
  transactions,
  language,
  userDepartment,
  sellerIsRestricted,
  onQuickListSuggestion,
  onSelectCategoryFilter,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [focusCategory, setFocusCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [trendsData, setTrendsData] = useState<MarketplaceTrendsResponse | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const hasAutoFetchedRef = useRef<boolean>(false);

  // Instant live metrics computed from current Marketplace state
  const liveMetrics = useMemo(() => {
    const activeItems = items.filter((i) => i.status === 'available');
    const totalViews = items.reduce((sum, i) => sum + (Number(i.views) || 0), 0);
    const avgPrice =
      items.length > 0
        ? Math.round(items.reduce((sum, i) => sum + (Number(i.price) || 0), 0) / items.length)
        : 0;

    const categoryBreakdown = ALL_CATEGORIES.map((cat) => {
      const catItems = items.filter((i) => i.category === cat);
      const views = catItems.reduce((sum, i) => sum + (Number(i.views) || 0), 0);
      const avgCatPrice =
        catItems.length > 0
          ? Math.round(catItems.reduce((sum, i) => sum + (Number(i.price) || 0), 0) / catItems.length)
          : 0;
      return {
        category: cat,
        supplyCount: catItems.length,
        views,
        avgViews: catItems.length > 0 ? Math.round(views / catItems.length) : 0,
        avgPrice: avgCatPrice,
      };
    }).sort((a, b) => b.views - a.views);

    const topCategory = categoryBreakdown[0]?.category || 'Electronics & Gadgets';

    return {
      activeCount: activeItems.length,
      totalCount: items.length,
      totalViews,
      avgPrice,
      completedOrActiveDeals: transactions.length,
      topCategory,
      categoryBreakdown,
    };
  }, [items, transactions]);

  const fetchTrendsAnalysis = useCallback(
    async (targetCategory: string) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/marketplace-trends-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            focusCategory: targetCategory,
            userDepartment,
            language,
            listings: items.map((item) => ({
              id: item.id,
              title: item.title,
              category: item.category,
              price: item.price,
              condition: item.condition,
              views: item.views,
              status: item.status,
              createdAt: item.createdAt,
            })),
            transactions: transactions.map((tx) => ({
              itemTitle: tx.itemTitle,
              offerAmount: tx.offerAmount,
              status: tx.status,
            })),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load AI marketplace trends.');
        }

        if (!controller.signal.aborted) {
          setTrendsData(data as MarketplaceTrendsResponse);
        }
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === 'AbortError') return;
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to analyze sales trends right now.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [items, transactions, userDepartment, language]
  );

  // Trigger initial AI trend analysis once on mount
  useEffect(() => {
    if (!hasAutoFetchedRef.current) {
      hasAutoFetchedRef.current = true;
      void fetchTrendsAnalysis('All');
    }
  }, [fetchTrendsAnalysis]);

  // Abort any in-flight request only on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleFocusCategoryChange = (nextCategory: string) => {
    setFocusCategory(nextCategory);
    void fetchTrendsAnalysis(nextCategory);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-label="AI Marketplace Sales Trends and Demand Insights"
        className="rounded-2xl bg-slate-900/85 border border-cyan-500/25 shadow-lg overflow-hidden"
      >
        {/* Header Bar */}
        <div className="px-4 py-3.5 sm:px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/35 text-cyan-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <span>AI Sales Trends & Demand Advisor</span>
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>PSAS Live Pulse</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Analyzes live campus views, pricing, and transactions to surface high-demand items to sell next.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={focusCategory}
              onChange={(e) => handleFocusCategoryChange(e.target.value)}
              disabled={isLoading}
              aria-label="Focus AI trend analysis by category"
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">Focus: All Categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Focus: {cat}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => void fetchTrendsAnalysis(focusCategory)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/35 disabled:opacity-60 border border-cyan-500/40 text-xs font-semibold text-cyan-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Analyzing...' : 'Refresh Trends'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'Minimize' : 'Expand'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Compact Summary Strip Always Visible */}
        <div className="px-4 py-2.5 sm:px-5 bg-slate-900/50 border-b border-slate-800/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 tabular-nums">
            <span className="text-slate-300 inline-flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <strong className="text-white">{liveMetrics.totalViews}</strong>
              <span className="text-slate-400">total listing views</span>
            </span>
            <span className="text-slate-300 inline-flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <strong className="text-white">RM {liveMetrics.avgPrice}</strong>
              <span className="text-slate-400">avg campus price</span>
            </span>
            <span className="text-slate-300 inline-flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Top Traction:</span>
              <strong className="text-amber-300">
                {trendsData?.hotCategory || liveMetrics.topCategory}
              </strong>
            </span>
          </div>

          {trendsData?.peakPriceSweetSpot && (
            <div className="text-[11px] font-semibold text-emerald-300 tabular-nums">
              Sweet Spot: <span className="font-mono">{trendsData.peakPriceSweetSpot}</span>
            </div>
          )}
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="trends-body"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="p-4 sm:p-5 space-y-4"
            >
              {/* AI Error Banner */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void fetchTrendsAnalysis(focusCategory)}
                    className="px-2.5 py-1 rounded-lg bg-rose-900/70 hover:bg-rose-800 text-xs font-semibold text-white shrink-0 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Loading Skeleton State */}
              {isLoading && !trendsData ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 animate-pulse">
                    <div className="h-4 w-40 bg-slate-800 rounded" />
                    <div className="h-3 w-full bg-slate-800/80 rounded" />
                    <div className="space-y-2.5 pt-2">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="space-y-1.5">
                          <div className="h-3 w-3/4 bg-slate-800 rounded" />
                          <div className="h-2 w-full bg-slate-800/70 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5"
                      >
                        <div className="h-3 w-24 bg-slate-800 rounded" />
                        <div className="h-4 w-4/5 bg-slate-800 rounded" />
                        <div className="h-3 w-full bg-slate-800/70 rounded" />
                        <div className="h-7 w-28 bg-slate-800 rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Executive AI Market Pulse Note */}
                  {trendsData && (
                    <div className="p-3.5 rounded-xl bg-slate-950/75 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Campus Market Pulse</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {trendsData.headlineInsight}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {trendsData.campusMomentumNote}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-left">
                          <span className="text-[10px] text-slate-400 block">Hottest Category</span>
                          <span className="text-xs font-bold text-amber-300">
                            {trendsData.hotCategory}
                          </span>
                        </div>
                        <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-left tabular-nums">
                          <span className="text-[10px] text-slate-400 block">Sweet Spot</span>
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            {trendsData.peakPriceSweetSpot}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Two-Column Analytics & High-Demand Suggestions */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* Left Column: Category Demand Trends */}
                    <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                          Category Demand Momentum
                        </h3>
                        <span className="text-[10px] text-slate-400">
                          Demand Index (0–100)
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(trendsData?.categoryTrends && trendsData.categoryTrends.length > 0
                          ? trendsData.categoryTrends
                          : liveMetrics.categoryBreakdown.slice(0, 5).map((cat) => ({
                              category: cat.category,
                              demandScore: Math.min(96, Math.max(42, Math.round((cat.views / Math.max(1, liveMetrics.totalViews)) * 220))),
                              trendDirection: (cat.views >= 70 ? 'rising' : 'steady') as 'rising' | 'steady' | 'cooling',
                              avgPriceRM: cat.avgPrice || 30,
                              insight: `${cat.supplyCount} active listings · ${cat.views} student views`,
                            }))
                        ).map((trend) => {
                          const liveCat = liveMetrics.categoryBreakdown.find(
                            (c) => c.category === trend.category
                          );
                          const barColor =
                            trend.trendDirection === 'rising'
                              ? 'bg-emerald-500'
                              : trend.trendDirection === 'cooling'
                              ? 'bg-amber-500'
                              : 'bg-cyan-500';

                          return (
                            <div
                              key={trend.category}
                              className="space-y-1.5 pb-2.5 border-b border-slate-800/70 last:border-b-0 last:pb-0"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => onSelectCategoryFilter?.(trend.category)}
                                  className="text-xs font-semibold text-white hover:text-cyan-300 transition-colors text-left cursor-pointer"
                                  title={`Filter marketplace by ${trend.category}`}
                                >
                                  {trend.category}
                                </button>

                                <div className="flex items-center gap-2 shrink-0 tabular-nums">
                                  <span className="text-[10px] font-mono text-slate-400">
                                    Avg RM {trend.avgPriceRM}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border ${
                                      trend.trendDirection === 'rising'
                                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/35'
                                        : trend.trendDirection === 'cooling'
                                        ? 'bg-amber-950/70 text-amber-300 border-amber-500/35'
                                        : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/35'
                                    }`}
                                  >
                                    {trend.trendDirection === 'rising' ? (
                                      <TrendingUp className="w-2.5 h-2.5" />
                                    ) : trend.trendDirection === 'cooling' ? (
                                      <TrendingDown className="w-2.5 h-2.5" />
                                    ) : (
                                      <Minus className="w-2.5 h-2.5" />
                                    )}
                                    <span className="capitalize">{trend.trendDirection}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${barColor} transition-all duration-500`}
                                    style={{ width: `${trend.demandScore}%` }}
                                  />
                                </div>
                                <span className="text-[11px] font-mono font-bold text-slate-200 w-7 text-right tabular-nums">
                                  {trend.demandScore}
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
                                <span className="line-clamp-1">{trend.insight}</span>
                                {liveCat && (
                                  <span className="shrink-0 tabular-nums text-slate-500">
                                    {liveCat.supplyCount} listed · {liveCat.views} views
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: High-Demand Items to Sell */}
                    <div className="lg:col-span-7 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>High-Demand Items to Sell Now</span>
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          Tap any item to pre-fill a new listing
                        </span>
                      </div>

                      {trendsData?.highDemandSuggestions &&
                      trendsData.highDemandSuggestions.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {trendsData.highDemandSuggestions.map((suggestion, idx) => (
                            <div
                              key={`${suggestion.title}-${idx}`}
                              className="p-3.5 rounded-xl bg-slate-950/75 border border-slate-800 hover:border-cyan-500/45 transition-colors flex flex-col justify-between gap-3"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-semibold text-cyan-300 truncate">
                                    {suggestion.category}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                                      suggestion.demandLevel === 'Very High'
                                        ? 'bg-emerald-950/75 text-emerald-300 border-emerald-500/40'
                                        : suggestion.demandLevel === 'Rising'
                                        ? 'bg-amber-950/75 text-amber-300 border-amber-500/40'
                                        : 'bg-cyan-950/75 text-cyan-300 border-cyan-500/40'
                                    }`}
                                  >
                                    {suggestion.demandLevel} Demand
                                  </span>
                                </div>

                                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                                  {suggestion.title}
                                </h4>

                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                  {suggestion.whyItSells}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                                <div className="tabular-nums">
                                  <div className="text-sm font-extrabold text-emerald-400 font-mono">
                                    RM {suggestion.recommendedPriceRM}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    Range: RM {suggestion.minPriceRM}–{suggestion.maxPriceRM}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  disabled={sellerIsRestricted}
                                  onClick={() => onQuickListSuggestion(suggestion)}
                                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-bold text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                                >
                                  <PlusCircle className="w-3.5 h-3.5" />
                                  <span>{sellerIsRestricted ? 'Restricted' : 'Sell This'}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-2">
                          <p className="text-xs text-slate-400">
                            Click <strong>Refresh Trends</strong> to generate AI-powered selling opportunities tailored to current campus demand.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
};
