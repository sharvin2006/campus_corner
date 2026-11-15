import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyResource, TutoringRequest } from '../types';
import { translations } from '../data/translations';
import { ImageUploader } from '../components/ImageUploader';
import { StudyAiChatModal } from '../components/StudyAiChatModal';
import {
  BookOpen,
  GraduationCap,
  Users,
  Download,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Star,
  FileText,
  X,
  Send,
  Sparkles,
  Layers,
  Plus,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Phone,
  MessageCircle,
  Check,
  ExternalLink,
  Eye,
  BookMarked,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Tag,
  Share2
} from 'lucide-react';

const PRESET_ACADEMIC_PHOTOS = [
  {
    name: 'Programming & C++ Code Notes',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Engineering Formula & Math Sheet',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Electronics Circuit Diagram Notes',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'CAD SolidWorks 3D Drafting',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'PSAS Library Study & Tutor Group',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Exam Past Year Solved Pack',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
  },
];

const COMMON_DEPARTMENTS: StudyResource['department'][] = ['JTMK', 'JKE', 'JKM', 'JP', 'JPA'];

export const StudyScreen: React.FC = () => {
  const {
    studyResources,
    tutoringRequests,
    requestTutoring,
    downloadResource,
    postStudyResource,
    updateStudyResource,
    deleteStudyResource,
    updateTutoringRequestStatus,
    language,
    user,
  } = useApp();

  const t = translations[language];

  // Navigation tab inside Study Hub
  const [activeTab, setActiveTab] = useState<'browse' | 'my_hub' | 'my_bookings'>('browse');

  // Filters for Browse
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

  // Modals & Active Viewers
  const [selectedResource, setSelectedResource] = useState<StudyResource | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [bookingResource, setBookingResource] = useState<StudyResource | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<StudyResource | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);

  // Tutoring Booking Request State
  const [topicInput, setTopicInput] = useState('Thévenin Theorem & AC Circuit Analysis');
  const [preferredTime, setPreferredTime] = useState('2026-10-18 20:00 (Perpustakaan PSAS)');
  const [contactInput, setContactInput] = useState(user.phone || '+60 12-345 6789');

  // Post / Edit Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDept, setFormDept] = useState<StudyResource['department']>('JTMK');
  const [formCourseCode, setFormCourseCode] = useState('DFC20113');
  const [formResourceType, setFormResourceType] = useState<StudyResource['resourceType']>('Past Year Papers');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formAuthorName, setFormAuthorName] = useState(user.name);
  const [formAuthorSemester, setFormAuthorSemester] = useState(`Semester ${user.semester || '4'}`);
  const [formAuthorPhone, setFormAuthorPhone] = useState(user.phone || '+60 12-345 6789');
  const [formDescription, setFormDescription] = useState('');
  const [formAvailability, setFormAvailability] = useState('Isnin & Rabu (8:00 PM - 10:00 PM), Perpustakaan PSAS');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<NonNullable<StudyResource['status']>>('Available');
  const [formAcademicTerm, setFormAcademicTerm] = useState('Sesi II 2025/2026');
  const [formTutoringMode, setFormTutoringMode] = useState<NonNullable<StudyResource['tutoringMode']>>('Physical (Library/Cafe)');
  const [formAttachmentName, setFormAttachmentName] = useState('DFC20113_Revision_Kit.pdf');
  const [formTopicTag, setFormTopicTag] = useState('');
  const [formKeyTopics, setFormKeyTopics] = useState<string[]>(['Exam Solved', 'Past Year Q&A']);

  const departments = ['All', 'JTMK', 'JKE', 'JKM', 'JP', 'JPA'];
  const resourceTypes = ['All', 'Past Year Papers', 'Lecture Notes', 'Peer Tutoring', 'Skill Exchange'];

  // Identify resources posted by current user
  const myResources = studyResources.filter(
    (res) => res.authorId === user.id || res.authorOrTutor.includes(user.name) || res.authorOrTutor.includes('(You)')
  );

  // Incoming requests for my tutoring posts
  const myIncomingRequests = tutoringRequests.filter(
    (req) => req.tutorId === user.id || req.tutorName.includes(user.name) || req.tutorName.includes('(You)')
  );

  // Requests made by current user to other tutors
  const myBookedSessions = tutoringRequests.filter(
    (req) => req.studentName === user.name || req.studentContact === user.phone
  );

  // Filtered resources for Browse tab
  const filteredResources = studyResources.filter((res) => {
    const matchesDept = selectedDept === 'All' || res.department === selectedDept;
    const matchesType = selectedType === 'All' || res.resourceType === selectedType;
    const matchesStatus =
      selectedStatusFilter === 'All' ||
      (res.status || 'Available') === selectedStatusFilter;

    const matchesPrice =
      priceFilter === 'all'
        ? true
        : priceFilter === 'free'
        ? res.price === 0
        : res.price > 0;

    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.authorOrTutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.keyTopics && res.keyTopics.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesDept && matchesType && matchesStatus && matchesPrice && matchesSearch;
  });

  // Open Post Modal (New)
  const handleOpenNewPost = () => {
    setEditingResource(null);
    setFormTitle('');
    setFormDept('JTMK');
    setFormCourseCode('DFC20113');
    setFormResourceType('Past Year Papers');
    setFormPrice(0);
    setFormAuthorName(user.name);
    setFormAuthorSemester(`Semester ${user.semester || '4'}`);
    setFormAuthorPhone(user.phone || '+60 12-345 6789');
    setFormDescription('Comprehensive chapter revision notes with worked step-by-step exam answers and diagram solutions.');
    setFormAvailability('Isnin & Rabu (8:00 PM - 10:00 PM), Perpustakaan PSAS');
    setFormImages([PRESET_ACADEMIC_PHOTOS[0].url]);
    setFormStatus('Available');
    setFormAcademicTerm('Sesi II 2025/2026');
    setFormTutoringMode('Physical (Library/Cafe)');
    setFormAttachmentName('DFC20113_Revision_Pack.pdf');
    setFormKeyTopics(['Past Year Solved', 'Chapter Summary', 'Formula Cheatsheet']);
    setIsPostModalOpen(true);
  };

  // Open Edit Modal (Existing)
  const handleOpenEditPost = (resource: StudyResource) => {
    setEditingResource(resource);
    setFormTitle(resource.title);
    setFormDept(resource.department);
    setFormCourseCode(resource.courseCode);
    setFormResourceType(resource.resourceType);
    setFormPrice(resource.price);
    setFormAuthorName(resource.authorOrTutor);
    setFormAuthorSemester(resource.authorSemester);
    setFormAuthorPhone(resource.authorPhone || user.phone || '');
    setFormDescription(resource.description);
    setFormAvailability(resource.availabilitySchedule || '');
    setFormImages(resource.images && resource.images.length > 0 ? resource.images : [resource.coverImage || PRESET_ACADEMIC_PHOTOS[0].url]);
    setFormStatus(resource.status || 'Available');
    setFormAcademicTerm(resource.academicTerm || 'Sesi II 2025/2026');
    setFormTutoringMode(resource.tutoringMode || 'Physical (Library/Cafe)');
    setFormAttachmentName(resource.fileAttachmentName || `${resource.courseCode}_Notes.pdf`);
    setFormKeyTopics(resource.keyTopics || ['Revision', 'Exam']);
    setIsPostModalOpen(true);
  };

  // Add / Remove Key Topics
  const handleAddTopicTag = () => {
    if (formTopicTag.trim() && !formKeyTopics.includes(formTopicTag.trim())) {
      setFormKeyTopics([...formKeyTopics, formTopicTag.trim()]);
      setFormTopicTag('');
    }
  };

  const handleRemoveTopicTag = (tag: string) => {
    setFormKeyTopics(formKeyTopics.filter((t) => t !== tag));
  };

  // Submit Post / Update Form
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImages = formImages.length > 0 ? formImages : [PRESET_ACADEMIC_PHOTOS[0].url];
    const finalCover = finalImages[0];

    if (editingResource) {
      updateStudyResource(editingResource.id, {
        title: formTitle,
        department: formDept,
        courseCode: formCourseCode.toUpperCase().trim(),
        resourceType: formResourceType,
        price: Number(formPrice),
        authorOrTutor: formAuthorName,
        authorSemester: formAuthorSemester,
        authorPhone: formAuthorPhone,
        description: formDescription,
        availabilitySchedule: formAvailability,
        images: finalImages,
        coverImage: finalCover,
        status: formStatus,
        academicTerm: formAcademicTerm,
        tutoringMode: formTutoringMode,
        fileAttachmentName: formAttachmentName,
        keyTopics: formKeyTopics,
      });
    } else {
      postStudyResource({
        title: formTitle,
        department: formDept,
        courseCode: formCourseCode.toUpperCase().trim(),
        resourceType: formResourceType,
        price: Number(formPrice),
        authorOrTutor: formAuthorName,
        authorSemester: formAuthorSemester,
        authorPhone: formAuthorPhone,
        authorId: user.id,
        description: formDescription,
        availabilitySchedule: formAvailability,
        images: finalImages,
        coverImage: finalCover,
        status: formStatus,
        academicTerm: formAcademicTerm,
        tutoringMode: formTutoringMode,
        fileAttachmentName: formAttachmentName,
        keyTopics: formKeyTopics,
      });
    }

    setIsPostModalOpen(false);
  };

  // Quick Toggle Status
  const handleToggleStatus = (resource: StudyResource) => {
    const nextStatus = resource.status === 'Available' ? 'Fully Booked' : 'Available';
    updateStudyResource(resource.id, { status: nextStatus });
  };

  // Tutoring Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingResource) return;
    requestTutoring(bookingResource.id, topicInput, preferredTime, contactInput);
    setBookingResource(null);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1E26] to-[#0A1622] border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Politeknik Sultan Azlan Shah (PSAS)
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Academic Exchange & Peer Network
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <BookOpen className="w-7 h-7 text-emerald-400 shrink-0" />
              Academic Resources & Peer Tutoring
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Explore past semester exam solutions, formula summaries, lab cheat sheets, or connect with top-scoring senior student peer tutors. Contribute your own materials or register as a tutor with image uploads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <button
              type="button"
              onClick={() => setIsAiChatOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-950/40 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'bm' ? 'Tanya AI' : 'Ask an AI'}</span>
            </button>

            <button
              onClick={handleOpenNewPost}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post Material / Offer Tutoring</span>
            </button>

            <button
              onClick={() => setActiveTab('my_hub')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>My Tutor Hub ({myResources.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'browse'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>Browse All Resources ({studyResources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_hub')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'my_hub'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>My Posts & Tutor Portal</span>
          {myResources.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-500/40">
              {myResources.length}
            </span>
          )}
          {myIncomingRequests.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-200 border border-amber-500/40">
              {myIncomingRequests.length} requests
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my_bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'my_bookings'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Booked Sessions ({myBookedSessions.length})</span>
        </button>
      </div>

      {/* VIEW 1: BROWSE ALL RESOURCES */}
      {activeTab === 'browse' && (
        <div className="space-y-5">
          {/* Filter Ribbon */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            {/* Department Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] text-slate-400 shrink-0 mr-1 font-semibold flex items-center gap-1">
                <Filter className="w-3 h-3 text-emerald-400" /> Dept:
              </span>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedDept === dept
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {dept === 'All' ? 'All PSAS Departments' : dept}
                </button>
              ))}
            </div>

            {/* Search, Type, Price, and Status filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search code (DFC20113, DBM10013), topic, tutor..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {resourceTypes.map((t) => (
                    <option key={t} value={t}>
                      Type: {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Pricing: All (Free & Paid)</option>
                  <option value="free">Free / Skill Exchange Only</option>
                  <option value="paid">Paid Tutoring / Material</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">Status: All Statuses</option>
                  <option value="Available">Available Only</option>
                  <option value="Fully Booked">Fully Booked</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Stats & Action Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Showing <strong>{filteredResources.length}</strong> academic resources & peer tutors available for semester revision.
              </span>
            </div>

            <button
              onClick={handleOpenNewPost}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors self-end sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Advertise Your Notes or Tutoring Slot</span>
            </button>
          </div>

          {/* Resources Cards Grid */}
          {filteredResources.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-semibold text-sm">No academic resources match your filter criteria.</p>
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                Try searching for other course codes (e.g. DFC, DBM, DEP) or be the first to post revision notes for your class!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAiChatOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-xs font-bold text-white inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'bm' ? 'Tanya AI untuk Kursus Ini' : 'Ask an AI for Help'}</span>
                </button>
                <button
                  onClick={handleOpenNewPost}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Post New Study Resource
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResources.map((res) => {
                const isTutoring = res.resourceType === 'Peer Tutoring' || res.resourceType === 'Skill Exchange';
                const isOwner = res.authorId === user.id || res.authorOrTutor.includes(user.name);
                const cover = res.coverImage || (res.images && res.images[0]) || PRESET_ACADEMIC_PHOTOS[0].url;

                return (
                  <div
                    key={res.id}
                    className="rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/40 flex flex-col justify-between overflow-hidden transition-all duration-200 group shadow-lg hover:shadow-emerald-950/20"
                  >
                    <div>
                      {/* Image Preview Banner */}
                      <div
                        onClick={() => setSelectedResource(res)}
                        className="relative h-44 bg-slate-950 cursor-pointer overflow-hidden group-hover:brightness-105 transition-all"
                      >
                        <img
                          src={cover}
                          alt={res.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                        {/* Top Chips */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm font-bold">
                            {res.department} • {res.courseCode}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-sm ${
                              res.status === 'Fully Booked'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                                : res.status === 'Closed'
                                ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {res.status || 'Available'}
                          </span>
                        </div>

                        {/* Photo count indicator */}
                        {res.images && res.images.length > 1 && (
                          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-slate-200 text-[10px] flex items-center gap-1 backdrop-blur-sm">
                            <ImageIcon className="w-3 h-3 text-emerald-400" />
                            <span>{res.images.length} photos</span>
                          </div>
                        )}

                        {/* Resource type badge */}
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-sm">
                          {res.resourceType}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 space-y-3">
                        {/* Title & Price */}
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            onClick={() => setSelectedResource(res)}
                            className="text-sm font-bold text-white hover:text-emerald-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
                          >
                            {res.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                            {res.price === 0 ? 'FREE' : `RM ${res.price.toFixed(2)}${isTutoring ? '/hr' : ''}`}
                          </span>

                          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{res.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {res.description}
                        </p>

                        {/* Key Topics / Tags */}
                        {res.keyTopics && res.keyTopics.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {res.keyTopics.slice(0, 3).map((topic, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                              >
                                #{topic}
                              </span>
                            ))}
                            {res.keyTopics.length > 3 && (
                              <span className="text-[10px] text-slate-400 self-center">
                                +{res.keyTopics.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Author Info */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1.5 truncate max-w-[190px]">
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{res.authorOrTutor}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 shrink-0">
                            {res.authorSemester}
                          </span>
                        </div>

                        {/* Tutoring schedule snippet */}
                        {res.availabilitySchedule && (
                          <div className="text-[11px] text-teal-300/90 bg-teal-950/30 p-2 rounded-lg border border-teal-500/20 truncate">
                            🕒 {res.availabilitySchedule}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 pt-0 space-y-2">
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                        <span>{res.downloadsCount} students benefited</span>

                        {isOwner && (
                          <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Your Listing
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setSelectedResource(res)}
                          className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Details</span>
                        </button>

                        {isTutoring ? (
                          <button
                            onClick={() => {
                              setBookingResource(res);
                              setTopicInput(`Session for ${res.courseCode}: Chapters revision & tutorials`);
                            }}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Book Session</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => downloadResource(res.id)}
                            className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Access Notes</span>
                          </button>
                        )}
                      </div>

                      {/* Owner quick inline controls */}
                      {isOwner && (
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleToggleStatus(res)}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3 text-emerald-400" />
                            <span>Toggle Status</span>
                          </button>
                          <span className="text-slate-700">•</span>
                          <button
                            onClick={() => handleOpenEditPost(res)}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Listing</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MY POSTS & TUTOR PORTAL */}
      {activeTab === 'my_hub' && (
        <div className="space-y-6">
          {/* Header Summary for Contributor / Tutor */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                Contributor & Peer Tutor Management Portal
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Manage your posted academic notes, update tutoring availability slots, refresh course photos, and respond to incoming booking requests from PSAS coursemates.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleOpenNewPost}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Material / Slot</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">My Active Listings</div>
              <div className="text-2xl font-black text-white mt-1">{myResources.length}</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">Notes & Tutoring posted</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Incoming Tutor Bookings</div>
              <div className="text-2xl font-black text-amber-300 mt-1">{myIncomingRequests.length}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Students awaiting confirmation</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Total Students Reached</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {myResources.reduce((acc, curr) => acc + curr.downloadsCount, 0)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Downloads & peer sessions</div>
            </div>
          </div>

          {/* Incoming Tutoring Requests Management */}
          {myIncomingRequests.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    Incoming Student Tutoring Requests ({myIncomingRequests.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Students who submitted a request for your peer tutoring sessions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {myIncomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-white">{req.studentName}</div>
                        <div className="text-xs text-emerald-400">{req.subject}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'Accepted'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : req.status === 'Completed'
                            ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                            : req.status === 'Declined'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80">
                      <div>
                        <strong className="text-slate-400 font-normal">Preferred Time & Venue:</strong>{' '}
                        <span className="text-white font-medium">{req.preferredDateTime}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 font-normal">Requested Topics:</strong>{' '}
                        <span className="text-slate-200">{req.topicsToCover}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 font-normal">Student Phone:</strong>{' '}
                        <span className="font-mono text-emerald-300">{req.studentContact}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`https://wa.me/${req.studentContact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Salam ${req.studentName}, saya mengenai permintaan tutoring PSAS untuk "${req.subject}".`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>

                      {req.status !== 'Accepted' && (
                        <button
                          onClick={() => updateTutoringRequestStatus(req.id, 'Accepted')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                        >
                          Accept Booking
                        </button>
                      )}

                      {req.status === 'Accepted' && (
                        <button
                          onClick={() => updateTutoringRequestStatus(req.id, 'Completed')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}

                      {req.status !== 'Declined' && (
                        <button
                          onClick={() => updateTutoringRequestStatus(req.id, 'Declined')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-colors"
                        >
                          Decline
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* List of User's Posts */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              My Published Resources & Tutoring Posts ({myResources.length})
            </h3>

            {myResources.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-slate-300 font-semibold text-sm">You haven't posted any study resources or tutoring slots yet.</p>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Earn extra pocket money as a peer tutor or help fellow polytechnic juniors by uploading solved past year papers.
                </p>
                <button
                  onClick={handleOpenNewPost}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Post Your First Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myResources.map((res) => {
                  const cover = res.coverImage || (res.images && res.images[0]) || PRESET_ACADEMIC_PHOTOS[0].url;

                  return (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 space-y-4 flex flex-col justify-between"
                    >
                      <div className="flex gap-3.5">
                        <img
                          src={cover}
                          alt={res.title}
                          className="w-24 h-24 rounded-xl object-cover border border-slate-800 shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-emerald-500/30 font-bold">
                              {res.department} • {res.courseCode}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                res.status === 'Fully Booked'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {res.status || 'Available'}
                            </span>
                            <span className="text-[10px] text-slate-400">{res.resourceType}</span>
                          </div>

                          <h4 className="text-sm font-bold text-white truncate">{res.title}</h4>

                          <div className="text-xs font-mono font-bold text-emerald-400">
                            {res.price === 0 ? 'FREE' : `RM ${res.price.toFixed(2)}`}
                          </div>

                          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                            <span>{res.downloadsCount} benefited</span>
                            <span>•</span>
                            <span>{res.images?.length || 1} photo(s)</span>
                          </div>
                        </div>
                      </div>

                      {/* Management Controls */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(res)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                              res.status === 'Fully Booked'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>
                              {res.status === 'Fully Booked' ? 'Set as Available' : 'Set as Fully Booked'}
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditPost(res)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Edit & Uploads</span>
                          </button>

                          <button
                            onClick={() => deleteStudyResource(res.id)}
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                            title="Delete listing"
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
          </div>
        </div>
      )}

      {/* VIEW 3: MY BOOKED SESSIONS */}
      {activeTab === 'my_bookings' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              My Booked Tutoring Sessions ({myBookedSessions.length})
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Peer tutoring requests you have sent to senior student tutors.
            </p>
          </div>

          {myBookedSessions.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-semibold text-sm">No booked tutoring sessions yet.</p>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Browse our peer tutors list and book a session to get personalized assistance with difficult subjects.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white inline-flex items-center gap-1.5"
              >
                <span>Browse Available Tutors</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBookedSessions.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-white">{req.subject}</h4>
                      <div className="text-xs text-slate-400">Tutor: <strong className="text-emerald-400">{req.tutorName}</strong></div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'Accepted'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : req.status === 'Completed'
                          ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs text-slate-300">
                    <div>
                      <strong className="text-slate-400 font-normal">Date & Location:</strong>{' '}
                      <span className="text-white font-medium">{req.preferredDateTime}</span>
                    </div>
                    <div>
                      <strong className="text-slate-400 font-normal">Topics Requested:</strong>{' '}
                      <span className="text-slate-200">{req.topicsToCover}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Submitted on: {req.createdAt}</span>
                    <span className="text-emerald-400 font-medium">Session in progress</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: POST OR UPDATE ACADEMIC RESOURCE / TUTORING */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0B1522] border border-emerald-500/40 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 my-8 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {editingResource ? 'Update Academic Listing' : 'Contribute & Advertise Hub'}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {editingResource
                    ? 'Update Study Resource or Tutoring Details'
                    : 'Post Study Material or Register as Peer Tutor'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Include photo previews of notes, past questions, or tutor profile to attract student bookings.
                </p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-5">
              {/* SECTION: Category & Type */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  1. Academic Classification
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Past Year Papers', 'Lecture Notes', 'Peer Tutoring', 'Skill Exchange'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormResourceType(type)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                        formResourceType === type
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-sm'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">PSAS Department</label>
                    <select
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      {COMMON_DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d} - Jabatan {d} PSAS
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Course / Subject Code <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formCourseCode}
                      onChange={(e) => setFormCourseCode(e.target.value)}
                      placeholder="e.g. DFC20113, DBM10013, DEP10023"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Title & Description */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  2. Listing Title & Overview
                </label>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Title / Topic Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. DFC20113 Object-Oriented Programming (C++) Exam Solved Pack"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Detailed Description & What Students Will Learn
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Outline key concepts covered (e.g. Thévenin calculations, pointers, formulas), study materials provided, or tutor qualification."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                  />
                </div>

                {/* Key Topics Tags */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Key Topics / Chapter Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={formTopicTag}
                      onChange={(e) => setFormTopicTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopicTag();
                        }
                      }}
                      placeholder="Type a topic (e.g. Polymorphism, Lab 3) and press Enter"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddTopicTag}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 rounded-xl border border-emerald-500/30"
                    >
                      Add Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {formKeyTopics.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-300 border border-slate-800 text-[11px] flex items-center gap-1.5"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTopicTag(tag)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: Image Upload Option (Up to 10 Images) */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                    3. Upload Images & Previews (Up to 10 photos)
                  </label>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    {formImages.length}/10 uploaded
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Upload cover photo, past year question snapshots, handwritten formulas, or peer tutor photos. Supports device files, camera, and quick presets.
                </p>

                <ImageUploader
                  mode="multiple"
                  values={formImages}
                  onChange={(urls) => setFormImages(urls)}
                  max={10}
                  label="Upload Academic Previews or Select Presets"
                  samplePresets={PRESET_ACADEMIC_PHOTOS}
                />
              </div>

              {/* SECTION: Pricing, Availability & Tutor Schedule */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  4. Pricing & Tutoring Availability
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Price / Rate (RM) - Enter 0 for Free
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">RM</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Listing Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Available">Available (Open for all students)</option>
                      <option value="Fully Booked">Fully Booked (Slots full)</option>
                      <option value="Closed">Closed / Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Tutoring / Study Mode</label>
                    <select
                      value={formTutoringMode}
                      onChange={(e) => setFormTutoringMode(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Physical (Library/Cafe)">Physical (Perpustakaan PSAS / Cafe Siswa)</option>
                      <option value="Online (Google Meet)">Online (Google Meet / Screen Share)</option>
                      <option value="Hybrid (Physical & Online)">Hybrid (Physical & Online)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Academic Term / Session
                    </label>
                    <input
                      type="text"
                      value={formAcademicTerm}
                      onChange={(e) => setFormAcademicTerm(e.target.value)}
                      placeholder="e.g. Sesi II 2025/2026"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Availability Schedule & Meetup Hours
                  </label>
                  <input
                    type="text"
                    value={formAvailability}
                    onChange={(e) => setFormAvailability(e.target.value)}
                    placeholder="e.g. Selasa & Khamis 8:00 PM - 10:00 PM (Perpustakaan PSAS Aras 2)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* SECTION: Author / Tutor Contact Details */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  5. Contributor & Tutor Contact
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Tutor / Author Name</label>
                    <input
                      type="text"
                      required
                      value={formAuthorName}
                      onChange={(e) => setFormAuthorName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Semester / Qualification</label>
                    <input
                      type="text"
                      required
                      value={formAuthorSemester}
                      onChange={(e) => setFormAuthorSemester(e.target.value)}
                      placeholder="e.g. Semester 4 (Dean's List)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Phone Contact</label>
                    <input
                      type="text"
                      required
                      value={formAuthorPhone}
                      onChange={(e) => setFormAuthorPhone(e.target.value)}
                      placeholder="+60 12-345 6789"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Attached Document Name (PDF / Notes reference)
                  </label>
                  <input
                    type="text"
                    value={formAttachmentName}
                    onChange={(e) => setFormAttachmentName(e.target.value)}
                    placeholder="e.g. DFC20113_Complete_Revision_Notes.pdf"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-emerald-300"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg flex items-center gap-2 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingResource ? 'Update Listing & Save' : 'Publish Resource / Tutor Slot'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESOURCE / TUTOR FULL DETAIL VIEWER */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0B1522] border border-emerald-500/40 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 my-8 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                    {selectedResource.department} • {selectedResource.courseCode}
                  </span>
                  <span className="text-xs text-slate-400">{selectedResource.resourceType}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {selectedResource.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedResource(null);
                  setActiveGalleryIndex(0);
                }}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo Gallery & Thumbnail strip */}
              {selectedResource.images && selectedResource.images.length > 0 && (
                <div className="space-y-2">
                  <div className="relative h-64 sm:h-80 rounded-2xl bg-black overflow-hidden border border-slate-800">
                    <img
                      src={selectedResource.images[activeGalleryIndex] || selectedResource.images[0]}
                      alt={selectedResource.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-slate-200 text-[10px] backdrop-blur-sm">
                      Photo {activeGalleryIndex + 1} of {selectedResource.images.length}
                    </div>
                  </div>

                  {selectedResource.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {selectedResource.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                            activeGalleryIndex === idx
                              ? 'border-emerald-500 shadow-md scale-105'
                              : 'border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Price & Rating Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <div className="text-[11px] text-slate-400">Access Fee / Tutor Rate</div>
                  <div className="text-base font-extrabold text-emerald-400 font-mono">
                    {selectedResource.price === 0
                      ? 'FREE (Skill Exchange)'
                      : `RM ${selectedResource.price.toFixed(2)}${
                          selectedResource.resourceType === 'Peer Tutoring' ? ' / hour' : ''
                        }`}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Student Rating</div>
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{selectedResource.rating.toFixed(1)} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Description & Syllabus Scope
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  {selectedResource.description}
                </p>
              </div>

              {/* Key Topics */}
              {selectedResource.keyTopics && selectedResource.keyTopics.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Topics Included
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedResource.keyTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-300 border border-slate-800 text-xs"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tutor & Contributor Info */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Contributor Profile
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-semibold">{selectedResource.authorOrTutor}</span>
                    <span className="text-slate-400">({selectedResource.authorSemester})</span>
                  </div>
                  {selectedResource.authorPhone && (
                    <a
                      href={`https://wa.me/${selectedResource.authorPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Salam ${selectedResource.authorOrTutor}, saya berminat dengan nota/tutor "${selectedResource.title}".`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Tutor</span>
                    </a>
                  )}
                </div>

                {selectedResource.availabilitySchedule && (
                  <div className="text-xs text-teal-300 bg-teal-950/40 p-2.5 rounded-lg border border-teal-500/20">
                    🕒 <strong>Availability:</strong> {selectedResource.availabilitySchedule}
                  </div>
                )}

                {selectedResource.fileAttachmentName && (
                  <div className="text-xs text-slate-300 flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Attachment: <strong>{selectedResource.fileAttachmentName}</strong></span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedResource(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Close
                </button>

                {selectedResource.resourceType === 'Peer Tutoring' || selectedResource.resourceType === 'Skill Exchange' ? (
                  <button
                    onClick={() => {
                      const res = selectedResource;
                      setSelectedResource(null);
                      setBookingResource(res);
                      setTopicInput(`Session for ${res.courseCode}: Chapters revision & tutorials`);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md flex items-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Tutoring Session</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      downloadResource(selectedResource.id);
                      setSelectedResource(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Preview & Download Notes</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BOOK TUTOR SESSION */}
      {bookingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0E1628] border border-emerald-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Request Peer Tutoring Session</h3>
                <p className="text-xs text-emerald-400 truncate max-w-xs">
                  {bookingResource.title} (with {bookingResource.authorOrTutor})
                </p>
              </div>
              <button
                onClick={() => setBookingResource(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specific Topics / Chapters to Focus On
                </label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  required
                  placeholder="e.g. Chapter 3: Calculations & Lab assignments"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Time & Campus Location
                </label>
                <input
                  type="text"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  required
                  placeholder="e.g. Thursday 8:00 PM at PSAS Library Discussion Room"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your WhatsApp / Contact Number
                </label>
                <input
                  type="text"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                Rate:{' '}
                <strong className="text-emerald-400">
                  {bookingResource.price === 0
                    ? 'Free Skill Exchange'
                    : `RM ${bookingResource.price.toFixed(2)}/hour`}
                </strong>
                . Payment settled directly upon completion of study session.
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setBookingResource(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ASK AN AI STUDY ASSISTANT */}
      <StudyAiChatModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        studyResources={studyResources}
        initialCourse={searchQuery}
        initialDepartment={selectedDept}
        userCourse={user.course}
        userDepartment={user.department}
        language={language}
        onSelectResource={(res) => {
          setActiveGalleryIndex(0);
          setSelectedResource(res);
        }}
        onBookTutor={(res) => {
          setBookingResource(res);
          setTopicInput(`Session for ${res.courseCode}: Chapters revision & tutorials`);
        }}
        onDownloadNotes={(id) => downloadResource(id)}
        onApplyCourseFilter={(courseQuery) => {
          setActiveTab('browse');
          setSearchQuery(courseQuery);
        }}
      />
    </div>
  );
};
