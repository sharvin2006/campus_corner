import {
  UserProfile,
  MarketplaceItem,
  Transaction,
  RentalItem,
  StudyResource,
  CampusJob,
  UtilityItem,
  StudentStore,
  SosAlertRecord,
  ChatMessage,
  AppNotification,
  SellerReview
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_student_new',
  name: 'New PSAS Student',
  matrixNo: '08DEP24F1001',
  department: 'Jabatan Pengajian (PSAS)',
  course: 'Diploma Program PSAS',
  semester: 1,
  email: 'student@psas.edu.my',
  phone: '+60 12-345 6789',
  bio: 'Student at Politeknik Sultan Azlan Shah. Exploring campus trading, academic textbooks, hostel rentals, and student services.',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  isVerified: false, // Starts as Demo Profile so student can toggle and observe distinction
  verificationNote: 'Student verification requires matching with the PSAS Academic Management Portal (SPMP) with active matrix card.',
  interests: ['Textbooks & Academic', 'Electronics & Gadgets', 'Student Essentials', 'Carpool Share'],
  savedItemIds: ['item_2', 'rent_1', 'study_1'],
  joinedDate: 'October 2026',
  campusRating: 5.0,
  reviewCount: 0,
};

export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'item_1',
    title: 'Casio fx-570EX ClassWiz Scientific Calculator (Original)',
    category: 'Engineering Tools',
    price: 55,
    condition: 'Good Condition',
    description: 'Essential calculator for Engineering Mathematics & Circuit Theory. Screen 100% crisp, includes protective slide cover. Battery replaced last month.',
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop&q=80'
    ],
    pickupLocation: 'Perpustakaan PSAS / Kafe JKE',
    sellerId: 'usr_harith_032',
    sellerName: 'Harith Syazwan',
    sellerMatrix: '08DEP22F1032',
    sellerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.9,
    sellerVerified: true,
    status: 'available',
    isFeatured: true,
    views: 89,
    createdAt: '2026-10-06'
  },
  {
    id: 'item_2',
    title: 'Arduino Uno R3 Ultimate Sensor Starter Kit + Breadboard',
    category: 'Electronics & Gadgets',
    price: 68,
    condition: 'Like New',
    description: 'Complete with ultrasonic sensors, servo motor, jumpers, resistors and 1602 LCD module. Used for 1 semester in Microcontroller subject.',
    images: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
    ],
    pickupLocation: 'Bengkel Elektronik Blok C, PSAS',
    sellerId: 'usr_syakir_009',
    sellerName: 'Ahmad Syakir',
    sellerMatrix: '08DEP22F1019',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    sellerRating: 5.0,
    sellerVerified: true,
    status: 'available',
    isFeatured: true,
    views: 142,
    createdAt: '2026-10-07'
  },
  {
    id: 'item_3',
    title: 'Engineering Mathematics 2 & 3 Politeknik Textbook Module',
    category: 'Textbooks & Academic',
    price: 22,
    condition: 'Good Condition',
    description: 'Clean textbook with useful pencil highlights and past test formulas. Official syllabus for politeknik Malaysia engineering departments.',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
    ],
    pickupLocation: 'Kafeteria Kolej Kediaman Siswa',
    sellerId: 'usr_nurul_044',
    sellerName: 'Nurul Ain binti Azman',
    sellerMatrix: '08DKM23F1088',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.8,
    sellerVerified: true,
    status: 'available',
    views: 64,
    createdAt: '2026-10-08'
  },
  {
    id: 'item_4',
    title: 'Official PSAS Lab Coat Unisex (Size M - 100% Cotton)',
    category: 'Clothing & Attire',
    price: 25,
    condition: 'Like New',
    description: 'Clean white lab coat with embroidered PSAS crest on the front pocket. Washed and ironed. Mandatory for chemistry and engineering labs.',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
    ],
    pickupLocation: 'Pusat Islam PSAS / Pintu Gerbang',
    sellerId: 'usr_hafeez_103',
    sellerName: 'Mohd Hafeez',
    sellerMatrix: '08JKM21F2003',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.7,
    sellerVerified: false,
    status: 'available',
    views: 51,
    createdAt: '2026-10-05'
  },
  {
    id: 'item_5',
    title: 'Logitech M220 Silent Wireless Mouse (Grey)',
    category: 'Electronics & Gadgets',
    price: 32,
    condition: 'Good Condition',
    description: 'Perfect quiet mouse for library study sessions. 90% noise reduction, plug & play USB receiver included with AA battery.',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'
    ],
    pickupLocation: 'Perpustakaan PSAS Level 1',
    sellerId: 'usr_aiman_054',
    sellerName: 'Aiman Zikri',
    sellerMatrix: '08DIT23F1054',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.9,
    sellerVerified: true,
    status: 'available',
    views: 77,
    createdAt: '2026-10-04'
  },
  {
    id: 'item_6',
    title: 'Philips Steam Iron & Compact Ironing Mat for Dormitory',
    category: 'Student Essentials',
    price: 35,
    condition: 'Good Condition',
    description: 'Handy non-stick soleplate steam iron. Saves time pressing presentations shirts in hostel rooms. Tested and fully functional.',
    images: [
      'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=600&auto=format&fit=crop&q=80'
    ],
    pickupLocation: 'Kafeteria Blok Kenanga',
    sellerId: 'usr_nadia_219',
    sellerName: 'Nadia Syafiqah',
    sellerMatrix: '08DPM23F2044',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.9,
    sellerVerified: true,
    status: 'available',
    views: 39,
    createdAt: '2026-10-09'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_demo_101',
    itemId: 'item_5',
    itemTitle: 'Logitech M220 Silent Wireless Mouse (Grey)',
    itemImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    itemPrice: 32,
    buyerId: 'usr_faris_998',
    buyerName: 'Faris Imran (JTMK)',
    sellerId: 'usr_aiman_054',
    sellerName: 'Aiman Zikri',
    status: 'pickup_scheduled',
    offerAmount: 30,
    pickupLocation: 'Lobi Perpustakaan PSAS',
    pickupDateTime: '2026-10-12 14:00',
    pickupNotes: 'Will meet near the main automated return counter after class.',
    paymentMethod: 'Demo Campus Pay',
    createdAt: '2026-10-08',
    updatedAt: '2026-10-09'
  },
  {
    id: 'tx_demo_102',
    itemId: 'item_past_99',
    itemTitle: 'SanDisk 64GB Ultra Dual USB-C Thumbdrive',
    itemImage: 'https://images.unsplash.com/photo-1628191081676-8f40d4ce6c44?w=600&auto=format&fit=crop&q=80',
    itemPrice: 28,
    buyerId: 'usr_syakir_009',
    buyerName: 'Ahmad Syakir',
    sellerId: 'usr_zack_112',
    sellerName: 'Zackry Haris',
    status: 'completed',
    offerAmount: 25,
    pickupLocation: 'Dataran Gemilang PSAS',
    pickupDateTime: '2026-10-02 17:30',
    paymentMethod: 'Cash on Meetup',
    reviewRating: 5,
    reviewComment: 'Barang tiptop, seller on-time dan ramah. Recommended sesama student PSAS!',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-02'
  }
];

