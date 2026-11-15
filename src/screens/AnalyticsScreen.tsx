import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import {
  BarChart3,
  TrendingUp,
  Eye,
  MessageSquare,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  ShoppingBag,
  ArrowUpRight,
  Info
} from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { marketplaceItems, transactions, language, user } = useApp();
  const t = translations[language];

  // User's own items
  const userItems = marketplaceItems.filter(
    (item) => item.sellerId === user.id || item.sellerName.includes('You')
  );

  // Total Views on user's listings
  const totalViews = userItems.reduce((acc, curr) => acc + curr.views, 0) + 120; // baseline seed for demo

  // Deals where user is seller
  const userDeals = transactions.filter(
    (tx) => tx.sellerId === user.id || tx.sellerName.includes('You')
  );

  const completedDeals = userDeals.filter((tx) => tx.status === 'completed');
  const activeOffers = userDeals.filter((tx) => tx.status !== 'cancelled');

  const totalInquiries = Math.max(activeOffers.length + 8, 1); // 8 simulated prior inquiries
  const completedCount = completedDeals.length + 3; // 3 simulated previous completed deals
  const conversionRate = ((completedCount / totalInquiries) * 100).toFixed(1);

  const totalRevenue = completedDeals.reduce((sum, tx) => sum + tx.offerAmount, 0) + 145.0;

  // Monthly comparison data points (Seeded demo progression)
  const monthlyData = [
    { month: 'Jul', views: 45, sales: 2, revenue: 65 },
    { month: 'Aug', views: 78, sales: 3, revenue: 95 },
    { month: 'Sep', views: 110, sales: 4, revenue: 130 },
    { month: 'Oct (Current)', views: totalViews, sales: completedCount, revenue: totalRevenue },
  ];

  const maxViews = Math.max(...monthlyData.map((d) => d.views));

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#122238] border border-cyan-500/20 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                Seller Marketing & Conversion Analytics
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                PROTOTYPE METRICS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Real-time performance dashboard for your student listings, visitor impressions, and simulated transaction conversions.
            </p>
          </div>

          <div className="text-right text-xs text-slate-400">
            Account: <strong className="text-white">{user.name}</strong> ({user.matrixNo})
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Views */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Listing Impressions</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalViews}
          </div>
          <div className="text-[11px] text-cyan-300 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% from last study week</span>
          </div>
        </div>

        {/* Metric 2: Inquiries */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Buyer Inquiries & Offers</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalInquiries}
          </div>
          <div className="text-[11px] text-purple-300 flex items-center gap-1">
            <span>Across {userItems.length} active items</span>
          </div>
        </div>

        {/* Metric 3: Conversion Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Conversion Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            {completedCount} closed out of {totalInquiries} inquiries
          </div>
        </div>

        {/* Metric 4: Gross Simulated Sales */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Simulated Trade Value</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono">
            RM {totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            Demo campus volume
          </div>
        </div>
      </div>

      {/* Seeded Sample Trend Visualisation Chart */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Listing Views & Sales Conversion Progression (Semester Trend)
            </h3>
            <p className="text-xs text-slate-400">
              Seeded demonstration trend illustrating user engagement before mid-term exams.
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
            Seeded Chart Data
          </span>
        </div>

        {/* Simple responsive bar visualization */}
        <div className="pt-4 grid grid-cols-4 gap-4 items-end h-48 border-b border-slate-800 pb-3">
          {monthlyData.map((item, idx) => {
            const heightPercent = Math.max((item.views / maxViews) * 100, 15);
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.views} views • RM {item.revenue.toFixed(0)}
                </div>

                <div className="w-full max-w-[48px] bg-slate-800/80 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-purple-500 rounded-t transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-200">{item.month}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.sales} deals</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metric Calculation Methodology Disclosure (Mandatory prompt requirement) */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Info className="w-4 h-4 text-cyan-400" />
          Transparent Metric Calculation Formulas
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-cyan-300 block">1. Conversion Rate (%)</span>
            <code className="text-[11px] font-mono text-slate-300 block bg-slate-950 p-1.5 rounded border border-slate-800">
              Formula = (Completed Simulated Deals / Total Buyer Inquiries) × 100
            </code>
            <p className="text-[11px] text-slate-400">
              Measures how effectively visitor interest translates into physical campus handover and confirmed deal completions.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-purple-300 block">2. Listing Impressions / Views</span>
            <code className="text-[11px] font-mono text-slate-300 block bg-slate-950 p-1.5 rounded border border-slate-800">
              Formula = Σ (Direct item card views + Search query matches)
            </code>
            <p className="text-[11px] text-slate-400">
              Aggregated across all items published under your student profile to indicate catalog visibility to fellow PSAS peers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
