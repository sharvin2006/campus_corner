import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_EMERGENCY_CONTACTS } from '../data/initialData';
import { translations } from '../data/translations';
import {
  AlertOctagon,
  X,
  PhoneCall,
  ShieldAlert,
  MapPin,
  CheckCircle,
  AlertTriangle,
  History,
  Info
} from 'lucide-react';
import { SosAlertRecord } from '../types';
import { ImageUploader } from './ImageUploader';

export const SosModal: React.FC = () => {
  const {
    isSosModalOpen,
    setIsSosModalOpen,
    language,
    recordDemoSos,
    sosRecords,
    user
  } = useApp();

  const [category, setCategory] = useState<SosAlertRecord['category']>('Campus Security & Harassment');
  const [location, setLocation] = useState('Kolej Kediaman Siswa Blok Kenanga');
  const [description, setDescription] = useState('');
  const [incidentImage, setIncidentImage] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<SosAlertRecord | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  if (!isSosModalOpen) return null;

  const t = translations[language];

  const psasLocations = [
    'Kolej Kediaman Siswa (Blok Kenanga/Cempaka)',
    'Kolej Kediaman Siswi (Blok Mawar/Melati)',
    'Perpustakaan PSAS / Dataran Ilmu',
    'Blok Jabatan Kejuruteraan Elektrik (JKE)',
    'Blok Jabatan Teknologi Maklumat (JTMK)',
    'Blok Jabatan Kejuruteraan Mekanikal (JKM)',
    'Blok Jabatan Perdagangan (JP)',
    'Kafeteria Utama Siswa PSAS',
    'Pusat Islam & Surau PSAS',
    'Pintu Gerbang Utama / Pondok Pengawal',
    'Laluan Berbumbung Pejalan Kaki',
    'Padang Bola / Kompleks Sukan PSAS',
    'Luar Kampus: Taman Behrang 2020'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordDemoSos(category, location, description, incidentImage);
    setSubmittedRecord({
      id: 'demo_' + Date.now(),
      category,
      location,
      description,
      timestamp: new Date().toLocaleString(),
      status: 'Demo Alert Recorded (No live dispatch)',
      callerName: user.name,
      callerMatrix: user.matrixNo,
      image: incidentImage,
    });
    setDescription('');
    setIncidentImage('');
  };

  const handleClose = () => {
    setIsSosModalOpen(false);
    setSubmittedRecord(null);
    setShowHistory(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0D1527] border border-red-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {t.sos.title}
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DEMO MODE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Politeknik Sultan Azlan Shah • Behrang Stesen, Perak
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Prominent Demo Mode Disclaimer Banner */}
        <div className="mb-5 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 font-semibold uppercase block mb-0.5">
              Strict Demonstration Safety Protocol:
            </strong>
            {t.sos.disclaimer}
          </div>
        </div>

        {submittedRecord ? (
          /* Confirmation Screen after Submission */
          <div className="p-6 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Demo Incident Record Created
              </h3>
              <p className="text-xs text-emerald-300 font-medium mt-1">
                “Demo alert recorded — no emergency service has been contacted.”
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 text-left text-xs space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Incident Category:</span>
                <span className="font-semibold text-white">{submittedRecord.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PSAS Location:</span>
                <span className="font-semibold text-white">{submittedRecord.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{submittedRecord.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">System Dispatch:</span>
                <span className="text-amber-400 font-mono">SIMULATED (NO OUTBOUND DISPATCH)</span>
              </div>
              {submittedRecord.image && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block mb-1.5">Attached Incident Photo:</span>
                  <div className="aspect-video w-full max-h-48 rounded-lg overflow-hidden border border-slate-700 bg-black">
                    <img src={submittedRecord.image} alt="Incident location" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubmittedRecord(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Log Another Demo Alert
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors"
              >
                Close Emergency Center
              </button>
            </div>
          </div>
        ) : showHistory ? (
          /* Demo Log View */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                Recorded Demo SOS Incidents ({sosRecords.length})
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-cyan-400 hover:underline"
              >
                ← Back to SOS Form
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {sosRecords.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  No demo incidents recorded in this session.
                </p>
              ) : (
                sosRecords.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-red-300">{item.category}</span>
                      <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                    </div>
                    <div className="text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {item.location}
                    </div>
                    {item.description && (
                      <p className="text-slate-400 italic text-[11px] mt-0.5">
                        "{item.description}"
                      </p>
                    )}
                    {item.image && (
                      <div className="mt-1.5 w-24 h-16 rounded-md overflow-hidden border border-slate-800 bg-slate-950">
                        <img src={item.image} alt="Incident" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="text-[10px] text-amber-400/90 font-mono mt-1">
                      Status: {item.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* SOS Dispatch Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                1. Select Emergency Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Campus Security & Harassment',
                  'Medical Emergency',
                  'Accident & Fire',
                  'Dangerous Facility Defect',
                  'Night Escort Request',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat as SosAlertRecord['category'])}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                      category === cat
                        ? 'bg-red-950/60 border-red-500 text-red-200 font-semibold shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <ShieldAlert
                      className={`w-4 h-4 shrink-0 ${
                        category === cat ? 'text-red-400' : 'text-slate-500'
                      }`}
                    />
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                2. Exact PSAS Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                {psasLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                3. Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="E.g., Broken lights, smoke noticed, suspected intruder near block..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div>
              <ImageUploader
                value={incidentImage}
                onChange={setIncidentImage}
                label="4. Incident Location Image (Optional)"
                aspect="video"
                samplePresets={[
                  { name: 'Blocked Walkway', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80' },
                  { name: 'Broken Light/Wire', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80' },
                  { name: 'Spill / Hazard', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80' }
                ]}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowHistory(true)}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                View Demo Alert History ({sosRecords.length})
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-xs font-bold text-white shadow-lg shadow-red-900/40 flex items-center gap-2 transition-all"
              >
                <AlertOctagon className="w-4 h-4" />
                {t.actions.submitSos}
              </button>
            </div>
          </form>
        )}

        {/* Official PSAS Emergency Contacts (Configurable Reference) */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
            {t.sos.contactsHeading}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CAMPUS_EMERGENCY_CONTACTS.slice(0, 4).map((c, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-200">{c.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{c.description}</div>
                </div>
                <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="font-mono text-cyan-400 font-semibold">{c.phone}</span>
                  <span className="text-[10px] text-slate-400">{c.hours}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center italic">
            For life-threatening emergencies in Malaysia outside this demonstration prototype, always dial 999 directly.
          </p>
        </div>
      </div>
    </div>
  );
};
