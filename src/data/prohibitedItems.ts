export interface ProhibitedCategory {
  id: string;
  category: string;
  categoryBm: string;
  iconName: string;
  examples: string[];
  examplesBm: string[];
  reason: string;
  reasonBm: string;
  penaltyNotice: string;
  penaltyNoticeBm: string;
}

export const PROHIBITED_ITEMS_CATEGORIES: ProhibitedCategory[] = [
  {
    id: 'drugs_tobacco',
    category: 'Vapes, E-Cigarettes, Tobacco & Controlled Substances',
    categoryBm: 'Vape, Rokok Elektronik, Tembakau & Bahan Terkawal',
    iconName: 'Flame',
    examples: [
      'Vape pod & disposables',
      'E-liquid / vape juice',
      'Cigarettes & shisha',
      'Prescription medications',
      'Illicit drugs, ketum & kratom'
    ],
    examplesBm: [
      'Pod vape & vape pakai buang',
      'Flavour / cecair e-liquid',
      'Rokok, tembakau & shisha',
      'Ubat-ubatan preskripsi tanpa kelulusan KKM',
      'Ketum, ganja, dadah & pil terlarang'
    ],
    reason: 'Strictly prohibited under PSAS Student Disciplinary Rules, Kementerian Kesihatan Malaysia (KKM), and Akta Racun.',
    reasonBm: 'Dilarang keras di bawah Peraturan Tatatertib Pelajar Politeknik, Kementerian Kesihatan Malaysia (KKM), dan Akta Racun.',
    penaltyNotice: 'Immediate referral to Unit Hal Ehwal Pelajar (HEP) & disciplinary committee action.',
    penaltyNoticeBm: 'Rujukan serta-merta ke Unit Hal Ehwal Pelajar (HEP) dan tindakan tatatertib.'
  },
  {
    id: 'weapons_dangerous',
    category: 'Weapons, Explosives & Dangerous Implements',
    categoryBm: 'Senjata, Bahan Letupan & Alat Merbahaya',
    iconName: 'ShieldAlert',
    examples: [
      'Folding knives & switchblades',
      'Pepper spray & stun guns',
      'Airsoft guns, BB guns & slingshots',
      'Fireworks & firecrackers',
      'Brass knuckles & tactical batons'
    ],
    examplesBm: [
      'Pisau lipat berbahaya & kerambit',
      'Penyembur lada (pepper spray) & taser stun gun',
      'Pistol mainan BB gun / airsoft',
      'Mercun & bunga api letupan',
      'Buku lima (brass knuckle) & baton'
    ],
    reason: 'Violates campus security mandates and Section 6 of the Corrosive, Explosive and Dangerous Weapons Act.',
    reasonBm: 'Melanggar mandat keselamatan kampus PSAS dan Akta Bahan Kakisan, Letupan dan Senjata Berbahaya.',
    penaltyNotice: 'Confiscation by Campus Security & police report.',
    penaltyNoticeBm: 'Rampasan oleh Polis Bantuan PSAS & laporan kepada pihak PDRM.'
  },
  {
    id: 'academic_dishonesty',
    category: 'Academic Dishonesty & Examination Leaks',
    categoryBm: 'Ketidakjujuran Akademik & Kebocoran Peperiksaan',
    iconName: 'FileX',
    examples: [
      'Leaked final exam papers & answer schemes',
      'Assignment proxy / ghostwriting services',
      'Paid FYP / thesis writing contracts',
      'Stolen lecturer marksheets & SPMP portal login'
    ],
    examplesBm: [
      'Soalan bocor peperiksaan akhir & skema jawapan',
      'Servis upah buat assignment / joki tugasan',
      'Servis joki projek akhir (FYP) & tesis',
      'Skrip jawapan curi & maklumat login portal pensyarah'
    ],
    reason: 'Integrity violation destroying academic accreditation standards across Polytechnic departments.',
    reasonBm: 'Pelanggaran integriti akademik yang merosakkan piawaian akreditasi Politeknik Malaysia.',
    penaltyNotice: 'Zero marks, course failure, or academic suspension.',
    penaltyNoticeBm: 'Markah sifar, penggantungan semester, atau penyingkiran pengajian.'
  },
  {
    id: 'alcohol_gambling',
    category: 'Alcohol & Gambling Devices',
    categoryBm: 'Minuman Keras & Peranti Perjudian',
    iconName: 'Wine',
    examples: [
      'Beer, wine, liquor & spirits',
      'Gambling chips & casino tokens',
      'Betting pool slips & lottery tickets'
    ],
    examplesBm: [
      'Arak, bir & minuman keras beralkohol',
      'Cip perjudian & token kasino',
      'Tiket loteri & skim pertaruhan haram'
    ],
    reason: 'Campus is a gazetted alcohol-free educational zone under Malaysian Higher Education rules.',
    reasonBm: 'Kampus PSAS ialah zon pendidikan bebas alkohol di bawah peraturan pengajian tinggi Malaysia.',
    penaltyNotice: 'Severe campus hostel eviction & disciplinary fine.',
    penaltyNoticeBm: 'Tindakan pengusiran asrama & tindakan disiplin HEP.'
  },
  {
    id: 'counterfeit_pirated',
    category: 'Counterfeit Goods & Pirated Digital Licenses',
    categoryBm: 'Barangan Tiruan & Lesen Perisian Lanun',
    iconName: 'Ban',
    examples: [
      'Cracked engineering software (AutoCAD, SolidWorks, MATLAB crack keys)',
      'Fake branded luxury goods & counterfeit matrix cards',
      'Hacked streaming / university account sharing'
    ],
    examplesBm: [
      'Kunci perisian cetak rompak (AutoCAD crack, SolidWorks hack)',
      'Kad matrik palsu & barangan tiruan hakcipta',
      'Akaun strim curi / perkongsian akaun haram'
    ],
    reason: 'Infringes intellectual property law, cybersecurity guidelines, and software copyright licenses.',
    reasonBm: 'Melanggar Akta Hakcipta 1987 dan keselamatan siber politeknik.',
    penaltyNotice: 'Listing blocked & account suspension.',
    penaltyNoticeBm: 'Penyenaraian disekat & penggantungan akaun pengguna.'
  },
  {
    id: 'hazardous_appliances',
    category: 'Prohibited High-Wattage Hostel Heating Appliances',
    categoryBm: 'Peralatan Pemanas Berwatt Tinggi Asrama',
    iconName: 'ZapOff',
    examples: [
      'Immersion water heater coils (pemanas air gegelung celup)',
      'High-power hotplates & electric induction cookers in student rooms',
      'Unauthorized modified electrical wiring & splitters'
    ],
    examplesBm: [
      'Gegelung pemanas air celup (immersion water coil)',
      'Dapur elektrik voltan tinggi dalam bilik kolej kediaman',
      'Pendawaian elektrik haram yang diubah suai'
    ],
    reason: 'Major fire hazards and electrical trip hazards inside Kolej Kediaman dormitories.',
    reasonBm: 'Punca utama bahaya kebakaran dan litar pintas di Kolej Kediaman Siswa/Siswi PSAS.',
    penaltyNotice: 'Hostel warden confiscation & forfeiture.',
    penaltyNoticeBm: 'Rampasan oleh felo asrama & denda keselamatan kolej kediaman.'
  }
];

