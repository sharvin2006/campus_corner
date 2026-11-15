export interface AcademicEvent {
  id: string;
  title: string;
  titleBm: string;
  category: 'exam' | 'break' | 'event' | 'academic' | 'deadline';
  categoryLabel: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  dateDisplay: string;
  description: string;
  descriptionBm: string;
  location?: string;
  targetAudience: string;
  priority: 'high' | 'medium' | 'normal';
  countdownDays?: number; // Calculated dynamically relative to reference Oct 2026
}

export const PSAS_ACADEMIC_CALENDAR_EVENTS: AcademicEvent[] = [
  {
    id: 'cal_midterm_eval',
    title: 'Penilaian Kerja Kursus & Ujian Pertengahan Semester (Mid-Term Week)',
    titleBm: 'Penilaian Kerja Kursus & Ujian Pertengahan Semester',
    category: 'exam',
    categoryLabel: 'Exams & Quizzes',
    startDate: '2026-10-12',
    endDate: '2026-10-16',
    dateDisplay: '12 - 16 Okt 2026',
    description: 'Penilaian Ujian 1 & Kuiz bertulis untuk kursus Kejuruteraan (JKE/JKM), Pengkomputeran (JTMK) dan Perdagangan (JP).',
    descriptionBm: 'Penilaian Ujian 1 & Kuiz bertulis untuk kursus Kejuruteraan (JKE/JKM), Pengkomputeran (JTMK) dan Perdagangan (JP).',
    location: 'Dewan Kuliah DK1/DK2 & Bilik Kuliah Jabatan',
    targetAudience: 'Semua Pelajar Diploma Semester 1 - 5',
    priority: 'high'
  },
  {
    id: 'cal_fyp_showcase',
    title: 'Minggu Inovasi & Pameran Projek Tahun Akhir (FYP Showcase Sesi II)',
    titleBm: 'Pameran Projek Tahun Akhir (FYP Showcase)',
    category: 'event',
    categoryLabel: 'Campus Event',
    startDate: '2026-10-14',
    endDate: '2026-10-16',
    dateDisplay: '14 - 16 Okt 2026',
    description: 'Pameran prototaip kejuruteraan, demonstrasi perisian IoT, dan pembentangan panel penilai industri untuk pelajar diploma tahun akhir.',
    descriptionBm: 'Pameran prototaip kejuruteraan, demonstrasi perisian IoT, dan pembentangan panel penilai industri untuk pelajar diploma tahun akhir.',
    location: 'Dewan Muadzam Shah (DMS), PSAS',
    targetAudience: 'Pelajar Semester Akhir & Penilai Industri',
    priority: 'high'
  },
  {
    id: 'cal_hostel_reg',
    title: 'Pendaftaran Permohonan Asrama Kolej Kediaman Sesi Hadapan',
    titleBm: 'Pendaftaran Kolej Kediaman (Hostel Booking)',
    category: 'deadline',
    categoryLabel: 'Important Deadline',
    startDate: '2026-10-20',
    endDate: '2026-10-25',
    dateDisplay: '20 - 25 Okt 2026',
    description: 'Permohonan penempatan Kamsis Siswa/Siswi secara atas talian melalui SPMP PSAS. Pelajar disaran semak direktori sewa luar kampus jika kuota penuh.',
    descriptionBm: 'Permohonan penempatan Kamsis Siswa/Siswi secara atas talian melalui SPMP PSAS. Pelajar disaran semak direktori sewa luar kampus jika kuota penuh.',
    location: 'Portal Pelajar SPMP PSAS',
    targetAudience: 'Pelajar Semester 2 - 5',
    priority: 'medium'
  },
  {
    id: 'cal_deepavali_break',
    title: 'Cuti Perayaan Deepavali & Cuti Pertengahan Semester',
    titleBm: 'Cuti Perayaan Deepavali & Mid-Sem Break',
    category: 'break',
    categoryLabel: 'Semester Break',
    startDate: '2026-10-31',
    endDate: '2026-11-04',
    dateDisplay: '31 Okt - 04 Nov 2026',
    description: 'Cuti umum perayaan Deepavali dan pelepasan kuliah pertengahan semester. Pelajar boleh menggunakan carpool share ke Stesen KTM Tanjung Malim.',
    descriptionBm: 'Cuti umum perayaan Deepavali dan pelepasan kuliah pertengahan semester. Pelajar boleh menggunakan carpool share ke Stesen KTM Tanjung Malim.',
    location: 'Seluruh Kampus PSAS',
    targetAudience: 'Semua Warga PSAS',
    priority: 'medium'
  },
  {
    id: 'cal_coursework_submission',
    title: 'Tarikh Akhir Penyerahan Tugasan Kursus & Laporan Makmal',
    titleBm: 'Tarikh Akhir Penyerahan Tugasan (Coursework Deadline)',
    category: 'deadline',
    categoryLabel: 'Important Deadline',
    startDate: '2026-11-20',
    dateDisplay: '20 Nov 2026 (5:00 PM)',
    description: 'Penyerahan akhir 100% markah kerja kursus bagi semua subjek teknikal sebelum minggu ulangkaji bermula.',
    descriptionBm: 'Penyerahan akhir 100% markah kerja kursus bagi semua subjek teknikal sebelum minggu ulangkaji bermula.',
    location: 'Bilik Pensyarah / Portal CIDOS PSAS',
    targetAudience: 'Semua Pelajar Diploma',
    priority: 'high'
  },
  {
    id: 'cal_study_week',
    title: 'Minggu Ulangkaji Berpusat (Revision / Study Week)',
    titleBm: 'Minggu Ulangkaji Berpusat (Study Week)',
    category: 'academic',
    categoryLabel: 'Academic Schedule',
    startDate: '2026-11-23',
    endDate: '2026-11-27',
    dateDisplay: '23 - 27 Nov 2026',
    description: 'Tiada kelas kuliah formal. Perpustakaan PSAS dibuka lanjutan sehingga 11:00 PM untuk sesi kaji selidik persediaan peperiksaan.',
    descriptionBm: 'Tiada kelas kuliah formal. Perpustakaan PSAS dibuka lanjutan sehingga 11:00 PM untuk sesi kaji selidik persediaan peperiksaan.',
    location: 'Perpustakaan PSAS & Bilik Diskusi',
    targetAudience: 'Semua Pelajar Diploma',
    priority: 'medium'
  },
  {
    id: 'cal_final_exam',
    title: 'Peperiksaan Akhir Semester Sesi II 2026 (Final Examination Period)',
    titleBm: 'Peperiksaan Akhir Sesi II 2026 (Final Exam)',
    category: 'exam',
    categoryLabel: 'Exams & Quizzes',
    startDate: '2026-11-30',
    endDate: '2026-12-18',
    dateDisplay: '30 Nov - 18 Dis 2026',
    description: 'Peperiksaan bertulis rasmi Politeknik Malaysia. Slip menduduki peperiksaan (dijana dari SPMP) wajib dibawa bersama kad matrik fizikal.',
    descriptionBm: 'Peperiksaan bertulis rasmi Politeknik Malaysia. Slip menduduki peperiksaan (dijana dari SPMP) wajib dibawa bersama kad matrik fizikal.',
    location: 'Dewan Muadzam Shah (DMS) & Dewan Peperiksaan',
    targetAudience: 'Semua Pelajar Menduduki Peperiksaan',
    priority: 'high'
  },
  {
    id: 'cal_end_sem_break',
    title: 'Cuti Akhir Semester Sesi II 2026 (End of Semester Vacation)',
    titleBm: 'Cuti Akhir Semester (End-Sem Break)',
    category: 'break',
    categoryLabel: 'Semester Break',
    startDate: '2026-12-19',
    endDate: '2027-01-17',
    dateDisplay: '19 Dis 2026 - 17 Jan 2027 (4 Minggu)',
    description: 'Cuti semester penuh sebelum sesi pengajian baharu 2027 bermula. Pengosongan bilik kolej kediaman siswa/siswi.',
    descriptionBm: 'Cuti semester penuh sebelum sesi pengajian baharu 2027 bermula. Pengosongan bilik kolej kediaman siswa/siswi.',
    location: 'Kolej Kediaman & Seluruh Kampus',
    targetAudience: 'Semua Pelajar',
    priority: 'medium'
  }
];