export const INITIAL_SELLER_REVIEWS: SellerReview[] = [
  {
    id: 'rev_101',
    sellerId: 'usr_harith_032',
    sellerName: 'Harith Syazwan',
    sellerMatrix: '08DEP22F1032',
    reviewerId: 'usr_faris_998',
    reviewerName: 'Faris Imran',
    reviewerMatrix: '08DIT23F1019',
    rating: 5,
    comment: 'Tested the ClassWiz calculator together at Perpustakaan Level 1. Display is crystal clear, original Casio hologram intact, and Harith arrived 5 minutes early.',
    tags: ['On-Time Meetup', 'Item As Described', 'Safe Campus Spot'],
    itemId: 'item_1',
    itemTitle: 'Casio fx-570EX ClassWiz Scientific Calculator (Original)',
    isVerifiedBuyer: true,
    helpfulCount: 6,
    helpfulVoterIds: [],
    createdAt: '2026-10-07'
  },
  {
    id: 'rev_102',
    sellerId: 'usr_harith_032',
    sellerName: 'Harith Syazwan',
    sellerMatrix: '08DEP22F1032',
    reviewerId: 'usr_haziq_410',
    reviewerName: 'Muhammad Haziq',
    reviewerMatrix: '08DEP23F1077',
    rating: 5,
    comment: 'Bought his past semester JKE reference pack earlier this month. Fast reply on chat and super helpful explaining which chapters came out in exams.',
    tags: ['Fast Reply', 'Friendly Seller'],
    itemTitle: 'JKE Engineering Lab Reference Kit',
    isVerifiedBuyer: true,
    helpfulCount: 3,
    helpfulVoterIds: [],
    createdAt: '2026-10-03'
  },
  {
    id: 'rev_103',
    sellerId: 'usr_syakir_009',
    sellerName: 'Ahmad Syakir',
    sellerMatrix: '08DEP22F1019',
    reviewerId: 'usr_aisyah_302',
    reviewerName: 'Nur Aisyah',
    reviewerMatrix: '08DIT23F1045',
    rating: 5,
    comment: 'All sensors in his microcontroller starter kit were neatly sorted in the divider box. He even shared his sample Arduino wiring sketch via WhatsApp.',
    tags: ['Item As Described', 'Friendly Seller', 'Fair Student Price'],
    itemId: 'item_2',
    itemTitle: 'Arduino Uno R3 Ultimate Sensor Starter Kit + Breadboard',
    isVerifiedBuyer: true,
    helpfulCount: 8,
    helpfulVoterIds: [],
    createdAt: '2026-10-08'
  },
  {
    id: 'rev_104',
    sellerId: 'usr_syakir_009',
    sellerName: 'Ahmad Syakir',
    sellerMatrix: '08DEP22F1019',
    reviewerId: 'usr_danish_204',
    reviewerName: 'Danish Haiqal',
    reviewerMatrix: '08DKM22F2004',
    rating: 5,
    comment: 'Smooth handover outside Bengkel Elektronik Blok C. Verified student and trustworthy.',
    tags: ['On-Time Meetup', 'Safe Campus Spot'],
    isVerifiedBuyer: true,
    helpfulCount: 4,
    helpfulVoterIds: [],
    createdAt: '2026-10-04'
  },
  {
    id: 'rev_105',
    sellerId: 'usr_nurul_044',
    sellerName: 'Nurul Ain binti Azman',
    sellerMatrix: '08DKM23F1088',
    reviewerId: 'usr_amira_088',
    reviewerName: 'Amira Yasmin',
    reviewerMatrix: '08DNS23F1088',
    rating: 5,
    comment: 'Buku sangat bersih, nota formula pensel dia siap bantu untuk kuiz Matematik Kejuruteraan!',
    tags: ['Item As Described', 'Fair Student Price'],
    itemId: 'item_3',
    itemTitle: 'Engineering Mathematics 2 & 3 Politeknik Textbook Module',
    isVerifiedBuyer: true,
    helpfulCount: 5,
    helpfulVoterIds: [],
    createdAt: '2026-10-08'
  },
  {
    id: 'rev_106',
    sellerId: 'usr_nurul_044',
    sellerName: 'Nurul Ain binti Azman',
    sellerMatrix: '08DKM23F1088',
    reviewerId: 'usr_iqbal_511',
    reviewerName: 'Iqbal Hakimi',
    reviewerMatrix: '08DKM24F1021',
    rating: 4,
    comment: 'Good seller, pickup at Kafeteria Kolej Kediaman was quick. Slight delay of 10 mins because of lab class but informed early.',
    tags: ['Friendly Seller', 'Fast Reply'],
    isVerifiedBuyer: false,
    helpfulCount: 2,
    helpfulVoterIds: [],
    createdAt: '2026-10-05'
  },
  {
    id: 'rev_107',
    sellerId: 'usr_hafeez_103',
    sellerName: 'Mohd Hafeez',
    sellerMatrix: '08JKM21F2003',
    reviewerId: 'usr_zul_198',
    reviewerName: 'Zulhelmi Rosli',
    reviewerMatrix: '08DEP23F1061',
    rating: 5,
    comment: 'Lab coat neatly washed and ironed, looks brand new for workshop sessions.',
    tags: ['Item As Described', 'Fair Student Price'],
    itemId: 'item_4',
    itemTitle: 'Official PSAS Lab Coat Unisex (Size M - 100% Cotton)',
    isVerifiedBuyer: true,
    helpfulCount: 2,
    helpfulVoterIds: [],
    createdAt: '2026-10-06'
  },
  {
    id: 'rev_108',
    sellerId: 'usr_aiman_054',
    sellerName: 'Aiman Zikri',
    sellerMatrix: '08DIT23F1054',
    reviewerId: 'usr_faris_998',
    reviewerName: 'Faris Imran',
    reviewerMatrix: '08DIT23F1019',
    rating: 5,
    comment: 'Super responsive and flexible meetup timing around Perpustakaan PSAS.',
    tags: ['Fast Reply', 'On-Time Meetup', 'Friendly Seller'],
    itemId: 'item_5',
    itemTitle: 'Logitech M220 Silent Wireless Mouse (Grey)',
    isVerifiedBuyer: true,
    helpfulCount: 4,
    helpfulVoterIds: [],
    createdAt: '2026-10-05'
  },
  {
    id: 'rev_109',
    sellerId: 'usr_nadia_219',
    sellerName: 'Nadia Syafiqah',
    sellerMatrix: '08DPM23F2044',
    reviewerId: 'usr_sarah_012',
    reviewerName: 'Siti Sarah',
    reviewerMatrix: '08DPM23F1012',
    rating: 5,
    comment: 'Tested the steam iron at Blok Kenanga lobby socket before paying. Heats up fast and works like new!',
    tags: ['Item As Described', 'Safe Campus Spot', 'Friendly Seller'],
    itemId: 'item_6',
    itemTitle: 'Philips Steam Iron & Compact Ironing Mat for Dormitory',
    isVerifiedBuyer: true,
    helpfulCount: 3,
    helpfulVoterIds: [],
    createdAt: '2026-10-09'
  },
  {
    id: 'rev_110',
    sellerId: 'usr_zack_112',
    sellerName: 'Zackry Haris',
    sellerMatrix: '08DIT22F1112',
    reviewerId: 'usr_syakir_009',
    reviewerName: 'Ahmad Syakir',
    reviewerMatrix: '08DEP22F1019',
    rating: 5,
    comment: 'Barang tiptop, seller on-time dan ramah. Recommended sesama student PSAS!',
    tags: ['On-Time Meetup', 'Friendly Seller'],
    itemId: 'item_past_99',
    itemTitle: 'SanDisk 64GB Ultra Dual USB-C Thumbdrive',
    isVerifiedBuyer: true,
    helpfulCount: 2,
    helpfulVoterIds: [],
    createdAt: '2026-10-02'
  }
];

