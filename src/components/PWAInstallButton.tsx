import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Laptop, CheckCircle2, X, Share } from 'lucide-react';

interface Props {
  variant?: 'header' | 'modal' | 'banner' | 'settings';
}

export const InstallAppModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0E1628] border border-cyan-500/40 rounded-3xl shadow-2xl p-6 text-slate-100 my-auto animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl border border-cyan-500/40 bg-[#0A0F1D] p-2 flex items-center justify-center">
            <img
              src="/icons/icon-192.png"
              alt="Campus Corner Logo"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>

          <div>
            <h3 className="text-lg font-black text-white">Install Campus Corner</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              Install directly to your Mobile Phone or Laptop home screen & app launcher with the official Campus Link logo.
            </p>
          </div>
        </div>

        {/* Device Compatibility Badges */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="text-left">
              <span className="text-xs font-bold text-white block">Mobile Device</span>
              <span className="text-[10px] text-slate-400">Android & iOS Home Screen</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
            <Laptop className="w-5 h-5 text-purple-400 shrink-0" />
            <div className="text-left">
              <span className="text-xs font-bold text-white block">Laptop / Desktop</span>
              <span className="text-[10px] text-slate-400">Windows, Mac & Chromebook</span>
            </div>
          </div>
        </div>

        {/* Action Button & Device Instructions */}
        <div className="space-y-3 pt-1">
          {isInstalled ? (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-1">
              <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Application Already Installed!</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Campus Corner is active in standalone mode with your home-screen icon configured.
              </p>
            </div>
          ) : isInstallable ? (
            <button
              onClick={async () => {
                await install();
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen & Desktop</span>
            </button>
          ) : isIOS ? (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Share className="w-4 h-4" />
                <span>iOS Safari Install Steps:</span>
              </div>
              <ol className="text-[11px] text-slate-300 list-decimal list-inside space-y-1">
                <li>Tap the <strong>Share</strong> button at bottom of Safari.</li>
                <li>Scroll down and select <strong>"Add to Home Screen"</strong>.</li>
                <li>Confirm to place the Campus Corner logo icon on your screen.</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={async () => {
                  if (install) {
                    await install();
                  }
                }}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Add to Home Screen / Install</span>
              </button>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed text-left">
                <strong>Google Chrome Instructions:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400">
                  <li><strong>On Android Phone:</strong> Tap Chrome menu (⋮) ➔ select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li><strong>On Laptop / PC:</strong> Click the <strong>Install icon (⊕)</strong> in the address bar or Chrome menu (⋮) ➔ <strong>"Save and share"</strong> ➔ <strong>"Install Campus Corner"</strong>.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  // If already running in standalone mode, hide button
  if (isInstalled) {
    return null;
  }

  if (variant === 'settings') {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install to Device</span>
        </button>
        <InstallAppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setModalOpen(true);
          }
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600 hover:to-blue-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold transition-all shadow-sm cursor-pointer group"
        title="Install Campus Corner directly to Mobile Phone or Laptop"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
        <span className="hidden sm:inline">Install App</span>
      </button>

      <InstallAppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
