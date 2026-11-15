/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/ToastContainer';
import { SearchModal } from './components/SearchModal';
import { SosModal } from './components/SosModal';
import { BrandLogo } from './components/BrandLogo';
import { SplashScreen } from './components/SplashScreen';

// Screens
import { DashboardScreen } from './screens/DashboardScreen';
import { MarketplaceScreen } from './screens/MarketplaceScreen';
import { RentalsScreen } from './screens/RentalsScreen';
import { StudyScreen } from './screens/StudyScreen';
import { JobsScreen } from './screens/JobsScreen';
import { UtilitiesScreen } from './screens/UtilitiesScreen';
import { StoresScreen } from './screens/StoresScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const MainContent: React.FC = () => {
  const { currentTab, setCurrentTab, setIsSosModalOpen, isSplashScreenVisible, hideSplashScreen } = useApp();

  const renderScreen = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'rentals':
        return <RentalsScreen />;
      case 'study':
        return <StudyScreen />;
      case 'jobs':
        return <JobsScreen />;
      case 'utilities':
        return <UtilitiesScreen />;
      case 'stores':
        return <StoresScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-16">
        {renderScreen()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070B16] text-slate-400 py-10 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <BrandLogo size="sm" />
            <p className="text-xs text-slate-400 mt-2 max-w-md">
              Campus Corner is an integrated student marketplace and services platform designed for Politeknik Sultan Azlan Shah (PSAS), Behrang Stesen, Perak.
            </p>
            <div className="text-[11px] text-cyan-400 font-mono pt-1">
              Campus Link Technologies Sdn. Bhd. • Made for Students, Built for Success
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
            <button onClick={() => setCurrentTab('marketplace')} className="hover:text-cyan-300">
              Marketplace
            </button>
            <button onClick={() => setCurrentTab('rentals')} className="hover:text-cyan-300">
              Accommodations
            </button>
            <button onClick={() => setCurrentTab('study')} className="hover:text-cyan-300">
              Study & Tutors
            </button>
            <button onClick={() => setCurrentTab('jobs')} className="hover:text-cyan-300">
              Campus Jobs
            </button>
            <button onClick={() => setCurrentTab('utilities')} className="hover:text-cyan-300">
              Carpool & Utilities
            </button>
            <button onClick={() => setCurrentTab('stores')} className="hover:text-cyan-300">
              Student Stores
            </button>
            <button onClick={() => setIsSosModalOpen(true)} className="hover:text-red-400 text-red-400 font-semibold">
              Emergency SOS
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <div>
            © 2026 Campus Link Technologies Sdn. Bhd. & Politeknik Sultan Azlan Shah (PSAS). All rights reserved.
          </div>
          <div className="mt-2 sm:mt-0 italic text-amber-400/80">
            Demonstration Prototype Sandbox • Local Storage Mode
          </div>
        </div>
      </footer>

      {/* Global Modals & Controls */}
      <MobileBottomNav />
      <SearchModal />
      <SosModal />
      <ToastContainer />

      {/* Campus Link Splash Screen */}
      {isSplashScreenVisible && (
        <SplashScreen onFinish={hideSplashScreen} minDuration={2200} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