export const INITIAL_RENTALS: RentalItem[] = [
  {
    id: 'rent_1',
    title: 'Bilik Single Lelaki Katil Queen @ Taman Behrang 2020',
    type: 'Single Room',
    pricePerMonth: 230,
    deposit: 230,
    locationArea: 'Taman Behrang 2020',
    distanceToCampus: '2.1 km (4 minit menunggang motosikal ke PSAS)',
    address: 'No 45, Jalan Behrang 2020/3, 35900 Behrang Stesen, Perak',
    facilities: ['High-speed WiFi 100Mbps', 'Peti Sejuk', 'Mesin Basuh', 'Water Heater', 'Parking Motosikal Berbumbung', 'Kipas Siling'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80'
    ],
    landlordName: 'En. Razak (Alumni PSAS)',
    landlordPhone: '+60 12-488 2011',
    availableFrom: 'Segera / Semester Baharu',
    genderPreference: 'Male',
    isVerifiedPartner: true,
    views: 210,
    status: 'Available',
    ownerId: 'owner_razak_88',
    ownerType: 'Direct Landlord',
    utilitiesIncluded: true,
    houseRules: 'Dilarang merokok di dalam bilik. Kebersihan kawasan dapur dan mesin basuh dijaga bersama.',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-09'
  },
  {
    id: 'rent_2',
    title: 'Rumah Teres 2 Tingkat Siswi (4 Bilik) @ Taman Bahtera',
    type: 'Whole House',
    pricePerMonth: 900,
    deposit: 900,
    locationArea: 'Taman Bahtera Tanjung Malim',
    distanceToCampus: '3.8 km ke PSAS (Berdekatan Tol Tanjung Malim)',
    address: 'Lorong Bahtera 8, Taman Bahtera, Perak/Selangor Border',
    facilities: ['Fully Furnished', 'Peti Sejuk 2 Pintu', 'Mesin Basuh Automatik', 'Dapur Gas Memasak', 'Grill Keselamatan Lengkap'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80'
    ],
    landlordName: 'Puan Halimah',
    landlordPhone: '+60 19-332 5590',
    availableFrom: 'November 2026',
    genderPreference: 'Female',
    isVerifiedPartner: false, // Unverified - shows disclaimer
    views: 184,
    status: 'Available',
    ownerId: 'owner_halimah_44',
    ownerType: 'Direct Landlord',
    utilitiesIncluded: false,
    houseRules: 'Kemasukan siswi PSAS sahaja. Bayaran sewa bulanan selewat-lewatnya 5hb setiap bulan.',
    createdAt: '2026-10-04',
    updatedAt: '2026-10-08'
  },
  {
    id: 'rent_3',
    title: 'Bilik Sharing 2 Orang Lakeview @ Proton City Tanjung Malim',
    type: 'Sharing Room',
    pricePerMonth: 160,
    deposit: 160,
    locationArea: 'Proton City',
    distanceToCampus: '6.5 km dari PSAS (Ada bas lalu)',
    address: 'Pangsapuri Proton City Lakeview, Blok B, Tanjung Malim',
    facilities: ['Swimming Pool & Gym', 'Kawalan Keselamatan 24 Jam', 'Peti Ais', 'Katil Single x2', 'Meja Belajar'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80'
    ],
    landlordName: 'Wan Hafizi (Master Tenant)',
    landlordPhone: '+60 11-2098 7761',
    availableFrom: 'Segera',
    genderPreference: 'Male',
    isVerifiedPartner: false,
    views: 95,
    status: 'Available',
    ownerId: 'owner_wan_22',
    ownerType: 'Master Tenant (Student Senior)',
    utilitiesIncluded: true,
    houseRules: 'Kongsi bilik secara harmoni. Sesuai untuk pelajar yang mempunyai motosikal sendiri.',
    createdAt: '2026-10-06',
    updatedAt: '2026-10-09'
  },
  {
    id: 'rent_my_sample',
    title: 'Bilik Master Luas Lengkap Perabot @ Taman Behrang 2020 (Siswa/Siswi)',
    type: 'Single Room',
    pricePerMonth: 280,
    deposit: 280,
    locationArea: 'Taman Behrang 2020',
    distanceToCampus: '1.5 km (3 minit ke Pintu Gerbang PSAS)',
    address: 'Jalan Behrang 2020/7, Taman Behrang 2020',
    facilities: ['High-speed WiFi 100Mbps', 'Air Conditioner', 'Katil Queen & Tilam Baru', 'Mesin Basuh', 'Peti Sejuk', 'Meja & Kerusi Belajar Ergonomik'],
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80'
    ],
    landlordName: 'New PSAS Student',
    landlordPhone: '+60 12-345 6789',
    availableFrom: 'Kemudahan Segera',
    genderPreference: 'Any',
    isVerifiedPartner: true,
    views: 142,
    status: 'Available',
    ownerId: 'usr_student_new',
    ownerType: 'Master Tenant (Student Senior)',
    utilitiesIncluded: true,
    houseRules: 'Saling menghormati privasi housemate. Mengunci pintu pagar selepas masuk.',
    createdAt: '2026-10-08',
    updatedAt: '2026-10-10'
  }
];

