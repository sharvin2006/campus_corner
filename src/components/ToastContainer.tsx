import React from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
  ShieldCheck,
  ShieldAlert,
  ScanSearch,
} from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[60] flex flex-col gap-2.5 max-w-sm w-[calc(100%-2rem)] sm:w-full pointer-events-none"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((toast) => {
            const isAiScan = toast.variant === 'ai_scan';
            const scanState = toast.scanState || 'active';
            const isActiveScanning =
              isAiScan && (scanState === 'active' || scanState === 'scanning');

            const bgBorder = isAiScan
              ? scanState === 'blocked'
                ? 'bg-slate-900/95 border-rose-500/60 text-rose-300 shadow-rose-950/50'
                : scanState === 'verified'
                ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40'
                : 'bg-[#0E1628]/95 border-cyan-400/50 text-cyan-300 shadow-cyan-950/50'
              : toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-slate-900/95 border-red-500/40 text-red-300'
              : toast.type === 'warning'
              ? 'bg-slate-900/95 border-amber-500/40 text-amber-300'
              : 'bg-slate-900/95 border-cyan-500/40 text-cyan-300';

            const Icon = isAiScan
              ? scanState === 'blocked'
                ? ShieldAlert
                : scanState === 'scanning'
                ? ScanSearch
                : scanState === 'verified'
                ? CheckCircle2
                : ShieldCheck
              : toast.type === 'success'
              ? CheckCircle2
              : toast.type === 'error'
              ? XCircle
              : toast.type === 'warning'
              ? AlertTriangle
              : Info;

            const statusLabel = isAiScan
              ? scanState === 'scanning'
                ? 'AI Prohibited Scan · Running'
                : scanState === 'verified'
                ? 'AI Prohibited Scan · Verified Safe'
                : scanState === 'blocked'
                ? 'AI Prohibited Scan · Blocked'
                : 'PSAS AI Safety Shield · Active'
              : null;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md ${bgBorder}`}
              >
                <div className="relative shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-slate-950/70 border border-current/20">
                  {isActiveScanning && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg border border-cyan-400/60"
                      animate={{ scale: [1, 1.32, 1], opacity: [0.55, 0, 0.55] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <motion.div
                    initial={false}
                    animate={
                      isActiveScanning
                        ? { scale: [1, 1.08, 1] }
                        : scanState === 'verified'
                        ? { scale: [0.85, 1.08, 1] }
                        : { scale: 1 }
                    }
                    transition={
                      isActiveScanning
                        ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                    }
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                </div>

                <div className="flex-1 min-w-0">
                  {statusLabel && (
                    <div className="text-[10px] font-semibold uppercase tracking-wider opacity-90 mb-0.5">
                      {statusLabel}
                    </div>
                  )}
                  <div className="text-xs font-bold text-white tracking-wide">
                    {toast.title}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 leading-snug">
                    {toast.message}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Animated scan sweep bar along bottom edge while active/scanning */}
                {isActiveScanning && (
                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-950/80 overflow-hidden"
                  >
                    <motion.div
                      className="h-full w-2/5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                      animate={{ x: ['-100%', '350%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};
