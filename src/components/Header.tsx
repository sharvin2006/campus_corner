import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { translations } from '../data/translations';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Search,
  AlertOctagon,
  Globe,
  Bell,
  Menu,
  X,
  ShoppingBag,
  Home,
  BookOpen,
  Briefcase,
  Layers,
  Store,
  BarChart3,
  User,
  Settings,
  ShieldCheck,
  Info,
  CheckCircle2,
  Sun,
  Moon,
  Palette
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    language,
    setLanguage,
    theme,
    setTheme,
    setIsSearchModalOpen,
    setIsSosModalOpen,
    user,
    activeRole,
    setActiveRole,
    notifications,
    markNotificationRead
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sandboxInfoOpen, setSandboxInfoOpen] = useState(false);

  const t = translations[language];

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Home },
    { id: 'marketplace', label: t.nav.marketplace, icon: ShoppingBag },
    { id: 'rentals', label: t.nav.rentals, icon: Home },
    { id: 'study', label: t.nav.study, icon: BookOpen },
    { id: 'jobs', label: t.nav.jobs, icon: Briefcase },
    { id: 'utilities', label: t.nav.utilities, icon: Layers },
    { id: 'stores', label: t.nav.stores, icon: Store },
    { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
    { id: 'profile', label: t.nav.profile, icon: User },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Brand Logo */}
            <div
              className="cursor-pointer shrink-0"
              onClick={() => handleNavClick('dashboard')}
            >
              <BrandLogo size="md" />
            </div>

            {/* Middle: Global Search Trigger (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:border-cyan-500/50 hover:text-slate-200 transition-colors shadow-inner"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">{t.actions.searchPlaceholder}</span>
                </span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
                  Ctrl+K
                </kbd>
              </button>
            </div>

            {/* Right: Actions, SOS, Language, Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Buyer / Seller Role Switcher */}
              <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveRole('buyer')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeRole === 'buyer'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Buyer Mode: Browse items, send offers, purchase products, contact sellers"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRole('seller')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeRole === 'seller'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Seller Mode: Post listings, manage catalog & inventory, accept orders & offers"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Seller</span>
                </button>
              </div>

              {/* Demo Mode Badge */}
              <button
                onClick={() => setSandboxInfoOpen(true)}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono hover:bg-cyan-900/40 transition-colors"
                title="Prototype Sandbox Notice"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                DEMO SANDBOX • PSAS
              </button>

              {/* SOS Emergency Button */}
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/50 text-xs font-bold transition-all shadow-sm shadow-red-900/30 group"
                title="Campus SOS"
              >
                <AlertOctagon className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform animate-pulse" />
                <span className="font-semibold tracking-wide">SOS</span>
              </button>

              {/* Direct PWA Install Button for Mobile & Laptop */}
              <PWAInstallButton variant="header" />

              {/* Quick Theme Switcher Button */}
              <button
                type="button"
                onClick={() => {
                  const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'psas_official' : 'dark';
                  setTheme(nextTheme);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                title={`Current Theme: ${theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'PSAS Official'}. Click to cycle themes.`}
              >
                {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-cyan-400" />}
                {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                {theme === 'psas_official' && <Palette className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden xl:inline text-[11px] font-semibold">
                  {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'PSAS'}
                </span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'bm' : 'en')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors"
                title="Switch Language (English / Bahasa Melayu)"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="uppercase text-[11px] font-bold">{language}</span>
              </button>

              {/* Search Icon on mobile */}
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-cyan-400" />
              </button>

              {/* Notification Popover Button */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white relative transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-[10px] text-white font-bold flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#0E1628] border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Campus Notifications
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {unreadNotifications} unread
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5 max-h-64 overflow-y-auto pr-0.5">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            n.read
                              ? 'bg-slate-900/40 text-slate-400'
                              : 'bg-purple-950/40 border border-purple-500/20 text-slate-200'
                          }`}
                        >
                          <div className="font-semibold text-white flex items-center justify-between">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                          </div>
                          <div className="text-[11px] text-slate-300 mt-0.5">{n.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Status Pill */}
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition-all text-left"
              >
                <div className="relative">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-500/40"
                  />
                  {user.isVerified && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center text-[8px] text-white" title="Verified PSAS Student">
                      ✓
                    </span>
                  )}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                    <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                    {user.isVerified ? (
                      <span className="text-[10px] text-emerald-400 font-mono">PSAS</span>
                    ) : (
                      <span className="text-[9px] text-amber-400 font-mono px-1 rounded bg-amber-950/60 border border-amber-500/30">
                        DEMO
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {user.matrixNo}
                  </div>
                </div>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Sub-Nav Bar (Desktop Category Tabs) */}
        <div className="hidden md:block bg-[#090D1A]/95 border-t border-slate-800/60 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center space-x-1 py-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-sm pt-16">
          <div className="bg-[#0B1120] border-b border-slate-800 p-4 space-y-2 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Modules Navigation
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                      isActive
                        ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile In-App Install Callout */}
            <div className="pt-2">
              <PWAInstallButton variant="settings" />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-2">
              <span>Institution:</span>
              <span className="font-semibold text-slate-200">PSAS Behrang</span>
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Info Modal */}
      {sandboxInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0E1628] border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Info className="w-4 h-4" />
                Prototype Demonstration Architecture
              </div>
              <button
                onClick={() => setSandboxInfoOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                <strong>Campus Corner</strong> is a prototype created for <strong>Politeknik Sultan Azlan Shah (PSAS)</strong> by <em>Campus Link Technologies</em>.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-cyan-300">What is active in this sandbox:</div>
                <div className="text-slate-400 text-[11px]">• Real-time browser local storage (persists on refresh)</div>
                <div className="text-slate-400 text-[11px]">• Complete marketplace listing creation, editing & deletion</div>
                <div className="text-slate-400 text-[11px]">• Transaction workflow (Offer ➔ Accept ➔ Meetup ➔ Review)</div>
                <div className="text-slate-400 text-[11px]">• Accommodation & tutoring request submissions</div>
                <div className="text-slate-400 text-[11px]">• Demo SOS alert logging with safety safeguards</div>
              </div>
              <p className="text-[11px] text-amber-300/90 italic">
                Notice: All payments and transactions are simulated. No emergency or external services are contacted.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSandboxInfoOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