export const INITIAL_STUDY_RESOURCES: StudyResource[] = [
  {
    id: 'study_1',
    title: 'DFC20113 Object-Oriented Programming (C++) Exam Solved Pack',
    department: 'JTMK',
    courseCode: 'DFC20113',
    resourceType: 'Past Year Papers',
    price: 0, // Free
    authorOrTutor: 'Aiman Hakim (Dean List JTMK)',
    authorSemester: 'Semester 5',
    description: 'Complete breakdown of past exam coding questions (Polymorphism, Inheritance, Pointers) with step-by-step commented code and output screenshots.',
    downloadsCount: 184,
    rating: 4.9,
    status: 'Available',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
    ],
    academicTerm: 'Sesi II 2024/2025',
    keyTopics: ['C++', 'Polymorphism', 'Inheritance', 'Final Exam Solved'],
    fileAttachmentName: 'DFC20113_OOP_Final_Exam_Solutions.pdf',
    createdAt: '2026-10-02',
    updatedAt: '2026-10-09'
  },
  {
    id: 'study_2',
    title: 'DBM10013 Engineering Mathematics 1: Formula Sheet & Worked Steps',
    department: 'JKE',
    courseCode: 'DBM10013',
    resourceType: 'Lecture Notes',
    price: 6,
    authorOrTutor: 'Nur Athirah (JKE)',
    authorSemester: 'Semester 4',
    description: 'Concise 18-page summary sheets for Trigonometry, Complex Numbers, and Differentiation with mnemonic guides.',
    downloadsCount: 96,
    rating: 4.8,
    status: 'Available',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'
    ],
    academicTerm: 'Sesi I 2025/2026',
    keyTopics: ['Differentiation', 'Integration', 'Complex Numbers'],
    fileAttachmentName: 'DBM10013_Math1_CheatSheet_Athirah.pdf',
    createdAt: '2026-10-04'
  },
  {
    id: 'study_3',
    title: '1-on-1 Peer Tutoring: Circuit Theory & Digital Logic',
    department: 'JKE',
    courseCode: 'DEP10023',
    resourceType: 'Peer Tutoring',
    price: 15,
    authorOrTutor: 'Kugan a/l Rajan',
    authorSemester: 'Semester 5 (CGPA 3.82)',
    description: 'Personalised physical or Google Meet tutoring session. Guaranteed clarity on Thévenin Theorem, Norton, and Karnaugh Maps with practical calculator hacks.',
    downloadsCount: 22,
    rating: 5.0,
    status: 'Available',
    availabilitySchedule: 'Selasa & Khamis (8:00 PM - 10:00 PM), Perpustakaan PSAS',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
    ],
    authorPhone: '+60 14-876 5432',
    tutoringMode: 'Physical (Library/Cafe)',
    createdAt: '2026-10-05'
  },
  {
    id: 'study_4',
    title: 'CAD SolidWorks 3D Modeling Skill-Exchange for FYP',
    department: 'JKM',
    courseCode: 'DJJ30103',
    resourceType: 'Skill Exchange',
    price: 0,
    authorOrTutor: 'Mohd Irfan (JKM)',
    authorSemester: 'Semester 6',
    description: 'Offering hands-on guidance in 3D SolidWorks drafting in exchange for web development / Arduino C++ coding guidance for my FYP robot.',
    downloadsCount: 14,
    rating: 4.9,
    status: 'Available',
    availabilitySchedule: 'Hujung Minggu di Cafe Siswa',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    ],
    tutoringMode: 'Physical (Library/Cafe)',
    createdAt: '2026-10-06'
  },
  {
    id: 'study_my_1',
    title: 'Web Programming (React & Node.js) Project & Lab Peer Tutoring',
    department: 'JTMK',
    courseCode: 'DFC40233',
    resourceType: 'Peer Tutoring',
    price: 10,
    authorOrTutor: 'New PSAS Student (You)',
    authorSemester: 'Semester 4',
    authorId: 'usr_student_new',
    authorPhone: '+60 12-345 6789',
    description: 'Friendly peer tutoring on JavaScript, React hooks, API integration, and debugging lab assignments. Session includes live screen share or physical meetup at Perpustakaan PSAS.',
    downloadsCount: 38,
    rating: 4.95,
    status: 'Available',
    availabilitySchedule: 'Isnin, Rabu, Jumaat (5:00 PM - 7:00 PM)',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80'
    ],
    academicTerm: 'Sesi II 2025/2026',
    keyTopics: ['React Hooks', 'Vite & Tailwind', 'REST API', 'Lab 1 - 4 Help'],
    tutoringMode: 'Hybrid (Physical & Online)',
    createdAt: '2026-10-08',
    updatedAt: '2026-10-10'
  }
];

