import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  ActiveRole,
  MarketplaceItem,
  Transaction,
  RentalItem,
  RentalEnquiry,
  StudyResource,
  TutoringRequest,
  CampusJob,
  JobApplication,
  UtilityItem,
  StudentStore,
  StoreProduct,
  StoreOrder,
  SosAlertRecord,
  DisputeReport,
  ChatMessage,
  Language,
  AppTheme,
  ToastMessage,
  AppNotification,
  ProhibitedViolationRecord,
  SellerRestriction,
  SellerReview,
  SellerReputationSummary
} from '../types';
import {
  INITIAL_USER,
  INITIAL_MARKETPLACE,
  INITIAL_TRANSACTIONS,
  INITIAL_RENTALS,
  INITIAL_STUDY_RESOURCES,
  INITIAL_JOBS,
  INITIAL_UTILITIES,
  INITIAL_STORES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SOS_RECORDS,
  INITIAL_MESSAGES,
  INITIAL_SELLER_REVIEWS
} from '../data/initialData';

interface AppContextType {
  // Navigation & UI
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  
  // User Profile & Role Switcher
  user: UserProfile;
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
  updateUser: (updated: Partial<UserProfile>) => void;
  toggleVerifiedStatus: () => void;
  toggleSavedItem: (itemId: string) => void;

