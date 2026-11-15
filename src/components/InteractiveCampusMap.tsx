import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Layers,
  Compass,
  Navigation,
  ExternalLink,
  Store,
  GraduationCap,
  Building2,
  BookOpen,
  Home,
  CheckCircle2,
  Clock,
  Phone,
  Info,
  Maximize2,
  Sparkles,
  X,
  Share2
} from 'lucide-react';
import { CampusLocation, PSAS_CAMPUS_LOCATIONS } from '../data/campusLocations';
import { Language } from '../types';

interface Props {
  language: Language;
  onSelectPickupPoint?: (locationName: string) => void;
}

export const InteractiveCampusMap: React.FC<Props> = ({
  language,
  onSelectPickupPoint
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(
    PSAS_CAMPUS_LOCATIONS[0]
  );
  const [hoveredLocation, setHoveredLocation] = useState<CampusLocation | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const categories = [
    { id: 'all', label: 'All Landmarks', icon: Compass, count: PSAS_CAMPUS_LOCATIONS.length },
    { id: 'store', label: 'Student Stores & Food', icon: Store, count: PSAS_CAMPUS_LOCATIONS.filter(l => l.category === 'store').length },
    { id: 'lecture_hall', label: 'Lecture Halls & Labs', icon: GraduationCap, count: PSAS_CAMPUS_LOCATIONS.filter(l => l.category === 'lecture_hall').length },
    { id: 'admin', label: 'Administrative Offices', icon: Building2, count: PSAS_CAMPUS_LOCATIONS.filter(l => l.category === 'admin').length },
    { id: 'facility', label: 'Library & Facilities', icon: BookOpen, count: PSAS_CAMPUS_LOCATIONS.filter(l => l.category === 'facility').length },
    { id: 'hostel', label: 'Kolej Kediaman (Hostels)', icon: Home, count: PSAS_CAMPUS_LOCATIONS.filter(l => l.category === 'hostel').length },
  ];

  const filteredLocations = useMemo(() => {
    return PSAS_CAMPUS_LOCATIONS.filter((loc) => {
      const matchesCategory = activeCategory === 'all' || loc.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getPinColor = (category: CampusLocation['category']) => {
    switch (category) {
      case 'store':
        return {
          bg: 'bg-pink-500',
          border: 'border-pink-300',
          glow: 'shadow-pink-500/50',
          text: 'text-pink-400'
        };
      case 'lecture_hall':
        return {
          bg: 'bg-indigo-500',
          border: 'border-indigo-300',
          glow: 'shadow-indigo-500/50',
          text: 'text-indigo-400'
        };
      case 'admin':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-300',
          glow: 'shadow-amber-500/50',
          text: 'text-amber-400'
        };
      case 'hostel':
        return {
          bg: 'bg-emerald-500',
          border: 'border-emerald-300',
          glow: 'shadow-emerald-500/50',
          text: 'text-emerald-400'
        };
      case 'facility':
      default:
        return {
          bg: 'bg-cyan-500',
          border: 'border-cyan-300',
          glow: 'shadow-cyan-500/50',
          text: 'text-cyan-400'
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Smart Campus Header Ribbon */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0C1A30] via-[#0E2445] to-[#121A2E] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              iMAP@PSAS • Smart Campus Interactive Navigator
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              110-Acre Masterplan
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            Politeknik Sultan Azlan Shah Interactive Campus Map
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Explore key buildings, student entrepreneurship storefronts, lecture hall complexes, library study zones, and administrative offices at Behrang, Perak.
          </p>
        </div>

        {/* Live Portal Reference */}
        <a
          href="https://www.psasmartcampus.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <span>PSASmartCampus Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-cyan-950/70 text-cyan-200' : 'bg-slate-800 text-slate-400'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hall, store, admin, block..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Map Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Interactive SVG Schematic (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-2">
          <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] bg-[#070D1B] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl">
            {/* Campus Schematic Vector Background */}
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-full select-none"
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.25s ease-out' }}
            >
              <defs>
                <radialGradient id="campusGlow" cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="#0B1A3A" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#040813" stopOpacity="1" />
                </radialGradient>
                <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
              </defs>

              {/* Background Fill & Grid */}
              <rect width="1000" height="650" fill="url(#campusGlow)" />
              <rect width="1000" height="650" fill="url(#grid)" />

              {/* Campus Boundary / Greenery Zones */}
              <path
                d="M 50,80 Q 250,20 500,50 T 950,90 Q 980,350 920,580 T 500,620 Q 150,600 50,550 Z"
                fill="#0A182E"
                stroke="#1E3A5F"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Sports Field (Track & Green Pitch) */}
              <rect x="680" y="470" width="180" height="120" rx="40" fill="#063223" stroke="#059669" strokeWidth="2" opacity="0.7" />
              <rect x="710" y="495" width="120" height="70" rx="10" fill="#047857" opacity="0.8" />
              <text x="770" y="535" fill="#A7F3D0" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.8">Padang PSAS</text>

              {/* Internal Campus Ring Road */}
              <path
                d="M 120,560 C 180,480 200,320 280,240 C 360,160 550,140 700,160 C 840,180 880,300 860,420 C 840,540 650,560 480,540 C 320,520 180,620 120,560 Z"
                fill="none"
                stroke="url(#roadGrad)"
                strokeWidth="22"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
              <path
                d="M 120,560 C 180,480 200,320 280,240 C 360,160 550,140 700,160 C 840,180 880,300 860,420 C 840,540 650,560 480,540 C 320,520 180,620 120,560 Z"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                opacity="0.5"
              />

              {/* Main Entrance Highway */}
              <line x1="20" y1="590" x2="160" y2="530" stroke="url(#roadGrad)" strokeWidth="26" strokeLinecap="round" />
              <line x1="20" y1="590" x2="160" y2="530" stroke="#FBBF24" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
              <text x="60" y="625" fill="#94A3B8" fontSize="11" fontWeight="bold">Jalan Utama Behrang</text>

              {/* Central Lake / Dataran Gemilang Fountain */}
              <ellipse cx="500" cy="380" rx="55" ry="32" fill="#0C2548" stroke="#38BDF8" strokeWidth="2" opacity="0.7" />
              <text x="500" y="384" fill="#7DD3FC" fontSize="10" textAnchor="middle" fontWeight="bold">Dataran Gemilang</text>

              {/* Architectural Block Shapes */}
              {/* Chancellor Hall DMS */}
              <rect x="460" y="70" width="120" height="70" rx="12" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
              <text x="520" y="110" fill="#E2E8F0" fontSize="11" textAnchor="middle" fontWeight="bold">DMS Hall</text>

              {/* Administration HQ */}
              <rect x="430" y="155" width="110" height="55" rx="8" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="485" y="187" fill="#FDE68A" fontSize="10" textAnchor="middle" fontWeight="bold">Pentadbiran</text>

              {/* Central Library */}
              <rect x="350" y="330" width="100" height="75" rx="10" fill="#1E293B" stroke="#22D3EE" strokeWidth="2" />
              <text x="400" y="372" fill="#CFFAFE" fontSize="11" textAnchor="middle" fontWeight="bold">Perpustakaan</text>

              {/* Academic Blocks JTMK */}
              <rect x="230" y="290" width="85" height="60" rx="8" fill="#1E293B" stroke="#818CF8" strokeWidth="1.5" />
              <text x="272" y="325" fill="#C7D2FE" fontSize="10" textAnchor="middle" fontWeight="bold">Blok JTMK</text>

              {/* Academic Blocks JKE/JKM */}
              <rect x="620" y="420" width="110" height="70" rx="8" fill="#1E293B" stroke="#818CF8" strokeWidth="1.5" />
              <text x="675" y="460" fill="#C7D2FE" fontSize="10" textAnchor="middle" fontWeight="bold">Bengkel JKE/JKM</text>

              {/* Kamsis Kenanga & Hostels */}
              <rect x="760" y="100" width="90" height="50" rx="6" fill="#1E293B" stroke="#34D399" strokeWidth="1.5" />
              <text x="805" y="130" fill="#A7F3D0" fontSize="9" textAnchor="middle">Kamsis Siswa</text>

              <rect x="780" y="300" width="95" height="55" rx="6" fill="#1E293B" stroke="#F472B6" strokeWidth="1.5" />
              <text x="827" y="332" fill="#FBCFE8" fontSize="9" textAnchor="middle">Kamsis Siswi</text>

              {/* Mosque Al-Mursyidin */}
              <circle cx="540" cy="510" r="38" fill="#1E293B" stroke="#34D399" strokeWidth="2" />
              <text x="540" y="514" fill="#A7F3D0" fontSize="10" textAnchor="middle" fontWeight="bold">Pusat Islam</text>
            </svg>

            {/* Interactive Location Pins Overlay (HTML Layer mapped by percentage) */}
            <div className="absolute inset-0 pointer-events-none">
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                const isHovered = hoveredLocation?.id === loc.id;
                const pinStyle = getPinColor(loc.category);

                return (
                  <div
                    key={loc.id}
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10 transition-all duration-300"
                    onMouseEnter={() => setHoveredLocation(loc)}
                    onMouseLeave={() => setHoveredLocation(null)}
                    onClick={() => setSelectedLocation(loc)}
                  >
                    <button
                      type="button"
                      className={`relative flex items-center justify-center cursor-pointer transition-all ${
                        isSelected
                          ? 'scale-125 z-30'
                          : isHovered
                          ? 'scale-115 z-20'
                          : 'scale-100 hover:scale-110'
                      }`}
                      title={loc.name}
                    >
                      {/* Pulse Wave for Active Selection */}
                      {isSelected && (
                        <span
                          className={`absolute w-9 h-9 rounded-full ${pinStyle.bg} opacity-40 animate-ping`}
                        />
                      )}

                      {/* Pin Circle */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${pinStyle.bg} border-2 ${
                          isSelected ? 'border-white shadow-lg ' + pinStyle.glow : 'border-slate-900 shadow-md'
                        } flex items-center justify-center text-white font-bold transition-transform`}
                      >
                        {loc.category === 'store' && <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        {loc.category === 'lecture_hall' && <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        {loc.category === 'admin' && <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        {loc.category === 'facility' && <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        {loc.category === 'hostel' && <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </div>

                      {/* Floating Pin Label Tooltip */}
                      {(isSelected || isHovered) && (
                        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/95 border border-cyan-500/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xl flex items-center gap-1 z-40 pointer-events-none">
                          <span className={`w-1.5 h-1.5 rounded-full ${pinStyle.bg}`} />
                          <span>{loc.code}</span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Map Controls & Compass */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 text-[10px] text-slate-300 pointer-events-auto">
                <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                <span className="font-mono">PSAS GPS (4.0412° N, 101.5204° E)</span>
              </div>

              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.9, z - 0.15))}
                  className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="text-[10px] text-slate-300 font-mono px-1">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
                  className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="px-1.5 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-[9px] text-cyan-300 flex items-center justify-center cursor-pointer ml-1"
                  title="Reset Map"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Quick Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Pin Legend:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Stores & Food
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Halls & Labs
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Admin & HEP
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Library
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hostels (Kamsis)
              </span>
            </div>
          </div>
        </div>

        {/* Right Details Panel (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          {selectedLocation ? (
            <div className="h-full rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-5 flex flex-col justify-between space-y-4 shadow-xl animate-in fade-in">
              <div className="space-y-4">
                {/* Photo Header */}
                <div className="relative h-40 sm:h-44 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={selectedLocation.imageUrl}
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/40">
                      {selectedLocation.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-semibold text-white">
                      {selectedLocation.categoryLabel}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug drop-shadow-md">
                      {selectedLocation.name}
                    </h3>
                  </div>
                </div>

                {/* Level & Hours */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Aras / Floor</span>
                    <strong className="text-white text-xs">{selectedLocation.level || 'Aras Utama'}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Masa Operasi</span>
                    <strong className="text-cyan-300 text-xs truncate block">{selectedLocation.operatingHours || 'Waktu Pejabat'}</strong>
                  </div>
                </div>

                {/* Description */}
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  {selectedLocation.description}
                </div>

                {/* Facilities & Services */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    Kemudahan & Ciri-Ciri:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLocation.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1"
                      >
                        • {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact info */}
                {selectedLocation.contact && (
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Hubungi: <strong className="text-white">{selectedLocation.contact}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/90 flex flex-col gap-2">
                {onSelectPickupPoint && (
                  <button
                    type="button"
                    onClick={() => onSelectPickupPoint(selectedLocation.name)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white shadow-lg shadow-cyan-950 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Tetapkan Sebagai Lokasi Serah-Terima (Pickup)</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.psasmartcampus.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-cyan-300 hover:text-white border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka iMAP@PSAS</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(`${selectedLocation.name} - ${selectedLocation.code} (Politeknik Sultan Azlan Shah)`);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1"
                    title="Salin Nama Lokasi"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full rounded-3xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <MapPin className="w-10 h-10 text-slate-600" />
              <h4 className="text-sm font-bold text-white">Select a Landmark Pin</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Click any interactive pin on the campus vector map or select from the list below to view opening hours, facilities, and contact details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Directory Quick-Search Cards (Horizontal Strip) */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Campus Landmark Directory ({filteredLocations.length} Locations)</span>
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">
            Politeknik Sultan Azlan Shah • Behrang Stesen, Perak
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {filteredLocations.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            const pinStyle = getPinColor(loc.category);

            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl ${pinStyle.bg}/20 border border-${pinStyle.bg}/40 flex items-center justify-center shrink-0 ${pinStyle.text}`}
                >
                  {loc.category === 'store' && <Store className="w-4 h-4" />}
                  {loc.category === 'lecture_hall' && <GraduationCap className="w-4 h-4" />}
                  {loc.category === 'admin' && <Building2 className="w-4 h-4" />}
                  {loc.category === 'facility' && <BookOpen className="w-4 h-4" />}
                  {loc.category === 'hostel' && <Home className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 truncate">
                      {loc.code}
                    </span>
                    <span className="text-[9px] text-slate-500 truncate">
                      {loc.categoryLabel}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white truncate mt-0.5">
                    {loc.name}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {loc.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