export const INITIAL_JOBS: CampusJob[] = [
  {
    id: 'job_1',
    title: 'Pembantu Kaunter & Stokis Koperasi Siswa PSAS',
    employer: 'Koperasi Politeknik Sultan Azlan Shah Berhad',
    employerType: 'PSAS Koperasi',
    payRate: 'RM 8.00 / jam',
    hours: '12 - 18 jam seminggu (Boleh ikut jadual kelas)',
    location: 'Bangunan Hal Ehwal Pelajar (HEP) PSAS',
    requirements: ['Pelajar aktif PSAS semester 2 - 5', 'Amanah, mesra pelanggan', 'Mahir sistem juruwang POS asas (latihan disediakan)'],
    description: 'Membantu urusan jualan alat tulis, cenderamata rasmi politeknik, dan pengurusan stok barang masuk.',
    postedDate: '2026-10-05',
    deadline: '2026-10-25',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'job_2',
    title: 'Barista & Kru Penyediaan Makanan Sambilan',
    employer: 'Kafeteria Siswa Selera Behrang (Stall 4)',
    employerType: 'Campus Cafe Vendor',
    payRate: 'RM 8.50 / jam + Makanan Tengahari Percuma',
    hours: 'Isnin hingga Khamis (11:30 AM - 3:00 PM)',
    location: 'Kafeteria Utama Siswa PSAS',
    requirements: ['Suntikan Typhoid wajib (kos boleh dituntut)', 'Pantas dan pembersih'],
    description: 'Membancuh minuman panas/sejuk dan melayan pesanan pelajar semasa waktu puncak rehat tengah hari.',
    postedDate: '2026-10-08',
    deadline: '2026-10-20',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'job_3',
    title: 'Kru Fotografi & Multimedia Majlis Konvokesyen / FYP Showcase',
    employer: 'Unit Media & Komunikasi Korporat PSAS',
    employerType: 'Local Behrang Business',
    payRate: 'RM 250 / hari acara',
    hours: 'Hujung minggu semasa Minggu Inovasi',
    location: 'Dewan Muadzam Shah PSAS',
    requirements: ['Mempunyai kamera DSLR/Mirrorless sendiri', 'Kemahiran editing Adobe Lightroom/Premiere'],
    description: 'Merakam foto dan video sorotan reruai projek akhir pelajar serta aktiviti rasmi kampus.',
    postedDate: '2026-10-09',
    deadline: '2026-10-30',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_UTILITIES: UtilityItem[] = [
  {
    id: 'util_1',
    type: 'borrow',
    title: 'Pinjam: Set Baju Blazer Rasmi Lelaki (Hitam, Size M) untuk Pembentangan FYP',
    description: 'Hanya perlu untuk pembentangan Viva FYP pada hari Rabu ini selama 3 jam. Akan dipulangkan siap hantar dobi.',
    contactName: 'Amirul Aiman',
    contactPhone: '+60 13-908 1123',
    borrowFee: 0,
    depositAmount: 30,
    maxDuration: '2 hari',
    createdAt: '2026-10-08'
  },
  {
    id: 'util_2',
    type: 'lost_found',
    title: 'JUMPA: Dompet Kulit Coklat & Kad Pelajar Matrix di Blok JKE',
    description: 'Dijumpai di atas kerusi makmal Telekomunikasi Aras 2. Mengandungi kad matrik nama Farah Hani dan kad Touch n Go. Boleh tuntut di Bilik Pensyarah En. Zulkifli.',
    contactName: 'En. Zulkifli (Pensyarah JKE)',
    contactPhone: '+60 19-543 9012',
    statusFound: 'found',
    locationPin: 'Makmal Komunikasi Aras 2 Blok JKE',
    claimInstruction: 'Sila bawa kad pengenalan (IC) untuk pengesahan tuntutan.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-10-09'
  },
  {
    id: 'util_3',
    type: 'carpool',
    title: 'Kongsi Kereta: PSAS Behrang ➔ KTM Tanjung Malim',
    description: 'Bertolak dari Pintu Utama PSAS terus ke stesen KTM Tanjung Malim untuk naik tren ETS/Komuter pulang ke kampung.',
    contactName: 'Haziq (Proton Iriz Hitam)',
    contactPhone: '+60 17-665 4410',
    routeFrom: 'Pintu Utama PSAS',
    routeTo: 'Stesen KTM Tanjung Malim',
    departureDate: 'Jumaat, 17 Okt 2026',
    departureTime: '4:45 PM',
    availableSeats: 3,
    fareContribution: 5,
    createdAt: '2026-10-09'
  },
  {
    id: 'util_4',
    type: 'carpool',
    title: 'Kongsi Kereta: PSAS Behrang ➔ TBS (Terminal Bersepadu Selatan, KL)',
    description: 'Balik hujung minggu ke Lembah Klang. Kereta berhawa dingin selesa, boot luas untuk beg pakaian.',
    contactName: 'Syafiq Azman (Perodua Bezza)',
    contactPhone: '+60 11-3990 8821',
    routeFrom: 'Kolej Kediaman PSAS',
    routeTo: 'TBS Kuala Lumpur',
    departureDate: 'Jumaat, 17 Okt 2026',
    departureTime: '5:30 PM',
    availableSeats: 2,
    fareContribution: 18,
    createdAt: '2026-10-09'
  }
];

export const INITIAL_STORES: StudentStore[] = [
  {
    id: 'store_student_my',
    name: 'Kenanga Dorm Bites & Craft Hub',
    tagline: 'Fresh Student Pastries, Matcha Latte & Custom Crochets',
    description: 'Diusahakan oleh pelajar PSAS. Menjual kudapan harian bakar segar, minuman matcha ais, dan cenderamata kait benang (crochet) untuk hadiah kawan atau konvokesyen.',
    ownerId: 'usr_student_new',
    ownerName: 'New PSAS Student',
    ownerMatrix: '08DEP24F1001',
    ownerPhone: '+60 12-345 6789',
    category: 'Food & Beverage',
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80',
    logoImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    whatsappContact: '+60 12-345 6789',
    pickupPoint: 'Lobi Blok Kenanga / Kafe Kolej Kediaman',
    operatingHours: '5:00 PM - 10:30 PM (Setiap Hari)',
    catalogCategories: ['Bakery & Pastry', 'Minuman Sejuk', 'Handmade Crochet', 'Combo Siswa'],
    products: [
      {
        id: 'p_my_1',
        name: 'Fudgy Dark Chocolate Brownies (Box 6 pcs)',
        price: 10,
        description: 'Bakar segar petang-petang. Kurang manis, menggunakan coklat beryl asli, tekstur chewy dan fudgy berkedut atas.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80'
        ],
        inStock: true,
        categoryTag: 'Bakery & Pastry',
        prepTime: 'Ready Stock',
        isPopular: true
      },
      {
        id: 'p_my_2',
        name: 'Matcha Cream Ice Frappe (Cup 500ml)',
        price: 6,
        description: 'Uji Matcha gred premium dicampur susu segar krim pekat. Segar diminum lepas kelas penat.',
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80'
        ],
        inStock: true,
        categoryTag: 'Minuman Sejuk',
        prepTime: 'Made to Order (5 mins)',
        isPopular: true
      },
      {
        id: 'p_my_3',
        name: 'Handmade Crochet Tulip Keychain Flower',
        price: 8,
        description: 'Kait benang susu lembut tebal, tahan lasak untuk beg galas laptop atau kunci bilik asrama.',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80'
        ],
        inStock: true,
        categoryTag: 'Handmade Crochet',
        prepTime: 'Ready Stock (Pilihan Warna Ungu/Pink)'
      }
    ],
    rating: 4.95,
    orderCount: 42,
    isDemoStore: true
  },
  {
    id: 'store_1',
    name: 'Dapur Siswa Sambal Hitam Behrang',
    tagline: 'Resepi Asli Tok Wan • Jimat & Mengenyangkan Bilik Asrama',
    description: 'Diusahakan oleh pelajar Jabatan Perdagangan (JP) PSAS. Menyediakan sambal hitam belimbing buluh sedia dimakan dan serunding ayam rangup yang tahan lama untuk siswa asrama.',
    ownerId: 'usr_siti_sarah',
    ownerName: 'Siti Sarah binti Idris',
    ownerMatrix: '08DPM23F1012',
    ownerPhone: '+60 18-912 4433',
    category: 'Food & Beverage',
    bannerImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80',
    logoImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    whatsappContact: '+60 18-912 4433',
    pickupPoint: 'Kafeteria Blok Kenanga / Delivery Asrama Percuma',
    operatingHours: '12:00 PM - 11:00 PM',
    catalogCategories: ['Sambal Botol', 'Lauk Segera', 'Pek Percubaan'],
    products: [
      {
        id: 'p_1',
        name: 'Sambal Hitam Belimbing Buluh (Bekas 150g)',
        price: 12,
        description: 'Pedas, masam manis secukup rasa. Sangat sesuai dimakan bersama nasi panas atau maggi goreng.',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&auto=format&fit=crop&q=80'
        ],
        inStock: true,
        categoryTag: 'Sambal Botol',
        prepTime: 'Ready Stock',
        isPopular: true
      },
      {
        id: 'p_2',
        name: 'Serunding Ayam Asli Kampung (Paket 100g)',
        price: 10,
        description: 'Daging ayam segar disiat halus dengan rempah ratus warisan, tahan 6 bulan.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80'
        ],
        inStock: true,
        categoryTag: 'Lauk Segera',
        prepTime: 'Ready Stock'
      }
    ],
    rating: 4.9,
    orderCount: 88,
    isDemoStore: true
  },
  {
    id: 'store_2',
    name: 'PSAS TechFix & Rapid Print Hub',
    tagline: 'Servis Komputer, Format Windows & Cetakan FYP Murah',
    description: 'Servis teknikal student-to-student oleh sekumpulan pelajar JTMK & JKE. Jimat kos format laptop, servis cuci habuk kipas, dan cetak laporan assignment berwarna murah.',
    ownerId: 'usr_harith',
    ownerName: 'Muhammad Harith & Rakan',
    ownerMatrix: '08DIT22F2001',
    ownerPhone: '+60 17-331 9908',
    category: 'Tech & Printing Services',
    bannerImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80',
    logoImage: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=200&auto=format&fit=crop&q=80',
    whatsappContact: '+60 17-331 9908',
    pickupPoint: 'Bilik JTMK Blok C / Pickup Bilik Asrama',
    operatingHours: '8:30 AM - 9:00 PM',
    catalogCategories: ['Laptop & Software', 'Servis Hardware', 'Cetakan & Binding'],
    products: [
      {
        id: 'p_3',
        name: 'Format Laptop + Windows 11 Pro + Microsoft Office Basic',
        price: 35,
        description: 'Termasuk pemasangan antivirus, Chrome, PDF viewer dan backup fail penting sehingga 50GB.',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80'
        ],
        inStock: true,
        categoryTag: 'Laptop & Software',
        prepTime: '2-4 Jam Siap',
        isPopular: true
      },
      {
        id: 'p_4',
        name: 'Tukar Thermal Paste Arctic MX-4 + Cuci Fan Laptop Panas',
        price: 25,
        description: 'Menurunkan suhu laptop semasa bermain game atau rendering SolidWorks / AutoCAD.',
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80'
        ],
        inStock: true,
        categoryTag: 'Servis Hardware',
        prepTime: '1 Jam Siap'
      }
    ],
    rating: 5.0,
    orderCount: 142,
    isDemoStore: true
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Pertemuan Dijadualkan!',
    message: 'Faris Imran telah bersetuju dengan lokasi pertemuan di Lobi Perpustakaan PSAS pada 12 Okt.',
    time: '2 jam yang lalu',
    read: false,
    type: 'order'
  },
  {
    id: 'notif_2',
    title: 'Tawaran Diterima',
    message: 'Tawaran RM 30 untuk Logitech M220 anda telah dipersetujui oleh pembeli.',
    time: '1 hari yang lalu',
    read: true,
    type: 'order'
  },
  {
    id: 'notif_3',
    title: 'Peringatan Keselamatan Kampus',
    message: 'Sentiasa lakukan urusan serah-terima barangan di kawasan awam bertutup seperti Perpustakaan atau Kafeteria PSAS.',
    time: '3 hari yang lalu',
    read: true,
    type: 'system'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_init_1',
    itemId: 'item_1',
    itemTitle: 'Casio fx-570EX ClassWiz Scientific Calculator (Original)',
    senderId: 'usr_student_new',
    senderName: 'New PSAS Student (You)',
    receiverId: 'usr_harith_032',
    receiverName: 'Harith Syazwan',
    content: 'Hi Harith, is the Casio fx-570EX calculator still available for pickup at Perpustakaan?',
    timestamp: '2026-10-10 14:20'
  },
  {
    id: 'msg_init_2',
    itemId: 'item_1',
    itemTitle: 'Casio fx-570EX ClassWiz Scientific Calculator (Original)',
    senderId: 'usr_harith_032',
    senderName: 'Harith Syazwan',
    receiverId: 'usr_student_new',
    receiverName: 'New PSAS Student (You)',
    content: 'Salam! Yes it is. The screen and buttons are 100% fine. I have class until 4:30 PM today if you want to inspect it at Perpustakaan Level 1.',
    timestamp: '2026-10-10 14:23'
  },
  {
    id: 'msg_init_3',
    itemId: 'item_2',
    itemTitle: 'Arduino Uno R3 Ultimate Sensor Starter Kit + Breadboard',
    senderId: 'usr_student_new',
    senderName: 'New PSAS Student (You)',
    receiverId: 'usr_syakir_009',
    receiverName: 'Ahmad Syakir',
    content: 'Hello Syakir, does the kit include the ultrasonic sensor and LCD module?',
    timestamp: '2026-10-10 15:05'
  },
  {
    id: 'msg_init_4',
    itemId: 'item_2',
    itemTitle: 'Arduino Uno R3 Ultimate Sensor Starter Kit + Breadboard',
    senderId: 'usr_syakir_009',
    senderName: 'Ahmad Syakir',
    receiverId: 'usr_student_new',
    receiverName: 'New PSAS Student (You)',
    content: 'Yes! Both HC-SR04 ultrasonic and 1602 I2C LCD modules are included inside the plastic divider box.',
    timestamp: '2026-10-10 15:11'
  }
];

