import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UtilityItem, UtilityType } from '../types';
import { translations } from '../data/translations';
import { InteractiveCampusMap } from '../components/InteractiveCampusMap';
import {
  Layers,
  Repeat,
  HelpCircle,
  Car,
  Compass,
  Plus,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  Users,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const UtilitiesScreen: React.FC = () => {
  const { utilities, addUtilityItem, reserveCarpoolSeat, language, user } = useApp();
  const t = translations[language];

  const [activeSubTab, setActiveSubTab] = useState<UtilityType | 'campus_map'>('campus_map');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Common Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState(user.name);
  const [contactPhone, setContactPhone] = useState(user.phone);

  // Borrow specific
  const [borrowFee, setBorrowFee] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(20);
  const [maxDuration, setMaxDuration] = useState('3 hari');

  // Lost & Found specific
  const [statusFound, setStatusFound] = useState<'lost' | 'found'>('lost');
  const [locationPin, setLocationPin] = useState('Perpustakaan PSAS Aras 1');
  const [claimInstruction, setClaimInstruction] = useState('Sila bawa bukti pemilikan untuk menuntut.');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80');

  // Carpool specific
  const [routeFrom, setRouteFrom] = useState('Pintu Utama PSAS Behrang');
  const [routeTo, setRouteTo] = useState('Stesen KTM Tanjung Malim');
  const [departureDate, setDepartureDate] = useState('Jumaat, 17 Okt 2026');
  const [departureTime, setDepartureTime] = useState('4:30 PM');
  const [availableSeats, setAvailableSeats] = useState<number>(3);
  const [fareContribution, setFareContribution] = useState<number>(5);

  const filteredItems = utilities.filter((u) => u.type === activeSubTab);

  const handleOpenPostModal = (type: UtilityType) => {
    setActiveSubTab(type);
    setTitle('');
    setDescription('');
    setIsPostModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSubTab === 'borrow') {
      addUtilityItem({
        type: 'borrow',
        title,
        description,
        contactName,
        contactPhone,
        borrowFee,
        depositAmount,
        maxDuration,
      });
    } else if (activeSubTab === 'lost_found') {
      addUtilityItem({
        type: 'lost_found',
        title,
        description,
        contactName,
        contactPhone,
        statusFound,
        locationPin,
        claimInstruction,
        image,
      });
    } else if (activeSubTab === 'carpool') {
      addUtilityItem({
        type: 'carpool',
        title: title || `Kongsi Kereta: ${routeFrom} ➔ ${routeTo}`,
        description,
        contactName,
        contactPhone,
        routeFrom,
        routeTo,
        departureDate,
        departureTime,
        availableSeats,
        fareContribution,
      });
    }
    setIsPostModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#101F38] border border-blue-500/20 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-400" />
              PSAS Campus Utilities Hub
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Short-term peer borrowing, campus lost & found board, and safe student carpooling to KTM and hometowns.
            </p>
          </div>

          {activeSubTab !== 'campus_map' ? (
            <button
              onClick={() => handleOpenPostModal(activeSubTab as UtilityType)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {activeSubTab === 'carpool'
                ? 'Offer Carpool Ride'
                : activeSubTab === 'borrow'
                ? 'Request / Lend Item'
                : 'Post Lost & Found'}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="https://www.psasmartcampus.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Live Portal</span>
                <span className="text-[10px] font-mono">↗</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Segmented Sub Tabs */}
      <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('campus_map')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'campus_map'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-300" />
          <span>Interactive Campus Map (iMAP)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-200 text-[10px] border border-cyan-500/30">
            PSAS
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('carpool')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'carpool'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Carpool Share</span>
        </button>

        <button
          onClick={() => setActiveSubTab('borrow')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'borrow'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>Borrow & Rent</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lost_found')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'lost_found'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Lost & Found</span>
        </button>
      </div>

      {/* Content for Interactive Campus Map */}
      {activeSubTab === 'campus_map' && (
        <div className="space-y-4">
          <InteractiveCampusMap
            language={language}
            onSelectPickupPoint={(locationName) => {
              setLocationPin(locationName);
              setActiveSubTab('lost_found');
            }}
          />
        </div>
      )}

      {/* Content for Carpool */}
      {activeSubTab === 'carpool' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/30 flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                      PSAS Student Ride
                    </span>
                    <span className="text-sm font-extrabold text-cyan-400 font-mono">
                      RM {item.fareContribution?.toFixed(2)} / seat
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <span className="text-slate-300">{item.routeFrom}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-cyan-300">{item.routeTo}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.departureDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.departureTime}</span>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                      "{item.description}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <div className="font-semibold text-white">{item.contactName}</div>
                    <div className="text-[11px] text-slate-400">{item.contactPhone}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        (item.availableSeats || 0) > 0
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {item.availableSeats} seat{(item.availableSeats || 0) !== 1 ? 's' : ''} left
                    </span>

                    <button
                      onClick={() => reserveCarpoolSeat(item.id)}
                      disabled={(item.availableSeats || 0) <= 0}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-xs font-bold text-white transition-colors"
                    >
                      Reserve Seat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content for Borrow & Rent */}
      {activeSubTab === 'borrow' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-cyan-500/30">
                    Peer Equipment Borrow
                  </span>
                  <span className="text-xs font-bold text-cyan-400">
                    {item.borrowFee === 0 ? 'FREE BORROW' : `RM ${item.borrowFee} / day`}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{item.title}</h3>

                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div>Max Duration: <strong className="text-white">{item.maxDuration}</strong></div>
                  <div>Refundable Deposit: <strong className="text-white">RM {item.depositAmount}</strong></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-semibold text-white">{item.contactName}</div>
                  <div className="text-[11px] text-slate-400">{item.contactPhone}</div>
                </div>
                <button
                  onClick={() => alert(`Contacting ${item.contactName} at ${item.contactPhone} for borrowing arrangement.`)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
                >
                  Contact Lender
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content for Lost & Found */}
      {activeSubTab === 'lost_found' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.statusFound === 'found'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {item.statusFound === 'found' ? 'FOUND / DIJUMPAI' : 'LOST / HILANG'}
                  </span>
                  <span className="text-[10px] text-slate-500">{item.createdAt}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{item.title}</h3>

                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Location: <strong className="text-white">{item.locationPin}</strong></span>
                  </div>
                  <div>Claim Note: <span className="text-slate-300">{item.claimInstruction}</span></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-semibold text-white">{item.contactName}</div>
                  <div className="text-[11px] text-slate-400">{item.contactPhone}</div>
                </div>
                <button
                  onClick={() => alert(`Contacting ${item.contactName} at ${item.contactPhone} regarding lost/found item claim.`)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                >
                  Contact / Claim
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0E1628] border border-blue-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white capitalize">
                Post {activeSubTab.replace('_', ' & ')} Notice
              </h3>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {activeSubTab === 'carpool' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Departure Location
                      </label>
                      <input
                        type="text"
                        value={routeFrom}
                        onChange={(e) => setRouteFrom(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Destination
                      </label>
                      <input
                        type="text"
                        value={routeTo}
                        onChange={(e) => setRouteTo(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Date
                      </label>
                      <input
                        type="text"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Available Seats
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(Number(e.target.value))}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Contribution (RM/seat)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={fareContribution}
                        onChange={(e) => setFareContribution(Number(e.target.value))}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </>
              ) : activeSubTab === 'lost_found' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Status
                    </label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-slate-300">
                        <input
                          type="radio"
                          name="statusFound"
                          checked={statusFound === 'lost'}
                          onChange={() => setStatusFound('lost')}
                        />
                        Lost (Saya Kehilangan Barang)
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-300">
                        <input
                          type="radio"
                          name="statusFound"
                          checked={statusFound === 'found'}
                          onChange={() => setStatusFound('found')}
                        />
                        Found (Saya Terjumpa Barang)
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g. Kad Matrik PSAS, Kunci Motosikal Yamaha"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Location Found / Lost
                    </label>
                    <input
                      type="text"
                      value={locationPin}
                      onChange={(e) => setLocationPin(e.target.value)}
                      required
                      placeholder="e.g. Meja Kafe Blok Kenanga"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Claim Instructions
                    </label>
                    <input
                      type="text"
                      value={claimInstruction}
                      onChange={(e) => setClaimInstruction(e.target.value)}
                      required
                      placeholder="e.g. Sila hubungi saya dan nyatakan ciri dompet"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </>
              ) : (
                /* Borrow */
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Item to Borrow / Lend
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g. DSLR Camera untuk video assignment"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Borrow Fee (0 if Free)
                      </label>
                      <input
                        type="number"
                        value={borrowFee}
                        onChange={(e) => setBorrowFee(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Security Deposit (RM)
                      </label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description & Details
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  required
                  placeholder="Additional details..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
