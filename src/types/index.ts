export type Language = 'en' | 'bm';

export type AppTheme = 'dark' | 'light' | 'psas_official';

export type UserRole = 'student' | 'verified_student' | 'campus_vendor';

export type ActiveRole = 'buyer' | 'seller';

export interface UserProfile {
  id: string;
  name: string;
  matrixNo: string;
  department: string; // e.g. JTMK, JKE, JKM, JP
  course: string; // e.g. Diploma Teknologi Maklumat (Digital Technology)
  semester: number;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean; // Demo distinction
  verificationNote: string;
  interests: string[];
  savedItemIds: string[];
  joinedDate: string;
  campusRating: number;
  reviewCount: number;
  activeRole?: ActiveRole; // Active perspective switch for testing both buyer and seller flows
}

export interface StoreOrder {
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  totalPrice: number;
  buyerId: string;
  buyerName: string;
  buyerMatrix: string;
  buyerPhone: string;
  sellerId?: string;
  pickupPoint: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'ready_for_pickup' | 'completed' | 'cancelled';
  createdAt: string;
}

export type ItemCondition = 'Brand New' | 'Like New' | 'Good Condition' | 'Fair Condition';

export type MarketplaceCategory =
  | 'Textbooks & Academic'
  | 'Electronics & Gadgets'
  | 'Clothing & Attire'
  | 'Student Essentials'
  | 'Student Services'
  | 'Engineering Tools';