export const INITIAL_SOS_RECORDS: SosAlertRecord[] = [
  {
    id: 'sos_demo_01',
    category: 'Dangerous Facility Defect',
    location: 'Laluan Berbumbung Menuju Kafeteria Kenanga',
    description: 'Dahan pokok besar patah menghalang laluan pejalan kaki selepas ribut petang.',
    timestamp: '2026-10-09 16:45',
    status: 'Demo Alert Recorded (No live dispatch)',
    callerName: 'Laporan Keselamatan Kampus',
    callerMatrix: 'PSAS-SAFETY-LOG'
  }
];

export const CAMPUS_EMERGENCY_CONTACTS = [
  {
    name: 'Unit Keselamatan PSAS (Pondok Pengawal Utama)',
    phone: '05-454 4433',
    hours: '24 Jam Setiap Hari',
    description: 'Kawalan keselamatan pintu pagar, peronda kolej, dan kecemasan dalam kampus.'
  },
  {
    name: 'Pejabat Hal Ehwal Pelajar (HEP) PSAS',
    phone: '05-454 4455',
    hours: '8:00 AM - 5:00 PM (Hari Bekerja)',
    description: 'Urusan kebajikan pelajar, insurans kemalangan berkelompok, dan kaunseling.'
  },
  {
    name: 'Warden Bertugas Kolej Kediaman PSAS',
    phone: '019-572 8821',
    hours: 'Panggilan Kecemasan Selepas 5:00 PM',
    description: 'Bantuan kecemasan asrama siswa & siswi, sakit tengah malam.'
  },
  {
    name: 'Klinik Kesihatan Behrang Stesen',
    phone: '05-454 1222',
    hours: '8:00 AM - 5:00 PM',
    description: 'Klinik kesihatan kerajaan terdekat untuk rawatan pesakit luar.'
  },
  {
    name: 'Hospital Slim River (Kecemasan & Kemalangan)',
    phone: '05-452 8333 / 999',
    hours: '24 Jam Ambulans & Wad Kecemasan',
    description: 'Hospital daerah utama terdekat untuk kecemasan kritikal.'
  },
  {
    name: 'Balai Polis Behrang Stesen (PDRM)',
    phone: '05-454 1222 / 999',
    hours: '24 Jam Operasi',
    description: 'Laporan polis jenayah, kehilangan dokumen penting, dan kemalangan jalan raya.'
  }
];

