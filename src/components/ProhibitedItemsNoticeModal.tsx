import React from 'react';
import {
  ShieldAlert,
  Flame,
  FileX,
  Wine,
  Ban,
  ZapOff,
  AlertTriangle,
  X,
  ExternalLink,
  BookOpen,
  Info
} from 'lucide-react';
import { PROHIBITED_ITEMS_CATEGORIES } from '../data/prohibitedItems';
import { Language, ProhibitedViolationRecord, SellerRestriction } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  violations?: ProhibitedViolationRecord[];
  sellerRestriction?: SellerRestriction | null;
  onClearRestriction?: () => void;
}

export const ProhibitedItemsNoticeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  violations = [],
  sellerRestriction = null,
  onClearRestriction,
}) => {
  if (!isOpen) return null;

  const isBm = language === 'bm';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'FileX':
        return <FileX className="w-5 h-5 text-indigo-400" />;
      case 'Wine':
        return <Wine className="w-5 h-5 text-red-400" />;
      case 'Ban':
        return <Ban className="w-5 h-5 text-orange-400" />;
      case 'ZapOff':
        return <ZapOff className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0E1628] border border-rose-500/40 rounded-3xl shadow-2xl p-6 text-slate-100 my-8 space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 uppercase">
                  {isBm ? 'Dasar Keselamatan Kampus' : 'Campus Safety Policy'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  PSAS SPMP Compliance
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                {isBm
                  ? 'Notis Senarai Barangan Terlarang di Campus Corner'
                  : 'Prohibited Items Policy Notice on Campus Corner'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isBm
                  ? 'Panduan rasmi barangan yang TIDAK DIBENARKAN sama sekali untuk dijual, diiklan, atau didagangkan sesama pelajar.'
                  : 'Official campus standards and catalog filters prohibiting illicit, dangerous, or unauthorized goods.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-red-950/40 to-slate-900 border border-rose-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-200 leading-relaxed">
            <strong className="text-rose-300 font-bold block mb-0.5">
              {isBm ? 'Penguatkuasaan Automatik & Tindakan Disiplin' : 'Automated Gatekeeping & Campus Disciplinary Action'}
            </strong>
            {isBm
              ? 'Sistem Campus Corner dilengkapi penapis algoritma masa nyata. Sebarang percubaan menyenaraikan barangan di bawah akan disekat serta-merta, dan maklumat boleh dirujuk kepada Unit Hal Ehwal Pelajar (HEP) Politeknik Sultan Azlan Shah.'
              : 'All marketplace submissions are dynamically audited by our safety verification engine. Blocked listings are halted before publishing and repeated violations will be flagged to PSAS Student Affairs (HEP).'}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {PROHIBITED_ITEMS_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {getIcon(cat.iconName)}
                  </div>
                  <h3 className="text-xs font-bold text-white leading-tight">
                    {isBm ? cat.categoryBm : cat.category}
                  </h3>
                </div>

                {/* Examples */}
                <div className="mt-2.5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    {isBm ? 'Contoh Barangan Disekat:' : 'Blocked Examples:'}
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc pl-4">
                    {(isBm ? cat.examplesBm : cat.examples).map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <p className="text-[10px] text-slate-400 italic">
                  {isBm ? cat.reasonBm : cat.reason}
                </p>
                <div className="text-[10px] font-semibold text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">
                  ⚠️ {isBm ? cat.penaltyNoticeBm : cat.penaltyNotice}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tracked Seller Violations & Marketplace Restriction Log */}
        {(sellerRestriction || violations.length > 0) && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>
                  {isBm
                    ? `Rekod Pemantauan Penjual & Pelanggaran (${violations.length})`
                    : `Tracked Seller Compliance & Violation Log (${violations.length})`}
                </span>
              </div>
              {sellerRestriction && onClearRestriction && (
                <button
                  type="button"
                  onClick={onClearRestriction}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-cyan-300 border border-slate-700 cursor-pointer"
                >
                  {isBm ? 'Set Semula Sekatan (Demo)' : 'Reset Compliance Lock (Demo)'}
                </button>
              )}
            </div>

            {sellerRestriction && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-xs text-rose-100 space-y-1">
                <div className="font-bold text-rose-300">
                  {isBm
                    ? 'STATUS PENJUAL: DISEKAT DARIPADA MENJUAL & MENERBITKAN ITEM'
                    : 'SELLER STATUS: NOT ALLOWED TO SELL OR PUBLISH IN MARKETPLACE'}
                </div>
                <div className="text-[11px] text-slate-200">
                  <strong>{sellerRestriction.sellerName}</strong> ({sellerRestriction.sellerMatrix}) —{' '}
                  {sellerRestriction.reason}
                </div>
                <div className="text-[10px] text-rose-300 font-mono">
                  Restricted since: {sellerRestriction.restrictedAt} • Total flagged attempts:{' '}
                  {sellerRestriction.violationCount}
                </div>
              </div>
            )}

            {violations.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {violations.map((v) => (
                  <div
                    key={v.id}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                  >
                    <div>
                      <div className="font-bold text-white">
                        {v.detectedItem}{' '}
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30 ml-1">
                          {v.source === 'image' ? 'Image Scan' : 'Text Scan'}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        Seller: <strong className="text-slate-200">{v.sellerName}</strong> ({v.sellerMatrix}) •{' '}
                        {v.category}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono shrink-0">{v.timestamp}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>
              {isBm
                ? 'Rujukan: Buku Panduan Disiplin Pelajar PSAS & Peraturan Asrama 2024/2026'
                : 'Governed by PSAS Student Conduct Handbook & Hostel Safety Directives 2024/2026'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            {isBm ? 'Faham & Tutup Notis' : 'I Understand'}
          </button>
        </div>
      </div>
    </div>
  );
};
