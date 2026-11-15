export interface CampusLocation {
  id: string;
  name: string;
  category: 'store' | 'lecture_hall' | 'admin' | 'facility' | 'hostel';
  categoryLabel: string;
  code: string; // e.g., 'ADM-01', 'STORE-02', 'JKE-LH'
  x: number; // percentage coordinates on campus schematic SVG (0 to 100)
  y: number; // percentage coordinates on campus schematic SVG (0 to 100)
  level?: string;
  description: string;
  operatingHours?: string;
  contact?: string;
  features: string[];
  smartCampusUrl?: string;
  imageUrl: string;
}

export const PSAS_CAMPUS_LOCATIONS: CampusLocation[] = [
  // 1. Administrative Offices
  {
    id: 'loc_admin_main',
    name: 'Bangunan Pentadbiran Utama (HEP & Hal Ehwal Akademik)',
    category: 'admin',
    categoryLabel: 'Administrative Office',
    code: 'ADMIN-HQ',
    x: 48,
    y: 28,
    level: 'Aras 1 & 2',
    description: 'Pejabat Pengarah, Unit Hal Ehwal Pelajar (HEP), Kaunter SPMP, Khidmat Biasiswa & Peperiksaan Politeknik Sultan Azlan Shah.',
    operatingHours: 'Isnin - Jumaat: 8:00 AM - 5:00 PM',
    contact: '05-454 4455 / hep@psas.edu.my',
    features: ['Kaunter Urusan Kad Pelajar', 'Pejabat Penasihat Akademik', 'Bantuan Kebajikan Siswa', 'Bilik Mesyuarat Eksekutif'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_security_gate',
    name: 'Pondok Keselamatan Pintu Gerbang Utama PSAS',
    category: 'admin',
    categoryLabel: 'Security Post',
    code: 'SEC-GATE',
    x: 12,
    y: 86,
    level: 'Aras Bawah',
    description: 'Kawalan keluar masuk kenderaan 24 jam, pendaftaran pelekat kenderaan pelajar, dan pusat bantuan kecemasan kampus.',
    operatingHours: '24 Jam Setiap Hari',
    contact: '05-454 4433 (Pondok Kawalan Utama)',
    features: ['Kawalan 24 Jam', 'Pendaftaran Pelekat Motosikal/Kereta', 'Pusat Bantuan Kecemasan SOS'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80'
  },

  // 2. Student Stores & Cafeterias
  {
    id: 'loc_store_kenanga',
    name: 'Kafeteria & Gerai Siswa Kolej Kediaman Kenanga',
    category: 'store',
    categoryLabel: 'Student Store & Food',
    code: 'STORE-KN1',
    x: 82,
    y: 35,
    level: 'Aras Bawah Blok Kenanga',
    description: 'Pusat gerai makanan siswa termasuk "Kenanga Dorm Bites" & "Dapur Siswa". Titik serah-terima utama (pickup point) tempahan makanan malam.',
    operatingHours: '7:30 AM - 11:00 PM',
    contact: '012-345 6789',
    features: ['1-Tap WhatsApp Store Pickup', 'DuitNow QR Ready', 'Kedai Runcit Asrama', 'Wi-Fi Siswa'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_store_koperasi',
    name: 'Koperasi & Kedai Buku Politeknik (KOPPSAS)',
    category: 'store',
    categoryLabel: 'Campus Mart & Bookstore',
    code: 'KOP-01',
    x: 42,
    y: 44,
    level: 'Aras 1, Sebelah Kafe Utama',
    description: 'Jualan alat tulis, kertas lukisan kejuruteraan, lab coat rasmi PSAS, buku modul Politeknik Malaysia, dan percetakan dokumen.',
    operatingHours: '8:30 AM - 5:30 PM (Hari Bekerja)',
    contact: '05-454 4488',
    features: ['Lab Coat & Peralatan Bengkel', 'Pencetakan Assignment & Binding', 'Kalkulator Saintifik Casio Original'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1507842229452-975a593368a3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_store_jke_cafe',
    name: 'Kiosk Usahawan Siswa JKE / Kafe Elektronik',
    category: 'store',
    categoryLabel: 'Student Store & Tech Services',
    code: 'TECH-JKE',
    x: 64,
    y: 62,
    level: 'Lobi Fakulti Kejuruteraan Elektrik',
    description: 'Kiosk servis baiki laptop/komponen mikropengawal "TechFix Enterprise" dan minuman segar usahawan muda PSAS.',
    operatingHours: '9:00 AM - 6:00 PM',
    contact: '013-442 8899',
    features: ['Servis Format Laptop & Arduino', 'Kiosk Kopi & Snack Siswa', 'Tempat Pertukaran Barang Marketplace'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80'
  },

  // 3. Lecture Halls & Faculty Auditoriums
  {
    id: 'loc_lh_dms',
    name: 'Dewan Muadzam Shah (DMS Chancellor Hall & Exam Hall)',
    category: 'lecture_hall',
    categoryLabel: 'Auditorium & Exam Hall',
    code: 'HALL-DMS',
    x: 52,
    y: 16,
    level: 'Aras Utama',
    description: 'Dewan konsert graduasi, perhimpunan rasmi minggu orientasi, dan dewan peperiksaan akhir berpusat Politeknik.',
    operatingHours: 'Berdasarkan Jadual Acara & Kuliah',
    contact: 'Unit Pengurusan Dewan PSAS',
    features: ['Kapasiti 2,500 Tempat Duduk', 'Dewan Peperiksaan Akhir', 'Pentas Utama & Sistem Audio'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_lh_dk1',
    name: 'Dewan Kuliah Utama 1 & 2 (DK1 / DK2)',
    category: 'lecture_hall',
    categoryLabel: 'Lecture Hall Complex',
    code: 'DK-COMPLEX',
    x: 36,
    y: 35,
    level: 'Aras 1 & 2',
    description: 'Dewan kuliah bertingkat untuk subjek universiti teras: Matematik Kejuruteraan, Pengajian Islam/Moral, dan Sains Bahan.',
    operatingHours: '8:00 AM - 6:00 PM',
    contact: 'Unit Jadual Waktu JKA',
    features: ['Projektor Dwi-Skrin Pintar', 'Penyaman Udara Berpusat', 'Mikrofon Pensyarah & Rakaman Kuliah'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_lh_jtmk',
    name: 'Makmal Komputer & Bilik Kuliah JTMK (Blok Siber)',
    category: 'lecture_hall',
    categoryLabel: 'Academic Block & Labs',
    code: 'JTMK-CYBER',
    x: 28,
    y: 50,
    level: 'Aras 1 - 3',
    description: 'Jabatan Teknologi Maklumat & Komunikasi. Makmal Rangkaian Cisco, Makmal Pengaturcaraan Web, dan Bilik Seminar Projek Akhir (FYP).',
    operatingHours: '8:00 AM - 7:00 PM',
    contact: '05-454 4477',
    features: ['Makmal Komputer Terkini', 'Rangkaian Berkelajuan Tinggi', 'Zon Diskusi Kod & Hackathon'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_lh_jke_jkm',
    name: 'Bengkel Kejuruteraan Mekanikal & Elektrik (JKM / JKE)',
    category: 'lecture_hall',
    categoryLabel: 'Engineering Workshops',
    code: 'ENG-WORKSHOP',
    x: 68,
    y: 72,
    level: 'Aras Bawah & Mezzanine',
    description: 'Bengkel Fabrikasi, Mesin Larik CNC, Bengkel Kimpalan, dan Makmal PLC & Robotik untuk pelajar diploma kejuruteraan.',
    operatingHours: '8:00 AM - 5:00 PM',
    contact: 'Penyelaras Makmal Kejuruteraan',
    features: ['Mesin CNC & Fabrikasi Logam', 'Peralatan Keselamatan Mandatori', 'Zon Ujian Projek Inovasi'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80'
  },

  // 4. Campus Facilities & Landmarks
  {
    id: 'loc_fac_library',
    name: 'Perpustakaan Politeknik Sultan Azlan Shah (Library)',
    category: 'facility',
    categoryLabel: 'Library & Learning Hub',
    code: 'LIB-CENTRAL',
    x: 40,
    y: 56,
    level: 'Bangunan 3 Tingkat',
    description: 'Pusat Sumber Pembelajaran, Bilik Perbincangan Kumpulan, Zon Pembacaan Sunyi, dan lokasi serah-terima jual beli barang paling popular di PSAS.',
    operatingHours: '8:30 AM - 10:00 PM (Lanjutan ketika musim exam)',
    contact: '05-454 4466 / lib@psas.edu.my',
    features: ['Bilik Kaji Selidik Berhawa Dingin', 'Pangkalan Data Jurnal & E-Book', 'Ruang Santai Pertukaran Barang Siswa', 'Kafeteria Aras Bawah'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_fac_mosque',
    name: 'Pusat Islam & Masjid Al-Mursyidin PSAS',
    category: 'facility',
    categoryLabel: 'Mosque & Spiritual Center',
    code: 'MOSQUE-PSAS',
    x: 54,
    y: 78,
    level: 'Aras Utama & Dewan Solat',
    description: 'Pusat aktiviti keagamaan, solat Jumaat berjemaah, ceramah motivasi, dan dewan majlis berbuka puasa Ramadan.',
    operatingHours: '5:00 AM - 11:00 PM',
    contact: 'Imam & Pegawai Hal Ehwal Islam PSAS',
    features: ['Dewan Solat Utama 1,500 Jemaah', 'Bilik Wuduk Lengkap', 'Zon Program Kebajikan Pelajar'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_fac_sports',
    name: 'Kompleks Stadium Sukan & Gelanggang Terbuka',
    category: 'facility',
    categoryLabel: 'Sports & Recreation',
    code: 'SPORT-STADIUM',
    x: 75,
    y: 84,
    level: 'Kawasan Sukan Luar',
    description: 'Padang bola sepak sintetik, trek larian balapan, gelanggang futsal, bola tampar, dan dewan badminton bertutup.',
    operatingHours: '7:00 AM - 7:00 PM',
    contact: 'Unit Sukan & Kokurikulum PSAS',
    features: ['Padang Bola Sintetik Bertaraf Kebangsaan', 'Gelanggang Futsal & Bola Tampar', 'Trek Olahraga Balapan'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'
  },

  // 5. Hostels (Kolej Kediaman)
  {
    id: 'loc_hostel_siswa',
    name: 'Kolej Kediaman Siswa (Kamsis V1 - V3)',
    category: 'hostel',
    categoryLabel: 'Male Dormitory Block',
    code: 'DORM-MALE',
    x: 88,
    y: 20,
    level: 'Blok Kediaman V1, V2, V3',
    description: 'Asrama penginapan pelajar lelaki semester 1 & penggerak aktiviti kolej. Dilengkapi dobi layan diri dan surau blok.',
    operatingHours: 'Pintu Pagar Asrama Ditutup: 11:00 PM',
    contact: 'Warden Bertugas Asrama Lelaki: 019-572 8821',
    features: ['Dobi Layan Diri 24 Jam', 'Bilik Belajar Berpusat', 'Kawalan Kad Akses Pelajar'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_hostel_siswi',
    name: 'Kolej Kediaman Siswi (Kamsis V4 - V6)',
    category: 'hostel',
    categoryLabel: 'Female Dormitory Block',
    code: 'DORM-FEMALE',
    x: 86,
    y: 52,
    level: 'Blok Kediaman V4, V5, V6',
    description: 'Asrama penginapan pelajar perempuan PSAS. Akses berpagar keselamatan dengan pengawasan warden 24 jam.',
    operatingHours: 'Pintu Pagar Ditutup: 11:00 PM',
    contact: 'Warden Bertugas Asrama Perempuan: 019-572 8822',
    features: ['Kawalan Keselamatan Berpagar', 'Dobi Pintar', 'Kafe Siswi Aras Bawah'],
    smartCampusUrl: 'https://www.psasmartcampus.com/',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80'
  }
];
