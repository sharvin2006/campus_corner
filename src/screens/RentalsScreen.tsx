import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RentalItem, RentalEnquiry } from '../types';
import { translations } from '../data/translations';
import { ImageUploader } from '../components/ImageUploader';
import {
  Home,
  MapPin,
  CheckCircle2,
  Phone,
  Calendar,
  Users,
  Search,
  SlidersHorizontal,
  X,
  Send,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Plus,
  Edit3,
  Trash2,
  MessageSquare,
  Check,
  ExternalLink,
  Sparkles,
  Building2,
  Bed,
  DollarSign,
  Camera,
  Tag,
  Clock,
  RefreshCw,
  HelpCircle,
  AlertCircle,
  FileText
} from 'lucide-react';

const COMMON_FACILITIES = [
  'High-speed WiFi (100Mbps+)',
  'Mesin Basuh Automatik',
  'Peti Sejuk',
  'Dapur Gas Memasak',
  'Air Conditioner',
  'Water Heater',
  'Katil & Tilam Selesa',
  'Meja & Kerusi Belajar',
  'Almari Pakaian',
  'Kipas Siling',
  'Parking Motosikal Berbumbung',
  'Parking Kereta',
  'Kawalan Keselamatan / Gated',
  'Berdekatan Kedai Makan & Speedmart'
];