// Keywords list used for strict algorithmic detection in Title & Description
export const PROHIBITED_KEYWORDS: { term: string; category: string; reason: string }[] = [
  // Vapes & Tobacco
  { term: 'vape', category: 'Vapes & Tobacco', reason: 'Vape and e-cigarettes are prohibited in Politeknik Sultan Azlan Shah.' },
  { term: 'vapour', category: 'Vapes & Tobacco', reason: 'Vape products are prohibited on campus.' },
  { term: 'pod', category: 'Vapes & Tobacco', reason: 'E-cigarette pods and cartridges are prohibited.' },
  { term: 'relx', category: 'Vapes & Tobacco', reason: 'Vape devices and pods (RELX) are prohibited on campus.' },
  { term: 'caliburn', category: 'Vapes & Tobacco', reason: 'Vape devices and pods are prohibited on campus.' },
  { term: 'voopoo', category: 'Vapes & Tobacco', reason: 'Vape devices and pods are prohibited on campus.' },
  { term: 'juul', category: 'Vapes & Tobacco', reason: 'E-cigarettes and pods are prohibited on campus.' },
  { term: 'nicotine', category: 'Vapes & Tobacco', reason: 'Nicotine and vape products are strictly banned on campus.' },
  { term: 'e-liquid', category: 'Vapes & Tobacco', reason: 'E-liquids and vape juices are prohibited substances.' },
  { term: 'flavour vape', category: 'Vapes & Tobacco', reason: 'Vape juices are prohibited on campus.' },
  { term: 'rokok', category: 'Vapes & Tobacco', reason: 'Cigarettes and tobacco products are strictly banned.' },
  { term: 'cigarette', category: 'Vapes & Tobacco', reason: 'Cigarettes and tobacco products are strictly banned.' },
  { term: 'cigarettes', category: 'Vapes & Tobacco', reason: 'Cigarettes and tobacco products are strictly banned.' },
  { term: 'shisha', category: 'Vapes & Tobacco', reason: 'Shisha/hookah products are strictly prohibited.' },
  { term: 'ketum', category: 'Controlled Substances', reason: 'Ketum/kratom is an illegal controlled poison in Malaysia.' },
  { term: 'ganja', category: 'Controlled Substances', reason: 'Cannabis/weed is strictly illegal under Malaysian law.' },
  { term: 'weed', category: 'Controlled Substances', reason: 'Cannabis is strictly illegal under Malaysian law.' },
  { term: 'drugs', category: 'Controlled Substances', reason: 'Controlled substances are prohibited.' },
  { term: 'pil kuda', category: 'Controlled Substances', reason: 'Prohibited illicit substance.' },

  // Weapons & Dangerous items
  { term: 'pisau lipat', category: 'Weapons', reason: 'Tactical knives and sharp blades are prohibited weapons.' },
  { term: 'kerambit', category: 'Weapons', reason: 'Bladed weapons are strictly illegal on campus grounds.' },
  { term: 'switchblade', category: 'Weapons', reason: 'Concealed blades are prohibited weapons.' },
  { term: 'knife', category: 'Weapons', reason: 'Knives and sharp blades are prohibited in the student marketplace.' },
  { term: 'dagger', category: 'Weapons', reason: 'Bladed weapons are strictly prohibited on campus.' },
  { term: 'pepper spray', category: 'Weapons', reason: 'Pepper spray is a restricted defensive weapon.' },
  { term: 'taser', category: 'Weapons', reason: 'Stun guns/tasers are prohibited implements.' },
  { term: 'airsoft', category: 'Weapons', reason: 'Replica firearms and airsoft guns are illegal on campus.' },
  { term: 'bb gun', category: 'Weapons', reason: 'Projectile weapons are prohibited.' },
  { term: 'mercun', category: 'Explosives', reason: 'Firecrackers and fireworks are illegal on campus.' },
  { term: 'firecracker', category: 'Explosives', reason: 'Explosives and firecrackers are illegal.' },
  { term: 'fireworks', category: 'Explosives', reason: 'Fireworks and explosives are strictly prohibited on campus.' },
  { term: 'buku lima', category: 'Weapons', reason: 'Brass knuckles are classified as dangerous weapons.' },

  // Academic cheating
  { term: 'soalan bocor', category: 'Academic Dishonesty', reason: 'Leaked examination materials violate academic integrity.' },
  { term: 'exam leak', category: 'Academic Dishonesty', reason: 'Leaked examination materials violate academic integrity.' },
  { term: 'skema bocor', category: 'Academic Dishonesty', reason: 'Leaked examination schemes are strictly prohibited.' },
  { term: 'joki assignment', category: 'Academic Dishonesty', reason: 'Assignment ghostwriting/proxying violates PSAS academic rules.' },
  { term: 'upah assignment', category: 'Academic Dishonesty', reason: 'Paid assignment writing services are prohibited.' },
  { term: 'joki fyp', category: 'Academic Dishonesty', reason: 'Paid FYP/thesis completion is strictly prohibited.' },
  { term: 'upah fyp', category: 'Academic Dishonesty', reason: 'Paid FYP/thesis completion is strictly prohibited.' },
  { term: 'ghostwrite', category: 'Academic Dishonesty', reason: 'Ghostwriting academic coursework is prohibited.' },

  // Alcohol & Gambling
  { term: 'arak', category: 'Alcohol', reason: 'Alcoholic beverages are strictly prohibited in PSAS.' },
  { term: 'beer', category: 'Alcohol', reason: 'Alcohol is prohibited on campus.' },
  { term: 'wine', category: 'Alcohol', reason: 'Alcoholic beverages are strictly prohibited on campus.' },
  { term: 'whisky', category: 'Alcohol', reason: 'Alcoholic beverages are strictly prohibited on campus.' },
  { term: 'vodka', category: 'Alcohol', reason: 'Alcoholic beverages are strictly prohibited on campus.' },
  { term: 'liquor', category: 'Alcohol', reason: 'Alcohol is prohibited on campus.' },
  { term: 'judi', category: 'Gambling', reason: 'Gambling devices and betting activities are illegal.' },
  { term: 'gambling', category: 'Gambling', reason: 'Gambling items and tokens are prohibited.' },

  // Counterfeits & Hacks
  { term: 'software crack', category: 'Counterfeits & Piracy', reason: 'Pirated software license cracking violates copyright law.' },
  { term: 'cracked autocad', category: 'Counterfeits & Piracy', reason: 'Pirated software keys are prohibited.' },
  { term: 'cracked solidworks', category: 'Counterfeits & Piracy', reason: 'Pirated software keys are prohibited.' },
  { term: 'kad matrik palsu', category: 'Counterfeit Documents', reason: 'Falsifying student identification is a major crime.' },
  { term: 'fake matrix card', category: 'Counterfeit Documents', reason: 'Falsifying student identification is a major crime.' },

  // Dorm safety hazards
  { term: 'pemanas air celup', category: 'Hostel Fire Hazard', reason: 'Immersion heating coils are hazardous and banned in PSAS hostels.' },
  { term: 'water heater coil', category: 'Hostel Fire Hazard', reason: 'Immersion heating coils are hazardous and banned in PSAS hostels.' },
  { term: 'dapur elektrik asrama', category: 'Hostel Fire Hazard', reason: 'High-wattage electric cookers are banned inside dorm rooms.' }
];

