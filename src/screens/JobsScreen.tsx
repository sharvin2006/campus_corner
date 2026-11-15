import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CampusJob } from '../types';
import { translations } from '../data/translations';
import { ImageUploader } from '../components/ImageUploader';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  X,
  Send,
  Building,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export const JobsScreen: React.FC = () => {
  const { jobs, jobApplications, applyForJob, postJob, language, user } = useApp();
  const t = translations[language];

  // Filters
  const [selectedEmployerType, setSelectedEmployerType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [applyingJob, setApplyingJob] = useState<CampusJob | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [showMyApplications, setShowMyApplications] = useState(false);

  // Application Form
  const [pitchNote, setPitchNote] = useState('Available every Tuesday & Thursday afternoon. Experienced in customer service and POS systems.');
  const [contactPhone, setContactPhone] = useState(user.phone);

  // Post Job Form
  const [newTitle, setNewTitle] = useState('');
  const [newEmployer, setNewEmployer] = useState('');
  const [newEmployerType, setNewEmployerType] = useState<CampusJob['employerType']>('Campus Cafe Vendor');
  const [newPay, setNewPay] = useState('RM 8.50 / jam');
  const [newHours, setNewHours] = useState('12 - 15 jam / seminggu');
  const [newLocation, setNewLocation] = useState('Kafeteria Blok Kenanga PSAS');
  const [newRequirements, setNewRequirements] = useState('Pelajar aktif PSAS, berdisiplin');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-10-31');
  const [newImage, setNewImage] = useState('');

  const employerTypes = ['All', 'PSAS Koperasi', 'Campus Cafe Vendor', 'Local Behrang Business', 'Student Freelance Team'];

  const filteredJobs = jobs.filter((job) => {
    const matchesType =
      selectedEmployerType === 'All' || job.employerType === selectedEmployerType;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    applyForJob(applyingJob.id, pitchNote, contactPhone);
    setApplyingJob(null);
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postJob({
      title: newTitle,
      employer: newEmployer,
      employerType: newEmployerType,
      payRate: newPay,
      hours: newHours,
      location: newLocation,
      requirements: newRequirements.split(',').map((r) => r.trim()),
      description: newDescription,
      deadline: newDeadline,
      image: newImage || undefined,
    });
    setIsPostJobModalOpen(false);
    setNewTitle('');
    setNewEmployer('');
    setNewDescription('');
    setNewImage('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#221A0F] border border-amber-500/20 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-amber-400" />
              PSAS Campus Part-Time Job Hub
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Student-friendly part-time jobs designed around politeknik lecture timetables.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMyApplications(!showMyApplications)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              My Applications ({jobApplications.length})
            </button>
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Post Vacancy
            </button>
          </div>
        </div>
      </div>

      {/* Applications Status Drawer */}
      {showMyApplications && (
        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              My Job Applications ({jobApplications.length})
            </div>
            <button
              onClick={() => setShowMyApplications(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          {jobApplications.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2 text-center">
              You haven't submitted any job applications yet. Click "Apply Now" on any vacancy below.
            </p>
          ) : (
            <div className="space-y-2">
              {jobApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{app.jobTitle}</div>
                    <div className="text-[11px] text-slate-400">
                      {app.employer} • Applied: {app.appliedDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 font-semibold">
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job title, employer, or location..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={selectedEmployerType}
            onChange={(e) => setSelectedEmployerType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            {employerTypes.map((et) => (
              <option key={et} value={et}>
                Employer: {et}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-3.5">
        {filteredJobs.map((job) => {
          const hasApplied = jobApplications.some((a) => a.jobId === job.id);

          return (
            <div
              key={job.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
                {job.image && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img src={job.image} alt={job.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-amber-500/30">
                      {job.employerType}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {job.employer}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      · Deadline: {job.deadline}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{job.payRate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.hours}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  {job.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requirements.map((req, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-slate-300"
                        >
                          • {req}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end">
                {hasApplied ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Application Submitted
                  </span>
                ) : (
                  <button
                    onClick={() => setApplyingJob(job)}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-md transition-colors"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0E1628] border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Apply for Student Job
                </h3>
                <p className="text-xs text-amber-300 truncate max-w-xs">
                  {applyingJob.title} @ {applyingJob.employer}
                </p>
              </div>
              <button
                onClick={() => setApplyingJob(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Applicant:</span>
                  <span className="font-semibold text-white">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Matrix & Dept:</span>
                  <span className="text-cyan-300">{user.matrixNo} ({user.department})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wage:</span>
                  <span className="text-amber-300 font-bold">{applyingJob.payRate}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Availability & Brief Experience Note
                </label>
                <textarea
                  value={pitchNote}
                  onChange={(e) => setPitchNote(e.target.value)}
                  rows={3}
                  required
                  placeholder="Tell the employer your free hours and past experience..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0E1628] border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">
                Post Campus Student Vacancy
              </h3>
              <button
                onClick={() => setIsPostJobModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJobSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Title / Role
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. Pembantu Kaunter Koperasi Siswa"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Employer Name
                  </label>
                  <input
                    type="text"
                    value={newEmployer}
                    onChange={(e) => setNewEmployer(e.target.value)}
                    required
                    placeholder="e.g. Kafe Siswa Behrang Stall 2"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Employer Category
                  </label>
                  <select
                    value={newEmployerType}
                    onChange={(e) => setNewEmployerType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                  >
                    <option value="PSAS Koperasi">PSAS Koperasi</option>
                    <option value="Campus Cafe Vendor">Campus Cafe Vendor</option>
                    <option value="Local Behrang Business">Local Behrang Business</option>
                    <option value="Student Freelance Team">Student Freelance Team</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pay Rate
                  </label>
                  <input
                    type="text"
                    value={newPay}
                    onChange={(e) => setNewPay(e.target.value)}
                    required
                    placeholder="e.g. RM 8.50 / jam"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    required
                    placeholder="e.g. 12-16 jam seminggu"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Deadline Date
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Requirements (comma separated)
                </label>
                <input
                  type="text"
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  placeholder="e.g. Pelajar aktif PSAS, Suntikan Typhoid, Peramah"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Description & Scope
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  required
                  placeholder="Explain tasks and benefits..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                />
              </div>

              <div>
                <ImageUploader
                  value={newImage}
                  onChange={setNewImage}
                  label="Recruitment Banner / Flyer Image (Optional)"
                  aspect="video"
                  samplePresets={[
                    { name: 'Koperasi Flyer', url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Cafe Banner', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Media Crew', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80' }
                  ]}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