export interface MarketplaceItem {
  id: string;
  title: string;
  category: MarketplaceCategory;
  price: number;
  condition: ItemCondition;
  description: string;
  images: string[];
  pickupLocation: string; // e.g. Perpustakaan PSAS, Kafeteria Kolej Kediaman
  sellerId: string;
  sellerName: string;
  sellerMatrix: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerVerified?: boolean;
  status: 'available' | 'reserved' | 'sold';
  isFeatured?: boolean;
  views: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: 'offer_made' | 'accepted' | 'pickup_scheduled' | 'completed' | 'cancelled';
  offerAmount: number;
  pickupLocation: string;
  pickupDateTime: string;
  pickupNotes?: string;
  paymentMethod: 'Demo Campus Pay' | 'Cash on Meetup' | 'DuitNow QR Demo';
  reviewRating?: number;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DisputeReport {
  id: string;
  transactionId: string;
  itemTitle: string;
  reportedBy: string;
  reason: 'Item not as described' | 'No show for pickup' | 'Payment dispute' | 'Counterfeit or prohibited' | 'Harassment';
  description: string;
  timestamp: string;
  status: 'Under PSAS Demo Review' | 'Resolved';
}

export interface ProhibitedViolationRecord {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerMatrix: string;
  itemTitle: string;
  category: string;
  detectedItem: string;
  reason: string;
  source: 'text' | 'image';
  timestamp: string;
}

export interface SellerRestriction {
  sellerId: string;
  sellerName: string;
  sellerMatrix: string;
  restrictedAt: string;
  reason: string;
  violationCount: number;
}

export interface SellerReview {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerMatrix: string;
  reviewerId: string;
  reviewerName: string;
  reviewerMatrix: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  tags: string[];
  itemId?: string;
  itemTitle?: string;
  isVerifiedBuyer: boolean;
  helpfulCount: number;
  helpfulVoterIds?: string[];
  createdAt: string;
}

export interface SellerReputationSummary {
  sellerId: string;
  averageRating: number;
  reviewCount: number;
  verifiedBuyerCount: number;
  breakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  topTags: { tag: string; count: number }[];
  tierLabel: 'Top Campus Seller' | 'Trusted Seller' | 'Rising Seller' | 'New Seller';
}

export interface RentalItem {
  id: string;
  title: string;
  type: 'Single Room' | 'Sharing Room' | 'Whole House' | 'Apartment';
  pricePerMonth: number;
  deposit: number;
  locationArea: string; // e.g. Taman Behrang 2020, Taman Bahtera, Proton City
  distanceToCampus: string; // e.g. 1.8 km from PSAS Gate
  address: string;
  facilities: string[];
  images: string[];
  landlordName: string;
  landlordPhone: string;
  availableFrom: string;
  genderPreference: 'Male' | 'Female' | 'Any';
  isVerifiedPartner: boolean;
  views: number;
  // Rental Owner & Advertisement management
  status?: 'Available' | 'Reserved' | 'Occupied';
  ownerId?: string;
  ownerType?: 'Direct Landlord' | 'Master Tenant (Student Senior)' | 'Property Agent';
  houseRules?: string;
  utilitiesIncluded?: boolean;
  whatsappNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalEnquiry {
  id: string;
  rentalId: string;
  rentalTitle: string;
  studentName: string;
  studentPhone: string;
  moveInDate: string;
  message: string;
  status: 'pending' | 'viewing_scheduled' | 'accepted' | 'declined';
  createdAt: string;
}

export interface StudyResource {
  id: string;
  title: string;
  department: 'JTMK' | 'JKE' | 'JKM' | 'JP' | 'JPA';
  courseCode: string; // e.g. DFC20113, DBM10013
  resourceType: 'Past Year Papers' | 'Lecture Notes' | 'Peer Tutoring' | 'Skill Exchange';
  price: number; // 0 = Free
  authorOrTutor: string;
  authorSemester: string;
  description: string;
  downloadsCount: number;
  rating: number;
  availabilitySchedule?: string;
  // Image uploads & academic material previews (up to 10 photos)
  images?: string[];
  coverImage?: string;
  // Author & Owner management
  authorId?: string;
  authorPhone?: string;
  status?: 'Active' | 'Available' | 'Fully Booked' | 'Closed';
  academicTerm?: string;
  keyTopics?: string[];
  tutoringMode?: 'Physical (Library/Cafe)' | 'Online (Google Meet)' | 'Hybrid (Physical & Online)';
  fileAttachmentName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TutoringRequest {
  id: string;
  resourceId: string;
  tutorName: string;
  tutorId?: string;
  subject: string;
  studentName: string;
  studentContact: string;
  preferredDateTime: string;
  topicsToCover: string;
  status: 'Request Sent' | 'Accepted' | 'Completed' | 'Declined';
  createdAt: string;
}

export interface CampusJob {
  id: string;
  title: string;
  employer: string;
  employerType: 'PSAS Koperasi' | 'Campus Cafe Vendor' | 'Local Behrang Business' | 'Student Freelance Team';
  payRate: string; // e.g. RM 8.00 / hour
  hours: string; // e.g. Flexible 12-16 hrs/week
  location: string;
  requirements: string[];
  description: string;
  postedDate: string;
  deadline: string;
  image?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  employer: string;
  studentName: string;
  studentMatrix: string;
  studentPhone: string;
  pitchNote: string;
  status: 'Applied' | 'Reviewing' | 'Interview Offered' | 'Accepted';
  appliedDate: string;
}

export type UtilityType = 'borrow' | 'lost_found' | 'carpool';

export interface UtilityItem {
  id: string;
  type: UtilityType;
  title: string;
  description: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  // Borrow & Rent specific
  borrowFee?: number; // 0 for free
  depositAmount?: number;
  maxDuration?: string;
  // Lost & Found specific
  statusFound?: 'lost' | 'found';
  locationPin?: string;
  claimInstruction?: string;
  image?: string;
  // Carpool specific
  routeFrom?: string;
  routeTo?: string;
  departureDate?: string;
  departureTime?: string;
  availableSeats?: number;
  fareContribution?: number; // in RM
}

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string; // primary display photo
  images?: string[]; // multiple catalog photos up to 10
  inStock: boolean;
  categoryTag?: string; // e.g. 'Snacks', 'Beverages', 'Hardware', 'Prints', 'Services', 'Handmade'
  prepTime?: string; // e.g. 'Instant / Ready Stock', 'Made to Order (15 mins)', 'Pre-order 1 Day'
  sku?: string;
  isPopular?: boolean;
  createdAt?: string;
}

export interface StudentStore {
  id: string;
  name: string;
  tagline: string;
  description: string;
  ownerId?: string; // 'usr_student_new' or custom
  ownerName: string;
  ownerMatrix: string;
  ownerPhone?: string;
  category: 'Food & Beverage' | 'Tech & Printing Services' | 'Fashion & Merch' | 'Arts & Crafts';
  bannerImage: string;
  logoImage: string;
  whatsappContact: string;
  pickupPoint: string;
  operatingHours?: string;
  products: StoreProduct[];
  rating: number;
  orderCount: number;
  isDemoStore: boolean;
  catalogCategories?: string[]; // Custom student catalog tabs/sections, e.g. ['Best Sellers', 'Combos', 'Ala Carte']
}

export interface SosAlertRecord {
  id: string;
  category: 'Medical Emergency' | 'Campus Security & Harassment' | 'Accident & Fire' | 'Dangerous Facility Defect' | 'Night Escort Request';
  location: string;
  description: string;
  timestamp: string;
  status: 'Demo Alert Recorded (No live dispatch)';
  callerName: string;
  callerMatrix: string;
  image?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  variant?: 'default' | 'ai_scan';
  scanState?: 'active' | 'scanning' | 'verified' | 'blocked';
}

export interface ChatMessage {
  id: string;
  itemId: string;
  itemTitle: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  isOfferProposal?: boolean;
  proposedPrice?: number;
  isPrivacyMasked?: boolean;
  redactedPiiCount?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'message' | 'sos' | 'system';
}