export interface ProhibitedCheckResult {
  isBlocked: boolean;
  detectedWord?: string;
  category?: string;
  reason?: string;
  source?: 'text' | 'image';
}

/**
 * Validates listing title, description, and uploaded image URLs/filenames against campus prohibited goods criteria.
 */
export function checkProhibitedContent(title: string, description: string, images: string[] = []): ProhibitedCheckResult {
  const combinedText = `${title} ${description}`.toLowerCase();

  // 1. Check title & description text
  for (const item of PROHIBITED_KEYWORDS) {
    const regex = new RegExp(`\\b${item.term.toLowerCase()}\\b`, 'i');
    if (regex.test(combinedText) || combinedText.includes(item.term.toLowerCase())) {
      return {
        isBlocked: true,
        detectedWord: item.term,
        category: item.category,
        reason: item.reason,
        source: 'text'
      };
    }
  }

  // 2. Check uploaded image URLs, metadata filenames, and known image hashes/keywords
  for (const imgUrl of images) {
    if (!imgUrl) continue;
    const lowerImg = imgUrl.toLowerCase();

    for (const item of PROHIBITED_KEYWORDS) {
      if (lowerImg.includes(item.term.toLowerCase())) {
        return {
          isBlocked: true,
          detectedWord: `Image containing ${item.term}`,
          category: item.category,
          reason: `The uploaded image is flagged as a prohibited ${item.category} item. Selling this item is not allowed on Campus Corner.`,
          source: 'image'
        };
      }
    }
  }

  return { isBlocked: false };
}

/**
 * Quick checker specifically for single or newly uploaded image file names or data URLs
 */
export function checkProhibitedImage(imageSource: string): ProhibitedCheckResult {
  if (!imageSource) return { isBlocked: false };
  const lowerImg = imageSource.toLowerCase();

  for (const item of PROHIBITED_KEYWORDS) {
    if (lowerImg.includes(item.term.toLowerCase())) {
      return {
        isBlocked: true,
        detectedWord: item.term,
        category: item.category,
        reason: `Image detected as prohibited ${item.category} (${item.term}). It is not allowed to be sold in the marketplace.`,
        source: 'image'
      };
    }
  }

  return { isBlocked: false };
}
