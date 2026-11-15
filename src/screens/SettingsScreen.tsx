import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import {
  Settings,
  Globe,
  Bell,
  Eye,
  RotateCcw,
  Shield,
  HelpCircle,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  Smartphone,
  Laptop,
  Palette,
  Sun,
  Moon,
  GraduationCap
} from 'lucide-react';
import { PWAInstallButton } from '../components/PWAInstallButton';

export const SettingsScreen: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    resetDemoData,
    addToast,
    showSplashScreen
  } = useApp();

  const t = translations[language];

  // Preferences State
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [publicPhone, setPublicPhone] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSavePreferences = () => {
    addToast('success', 'Preferences Saved', 'Your system and notification settings were updated.');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#141A33] border border-cyan-500/20 shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          Settings & System Preferences
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Configure notifications, privacy parameters, language selection, and review prototype architecture details.
        </p>
      </div>

      {/* Language Section */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Globe className="w-4 h-4 text-cyan-400" />
          Language Selection / Pilihan Bahasa
        </div>
        <p className="text-xs text-slate-400">
          Switch interface labels and navigation between English and Bahasa Melayu.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1 max-w-sm">
          <button
            onClick={() => setLanguage('en')}
            className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
              language === 'en'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🇬🇧 English (Default)
          </button>

          <button
            onClick={() => setLanguage('bm')}
            className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
              language === 'bm'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🇲🇾 Bahasa Melayu
          </button>
        </div>
      </div>

      {/* Theme Appearance Setting using CSS Variables */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Theme & Visual Appearance / Tema Visual</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            CSS Variables
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Personalize your campus interface. Toggle between the default midnight Dark mode, high-clarity Light mode, or the PSAS Official polytechnic corporate theme.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* 1. Dark Theme */}
          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              addToast('info', 'Dark Theme Activated', 'Interface updated to midnight dark mode.');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              theme === 'dark'
                ? 'bg-[#0B152E] border-cyan-500 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Dark Theme</span>
                  <span className="text-[10px] text-slate-400">Default Mode</span>
                </div>
              </div>
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>

            {/* Visual preview swatch */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-5 h-5 rounded-md bg-[#0A0F1D] border border-slate-700" title="Background" />
              <span className="w-5 h-5 rounded-md bg-[#0F172A] border border-slate-700" title="Surface" />
              <span className="w-5 h-5 rounded-md bg-[#00A3FF]" title="Cyan Accent" />
              <span className="text-[10px] font-mono text-slate-400 ml-auto">#0A0F1D</span>
            </div>
          </button>

          {/* 2. Light Theme */}
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              addToast('info', 'Light Theme Activated', 'Interface updated to high-clarity daylight mode.');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              theme === 'light'
                ? 'bg-slate-100 border-sky-600 text-slate-900 shadow-lg shadow-sky-500/20 ring-1 ring-sky-500/40'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Light Theme</span>
                  <span className="text-[10px] text-slate-400">Clean Daylight</span>
                </div>
              </div>
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-sky-500" />}
            </div>

            {/* Visual preview swatch */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-5 h-5 rounded-md bg-[#F4F6F9] border border-slate-300" title="Background" />
              <span className="w-5 h-5 rounded-md bg-[#FFFFFF] border border-slate-300" title="Surface" />
              <span className="w-5 h-5 rounded-md bg-[#0284C7]" title="Sky Accent" />
              <span className="text-[10px] font-mono text-slate-400 ml-auto">#F4F6F9</span>
            </div>
          </button>

          {/* 3. PSAS Official Theme */}
          <button
            type="button"
            onClick={() => {
              setTheme('psas_official');
              addToast('info', 'PSAS Official Theme Activated', 'Polytechnic royal navy blue and gold corporate palette applied.');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              theme === 'psas_official'
                ? 'bg-[#0C2340] border-amber-500 text-white shadow-lg shadow-amber-950/60 ring-1 ring-amber-500/50'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">PSAS Official</span>
                  <span className="text-[10px] text-amber-400/90 font-medium">Navy & Gold Corporate</span>
                </div>
              </div>
              {theme === 'psas_official' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
            </div>

            {/* Visual preview swatch */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-5 h-5 rounded-md bg-[#071526] border border-amber-900/40" title="PSAS Deep Navy" />
              <span className="w-5 h-5 rounded-md bg-[#0C2340] border border-amber-900/40" title="PSAS Royal Blue" />
              <span className="w-5 h-5 rounded-md bg-[#E5A823]" title="Academic Gold Accent" />
              <span className="text-[10px] font-mono text-amber-400/90 ml-auto">PSAS Gold</span>
            </div>
          </button>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Bell className="w-4 h-4 text-purple-400" />
          Notification Preferences
        </div>
        <div className="space-y-2.5 pt-1 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <div>
              <div className="font-semibold text-white">In-App Transaction & Meetup Alerts</div>
              <div className="text-[11px] text-slate-400">Receive toasts when a buyer proposes an offer or confirms pickup.</div>
            </div>
            <input
              type="checkbox"
              checked={inAppNotifs}
              onChange={(e) => setInAppNotifs(e.target.checked)}
              className="accent-cyan-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <div>
              <div className="font-semibold text-white">PSAS Academic Bulletin & FYP Notifications</div>
              <div className="text-[11px] text-slate-400">Receive notifications on new academic season listings and deadlines.</div>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="accent-cyan-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <div>
              <div className="font-semibold text-white">Urgent Campus SOS Broadcasts (Simulated)</div>
              <div className="text-[11px] text-slate-400">Safety notifications triggered in prototype demonstration mode.</div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="accent-cyan-500 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Privacy Controls */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Eye className="w-4 h-4 text-emerald-400" />
          Privacy & Contact Visibility Controls
        </div>
        <div className="space-y-2.5 pt-1 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <div>
              <div className="font-semibold text-white">Display Student Phone Number on Listings</div>
              <div className="text-[11px] text-slate-400">Allow fellow PSAS students to contact you via WhatsApp for physical handovers.</div>
            </div>
            <input
              type="checkbox"
              checked={publicPhone}
              onChange={(e) => setPublicPhone(e.target.checked)}
              className="accent-emerald-500 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Production Backend Integration Checklist (Honest disclosure required by prompt) */}
      <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Server className="w-4 h-4 text-cyan-400" />
          Production Deployment & Backend Integration Roadmap (FYP Documentation)
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This system is structured as an Execute-First, highly modular prototype with complete local persistence. For live institutional deployment at Politeknik Sultan Azlan Shah, connect the following designated backend subsystems:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>1. Student Identity (SPMP SSO)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Integrate LDAP / CAS authentication with the official PSAS SPMP student portal to verify matriculation status automatically.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-purple-300 flex items-center gap-1.5">
              <span>2. Persistent Cloud Database</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Connect PostgreSQL / Cloud SQL or Firebase Firestore replacing current reactive localStorage sync.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span>3. Payment Gateway & Escrow</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Incorporate ToyyibPay / FPX / DuitNow QR API to hold funds securely in escrow until both students confirm campus handover.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>4. Emergency Security Dispatch</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Link the SOS module with the physical PSAS Security Control Room radio telemetry or automated SMS dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Replay Startup Splash Screen */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Campus Link Startup Splash Screen</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Preview the branded app opening interface featuring the official Campus Link Technologies emblem, slogan, and loading progress bar.
          </p>
        </div>

        <button
          onClick={() => showSplashScreen()}
          className="px-4 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-colors shrink-0 cursor-pointer"
        >
          Replay Splash Screen
        </button>
      </div>

      {/* Device Installation & Homescreen App */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1B33] to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <Laptop className="w-4 h-4 text-purple-400" />
            <span>Install to Phone & Laptop (Home Screen App)</span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Add Campus Corner directly to your Android, iPhone, Windows, or Mac home screen and app launcher. Displays the official Campus Link emblem as your native application icon.
          </p>
        </div>

        <PWAInstallButton variant="settings" />
      </div>

      {/* Reset Demonstration Data */}
      <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-red-400" />
            Reset Demonstration Data
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Clear all created listings, simulated offers, and local modifications to restore initial prototype demonstration records.
          </p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/40 text-red-300 border border-red-500/40 text-xs font-bold transition-colors shrink-0"
        >
          {t.actions.resetData}
        </button>
      </div>

      {/* Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="p-6 rounded-2xl bg-[#0E1628] border border-red-500/40 max-w-sm w-full space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              Reset All Demo Data?
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will restore all marketplace items, transactions, user profiles, and logs back to their original default state.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
              >
                Yes, Reset Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