  // Marketplace
  marketplaceItems: MarketplaceItem[];
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'views' | 'sellerId' | 'sellerName' | 'sellerMatrix' | 'sellerAvatar' | 'sellerRating'>) => void;
  updateMarketplaceItem: (id: string, updated: Partial<MarketplaceItem>) => void;
  deleteMarketplaceItem: (id: string) => void;
  setItemStatus: (id: string, status: 'available' | 'reserved' | 'sold') => void;

  // Prohibited Item Compliance & Seller Tracking
  prohibitedViolations: ProhibitedViolationRecord[];
  restrictedSellers: Record<string, SellerRestriction>;
  isSellerRestricted: (sellerId?: string) => boolean;
  getSellerRestriction: (sellerId?: string) => SellerRestriction | null;
  recordProhibitedAttempt: (attempt: {
    itemTitle: string;
    category: string;
    detectedItem: string;
    reason: string;
    source: 'text' | 'image';
  }) => void;
  clearSellerRestriction: (sellerId?: string) => void;

  // Transactions & Offers
  transactions: Transaction[];
  createOffer: (itemId: string, offerAmount: number, notes?: string) => void;
  acceptOffer: (transactionId: string) => void;
  schedulePickup: (transactionId: string, location: string, dateTime: string, notes?: string) => void;
  completeTransaction: (transactionId: string, rating: number, review: string) => void;
  cancelTransaction: (transactionId: string) => void;

  // Seller Reviews & Campus Reputation
  sellerReviews: SellerReview[];
  addSellerReview: (review: {
    sellerId: string;
    sellerName: string;
    sellerMatrix: string;
    rating: number;
    comment: string;
    tags: string[];
    itemId?: string;
    itemTitle?: string;
  }) => boolean;
  toggleReviewHelpful: (reviewId: string) => void;
  getSellerReputation: (sellerId: string, fallbackRating?: number) => SellerReputationSummary;

  // Real-Time Buyer-Seller Messaging & Privacy Controls
  messages: ChatMessage[];
  blockedPeerIds: string[];
  sendMessage: (
    itemId: string,
    itemTitle: string,
    receiverId: string,
    receiverName: string,
    content: string,
    isOfferProposal?: boolean,
    proposedPrice?: number,
    options?: {
      isPrivacyMasked?: boolean;
      senderDisplayName?: string;
      redactedPiiCount?: number;
    }
  ) => void;
  toggleBlockPeer: (peerId: string, peerName?: string) => void;
  clearItemMessages: (itemId: string) => void;

  // Disputes
  disputes: DisputeReport[];
  submitDispute: (transactionId: string, reason: DisputeReport['reason'], description: string) => void;

  // Rentals & Owner Advertising Hub
  rentals: RentalItem[];
  rentalEnquiries: RentalEnquiry[];
  submitRentalEnquiry: (rentalId: string, name: string, phone: string, moveInDate: string, message: string) => void;
  postRental: (rental: Omit<RentalItem, 'id' | 'views'>) => void;
  updateRental: (rentalId: string, updates: Partial<RentalItem>) => void;
  deleteRental: (rentalId: string) => void;
  updateRentalEnquiryStatus: (enquiryId: string, status: RentalEnquiry['status']) => void;

  // Study Resources & Tutoring
  studyResources: StudyResource[];
  tutoringRequests: TutoringRequest[];
  requestTutoring: (resourceId: string, topic: string, preferredDateTime: string, contact: string) => void;
  downloadResource: (resourceId: string) => void;
  postStudyResource: (resource: Omit<StudyResource, 'id' | 'downloadsCount' | 'rating'>) => void;
  updateStudyResource: (resourceId: string, updates: Partial<StudyResource>) => void;
  deleteStudyResource: (resourceId: string) => void;
  updateTutoringRequestStatus: (requestId: string, status: TutoringRequest['status']) => void;

  // Jobs
  jobs: CampusJob[];
  jobApplications: JobApplication[];
  applyForJob: (jobId: string, pitchNote: string, phone: string) => void;
  postJob: (job: Omit<CampusJob, 'id' | 'postedDate'>) => void;

  // Utilities (Borrow, Lost & Found, Carpool)
  utilities: UtilityItem[];
  addUtilityItem: (item: Omit<UtilityItem, 'id' | 'createdAt'>) => void;
  reserveCarpoolSeat: (utilityId: string) => void;

  // Stores & Product Catalogs
  stores: StudentStore[];
  storeOrders: StoreOrder[];
  createStore: (store: Omit<StudentStore, 'id' | 'rating' | 'orderCount' | 'isDemoStore' | 'ownerName' | 'ownerMatrix'>) => void;
  updateStore: (storeId: string, updates: Partial<StudentStore>) => void;
  deleteStore: (storeId: string) => void;
  addProductToStore: (storeId: string, product: Omit<StoreProduct, 'id'>) => void;
  updateStoreProduct: (storeId: string, productId: string, updates: Partial<StoreProduct>) => void;
  deleteStoreProduct: (storeId: string, productId: string) => void;
  toggleProductStock: (storeId: string, productId: string) => void;
  placeStoreOrder: (order: Omit<StoreOrder, 'id' | 'createdAt' | 'status' | 'buyerId' | 'buyerName' | 'buyerMatrix' | 'buyerPhone'>) => void;
  updateStoreOrderStatus: (orderId: string, status: StoreOrder['status']) => void;

  // SOS Emergency
  sosRecords: SosAlertRecord[];
  recordDemoSos: (category: SosAlertRecord['category'], location: string, description: string, image?: string) => void;

  // Notifications & Toasts
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  toasts: ToastMessage[];
  addToast: (
    type: ToastMessage['type'],
    title: string,
    message: string,
    options?: {
      id?: string;
      variant?: ToastMessage['variant'];
      scanState?: ToastMessage['scanState'];
      durationMs?: number;
    }
  ) => string;
  removeToast: (id: string) => void;

  // System
  resetDemoData: () => void;
  isSplashScreenVisible: boolean;
  showSplashScreen: () => void;
  hideSplashScreen: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'campus_corner_v2_user',
  MARKETPLACE: 'campus_corner_v2_marketplace',
  TRANSACTIONS: 'campus_corner_v2_transactions',
  RENTALS: 'campus_corner_v2_rentals',
  RENTAL_ENQUIRIES: 'campus_corner_v2_rental_enquiries',
  STUDY: 'campus_corner_v2_study',
  TUTORING: 'campus_corner_v2_tutoring',
  JOBS: 'campus_corner_v2_jobs',
  JOB_APPS: 'campus_corner_v2_job_apps',
  UTILITIES: 'campus_corner_v2_utilities',
  STORES: 'campus_corner_v2_stores',
  STORE_ORDERS: 'campus_corner_v2_store_orders',
  ROLE: 'campus_corner_v2_role',
  MESSAGES: 'campus_corner_v2_messages',
  SOS: 'campus_corner_v2_sos',
  DISPUTES: 'campus_corner_v2_disputes',
  NOTIFICATIONS: 'campus_corner_v2_notifications',
  PROHIBITED_VIOLATIONS: 'campus_corner_v2_prohibited_violations',
  RESTRICTED_SELLERS: 'campus_corner_v2_restricted_sellers',
  SELLER_REVIEWS: 'campus_corner_v2_seller_reviews',
  BLOCKED_PEERS: 'campus_corner_v2_blocked_peers',
  LANG: 'campus_corner_v2_lang',
  THEME: 'campus_corner_v2_theme',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return saved === 'bm' ? 'bm' : 'en';
  });
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'psas_official') {
      return saved as AppTheme;
    }
    return 'dark';
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else if (theme === 'psas_official') {
      root.classList.remove('dark');
      root.classList.add('psas-official');
    } else {
      root.classList.remove('light', 'psas-official');
      root.classList.add('dark');
    }
  }, [theme]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState<boolean>(true);

  const showSplashScreen = () => setIsSplashScreenVisible(true);
  const hideSplashScreen = () => setIsSplashScreenVisible(false);

  // User & Role State (Buyer vs Seller perspective)
  const [activeRole, setActiveRoleState] = useState<ActiveRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return saved === 'seller' ? 'seller' : 'buyer';
  });

  const setActiveRole = (role: ActiveRole) => {
    setActiveRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    addToast(
      'info',
      role === 'seller' ? 'Switched to Seller Mode' : 'Switched to Buyer Mode',
      role === 'seller'
        ? 'Viewing merchant controls, incoming buyer orders, stock status, and listings.'
        : 'Viewing student buyer catalog, add-to-cart, offers, and verified reviews.'
    );
  };

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed?.name?.includes('Danial') ||
          parsed?.name?.includes('Farhan') ||
          parsed?.matrixNo === '08DEP22F1042'
        ) {
          localStorage.removeItem(STORAGE_KEYS.USER);
          return INITIAL_USER;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER;
  });

  // Marketplace State
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MARKETPLACE);
      if (saved) {
        const parsed = JSON.parse(saved) as MarketplaceItem[];
        const initialVerifiedById = new Map(
          INITIAL_MARKETPLACE.map((item) => [item.id, item.sellerVerified])
        );
        return parsed.map((item) => ({
          ...item,
          sellerVerified:
            item.sellerVerified !== undefined
              ? item.sellerVerified
              : initialVerifiedById.get(item.id) ?? false,
        }));
      }
    } catch {
      // fall back to initial marketplace
    }
    return INITIAL_MARKETPLACE;
  });

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Rentals State
  const [rentals, setRentals] = useState<RentalItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RENTALS);
    return saved ? JSON.parse(saved) : INITIAL_RENTALS;
  });

  const [rentalEnquiries, setRentalEnquiries] = useState<RentalEnquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RENTAL_ENQUIRIES);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'enq_sample_1',
        rentalId: 'rent_my_sample',
        rentalTitle: 'Bilik Master Luas Lengkap Perabot @ Taman Behrang 2020 (Siswa/Siswi)',
        studentName: 'Zulhelmi Bin Rosli (JKE PSAS)',
        studentPhone: '+60 17-644 1982',
        moveInDate: '2026-11-01',
        message: 'Salam tuan, saya pelajar semester 3 JKE. Boleh saya setkan masa petang Sabtu ini untuk tengok bilik master?',
        status: 'viewing_scheduled',
        createdAt: '2026-10-09',
      },
      {
        id: 'enq_sample_2',
        rentalId: 'rent_1',
        rentalTitle: 'Bilik Single Lelaki Katil Queen @ Taman Behrang 2020',
        studentName: 'Afiq Najmi (JTMK)',
        studentPhone: '+60 13-912 3044',
        moveInDate: '2026-10-25',
        message: 'Bilik single masih ada kekosongan lagi ke? Nak tanya sekali deposit boleh bayar separuh dulu ke?',
        status: 'pending',
        createdAt: '2026-10-10',
      }
    ];
  });

  // Study Resources State
  const [studyResources, setStudyResources] = useState<StudyResource[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDY);
    return saved ? JSON.parse(saved) : INITIAL_STUDY_RESOURCES;
  });

  const [tutoringRequests, setTutoringRequests] = useState<TutoringRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TUTORING);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'tutor_req_sample_1',
        resourceId: 'study_my_1',
        tutorName: 'New PSAS Student (You)',
        tutorId: 'usr_student_new',
        subject: 'Web Programming (React & Node.js) Project & Lab Peer Tutoring',
        studentName: 'Muhammad Hariz (JTMK Sem 3)',
        studentContact: '+60 11-2384 9912',
        preferredDateTime: 'Rabu 5:30 PM (Perpustakaan PSAS Aras 2)',
        topicsToCover: 'Need guidance on React state management, useEffect hooks, and Tailwind flexbox layout for upcoming Lab Assessment 2.',
        status: 'Accepted',
        createdAt: '2026-10-09',
      },
      {
        id: 'tutor_req_sample_2',
        resourceId: 'study_3',
        tutorName: 'Kugan a/l Rajan',
        subject: '1-on-1 Peer Tutoring: Circuit Theory & Digital Logic',
        studentName: 'New PSAS Student',
        studentContact: '+60 12-345 6789',
        preferredDateTime: 'Khamis 8:30 PM (Google Meet)',
        topicsToCover: 'Thévenin Theorem calculations & Norton equivalent circuit questions from June 2024 Past Year Paper.',
        status: 'Request Sent',
        createdAt: '2026-10-10',
      }
    ];
  });

  // Jobs State
  const [jobs, setJobs] = useState<CampusJob[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOB_APPS);
    return saved ? JSON.parse(saved) : [];
  });

  // Utilities State
  const [utilities, setUtilities] = useState<UtilityItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.UTILITIES);
    return saved ? JSON.parse(saved) : INITIAL_UTILITIES;
  });

  // Stores State
  const [stores, setStores] = useState<StudentStore[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORES);
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });

  // Store Orders State (For Buyer and Seller checkout/fulfillment)
  const [storeOrders, setStoreOrders] = useState<StoreOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORE_ORDERS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ord_sample_101',
        storeId: 'store_student_my',
        storeName: 'Kenanga Dorm Bites & Craft Hub',
        productId: 'p_my_1',
        productName: 'Matcha Cream Croissant (Fresh Baked)',
        productImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
        price: 5.5,
        quantity: 2,
        totalPrice: 11.0,
        buyerId: 'usr_buyer_amira',
        buyerName: 'Amira Yasmin (JTMK)',
        buyerMatrix: '08DNS23F1088',
        buyerPhone: '+60 19-332 9941',
        sellerId: 'usr_student_new',
        pickupPoint: 'Kafe Blok Kenanga (Aras Bawah)',
        notes: 'Sila bungkus asing-asing ya. Ambil lepas solat Asar.',
        status: 'accepted',
        createdAt: '2026-10-10',
      },
      {
        id: 'ord_sample_102',
        storeId: 'store_student_my',
        storeName: 'Kenanga Dorm Bites & Craft Hub',
        productId: 'p_my_2',
        productName: 'Iced Artisan Matcha Latte (500ml Bottle)',
        productImage: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
        price: 7.0,
        quantity: 1,
        totalPrice: 7.0,
        buyerId: 'usr_buyer_danish',
        buyerName: 'Danish Haiqal (JKM)',
        buyerMatrix: '08DKM22F2004',
        buyerPhone: '+60 17-882 1044',
        sellerId: 'usr_student_new',
        pickupPoint: 'Kafe Blok Kenanga (Aras Bawah)',
        notes: 'Kurang manis (less sweet)',
        status: 'pending',
        createdAt: '2026-10-10',
      }
    ];
  });

  // SOS Records
  const [sosRecords, setSosRecords] = useState<SosAlertRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOS);
    return saved ? JSON.parse(saved) : INITIAL_SOS_RECORDS;
  });

  // Disputes
  const [disputes, setDisputes] = useState<DisputeReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DISPUTES);
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Prohibited Violations & Restricted Sellers
  const [prohibitedViolations, setProhibitedViolations] = useState<ProhibitedViolationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROHIBITED_VIOLATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restrictedSellers, setRestrictedSellers] = useState<Record<string, SellerRestriction>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESTRICTED_SELLERS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Seller Reviews State
  const [sellerReviews, setSellerReviews] = useState<SellerReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELLER_REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_SELLER_REVIEWS;
    } catch {
      return INITIAL_SELLER_REVIEWS;
    }
  });

  // Blocked P2P Chat Peers
  const [blockedPeerIds, setBlockedPeerIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_PEERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cleanup old keys once on mount to ensure fresh student profile state
  useEffect(() => {
    try {
      const oldKeys = [
        'campus_corner_psas_user',
        'campus_corner_psas_marketplace',
        'campus_corner_psas_transactions',
        'campus_corner_psas_rentals',
        'campus_corner_psas_sos',
      ];
      oldKeys.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MARKETPLACE, JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentals));
  }, [rentals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RENTAL_ENQUIRIES, JSON.stringify(rentalEnquiries));
  }, [rentalEnquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDY, JSON.stringify(studyResources));
  }, [studyResources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TUTORING, JSON.stringify(tutoringRequests));
  }, [tutoringRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOB_APPS, JSON.stringify(jobApplications));
  }, [jobApplications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UTILITIES, JSON.stringify(utilities));
  }, [utilities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORE_ORDERS, JSON.stringify(storeOrders));
  }, [storeOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOS, JSON.stringify(sosRecords));
  }, [sosRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROHIBITED_VIOLATIONS, JSON.stringify(prohibitedViolations));
  }, [prohibitedViolations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESTRICTED_SELLERS, JSON.stringify(restrictedSellers));
  }, [restrictedSellers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELLER_REVIEWS, JSON.stringify(sellerReviews));
  }, [sellerReviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOCKED_PEERS, JSON.stringify(blockedPeerIds));
  }, [blockedPeerIds]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  const toastTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeToast = (id: string) => {
    if (toastTimersRef.current[id]) {
      clearTimeout(toastTimersRef.current[id]);
      delete toastTimersRef.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (
    type: ToastMessage['type'],
    title: string,
    message: string,
    options?: {
      id?: string;
      variant?: ToastMessage['variant'];
      scanState?: ToastMessage['scanState'];
      durationMs?: number;
    }
  ): string => {
    const id =
      options?.id ||
      'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);

    if (toastTimersRef.current[id]) {
      clearTimeout(toastTimersRef.current[id]);
      delete toastTimersRef.current[id];
    }

    const nextToast: ToastMessage = {
      id,
      type,
      title,
      message,
      variant: options?.variant || 'default',
      scanState: options?.scanState,
    };

    setToasts((prev) => {
      const exists = prev.some((t) => t.id === id);
      if (exists) {
        return prev.map((t) => (t.id === id ? nextToast : t));
      }
      return [...prev, nextToast];
    });

    const durationMs = options?.durationMs !== undefined ? options.durationMs : 4500;
    if (durationMs > 0) {
      toastTimersRef.current[id] = setTimeout(() => {
        removeToast(id);
      }, durationMs);
    }

    return id;
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
    addToast('success', 'Profile Updated', 'Student profile details saved locally.');
  };

  const toggleVerifiedStatus = () => {
    const nextStatus = !user.isVerified;
    setUser((prev) => ({ ...prev, isVerified: nextStatus }));
    setMarketplaceItems((prev) =>
      prev.map((item) =>
        item.sellerId === user.id || item.sellerName.includes('You')
          ? { ...item, sellerVerified: nextStatus }
          : item
      )
    );
    addToast(
      nextStatus ? 'success' : 'info',
      nextStatus ? 'Student Verified (Demo)' : 'Switched to Demo Account',
      nextStatus
        ? 'Matrix status verified with PSAS Academic Management Portal. Your Marketplace listings now show Verified Seller.'
        : 'Reverted back to standard prototype demo account.'
    );
  };

  const toggleSavedItem = (itemId: string) => {
    setUser((prev) => {
      const isSaved = prev.savedItemIds.includes(itemId);
      const newSaved = isSaved
        ? prev.savedItemIds.filter((id) => id !== itemId)
        : [...prev.savedItemIds, itemId];
      addToast(
        isSaved ? 'info' : 'success',
        isSaved ? 'Item Removed' : 'Item Saved',
        isSaved ? 'Removed from your saved items.' : 'Saved to your favourites list.'
      );
      return { ...prev, savedItemIds: newSaved };
    });
  };

  // Prohibited Item Compliance & Seller Tracking Actions
  const isSellerRestricted = (sellerId?: string): boolean => {
    const targetId = sellerId || user.id;
    return Boolean(restrictedSellers[targetId]);
  };

  const getSellerRestriction = (sellerId?: string): SellerRestriction | null => {
    const targetId = sellerId || user.id;
    return restrictedSellers[targetId] || null;
  };

  const recordProhibitedAttempt = (attempt: {
    itemTitle: string;
    category: string;
    detectedItem: string;
    reason: string;
    source: 'text' | 'image';
  }) => {
    const timestamp = new Date().toLocaleString();
    const record: ProhibitedViolationRecord = {
      id: 'viol_' + Date.now() + Math.random().toString(36).substring(2, 5),
      sellerId: user.id,
      sellerName: user.name,
      sellerMatrix: user.matrixNo,
      itemTitle: attempt.itemTitle || 'Untitled Listing',
      category: attempt.category,
      detectedItem: attempt.detectedItem,
      reason: attempt.reason,
      source: attempt.source,
      timestamp,
    };

    setProhibitedViolations((prev) => [record, ...prev]);

    setRestrictedSellers((prev) => {
      const existing = prev[user.id];
      return {
        ...prev,
        [user.id]: {
          sellerId: user.id,
          sellerName: user.name,
          sellerMatrix: user.matrixNo,
          restrictedAt: existing?.restrictedAt || timestamp,
          reason: `${attempt.category}: ${attempt.detectedItem} (${attempt.source === 'image' ? 'Image Scan' : 'Listing Scan'})`,
          violationCount: (existing?.violationCount || 0) + 1,
        },
      };
    });

    setNotifications((prev) => [
      {
        id: 'notif_prohib_' + Date.now(),
        title: 'Seller Restricted: Prohibited Item Detected',
        message: `${user.name} (${user.matrixNo}) is not allowed to sell or publish items after attempting "${attempt.detectedItem}" (${attempt.category}).`,
        time: 'Just now',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  const clearSellerRestriction = (sellerId?: string) => {
    const targetId = sellerId || user.id;
    setRestrictedSellers((prev) => {
      const next = { ...prev };
      delete next[targetId];
      return next;
    });
    addToast(
      'info',
      'Seller Compliance Reset (Demo)',
      'Marketplace selling restriction cleared for demonstration testing.'
    );
  };

  // Marketplace Actions
  const addMarketplaceItem = (
    itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'views' | 'sellerId' | 'sellerName' | 'sellerMatrix' | 'sellerAvatar' | 'sellerRating'>
  ) => {
    if (isSellerRestricted(user.id)) {
      addToast(
        'error',
        'Publishing Blocked',
        'Your seller account is restricted from selling or publishing items due to a prohibited item violation.'
      );
      return;
    }
    const newItem: MarketplaceItem = {
      ...itemData,
      id: 'item_' + Date.now(),
      sellerId: user.id,
      sellerName: user.name + ' (You)',
      sellerMatrix: user.matrixNo,
      sellerAvatar: user.avatarUrl,
      sellerRating: user.campusRating,
      sellerVerified: user.isVerified,
      views: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMarketplaceItems((prev) => [newItem, ...prev]);
    addToast('success', 'Listing Created!', `"${newItem.title}" is now visible to PSAS students.`);
  };

  const updateMarketplaceItem = (id: string, updated: Partial<MarketplaceItem>) => {
    if (isSellerRestricted(user.id)) {
      addToast(
        'error',
        'Editing Blocked',
        'Your seller account is restricted from selling or publishing items due to a prohibited item violation.'
      );
      return;
    }
    setMarketplaceItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    addToast('success', 'Listing Updated', 'Item information was updated.');
  };

  const deleteMarketplaceItem = (id: string) => {
    setMarketplaceItems((prev) => prev.filter((item) => item.id !== id));
    addToast('info', 'Listing Deleted', 'The item has been removed from the marketplace.');
  };

  const setItemStatus = (id: string, status: 'available' | 'reserved' | 'sold') => {
    setMarketplaceItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    addToast(
      'info',
      'Status Changed',
      `Listing marked as ${status.toUpperCase()}.`
    );
  };

  // Transaction Actions
  const createOffer = (itemId: string, offerAmount: number, notes?: string) => {
    const targetItem = marketplaceItems.find((i) => i.id === itemId);
    if (!targetItem) return;

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      itemId: targetItem.id,
      itemTitle: targetItem.title,
      itemImage: targetItem.images[0] || '',
      itemPrice: targetItem.price,
      buyerId: user.id,
      buyerName: user.name + ' (You)',
      sellerId: targetItem.sellerId,
      sellerName: targetItem.sellerName,
      status: 'offer_made',
      offerAmount,
      pickupLocation: targetItem.pickupLocation,
      pickupDateTime: 'To be arranged with seller',
      pickupNotes: notes,
      paymentMethod: 'Demo Campus Pay',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setTransactions((prev) => [newTx, ...prev]);
    addToast(
      'success',
      'Simulated Offer Submitted',
      `Offer of RM ${offerAmount.toFixed(2)} sent to ${targetItem.sellerName}.`
    );
  };

  const acceptOffer = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId
          ? { ...tx, status: 'accepted', updatedAt: new Date().toISOString().split('T')[0] }
          : tx
      )
    );
    // Mark item reserved
    const tx = transactions.find((t) => t.id === transactionId);
    if (tx) {
      setItemStatus(tx.itemId, 'reserved');
    }
    addToast('success', 'Offer Accepted', 'Please agree on campus pickup date and location.');
  };

  const schedulePickup = (
    transactionId: string,
    location: string,
    dateTime: string,
    notes?: string
  ) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId
          ? {
              ...tx,
              status: 'pickup_scheduled',
              pickupLocation: location,
              pickupDateTime: dateTime,
              pickupNotes: notes,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : tx
      )
    );
    addToast('success', 'Campus Meetup Confirmed', `Pickup set for ${dateTime} at ${location}.`);
  };

  const getSellerReputation = (
    sellerId: string,
    fallbackRating?: number
  ): SellerReputationSummary => {
    const reviewsForSeller = sellerReviews.filter((r) => r.sellerId === sellerId);
    const breakdown: { 5: number; 4: number; 3: number; 2: number; 1: number } = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    if (reviewsForSeller.length === 0) {
      return {
        sellerId,
        averageRating: fallbackRating ?? 0,
        reviewCount: 0,
        verifiedBuyerCount: 0,
        breakdown,
        topTags: [],
        tierLabel: 'New Seller',
      };
    }

    let ratingSum = 0;
    let verifiedBuyerCount = 0;
    const tagCounts: Record<string, number> = {};

    for (const rev of reviewsForSeller) {
      const clamped = Math.min(5, Math.max(1, Math.round(rev.rating))) as 1 | 2 | 3 | 4 | 5;
      breakdown[clamped] += 1;
      ratingSum += rev.rating;
      if (rev.isVerifiedBuyer) verifiedBuyerCount += 1;
      for (const tag of rev.tags || []) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }

    const averageRating = Number((ratingSum / reviewsForSeller.length).toFixed(1));
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const tierLabel: SellerReputationSummary['tierLabel'] =
      averageRating >= 4.7 && reviewsForSeller.length >= 2
        ? 'Top Campus Seller'
        : averageRating >= 4.0
        ? 'Trusted Seller'
        : 'Rising Seller';

    return {
      sellerId,
      averageRating,
      reviewCount: reviewsForSeller.length,
      verifiedBuyerCount,
      breakdown,
      topTags,
      tierLabel,
    };
  };

  const addSellerReview = (input: {
    sellerId: string;
    sellerName: string;
    sellerMatrix: string;
    rating: number;
    comment: string;
    tags: string[];
    itemId?: string;
    itemTitle?: string;
  }): boolean => {
    if (input.sellerId === user.id) {
      addToast('warning', 'Self-Review Not Allowed', 'You cannot submit a rating or review for your own seller account.');
      return false;
    }

    const trimmedComment = input.comment.trim();
    if (!trimmedComment) {
      addToast('warning', 'Review Comment Required', 'Please write a short comment about your experience with this seller.');
      return false;
    }

    const clampedRating = Math.min(5, Math.max(1, Math.round(input.rating)));
    const hasCompletedDeal = transactions.some(
      (t) =>
        t.sellerId === input.sellerId &&
        t.status === 'completed' &&
        (t.buyerId === user.id || t.buyerName.includes('You'))
    );

    const newReview: SellerReview = {
      id: 'rev_' + Date.now(),
      sellerId: input.sellerId,
      sellerName: input.sellerName,
      sellerMatrix: input.sellerMatrix,
      reviewerId: user.id,
      reviewerName: user.name,
      reviewerMatrix: user.matrixNo,
      reviewerAvatar: user.avatarUrl,
      rating: clampedRating,
      comment: trimmedComment,
      tags: input.tags,
      itemId: input.itemId,
      itemTitle: input.itemTitle,
      isVerifiedBuyer: hasCompletedDeal,
      helpfulCount: 0,
      helpfulVoterIds: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedSellerReviews = [newReview, ...sellerReviews];
    setSellerReviews(updatedSellerReviews);

    const sellerOnly = updatedSellerReviews.filter((r) => r.sellerId === input.sellerId);
    const newAvg = Number(
      (sellerOnly.reduce((sum, r) => sum + r.rating, 0) / sellerOnly.length).toFixed(1)
    );

    setMarketplaceItems((prev) =>
      prev.map((item) =>
        item.sellerId === input.sellerId ? { ...item, sellerRating: newAvg } : item
      )
    );

    addToast(
      'success',
      'Seller Review Published',
      `Your ${clampedRating}★ review for ${input.sellerName} is now live on campus Marketplace.`
    );
    return true;
  };

  const toggleReviewHelpful = (reviewId: string) => {
    setSellerReviews((prev) =>
      prev.map((rev) => {
        if (rev.id !== reviewId) return rev;
        const voters = rev.helpfulVoterIds || [];
        const hasVoted = voters.includes(user.id);
        return {
          ...rev,
          helpfulCount: hasVoted ? Math.max(0, rev.helpfulCount - 1) : rev.helpfulCount + 1,
          helpfulVoterIds: hasVoted
            ? voters.filter((id) => id !== user.id)
            : [...voters, user.id],
        };
      })
    );
  };

  const completeTransaction = (transactionId: string, rating: number, review: string) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId
          ? {
              ...tx,
              status: 'completed',
              reviewRating: rating,
              reviewComment: review,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : tx
      )
    );
    const tx = transactions.find((t) => t.id === transactionId);
    if (tx) {
      setItemStatus(tx.itemId, 'sold');

      const sellerListing = marketplaceItems.find((i) => i.sellerId === tx.sellerId);
      const txReview: SellerReview = {
        id: 'rev_tx_' + Date.now(),
        sellerId: tx.sellerId,
        sellerName: tx.sellerName,
        sellerMatrix: sellerListing?.sellerMatrix || 'PSAS-STUDENT',
        reviewerId: user.id,
        reviewerName: user.name,
        reviewerMatrix: user.matrixNo,
        reviewerAvatar: user.avatarUrl,
        rating,
        comment: review.trim() || 'Completed campus meetup transaction.',
        tags: ['On-Time Meetup', 'Item As Described'],
        itemId: tx.itemId,
        itemTitle: tx.itemTitle,
        isVerifiedBuyer: true,
        helpfulCount: 0,
        helpfulVoterIds: [],
        createdAt: new Date().toISOString().split('T')[0],
      };

      const nextReviews = [txReview, ...sellerReviews];
      setSellerReviews(nextReviews);

      const sellerOnly = nextReviews.filter((r) => r.sellerId === tx.sellerId);
      const newAvg = Number(
        (sellerOnly.reduce((sum, r) => sum + r.rating, 0) / sellerOnly.length).toFixed(1)
      );

      setMarketplaceItems((prev) =>
        prev.map((item) =>
          item.sellerId === tx.sellerId ? { ...item, sellerRating: newAvg } : item
        )
      );
    }
    addToast('success', 'Transaction Completed & Reviewed!', `Submitted ${rating}★ feedback for ${tx?.sellerName || 'seller'}.`);
  };

  const sendMessage = (
    itemId: string,
    itemTitle: string,
    receiverId: string,
    receiverName: string,
    content: string,
    isOfferProposal?: boolean,
    proposedPrice?: number,
    options?: {
      isPrivacyMasked?: boolean;
      senderDisplayName?: string;
      redactedPiiCount?: number;
    }
  ) => {
    if (blockedPeerIds.includes(receiverId)) {
      addToast('warning', 'Peer Blocked', `Unblock ${receiverName} to resume messaging.`);
      return;
    }

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      itemId,
      itemTitle,
      senderId: user.id,
      senderName: options?.senderDisplayName || user.name,
      senderAvatar: options?.isPrivacyMasked ? undefined : user.avatarUrl,
      receiverId,
      receiverName,
      content,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isOfferProposal,
      proposedPrice,
      isPrivacyMasked: options?.isPrivacyMasked,
      redactedPiiCount: options?.redactedPiiCount,
    };

    setMessages((prev) => [...prev, newMsg]);

    addToast(
      'info',
      'Secure Message Sent',
      `Delivered privately to ${receiverName} regarding "${itemTitle}".`
    );
  };

  const toggleBlockPeer = (peerId: string, peerName = 'Student Peer') => {
    setBlockedPeerIds((prev) => {
      const exists = prev.includes(peerId);
      if (exists) {
        addToast('info', 'Peer Unblocked', `You can now receive and send messages with ${peerName}.`);
        return prev.filter((id) => id !== peerId);
      }
      addToast('warning', 'Peer Blocked for Privacy', `${peerName} has been blocked from contacting you.`);
      return [...prev, peerId];
    });
  };

  const clearItemMessages = (itemId: string) => {
    setMessages((prev) => prev.filter((m) => m.itemId !== itemId));
    addToast('info', 'Thread Cleared', 'Local conversation history for this listing was removed.');
  };

  const cancelTransaction = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId
          ? { ...tx, status: 'cancelled', updatedAt: new Date().toISOString().split('T')[0] }
          : tx
      )
    );
    const tx = transactions.find((t) => t.id === transactionId);
    if (tx) {
      setItemStatus(tx.itemId, 'available');
    }
    addToast('info', 'Transaction Cancelled', 'Item has been returned to available status.');
  };

  const submitDispute = (
    transactionId: string,
    reason: DisputeReport['reason'],
    description: string
  ) => {
    const tx = transactions.find((t) => t.id === transactionId);
    const newDispute: DisputeReport = {
      id: 'disp_' + Date.now(),
      transactionId,
      itemTitle: tx?.itemTitle || 'Marketplace Item',
      reportedBy: user.name,
      reason,
      description,
      timestamp: new Date().toLocaleString(),
      status: 'Under PSAS Demo Review',
    };
    setDisputes((prev) => [newDispute, ...prev]);
    addToast('warning', 'Dispute Filed', 'Simulated report logged under student mediation.');
  };

  // Rentals & Owner Hub
  const submitRentalEnquiry = (
    rentalId: string,
    name: string,
    phone: string,
    moveInDate: string,
    message: string
  ) => {
    const targetRental = rentals.find((r) => r.id === rentalId);
    const enquiry: RentalEnquiry = {
      id: 'enq_' + Date.now(),
      rentalId,
      rentalTitle: targetRental?.title || 'Accommodation',
      studentName: name,
      studentPhone: phone,
      moveInDate,
      message,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRentalEnquiries((prev) => [enquiry, ...prev]);
    addToast('success', 'Viewing Enquiry Sent', `Rental owner ${targetRental?.landlordName || ''} notified via inquiry.`);
  };

  const postRental = (rentalData: Omit<RentalItem, 'id' | 'views'>) => {
    const newRental: RentalItem = {
      ...rentalData,
      id: 'rent_' + Date.now(),
      views: 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: rentalData.status || 'Available',
    };
    setRentals((prev) => [newRental, ...prev]);
    addToast('success', 'Rental Advertised', 'Your accommodation advertisement is now published on PSAS Accommodation Hub!');
  };

  const updateRental = (rentalId: string, updates: Partial<RentalItem>) => {
    setRentals((prev) =>
      prev.map((r) => (r.id === rentalId ? { ...r, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : r))
    );
    addToast('success', 'Rental Updated', 'Listing details and rental availability updated successfully.');
  };

  const deleteRental = (rentalId: string) => {
    setRentals((prev) => prev.filter((r) => r.id !== rentalId));
    addToast('info', 'Rental Removed', 'The accommodation listing has been removed.');
  };

  const updateRentalEnquiryStatus = (enquiryId: string, status: RentalEnquiry['status']) => {
    setRentalEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status } : e))
    );
    addToast('success', 'Enquiry Updated', `Status updated to ${status.replace('_', ' ')}.`);
  };

  // Study Resources
  const requestTutoring = (
    resourceId: string,
    topic: string,
    preferredDateTime: string,
    contact: string
  ) => {
    const res = studyResources.find((r) => r.id === resourceId);
    const req: TutoringRequest = {
      id: 'tutor_req_' + Date.now(),
      resourceId,
      tutorName: res?.authorOrTutor || 'Peer Tutor',
      subject: res?.title || 'Subject',
      studentName: user.name,
      studentContact: contact,
      preferredDateTime,
      topicsToCover: topic,
      status: 'Request Sent',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTutoringRequests((prev) => [req, ...prev]);
    addToast('success', 'Tutoring Session Requested', `Request sent to ${res?.authorOrTutor}.`);
  };

  const downloadResource = (resourceId: string) => {
    setStudyResources((prev) =>
      prev.map((r) =>
        r.id === resourceId ? { ...r, downloadsCount: r.downloadsCount + 1 } : r
      )
    );
    addToast('info', 'Demo Resource Accessed', 'Sample PSAS revision notes opened for preview.');
  };

  const postStudyResource = (
    resourceData: Omit<StudyResource, 'id' | 'downloadsCount' | 'rating'>
  ) => {
    const defaultCover =
      resourceData.coverImage ||
      resourceData.images?.[0] ||
      (resourceData.resourceType === 'Peer Tutoring' || resourceData.resourceType === 'Skill Exchange'
        ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80');

    const newResource: StudyResource = {
      ...resourceData,
      id: 'study_' + Date.now(),
      downloadsCount: 0,
      rating: 5.0,
      status: resourceData.status || 'Available',
      coverImage: defaultCover,
      images: resourceData.images && resourceData.images.length > 0 ? resourceData.images : [defaultCover],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setStudyResources((prev) => [newResource, ...prev]);
    addToast(
      'success',
      'Resource / Tutoring Published',
      `"${newResource.title}" is now published on PSAS Academic Resources & Peer Tutoring!`
    );
  };

  const updateStudyResource = (
    resourceId: string,
    updates: Partial<StudyResource>
  ) => {
    setStudyResources((prev) =>
      prev.map((r) => {
        if (r.id !== resourceId) return r;
        const updatedImages = updates.images !== undefined ? updates.images : r.images;
        const updatedCover =
          updates.coverImage ||
          (updatedImages && updatedImages.length > 0 ? updatedImages[0] : r.coverImage);

        return {
          ...r,
          ...updates,
          coverImage: updatedCover,
          images: updatedImages,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
    addToast('success', 'Academic Post Updated', 'Study resource / tutoring details updated successfully.');
  };

  const deleteStudyResource = (resourceId: string) => {
    setStudyResources((prev) => prev.filter((r) => r.id !== resourceId));
    addToast('info', 'Post Removed', 'Study resource / tutoring post has been deleted.');
  };

  const updateTutoringRequestStatus = (
    requestId: string,
    status: TutoringRequest['status']
  ) => {
    setTutoringRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status } : req))
    );
    addToast(
      'success',
      'Tutoring Request Updated',
      `Session status changed to "${status}".`
    );
  };

  // Jobs
  const applyForJob = (jobId: string, pitchNote: string, phone: string) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    const application: JobApplication = {
      id: 'app_' + Date.now(),
      jobId,
      jobTitle: targetJob?.title || 'Job',
      employer: targetJob?.employer || 'Campus Employer',
      studentName: user.name,
      studentMatrix: user.matrixNo,
      studentPhone: phone,
      pitchNote,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setJobApplications((prev) => [application, ...prev]);
    addToast('success', 'Application Submitted', `Application sent to ${targetJob?.employer}.`);
  };

  const postJob = (jobData: Omit<CampusJob, 'id' | 'postedDate'>) => {
    const newJob: CampusJob = {
      ...jobData,
      id: 'job_' + Date.now(),
      postedDate: new Date().toISOString().split('T')[0],
    };
    setJobs((prev) => [newJob, ...prev]);
    addToast('success', 'Vacancy Posted', `Job listing "${newJob.title}" is now active.`);
  };

  // Utilities
  const addUtilityItem = (itemData: Omit<UtilityItem, 'id' | 'createdAt'>) => {
    const newUtil: UtilityItem = {
      ...itemData,
      id: 'util_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUtilities((prev) => [newUtil, ...prev]);
    addToast('success', 'Utility Notice Posted', `Listing "${newUtil.title}" published.`);
  };

  const reserveCarpoolSeat = (utilityId: string) => {
    setUtilities((prev) =>
      prev.map((item) => {
        if (item.id === utilityId && (item.availableSeats || 0) > 0) {
          const updatedSeats = (item.availableSeats || 1) - 1;
          addToast('success', 'Seat Reserved!', `Carpool seat booked. Please contact driver ${item.contactName}.`);
          return { ...item, availableSeats: updatedSeats };
        }
        return item;
      })
    );
  };

  // Stores & Product Catalogs
  const createStore = (
    storeData: Omit<StudentStore, 'id' | 'rating' | 'orderCount' | 'isDemoStore' | 'ownerName' | 'ownerMatrix'>
  ) => {
    const newStore: StudentStore = {
      ...storeData,
      id: 'store_' + Date.now(),
      ownerId: user.id,
      ownerName: user.name,
      ownerMatrix: user.matrixNo,
      ownerPhone: user.phone,
      rating: 5.0,
      orderCount: 0,
      isDemoStore: true,
      products: storeData.products || [],
      catalogCategories: storeData.catalogCategories || ['General', 'Best Sellers', 'New Arrivals'],
    };
    setStores((prev) => [newStore, ...prev]);
    addToast('success', 'Student Storefront Created!', `Store "${newStore.name}" is now published.`);
  };

  const updateStore = (storeId: string, updates: Partial<StudentStore>) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, ...updates } : s))
    );
    addToast('success', 'Store Updated', 'Storefront profile and catalog settings updated.');
  };

  const deleteStore = (storeId: string) => {
    setStores((prev) => prev.filter((s) => s.id !== storeId));
    addToast('info', 'Storefront Removed', 'The store and its catalog items have been removed.');
  };

  const addProductToStore = (
    storeId: string,
    product: Omit<StoreProduct, 'id'>
  ) => {
    const newProd: StoreProduct = {
      ...product,
      id: 'prod_' + Date.now(),
      inStock: product.inStock ?? true,
      images: product.images && product.images.length > 0 ? product.images : [product.image],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStores((prev) =>
      prev.map((store) => {
        if (store.id === storeId) {
          // If product has a categoryTag not yet in catalogCategories, append it
          const existingCats = store.catalogCategories || [];
          const updatedCats =
            newProd.categoryTag && !existingCats.includes(newProd.categoryTag)
              ? [...existingCats, newProd.categoryTag]
              : existingCats;

          return {
            ...store,
            catalogCategories: updatedCats,
            products: [newProd, ...store.products],
          };
        }
        return store;
      })
    );
    addToast('success', 'Product Posted to Catalog!', `Added "${product.name}" to store inventory.`);
  };

  const updateStoreProduct = (
    storeId: string,
    productId: string,
    updates: Partial<StoreProduct>
  ) => {
    setStores((prev) =>
      prev.map((store) => {
        if (store.id === storeId) {
          return {
            ...store,
            products: store.products.map((p) =>
              p.id === productId ? { ...p, ...updates } : p
            ),
          };
        }
        return store;
      })
    );
    addToast('success', 'Product Updated', 'Product details saved to catalog.');
  };

  const deleteStoreProduct = (storeId: string, productId: string) => {
    setStores((prev) =>
      prev.map((store) => {
        if (store.id === storeId) {
          return {
            ...store,
            products: store.products.filter((p) => p.id !== productId),
          };
        }
        return store;
      })
    );
    addToast('info', 'Item Removed', 'Product removed from store catalog.');
  };

  const toggleProductStock = (storeId: string, productId: string) => {
    setStores((prev) =>
      prev.map((store) => {
        if (store.id === storeId) {
          return {
            ...store,
            products: store.products.map((p) =>
              p.id === productId ? { ...p, inStock: !p.inStock } : p
            ),
          };
        }
        return store;
      })
    );
  };

  const placeStoreOrder = (
    orderData: Omit<StoreOrder, 'id' | 'createdAt' | 'status' | 'buyerId' | 'buyerName' | 'buyerMatrix' | 'buyerPhone'>
  ) => {
    const newOrder: StoreOrder = {
      ...orderData,
      id: 'ord_' + Date.now(),
      buyerId: user.id,
      buyerName: user.name,
      buyerMatrix: user.matrixNo,
      buyerPhone: user.phone,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStoreOrders((prev) => [newOrder, ...prev]);

    // Also increment store order count
    setStores((prev) =>
      prev.map((s) =>
        s.id === orderData.storeId
          ? { ...s, orderCount: (s.orderCount || 0) + 1 }
          : s
      )
    );

    addToast(
      'success',
      'Order Placed Successfully!',
      `Sent order for ${orderData.quantity}x "${orderData.productName}" (RM ${orderData.totalPrice.toFixed(2)}) to ${orderData.storeName}.`
    );
  };

  const updateStoreOrderStatus = (orderId: string, status: StoreOrder['status']) => {
    setStoreOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    const readableStatus =
      status === 'accepted'
        ? 'Accepted by Merchant'
        : status === 'ready_for_pickup'
        ? 'Ready for Campus Pickup'
        : status === 'completed'
        ? 'Completed & Paid'
        : 'Cancelled';
    addToast('info', 'Order Status Updated', `Order #${orderId.slice(-6)} is now ${readableStatus}.`);
  };

  // SOS Emergency
  const recordDemoSos = (
    category: SosAlertRecord['category'],
    location: string,
    description: string,
    image?: string
  ) => {
    const newRecord: SosAlertRecord = {
      id: 'sos_' + Date.now(),
      category,
      location,
      description,
      image,
      timestamp: new Date().toLocaleString(),
      status: 'Demo Alert Recorded (No live dispatch)',
      callerName: user.name,
      callerMatrix: user.matrixNo,
    };
    setSosRecords((prev) => [newRecord, ...prev]);
    addToast(
      'warning',
      'Demo Alert Recorded',
      'Demo alert recorded — no emergency service has been contacted.'
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetDemoData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setMarketplaceItems(INITIAL_MARKETPLACE);
    setTransactions(INITIAL_TRANSACTIONS);
    setRentals(INITIAL_RENTALS);
    setRentalEnquiries([]);
    setStudyResources(INITIAL_STUDY_RESOURCES);
    setTutoringRequests([]);
    setJobs(INITIAL_JOBS);
    setJobApplications([]);
    setUtilities(INITIAL_UTILITIES);
    setStores(INITIAL_STORES);
    setSosRecords(INITIAL_SOS_RECORDS);
    setDisputes([]);
    setNotifications(INITIAL_NOTIFICATIONS);
    setProhibitedViolations([]);
    setRestrictedSellers({});
    setSellerReviews(INITIAL_SELLER_REVIEWS);
    setBlockedPeerIds([]);
    setLanguageState('en');
    setCurrentTab('dashboard');
    addToast('info', 'Demo Data Reset', 'All records have been restored to initial prototype state.');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        language,
        setLanguage,
        searchQuery,
        setSearchQuery,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isSosModalOpen,
        setIsSosModalOpen,
        user,
        activeRole,
        setActiveRole,
        updateUser,
        toggleVerifiedStatus,
        toggleSavedItem,
        marketplaceItems,
        addMarketplaceItem,
        updateMarketplaceItem,
        deleteMarketplaceItem,
        setItemStatus,
        prohibitedViolations,
        restrictedSellers,
        isSellerRestricted,
        getSellerRestriction,
        recordProhibitedAttempt,
        clearSellerRestriction,
        transactions,
        createOffer,
        acceptOffer,
        schedulePickup,
        completeTransaction,
        cancelTransaction,
        sellerReviews,
        addSellerReview,
        toggleReviewHelpful,
        getSellerReputation,
        messages,
        blockedPeerIds,
        sendMessage,
        toggleBlockPeer,
        clearItemMessages,
        disputes,
        submitDispute,
        rentals,
        rentalEnquiries,
        submitRentalEnquiry,
        postRental,
        updateRental,
        deleteRental,
        updateRentalEnquiryStatus,
        studyResources,
        tutoringRequests,
        requestTutoring,
        downloadResource,
        postStudyResource,
        updateStudyResource,
        deleteStudyResource,
        updateTutoringRequestStatus,
        jobs,
        jobApplications,
        applyForJob,
        postJob,
        utilities,
        addUtilityItem,
        reserveCarpoolSeat,
        stores,
        storeOrders,
        createStore,
        updateStore,
        deleteStore,
        addProductToStore,
        updateStoreProduct,
        deleteStoreProduct,
        toggleProductStock,
        placeStoreOrder,
        updateStoreOrderStatus,
        sosRecords,
        recordDemoSos,
        notifications,
        markNotificationRead,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
        isSplashScreenVisible,
        showSplashScreen,
        hideSplashScreen,
        theme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