export const CAMPUS_ANNOUNCEMENTS = [
  {
    id: 'ann_1',
    title: 'Minggu Inovasi & Pameran Projek Tahun Akhir (FYP) Sesi II 2026',
    date: '14 - 16 Oktober 2026',
    venue: 'Dewan Muadzam Shah, PSAS',
    category: 'Akademik',
    details: 'Semua pelajar diploma semester akhir diwajibkan bersedia dengan poster dan prototaip fungsi mengikut rubrik penilaian.'
  },
  {
    id: 'ann_2',
    title: 'Pendaftaran Kolej Kediaman Sesi Baharu Dibuka',
    date: 'Bermula 20 Oktober 2026',
    venue: 'Portal SPMP PSAS',
    category: 'Hal Ehwal Pelajar',
    details: 'Keutamaan penempatan diberikan kepada pelajar semester 1 dan jawatankuasa aktif kolej kediaman. Pelajar lain disaran menyemak direktori sewa luar kampus.'
  },
  {
    id: 'ann_3',
    title: 'Program Bengkel Keusahawanan Siswa Campus Link 2026',
    date: '28 Oktober 2026 (Sabtu, 9:00 AM)',
    venue: 'Auditorium Perpustakaan PSAS',
    category: 'Keusahawanan',
    details: 'Bengkel percuma bimbingan penjenamaan digital, e-dagang mikro, dan pengurusan kewangan perniagaan kecil kampus.'
  }
];