const PRESET_RENTAL_PHOTOS = [
  { name: 'Single Bedroom', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80' },
  { name: 'Master Bedroom', url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?w=600&auto=format&fit=crop&q=80' },
  { name: 'Living Hall', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80' },
  { name: 'Shared Room (Twin)', url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80' },
  { name: 'Kitchen & Cooking', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80' },
  { name: 'Clean Bathroom', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' }
];

export const RentalsScreen: React.FC = () => {
  const {
    rentals,
    rentalEnquiries,
    submitRentalEnquiry,
    postRental,
    updateRental,
    deleteRental,
    updateRentalEnquiryStatus,
    language,
    user
  } = useApp();
  const t = translations[language];

  // Navigation tab inside Hub
  const [activeTab, setActiveTab] = useState<'browse' | 'owner_hub' | 'enquiries'>('browse');
  const [ownerFilterScope, setOwnerFilterScope] = useState<'my_only' | 'all'>('my_only');

  // Filters for Browse
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(1000);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Detail Modal & Enquiry Modal
  const [detailRental, setDetailRental] = useState<RentalItem | null>(null);
  const [detailPhotoIdx, setDetailPhotoIdx] = useState<number>(0);
  const [enquiryRental, setEnquiryRental] = useState<RentalItem | null>(null);

  // Enquiry Form Fields
  const [enquiryName, setEnquiryName] = useState(user.name);
  const [enquiryPhone, setEnquiryPhone] = useState(user.phone);
  const [moveInDate, setMoveInDate] = useState('2026-11-01');
  const [enquiryMessage, setEnquiryMessage] = useState(
    'Hi, I am a student at PSAS interested in scheduling a physical room viewing for the upcoming semester.'
  );

  // Post / Edit Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingRentalId, setEditingRentalId] = useState<string | null>(null);

  // Form Fields for Posting / Advertising Rental
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<RentalItem['type']>('Single Room');
  const [formPrice, setFormPrice] = useState<number>(250);
  const [formDeposit, setFormDeposit] = useState<number>(250);
  const [formLocationArea, setFormLocationArea] = useState('Taman Behrang 2020');
  const [formCustomArea, setFormCustomArea] = useState('');
  const [formDistance, setFormDistance] = useState('2.0 km ke Pintu Gerbang PSAS');
  const [formAddress, setFormAddress] = useState('');
  const [formFacilities, setFormFacilities] = useState<string[]>([
    'High-speed WiFi (100Mbps+)',
    'Mesin Basuh Automatik',
    'Peti Sejuk',
    'Katil & Tilam Selesa'
  ]);
  const [customFacility, setCustomFacility] = useState('');
  const [formImages, setFormImages] = useState<string[]>([PRESET_RENTAL_PHOTOS[0].url]);
  const [formLandlordName, setFormLandlordName] = useState(user.name);
  const [formLandlordPhone, setFormLandlordPhone] = useState(user.phone);
  const [formAvailableFrom, setFormAvailableFrom] = useState('Kemudahan Segera');
  const [formGenderPreference, setFormGenderPreference] = useState<RentalItem['genderPreference']>('Male');
  const [formStatus, setFormStatus] = useState<RentalItem['status']>('Available');
  const [formOwnerType, setFormOwnerType] = useState<RentalItem['ownerType']>('Direct Landlord');
  const [formHouseRules, setFormHouseRules] = useState('Dilarang merokok. Menjaga kebersihan bersama.');
  const [formUtilitiesIncluded, setFormUtilitiesIncluded] = useState(true);
  const [formVerificationRequested, setFormVerificationRequested] = useState(false);

  const areas = [
    'All',
    'Taman Behrang 2020',
    'Taman Bahtera Tanjung Malim',
    'Proton City',
    'Bandar Behrang 2020',
    'Taman Universiti Tanjung Malim',
    'Pekan Behrang Stesen'
  ];
  const types = ['All', 'Single Room', 'Sharing Room', 'Whole House', 'Apartment'];

  // Identify rentals belonging to current user
  const myRentals = rentals.filter(
    (r) =>
      r.ownerId === user.id ||
      r.landlordName === user.name ||
      r.landlordPhone === user.phone ||
      r.id === 'rent_my_sample'
  );

  // Filter rentals for student browsing
  const filteredRentals = rentals.filter((r) => {
    const matchesType = selectedType === 'All' || r.type === selectedType;
    const matchesArea = selectedArea === 'All' || r.locationArea.includes(selectedArea);
    const matchesGender = selectedGender === 'All' || r.genderPreference === selectedGender || r.genderPreference === 'Any';
    const matchesBudget = r.pricePerMonth <= maxBudget;
    const matchesStatus =
      selectedStatusFilter === 'All'
        ? true
        : selectedStatusFilter === 'Available Only'
        ? (r.status || 'Available') === 'Available'
        : (r.status || 'Available') === selectedStatusFilter;

    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.locationArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.facilities.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesArea && matchesGender && matchesBudget && matchesStatus && matchesSearch;
  });

  // Owner tab list depending on scope
  const ownerDisplayRentals = ownerFilterScope === 'my_only' ? myRentals : rentals;

  // Open Post Rental Modal (Reset Form)
  const handleOpenPostModal = () => {
    setEditingRentalId(null);
    setFormTitle('');
    setFormType('Single Room');
    setFormPrice(250);
    setFormDeposit(250);
    setFormLocationArea('Taman Behrang 2020');
    setFormCustomArea('');
    setFormDistance('1.8 km (4 minit ke PSAS)');
    setFormAddress('Jalan Behrang 2020/4, 35900 Behrang Stesen, Perak');
    setFormFacilities([
      'High-speed WiFi (100Mbps+)',
      'Mesin Basuh Automatik',
      'Peti Sejuk',
      'Katil & Tilam Selesa'
    ]);
    setCustomFacility('');
    setFormImages([
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?w=600&auto=format&fit=crop&q=80'
    ]);
    setFormLandlordName(user.name);
    setFormLandlordPhone(user.phone);
    setFormAvailableFrom('Kemudahan Segera');
    setFormGenderPreference('Male');
    setFormStatus('Available');
    setFormOwnerType('Direct Landlord');
    setFormHouseRules('Dilarang merokok di dalam rumah. Hormati ketenteraman rakan serumah.');
    setFormUtilitiesIncluded(true);
    setFormVerificationRequested(false);
    setIsPostModalOpen(true);
  };

  // Open Edit Rental Modal (Pre-populate with existing rental data)
  const handleOpenEditModal = (rental: RentalItem) => {
    setEditingRentalId(rental.id);
    setFormTitle(rental.title);
    setFormType(rental.type);
    setFormPrice(rental.pricePerMonth);
    setFormDeposit(rental.deposit);
    if (areas.includes(rental.locationArea)) {
      setFormLocationArea(rental.locationArea);
      setFormCustomArea('');
    } else {
      setFormLocationArea('Other');
      setFormCustomArea(rental.locationArea);
    }
    setFormDistance(rental.distanceToCampus);
    setFormAddress(rental.address);
    setFormFacilities(rental.facilities || []);
    setCustomFacility('');
    setFormImages(rental.images && rental.images.length > 0 ? rental.images : [PRESET_RENTAL_PHOTOS[0].url]);
    setFormLandlordName(rental.landlordName);
    setFormLandlordPhone(rental.landlordPhone);
    setFormAvailableFrom(rental.availableFrom);
    setFormGenderPreference(rental.genderPreference);
    setFormStatus(rental.status || 'Available');
    setFormOwnerType(rental.ownerType || 'Direct Landlord');
    setFormHouseRules(rental.houseRules || 'Dilarang merokok. Menjaga kebersihan bersama.');
    setFormUtilitiesIncluded(rental.utilitiesIncluded ?? true);
    setFormVerificationRequested(rental.isVerifiedPartner);
    setIsPostModalOpen(true);
  };

  // Toggle facility in checkbox array
  const handleToggleFacility = (facility: string) => {
    setFormFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const handleAddCustomFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFacility.trim()) return;
    if (!formFacilities.includes(customFacility.trim())) {
      setFormFacilities((prev) => [...prev, customFacility.trim()]);
    }
    setCustomFacility('');
  };

  // Handle Save (Create or Update)
  const handleSaveRentalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) return;
    if (formImages.length === 0) {
      alert('Please upload or select at least 1 photo for your accommodation listing.');
      return;
    }

    const finalArea = formLocationArea === 'Other' && formCustomArea.trim() ? formCustomArea.trim() : formLocationArea;

    const rentalPayload = {
      title: formTitle.trim(),
      type: formType,
      pricePerMonth: Number(formPrice),
      deposit: Number(formDeposit),
      locationArea: finalArea,
      distanceToCampus: formDistance.trim() || 'Berhampiran PSAS',
      address: formAddress.trim() || finalArea,
      facilities: formFacilities,
      images: formImages,
      landlordName: formLandlordName.trim(),
      landlordPhone: formLandlordPhone.trim(),
      availableFrom: formAvailableFrom.trim() || 'Kemudahan Segera',
      genderPreference: formGenderPreference,
      isVerifiedPartner: formVerificationRequested,
      status: formStatus,
      ownerId: user.id,
      ownerType: formOwnerType,
      houseRules: formHouseRules.trim(),
      utilitiesIncluded: formUtilitiesIncluded
    };

    if (editingRentalId) {
      updateRental(editingRentalId, rentalPayload);
    } else {
      postRental(rentalPayload);
    }

    setIsPostModalOpen(false);
    setEditingRentalId(null);
  };

  // Quick 1-click status update by owner
  const handleQuickStatusChange = (rentalId: string, newStatus: 'Available' | 'Reserved' | 'Occupied') => {
    updateRental(rentalId, { status: newStatus });
  };

  // Enquiry submission by student
  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryRental) return;
    submitRentalEnquiry(enquiryRental.id, enquiryName, enquiryPhone, moveInDate, enquiryMessage);
    setEnquiryRental(null);
  };

  // Generate WhatsApp Direct Link
  const makeWhatsAppLink = (phone: string, text: string) => {
    const cleanNum = phone.replace(/[^0-9]/g, '');
    const intlNum = cleanNum.startsWith('0') ? '60' + cleanNum.substring(1) : cleanNum;
    return `https://wa.me/${intlNum}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header & Hub Navigation */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131b36] to-[#1e1b4b] border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-[11px] font-semibold text-purple-300 mb-2">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>PSAS Accommodation & Landlord Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <Home className="w-7 h-7 text-purple-400 shrink-0" />
              Student Accommodation Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Find verified student rooms, shared houses, or advertise rental accommodations in Behrang 2020, Tanjung Malim, and Proton City for PSAS students.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenPostModal}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Post / Advertise Rental</span>
            </button>
          </div>
        </div>

        {/* Hub Tab Switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'browse'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse Accommodations</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px]">
              {filteredRentals.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('owner_hub')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'owner_hub'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-300" />
            <span>Rental Owner & Landlord Portal</span>
            {myRentals.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-purple-400/30 text-purple-200 text-[10px]">
                {myRentals.length} listings
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'enquiries'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />
            <span>Student Viewing Requests</span>
            {rentalEnquiries.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-cyan-400/30 text-cyan-200 text-[10px]">
                {rentalEnquiries.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= TAB 1: BROWSE ACCOMMODATIONS ================= */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search text */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search location, WiFi, room type, or landmark..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Type filter */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t === 'All' ? 'All Types' : t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area filter */}
              <div>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a === 'All' ? 'All Areas' : a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Preference */}
              <div>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="All">All Tenants</option>
                  <option value="Male">Lelaki Sahaja (Siswa)</option>
                  <option value="Female">Siswi Sahaja</option>
                  <option value="Any">Campuran / Any</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              {/* Quick Availability Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[11px] text-slate-400 font-medium shrink-0">Status:</span>
                {['All', 'Available Only', 'Reserved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      selectedStatusFilter === st
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {st === 'Available Only' ? '🟢 Available Only' : st}
                  </button>
                ))}
              </div>

              {/* Budget slider */}
              <div className="flex items-center gap-3 w-full sm:w-64">
                <span className="text-[11px] text-slate-400 shrink-0">Max Budget:</span>
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="50"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-bold text-purple-300 font-mono shrink-0">
                  RM{maxBudget}
                </span>
              </div>
            </div>
          </div>

          {/* Accommodation Listings Grid */}
          {filteredRentals.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <Home className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No accommodations match your filter</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try widening your budget, selecting a different campus area, or post a new rental advertisement if you have a room to rent out.
              </p>
              <button
                onClick={handleOpenPostModal}
                className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Post an Accommodation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRentals.map((rental) => {
                const isOwner =
                  rental.ownerId === user.id ||
                  rental.landlordName === user.name ||
                  rental.landlordPhone === user.phone;
                const status = rental.status || 'Available';

                return (
                  <div
                    key={rental.id}
                    className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all group shadow-sm"
                  >
                    {/* Image Header & Badges */}
                    <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                      <img
                        src={rental.images[0]}
                        alt={rental.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Photo Count Tag */}
                      {rental.images.length > 1 && (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[10px] font-medium text-slate-200 border border-slate-700 flex items-center gap-1">
                          <Camera className="w-3 h-3 text-purple-400" />
                          <span>{rental.images.length} photos</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/90 text-purple-300 border border-purple-500/40">
                          {rental.type}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950/90 text-slate-200 border border-slate-700">
                          {rental.genderPreference === 'Male'
                            ? 'Lelaki Sahaja'
                            : rental.genderPreference === 'Female'
                            ? 'Siswi Sahaja'
                            : 'Campuran'}
                        </span>
                      </div>

                      {/* Status & Verification Pill */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border backdrop-blur-md ${
                            status === 'Available'
                              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                              : status === 'Reserved'
                              ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
                              : 'bg-slate-950/90 text-slate-400 border-slate-700'
                          }`}
                        >
                          ● {status}
                        </span>

                        {rental.isVerifiedPartner ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-medium">
                            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>Verified Partner</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/90 text-amber-300/90 border border-amber-500/30 text-[10px]">
                            <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>Unverified</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="font-medium text-slate-200">{rental.locationArea}</span>
                          <span>·</span>
                          <span className="truncate text-cyan-300">{rental.distanceToCampus}</span>
                        </div>

                        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                          {rental.title}
                        </h3>

                        {/* Facilities tags */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {rental.facilities.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-950/70 text-slate-300 border border-slate-800"
                            >
                              {f}
                            </span>
                          ))}
                          {rental.facilities.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/70 text-slate-400">
                              +{rental.facilities.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Owner / Landlord byline */}
                        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                          <span className="truncate">By: {rental.landlordName}</span>
                          {rental.utilitiesIncluded && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-800/40">
                              Utilities Inc.
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            Deposit: RM {rental.deposit}
                          </span>
                          <span className="text-base font-extrabold text-purple-400 font-mono">
                            RM {rental.pricePerMonth}
                            <span className="text-xs text-slate-400 font-normal"> / mo</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isOwner && (
                            <button
                              onClick={() => handleOpenEditModal(rental)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs transition-colors"
                              title="Edit Your Listing"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setDetailRental(rental);
                              setDetailPhotoIdx(0);
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                            title="View Full Details & Photos"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEnquiryRental(rental);
                              setDetailRental(null);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md transition-colors"
                          >
                            Schedule Viewing
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: RENTAL OWNER & LANDLORD PORTAL ================= */}
      {activeTab === 'owner_hub' && (
        <div className="space-y-6">
          {/* Owner Dashboard Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-xs">Advertised Listings</span>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
                {myRentals.length}
              </div>
              <span className="text-[10px] text-purple-400 mt-0.5 block">Managed in this app</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-xs">Available Vacancies</span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono mt-1">
                {myRentals.filter((r) => (r.status || 'Available') === 'Available').length}
              </div>
              <span className="text-[10px] text-emerald-400/80 mt-0.5 block">Ready for students</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-xs">Viewing Enquiries</span>
              <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono mt-1">
                {rentalEnquiries.length}
              </div>
              <span className="text-[10px] text-cyan-400/80 mt-0.5 block">Incoming student requests</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-xs">Total Student Views</span>
              <div className="text-xl sm:text-2xl font-bold text-purple-300 font-mono mt-1">
                {myRentals.reduce((sum, r) => sum + r.views, 0)}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Campus interest</span>
            </div>
          </div>

          {/* Action Bar & Scope Toggle */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                Manage Your Rental Advertisements
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Update occupancy status, edit rent/deposit, adjust amenities, or upload updated room photos.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
                <button
                  onClick={() => setOwnerFilterScope('my_only')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    ownerFilterScope === 'my_only'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  My Listings ({myRentals.length})
                </button>
                <button
                  onClick={() => setOwnerFilterScope('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    ownerFilterScope === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Demo Admin View to edit any listing"
                >
                  All Hub Listings ({rentals.length})
                </button>
              </div>

              <button
                onClick={handleOpenPostModal}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white inline-flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Advertise New Rental</span>
              </button>
            </div>
          </div>

          {/* Owner Listings List */}
          {ownerDisplayRentals.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No rental advertisements found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Are you a landlord, property owner, or senior student sub-letting a room? Create your first advertisement with up to 10 photos!
              </p>
              <button
                onClick={handleOpenPostModal}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Create Advertisement
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {ownerDisplayRentals.map((rental) => {
                const currentStatus = rental.status || 'Available';
                const relatedEnquiries = rentalEnquiries.filter((e) => e.rentalId === rental.id);

                return (
                  <div
                    key={rental.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                  >
                    {/* Left: Thumbnail & Main info */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                      <div className="relative w-full sm:w-36 h-24 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                        <img
                          src={rental.images[0]}
                          alt={rental.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300 flex items-center gap-0.5">
                          <Camera className="w-2.5 h-2.5" />
                          {rental.images.length}
                        </span>
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                            {rental.type}
                          </span>
                          <span className="text-[10px] text-slate-300">
                            {rental.locationArea}
                          </span>
                          {rental.isVerifiedPartner ? (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Verified PSAS Partner
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400/80">
                              Unverified Private
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-white truncate">
                          {rental.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="font-mono text-purple-300 font-bold">
                            RM {rental.pricePerMonth} / month
                          </span>
                          <span>•</span>
                          <span>Deposit: RM {rental.deposit}</span>
                          <span>•</span>
                          <span>{rental.views} views</span>
                          {relatedEnquiries.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-cyan-400 font-medium">
                                📩 {relatedEnquiries.length} Student Requests
                              </span>
                            </>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500">
                          Contact: {rental.landlordName} ({rental.landlordPhone}) • Available from: {rental.availableFrom}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Status Changer & Edit Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                      {/* One-click status dropdown */}
                      <div className="flex flex-col">
                        <label className="text-[10px] text-slate-400 mb-1 font-medium">
                          Occupancy Status:
                        </label>
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleQuickStatusChange(
                              rental.id,
                              e.target.value as 'Available' | 'Reserved' | 'Occupied'
                            )
                          }
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none border ${
                            currentStatus === 'Available'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                              : currentStatus === 'Reserved'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="Available">🟢 Available (Vacant)</option>
                          <option value="Reserved">🟡 Reserved (Pending Deposit)</option>
                          <option value="Occupied">🔴 Occupied (Rented Out)</option>
                        </select>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setDetailRental(rental);
                            setDetailPhotoIdx(0);
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="View Live Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(rental)}
                          className="px-3.5 py-2 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-sm"
                          title="Edit Details & Photos"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the listing "${rental.title}"?`)) {
                              deleteRental(rental.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 transition-colors"
                          title="Remove Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Landlord Safety & Verification Advisory */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>PSAS Accommodation Safety & Partner Standards</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rental listings marked with the <strong>"Verified PSAS Partner"</strong> badge receive higher student inquiry rates and trusted placement. To maintain student welfare around Politeknik Sultan Azlan Shah, accommodation owners are expected to provide working window grills, fire safety, signed tenancy agreements, and transparent refundable deposits.
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB 3: STUDENT VIEWING REQUESTS & ENQUIRIES ================= */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Student Viewing Enquiries ({rentalEnquiries.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Students requesting physical room visits, tenancy discussions, or move-in reservations.
              </p>
            </div>
          </div>

          {rentalEnquiries.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No viewing enquiries received yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Once students browse your accommodation listings and click "Schedule Viewing", their contact details and target move-in dates will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rentalEnquiries.map((enq) => {
                const whatsappMsg = `Salam ${enq.studentName}, saya pemilik bagi ${enq.rentalTitle}. Saya telah menerima permohonan viewing anda untuk tarikh ${enq.moveInDate}.`;
                const whatsappUrl = makeWhatsAppLink(enq.studentPhone, whatsappMsg);

                return (
                  <div
                    key={enq.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-purple-300 font-mono">
                            Target Move-in: {enq.moveInDate}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-0.5">
                            {enq.studentName}
                          </h4>
                        </div>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            enq.status === 'accepted'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                              : enq.status === 'viewing_scheduled'
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                              : enq.status === 'declined'
                              ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                              : 'bg-amber-950 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {enq.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                        <div className="text-[10px] text-slate-400 font-medium mb-1">
                          Property: <span className="text-slate-200">{enq.rentalTitle}</span>
                        </div>
                        <p className="italic text-slate-300">"{enq.message}"</p>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span>Phone / WhatsApp: {enq.studentPhone}</span>
                        <span className="text-[10px]">{enq.createdAt}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateRentalEnquiryStatus(enq.id, 'viewing_scheduled')}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/50 text-[11px] font-medium"
                        >
                          Confirm Viewing
                        </button>
                        <button
                          onClick={() => updateRentalEnquiryStatus(enq.id, 'accepted')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 text-[11px] font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateRentalEnquiryStatus(enq.id, 'declined')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px]"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: POST / ADVERTISE OR EDIT RENTAL ================= */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0E1628] border border-purple-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-5">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                  PSAS Accommodation Advertising
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  {editingRentalId ? 'Update Rental Advertisement' : 'Post / Advertise New Rental'}
                </h3>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRentalSubmit} className="space-y-5">
              {/* SECTION 1: Basic Information */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  1. Basic Accommodation Information
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    placeholder="e.g. Bilik Single Lelaki Selesa Katil Queen @ Taman Behrang 2020"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Accommodation Type
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as RentalItem['type'])}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Single Room">Single Room (Bilik Perseorangan)</option>
                      <option value="Sharing Room">Sharing Room (Bilik Kongsi)</option>
                      <option value="Whole House">Whole House (Satu Rumah)</option>
                      <option value="Apartment">Apartment / Pangsapuri</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tenant Preference
                    </label>
                    <select
                      value={formGenderPreference}
                      onChange={(e) => setFormGenderPreference(e.target.value as RentalItem['genderPreference'])}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Male">Lelaki Sahaja (Siswa)</option>
                      <option value="Female">Siswi Sahaja</option>
                      <option value="Any">Campuran / Any</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Occupancy Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as RentalItem['status'])}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
                    >
                      <option value="Available">🟢 Available (Vacant)</option>
                      <option value="Reserved">🟡 Reserved (Pending)</option>
                      <option value="Occupied">🔴 Occupied (Rented)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Photos (Up to 10 Images) */}
              <div className="space-y-3.5 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    2. Room & House Photos (Up to 10 Images)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {formImages.length}/10 uploaded
                  </span>
                </div>

                <ImageUploader
                  mode="multiple"
                  values={formImages}
                  onChange={setFormImages}
                  max={10}
                  label="Upload Photos (Bedroom, Hall, Kitchen, Toilet, Parking)"
                  samplePresets={PRESET_RENTAL_PHOTOS}
                />
              </div>

              {/* SECTION 3: Pricing & Availability */}
              <div className="space-y-3.5 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  3. Pricing & Move-in Terms
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Monthly Rent (RM) *
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="3000"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Deposit (RM) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      value={formDeposit}
                      onChange={(e) => setFormDeposit(Number(e.target.value))}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Available From
                    </label>
                    <input
                      type="text"
                      value={formAvailableFrom}
                      onChange={(e) => setFormAvailableFrom(e.target.value)}
                      placeholder="e.g. Segera / Nov 2026"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="utilInc"
                    checked={formUtilitiesIncluded}
                    onChange={(e) => setFormUtilitiesIncluded(e.target.checked)}
                    className="accent-purple-500 rounded cursor-pointer w-4 h-4"
                  />
                  <label htmlFor="utilInc" className="text-xs text-slate-300 cursor-pointer">
                    Include water and electricity bills in monthly rent (Bil Air & Elektrik Termasuk)
                  </label>
                </div>
              </div>

              {/* SECTION 4: Location & Proximity to PSAS */}
              <div className="space-y-3.5 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  4. Location & Distance to PSAS Campus
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Location Area *
                    </label>
                    <select
                      value={formLocationArea}
                      onChange={(e) => setFormLocationArea(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Taman Behrang 2020">Taman Behrang 2020</option>
                      <option value="Taman Bahtera Tanjung Malim">Taman Bahtera Tanjung Malim</option>
                      <option value="Proton City">Proton City</option>
                      <option value="Bandar Behrang 2020">Bandar Behrang 2020</option>
                      <option value="Taman Universiti Tanjung Malim">Taman Universiti Tanjung Malim</option>
                      <option value="Pekan Behrang Stesen">Pekan Behrang Stesen</option>
                      <option value="Other">Other Area...</option>
                    </select>

                    {formLocationArea === 'Other' && (
                      <input
                        type="text"
                        value={formCustomArea}
                        onChange={(e) => setFormCustomArea(e.target.value)}
                        placeholder="Enter custom area name"
                        className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Distance to PSAS Gate *
                    </label>
                    <input
                      type="text"
                      value={formDistance}
                      onChange={(e) => setFormDistance(e.target.value)}
                      placeholder="e.g. 1.8 km (4 minit motosikal ke PSAS)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Address / Landmark
                  </label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="e.g. No 12, Jalan Behrang 2020/5 (Berdekatan surau & kedai runcit)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* SECTION 5: Facilities & Amenities Checklist */}
              <div className="space-y-3.5 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  5. Facilities & Included Amenities
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_FACILITIES.map((facility) => {
                    const isSelected = formFacilities.includes(facility);
                    return (
                      <button
                        type="button"
                        key={facility}
                        onClick={() => handleToggleFacility(facility)}
                        className={`p-2 rounded-xl text-left text-[11px] font-medium transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-purple-950/80 text-purple-200 border-purple-500/50 shadow-sm'
                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <Check
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-purple-400 opacity-100' : 'opacity-20'
                          }`}
                        />
                        <span className="truncate">{facility}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Facility */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customFacility}
                    onChange={(e) => setCustomFacility(e.target.value)}
                    placeholder="Add other amenity (e.g. Penapis Air Coway, Balkoni)..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFacility}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* SECTION 6: Landlord Contact & House Rules */}
              <div className="space-y-3.5 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  6. Landlord Contact & Tenancy Rules
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Owner / Landlord Name *
                    </label>
                    <input
                      type="text"
                      value={formLandlordName}
                      onChange={(e) => setFormLandlordName(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      value={formLandlordPhone}
                      onChange={(e) => setFormLandlordPhone(e.target.value)}
                      required
                      placeholder="+60 12-345 6789"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Owner Role
                    </label>
                    <select
                      value={formOwnerType}
                      onChange={(e) => setFormOwnerType(e.target.value as RentalItem['ownerType'])}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Direct Landlord">Direct Landlord (Pemilik Rumah)</option>
                      <option value="Master Tenant (Student Senior)">Master Tenant (Pelajar Senior PSAS)</option>
                      <option value="Property Agent">Property Agent / Caretaker</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    House Rules & Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formHouseRules}
                    onChange={(e) => setFormHouseRules(e.target.value)}
                    placeholder="e.g. Dilarang merokok, bayar sewa sebelum 5hb, menjaga ketenteraman jiran..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Partner safety badge opt-in */}
                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="verifyCheck"
                    checked={formVerificationRequested}
                    onChange={(e) => setFormVerificationRequested(e.target.checked)}
                    className="accent-purple-500 rounded cursor-pointer w-4 h-4 mt-0.5"
                  />
                  <label htmlFor="verifyCheck" className="text-xs text-slate-300 cursor-pointer">
                    <strong>Request Verified PSAS Accommodation Partner Badge:</strong> I confirm that this premises fulfills student safety standards (lockable rooms, grilled windows, transparent contract, and fair deposit return).
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {editingRentalId ? 'Save & Update Advertisement' : 'Publish Rental Advertisement'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ACCOMMODATION FULL DETAILS & GALLERY ================= */}
      {detailRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0E1628] border border-purple-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                    {detailRental.type} • {detailRental.locationArea}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                      (detailRental.status || 'Available') === 'Available'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    ● {detailRental.status || 'Available'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {detailRental.title}
                </h3>
              </div>
              <button
                onClick={() => setDetailRental(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Main Photo Display */}
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                <img
                  src={detailRental.images[detailPhotoIdx] || detailRental.images[0]}
                  alt={detailRental.title}
                  className="w-full h-full object-cover transition-all"
                />
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm text-[11px] font-medium text-slate-200 border border-slate-700">
                  Photo {detailPhotoIdx + 1} of {detailRental.images.length}
                </div>
              </div>

              {/* Photo Thumbnails Carousel */}
              {detailRental.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {detailRental.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDetailPhotoIdx(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        detailPhotoIdx === idx
                          ? 'border-purple-500 ring-2 ring-purple-500/30'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Verification status disclosure */}
              {detailRental.isVerifiedPartner ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <strong>Verified PSAS Accommodation Partner:</strong> Tenancy agreement terms and physical premise standards have been verified with campus student welfare records.
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <strong>Unverified Private Listing:</strong> This accommodation has not undergone PSAS safety audit. Always visit the premise with fellow classmates and never transfer full deposits without a signed lease.
                  </div>
                </div>
              )}

              {/* Info grid */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Address / Location:</span>
                  <span className="text-right text-slate-200">{detailRental.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Distance to PSAS Gate:</span>
                  <span className="font-semibold text-cyan-300">{detailRental.distanceToCampus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Available From:</span>
                  <span className="text-slate-200">{detailRental.availableFrom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Owner / Master Tenant:</span>
                  <span className="font-semibold text-white">
                    {detailRental.landlordName} ({detailRental.landlordPhone})
                  </span>
                </div>
                {detailRental.houseRules && (
                  <div className="pt-1 border-t border-slate-800/80 flex justify-between">
                    <span className="text-slate-400">House Rules:</span>
                    <span className="text-right text-slate-300 max-w-xs">{detailRental.houseRules}</span>
                  </div>
                )}
              </div>

              {/* Facilities tags */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Included Facilities & Utilities
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailRental.facilities.map((fac) => (
                    <span
                      key={fac}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200"
                    >
                      ✓ {fac}
                    </span>
                  ))}
                  {detailRental.utilitiesIncluded && (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold">
                      ⚡ Bil Api & Air Termasuk
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Price & WhatsApp / Viewing CTA */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400">
                    Deposit: RM {detailRental.deposit}
                  </span>
                  <span className="text-xl font-bold text-purple-400 font-mono block">
                    RM {detailRental.pricePerMonth}
                    <span className="text-xs text-slate-400 font-normal"> / month</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={makeWhatsAppLink(
                      detailRental.landlordPhone,
                      `Salam En/Puan ${detailRental.landlordName}, saya berminat dengan sewaan ${detailRental.title} di ${detailRental.locationArea}. Masih ada kekosongan lagi ke?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Owner</span>
                  </a>

                  <button
                    onClick={() => {
                      setEnquiryRental(detailRental);
                      setDetailRental(null);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md transition-colors"
                  >
                    Schedule Viewing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: STUDENT SCHEDULE VIEWING ================= */}
      {enquiryRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0E1628] border border-purple-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Schedule Room Viewing
                </h3>
                <p className="text-xs text-purple-300 truncate max-w-xs mt-0.5">
                  {enquiryRental.title}
                </p>
              </div>
              <button
                onClick={() => setEnquiryRental(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEnquiry} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Move-in Date
                  </label>
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Message / Availability for Viewing
                </label>
                <textarea
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  rows={3}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEnquiryRental(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
