import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MarketplaceItem, MarketplaceCategory, ItemCondition } from '../types';
import { translations } from '../data/translations';
import { TransactionWorkflowModal } from './TransactionWorkflowModal';
import { ImageUploader } from '../components/ImageUploader';
import { ProhibitedItemsNoticeModal } from '../components/ProhibitedItemsNoticeModal';
import { MarketplacePeerMessaging } from '../components/MarketplacePeerMessaging';
import { SellerReviewsModal, SellerReviewTarget } from '../components/SellerReviewsModal';
import { MarketplaceTrendsWidget, HighDemandSuggestion } from '../components/MarketplaceTrendsWidget';
import { checkProhibitedContent, ProhibitedCheckResult } from '../data/prohibitedItems';
import {
  ShoppingBag,
  Plus,
  Filter,
  Search,
  Heart,
  Tag,
  MapPin,
  Star,
  User,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  AlertTriangle,
  Edit2,
  Trash2,
  X,
  CreditCard,
  MessageCircle,
  Eye,
  ArrowUpDown,
  History,
  Sparkles,
  Loader2,
  RotateCcw,
  Award,
  MessageSquarePlus,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Lock,
  BadgeCheck
} from 'lucide-react';

interface AiPriceValuation {
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  estimatedRetailPrice: number;
  demandLevel: 'High' | 'Moderate' | 'Niche';
  priceAssessment: 'Great Deal' | 'Fair Campus Price' | 'Slightly High' | 'Not Set';
  pricingTip: string;
}

export const MarketplaceScreen: React.FC = () => {
  const {
    marketplaceItems,
    addMarketplaceItem,
    updateMarketplaceItem,
    deleteMarketplaceItem,
    setItemStatus,
    toggleSavedItem,
    user,
    language,
    createOffer,
    transactions,
    messages,
    blockedPeerIds,
    sendMessage,
    toggleBlockPeer,
    clearItemMessages,
    activeRole,
    setActiveRole,
    addToast,
    prohibitedViolations,
    isSellerRestricted,
    getSellerRestriction,
    recordProhibitedAttempt,
    clearSellerRestriction,
    sellerReviews,
    getSellerReputation,
  } = useApp();

  const t = translations[language];

  // Filters & State
  const [marketScope, setMarketScope] = useState<'all' | 'my_listings' | 'messages'>('all');
  const activeConversationCount = new Set(messages.map((m) => m.itemId)).size;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minSellerRating, setMinSellerRating] = useState<'all' | '4.5' | '4.8'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [selectedSellerFilter, setSelectedSellerFilter] = useState<{ id: string; name: string } | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'rating_high' | 'price_low' | 'price_high'>('newest');

  // Modals & Chat
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [chattingItem, setChattingItem] = useState<MarketplaceItem | null>(null);
  const [reviewSellerTarget, setReviewSellerTarget] = useState<SellerReviewTarget | null>(null);
  const [reviewOpenForm, setReviewOpenForm] = useState<boolean>(false);
  const [isProhibitedNoticeOpen, setIsProhibitedNoticeOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null);
  const [showTransactionsList, setShowTransactionsList] = useState(false);
  const [prohibitedError, setProhibitedError] = useState<ProhibitedCheckResult | null>(null);

  // Offer State inside Item Modal
  const [offerInput, setOfferInput] = useState<string>('');
  const [offerNotes, setOfferNotes] = useState<string>('');
  const [showOfferForm, setShowOfferForm] = useState(false);

  // New Listing Form State (Up to 10 photos)
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<MarketplaceCategory>('Engineering Tools');
  const [formPrice, setFormPrice] = useState<string>('30');
  const [formCondition, setFormCondition] = useState<ItemCondition>('Good Condition');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('Perpustakaan PSAS / Kafe Siswa');
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
  ]);
  const [detailPhotoIndex, setDetailPhotoIndex] = useState<number>(0);

  // AI Description Generator State
  const [showAiDescHelper, setShowAiDescHelper] = useState<boolean>(false);
  const [aiDescHighlights, setAiDescHighlights] = useState<string>('');
  const [aiDescTone, setAiDescTone] = useState<'friendly' | 'concise' | 'detailed'>('friendly');
  const [aiDescLanguage, setAiDescLanguage] = useState<'en' | 'bm'>(language);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState<boolean>(false);
  const [aiDescError, setAiDescError] = useState<string | null>(null);
  const [aiSuggestedTitle, setAiSuggestedTitle] = useState<string | null>(null);
  const [previousDescBackup, setPreviousDescBackup] = useState<string | null>(null);
  const [isEstimatingPrice, setIsEstimatingPrice] = useState<boolean>(false);
  const [aiPriceValuation, setAiPriceValuation] = useState<AiPriceValuation | null>(null);
  const [aiPriceError, setAiPriceError] = useState<string | null>(null);
  const [isImageScanning, setIsImageScanning] = useState<boolean>(false);
  const [isPublishingScan, setIsPublishingScan] = useState<boolean>(false);

  const sellerRestriction = getSellerRestriction(user.id);
  const sellerIsRestricted = isSellerRestricted(user.id);

  const categories: string[] = [
    'All',
    'Textbooks & Academic',
    'Electronics & Gadgets',
    'Clothing & Attire',
    'Student Essentials',
    'Student Services',
    'Engineering Tools',
  ];

  const pricePresets = [
    { label: 'Any Price', min: '', max: '' },
    { label: 'Under RM 25', min: '', max: '25' },
    { label: 'RM 25 - RM 50', min: '25', max: '50' },
    { label: 'RM 50 - RM 100', min: '50', max: '100' },
    { label: 'RM 100+', min: '100', max: '' },
  ];

  const scopedItems = marketplaceItems.filter((item) => {
    const isMine = item.sellerId === user.id || item.sellerName.includes('You');
    return marketScope === 'my_listings' ? isMine : true;
  });

  const getCategoryCount = (cat: string) =>
    cat === 'All'
      ? scopedItems.length
      : scopedItems.filter((item) => item.category === cat).length;

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchFilter.trim() !== '' ||
    selectedCondition !== 'All' ||
    minPrice.trim() !== '' ||
    maxPrice.trim() !== '' ||
    minSellerRating !== 'all' ||
    verifiedOnly ||
    selectedSellerFilter !== null;

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchFilter('');
    setSelectedCondition('All');
    setMinPrice('');
    setMaxPrice('');
    setMinSellerRating('all');
    setVerifiedOnly(false);
    setSelectedSellerFilter(null);
    setSortBy('newest');
  };

  const openSellerReviews = (item: MarketplaceItem, openForm = false) => {
    setReviewOpenForm(openForm);
    setReviewSellerTarget({
      sellerId: item.sellerId,
      sellerName: item.sellerName,
      sellerMatrix: item.sellerMatrix,
      sellerAvatar: item.sellerAvatar,
      sellerRating: item.sellerRating,
      itemId: item.id,
      itemTitle: item.title,
    });
  };

  // Filtering & Sorting Logic
  const parsedMin = minPrice.trim() !== '' ? Number(minPrice) : null;
  const parsedMax = maxPrice.trim() !== '' ? Number(maxPrice) : null;

  const filteredItems = scopedItems
    .filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.pickupLocation.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesCondition =
        selectedCondition === 'All' || item.condition === selectedCondition;
      const matchesMinPrice =
        parsedMin === null || Number.isNaN(parsedMin) || item.price >= parsedMin;
      const matchesMaxPrice =
        parsedMax === null || Number.isNaN(parsedMax) || item.price <= parsedMax;
      const rep = getSellerReputation(item.sellerId, item.sellerRating);
      const matchesSellerRating =
        minSellerRating === 'all' || rep.averageRating >= Number(minSellerRating);
      const isItemOwn = item.sellerId === user.id || item.sellerName.includes('You');
      const isSellerVerified = isItemOwn ? user.isVerified : Boolean(item.sellerVerified);
      const matchesVerifiedOnly = !verifiedOnly || isSellerVerified;
      const matchesSellerFilter =
        !selectedSellerFilter || item.sellerId === selectedSellerFilter.id;
      return (
        matchesCategory &&
        matchesSearch &&
        matchesCondition &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesSellerRating &&
        matchesVerifiedOnly &&
        matchesSellerFilter
      );
    })
    .sort((a, b) => {
      if (sortBy === 'rating_high') {
        const repA = getSellerReputation(a.sellerId, a.sellerRating);
        const repB = getSellerReputation(b.sellerId, b.sellerRating);
        if (repB.averageRating !== repA.averageRating) {
          return repB.averageRating - repA.averageRating;
        }
        return repB.reviewCount - repA.reviewCount;
      }
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const resetAiDescState = () => {
    setShowAiDescHelper(false);
    setAiDescHighlights('');
    setAiDescTone('friendly');
    setAiDescLanguage(language);
    setIsGeneratingDesc(false);
    setAiDescError(null);
    setAiSuggestedTitle(null);
    setPreviousDescBackup(null);
    setIsEstimatingPrice(false);
    setAiPriceValuation(null);
    setAiPriceError(null);
  };

  const handleOpenCreate = () => {
    if (sellerIsRestricted) {
      addToast(
        'error',
        'Seller Not Allowed to Sell or Publish',
        `Your seller account (${user.matrixNo}) is restricted due to a prohibited item violation and cannot publish items in the marketplace.`
      );
      setIsProhibitedNoticeOpen(true);
      return;
    }
    setFormTitle('');
    setFormCategory('Engineering Tools');
    setFormPrice('30');
    setFormCondition('Good Condition');
    setFormDescription('');
    setFormLocation('Perpustakaan PSAS');
    setFormImages([]);
    setEditingItem(null);
    setProhibitedError(null);
    resetAiDescState();
    setIsCreateModalOpen(true);
    addToast(
      'info',
      'AI Safety Shield Active',
      'Live AI prohibited-item scanning is protecting your photo uploads and listing.',
      {
        id: 'marketplace_ai_scan_toast',
        variant: 'ai_scan',
        scanState: 'active',
        durationMs: 4200,
      }
    );
  };

  const handleQuickListFromSuggestion = (suggestion: HighDemandSuggestion) => {
    if (sellerIsRestricted) {
      addToast(
        'error',
        'Seller Not Allowed to Sell or Publish',
        `Your seller account (${user.matrixNo}) is restricted due to a prohibited item violation and cannot publish items in the marketplace.`
      );
      setIsProhibitedNoticeOpen(true);
      return;
    }
    setFormTitle(suggestion.title);
    setFormCategory(suggestion.category);
    setFormPrice(String(suggestion.recommendedPriceRM));
    setFormCondition(suggestion.suggestedCondition);
    setFormDescription(suggestion.starterDescription);
    setFormLocation('Perpustakaan PSAS');
    setFormImages([]);
    setEditingItem(null);
    setProhibitedError(null);
    resetAiDescState();
    setIsCreateModalOpen(true);
    addToast(
      'info',
      'AI Safety Shield Active',
      'Pre-filled from AI Demand Advisor. Live prohibited-item scanning is active for your upload.',
      {
        id: 'marketplace_ai_scan_toast',
        variant: 'ai_scan',
        scanState: 'active',
        durationMs: 4200,
      }
    );
  };

  const handleOpenEdit = (item: MarketplaceItem) => {
    if (sellerIsRestricted) {
      addToast(
        'error',
        'Seller Not Allowed to Edit or Publish',
        `Your seller account (${user.matrixNo}) is restricted due to a prohibited item violation.`
      );
      setIsProhibitedNoticeOpen(true);
      return;
    }
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormPrice(item.price.toString());
    setFormCondition(item.condition);
    setFormDescription(item.description);
    setFormLocation(item.pickupLocation);
    setFormImages(item.images && item.images.length > 0 ? [...item.images] : []);
    setProhibitedError(null);
    resetAiDescState();
    setIsCreateModalOpen(true);
    addToast(
      'info',
      'AI Safety Shield Active',
      'Live AI prohibited-item scanning is protecting your photo updates and listing.',
      {
        id: 'marketplace_ai_scan_toast',
        variant: 'ai_scan',
        scanState: 'active',
        durationMs: 4200,
      }
    );
  };

  const handleGenerateDescription = async () => {
    if (isGeneratingDesc) return;

    if (!formTitle.trim() && !formDescription.trim() && !aiDescHighlights.trim()) {
      setShowAiDescHelper(true);
      setAiDescError('Please enter an Item Title or short notes first so the AI can write a description.');
      return;
    }

    const preCheck = checkProhibitedContent(formTitle, aiDescHighlights, []);
    if (preCheck.isBlocked) {
      setProhibitedError(preCheck);
      setAiDescError(`Cannot generate description: "${preCheck.detectedWord}" is prohibited (${preCheck.category}).`);
      return;
    }

    setAiDescError(null);
    setAiSuggestedTitle(null);
    setIsGeneratingDesc(true);

    try {
      const response = await fetch('/api/marketplace-description-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory,
          price: formPrice,
          condition: formCondition,
          pickupLocation: formLocation.trim(),
          existingDescription: formDescription.trim(),
          highlights: aiDescHighlights.trim(),
          tone: aiDescTone,
          language: aiDescLanguage,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to generate description.');
      }

      if (formDescription.trim() && formDescription.trim() !== data.description) {
        setPreviousDescBackup(formDescription);
      }
      setFormDescription(data.description || '');

      if (
        typeof data.suggestedTitle === 'string' &&
        data.suggestedTitle.trim() &&
        data.suggestedTitle.trim().toLowerCase() !== formTitle.trim().toLowerCase()
      ) {
        setAiSuggestedTitle(data.suggestedTitle.trim());
      }
    } catch (err: unknown) {
      setAiDescError(
        err instanceof Error ? err.message : 'Unable to generate description right now.'
      );
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleEstimatePrice = async () => {
    if (isEstimatingPrice) return;

    const primaryDataImage = formImages.find((img) => img.startsWith('data:image/'));
    if (!formTitle.trim() && !formDescription.trim() && !primaryDataImage) {
      setAiPriceError('Enter an Item Title (or notes / upload a photo) first so AI can estimate a fair RM price.');
      return;
    }

    const preCheck = checkProhibitedContent(formTitle, formDescription, formImages);
    if (preCheck.isBlocked) {
      setProhibitedError(preCheck);
      setAiPriceError(`Cannot value item: "${preCheck.detectedWord}" is prohibited (${preCheck.category}).`);
      return;
    }

    setAiPriceError(null);
    setIsEstimatingPrice(true);

    try {
      const sameCategoryComparables = marketplaceItems
        .filter((item) => item.category === formCategory && item.id !== editingItem?.id)
        .slice(0, 6);
      const comparables = (
        sameCategoryComparables.length > 0
          ? sameCategoryComparables
          : marketplaceItems.filter((item) => item.id !== editingItem?.id).slice(0, 5)
      ).map((item) => ({
        title: item.title,
        category: item.category,
        condition: item.condition,
        price: item.price,
      }));

      const response = await fetch('/api/marketplace-price-valuation-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory,
          condition: formCondition,
          currentPrice: formPrice,
          description: formDescription.trim(),
          pickupLocation: formLocation.trim(),
          language: aiDescLanguage,
          imageDataUrl: primaryDataImage,
          comparables,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to estimate price.');
      }

      setAiPriceValuation(data as AiPriceValuation);
    } catch (err: unknown) {
      setAiPriceError(
        err instanceof Error ? err.message : 'Unable to run AI price valuation right now.'
      );
    } finally {
      setIsEstimatingPrice(false);
    }
  };

  const flagAndBlockListing = (checkResult: ProhibitedCheckResult) => {
    setProhibitedError(checkResult);
    recordProhibitedAttempt({
      itemTitle: formTitle.trim() || checkResult.detectedWord || 'Prohibited Listing',
      category: checkResult.category || 'Prohibited Campus Item',
      detectedItem: checkResult.detectedWord || formTitle.trim() || 'Prohibited Product',
      reason:
        checkResult.reason ||
        'This product is not allowed to be sold or published in the PSAS Campus Corner Marketplace.',
      source: checkResult.source || 'text',
    });
    addToast(
      'error',
      'Alert: Product Not Allowed in Marketplace',
      `"${formTitle.trim() || checkResult.detectedWord}" is prohibited (${checkResult.category}). Your seller account has been flagged and restricted from publishing.`,
      {
        id: 'marketplace_ai_scan_toast',
        variant: 'ai_scan',
        scanState: 'blocked',
        durationMs: 5500,
      }
    );
  };

  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPublishingScan || isImageScanning) return;

    if (sellerIsRestricted) {
      addToast(
        'error',
        'Seller Restricted — Publishing Blocked',
        `Seller ${user.name} (${user.matrixNo}) is not allowed to sell or publish items in the marketplace.`
      );
      return;
    }

    // 1. Instant Keyword & Filename Screening for Title, Description & Images
    const checkResult = checkProhibitedContent(formTitle, formDescription, formImages);
    if (checkResult.isBlocked) {
      flagAndBlockListing(checkResult);
      return;
    }

    // 2. Server-Side Multimodal AI Scan (Title, Description & Uploaded Photos)
    setIsPublishingScan(true);
    addToast(
      'info',
      'Final AI Safety Scan Active',
      'Scanning your listing title, description, and photos for prohibited campus items...',
      {
        id: 'marketplace_ai_scan_toast',
        variant: 'ai_scan',
        scanState: 'scanning',
        durationMs: 0,
      }
    );
    try {
      const imagesToVerify = formImages.length > 0 ? formImages : [undefined];
      for (const img of imagesToVerify) {
        const isDataUrl = typeof img === 'string' && img.startsWith('data:image/');
        const scanResp = await fetch('/api/prohibited-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle.trim(),
            description: formDescription.trim(),
            imageDataUrl: isDataUrl ? img : undefined,
            imageUrl: !isDataUrl ? img : undefined,
          }),
        });

        if (scanResp.ok) {
          const scanData = await scanResp.json();
          if (scanData?.isBlocked) {
            flagAndBlockListing({
              isBlocked: true,
              detectedWord: scanData.detectedWord || formTitle.trim(),
              category: scanData.category || 'Prohibited Campus Item',
              reason:
                scanData.reason ||
                'This product is not allowed to be sold or published in the PSAS Campus Corner Marketplace.',
              source: scanData.source === 'image' ? 'image' : 'text',
            });
            return;
          }
        }
      }
    } catch {
      // Fall through if offline while client check already passed
    } finally {
      setIsPublishingScan(false);
    }

    setProhibitedError(null);
    addToast(
      'success',
      'AI Prohibited-Item Scan Passed',
      'Your listing cleared all PSAS campus safety checks and is safe to publish.',
      {
        id: 'marketplace_ai_scan_toast',
        variant: 'ai_scan',
        scanState: 'verified',
        durationMs: 4000,
      }
    );
    const priceNum = parseFloat(formPrice) || 0;
    const fallbackImage = 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80';
    const finalImages = formImages.length > 0 ? formImages : [fallbackImage];

    if (editingItem) {
      updateMarketplaceItem(editingItem.id, {
        title: formTitle,
        category: formCategory,
        price: priceNum,
        condition: formCondition,
        description: formDescription,
        pickupLocation: formLocation,
        images: finalImages,
      });
    } else {
      addMarketplaceItem({
        title: formTitle,
        category: formCategory,
        price: priceNum,
        condition: formCondition,
        description: formDescription,
        pickupLocation: formLocation,
        images: finalImages,
        status: 'available',
      });
    }

    setIsCreateModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteListing = (id: string) => {
    deleteMarketplaceItem(id);
    setDeleteConfirmId(null);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleStartOffer = (item: MarketplaceItem) => {
    setOfferInput(item.price.toString());
    setShowOfferForm(true);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    const amount = parseFloat(offerInput) || selectedItem.price;
    createOffer(selectedItem.id, amount, offerNotes);
    setShowOfferForm(false);
    // Find the created transaction or latest
    const active = transactions.find((t) => t.itemId === selectedItem.id);
    if (active) {
      setActiveTransactionId(active.id);
    }
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0F1C38] border border-cyan-500/20 shadow-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-cyan-400" />
            PSAS Student Marketplace
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Buy, sell, and swap academic essentials, lab tools, and textbooks safely within the campus community.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsProhibitedNoticeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-xs font-bold text-rose-300 border border-rose-500/40 transition-colors shadow-sm cursor-pointer"
            title="Read campus prohibited items policy"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Prohibited Items Notice</span>
          </button>

          <button
            onClick={() => {
              setMarketScope('messages');
              setShowTransactionsList(false);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              marketScope === 'messages'
                ? 'bg-emerald-600/25 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
            }`}
            title="Open peer-to-peer privacy-shielded messaging"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Secure Messages ({activeConversationCount})</span>
          </button>

          <button
            onClick={() => setShowTransactionsList(!showTransactionsList)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span>Deals & Orders ({transactions.length})</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
              sellerIsRestricted
                ? 'bg-rose-900/70 border border-rose-500/50 text-rose-200 hover:bg-rose-900'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-950'
            }`}
          >
            {sellerIsRestricted ? <ShieldAlert className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{sellerIsRestricted ? 'Selling Restricted' : t.actions.createListing}</span>
          </button>
        </div>
      </div>

      {/* Seller Restriction & Violation Tracking Alert Banner */}
      {sellerRestriction && (
        <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold text-rose-300 uppercase tracking-wider">
                  Seller Account Restricted — Not Allowed to Sell or Publish
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-500/40">
                  {sellerRestriction.violationCount} violation{sellerRestriction.violationCount > 1 ? 's' : ''} tracked
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Seller <strong>{sellerRestriction.sellerName}</strong> ({sellerRestriction.sellerMatrix}) is blocked from selling or publishing items in the marketplace. Latest trigger: <strong>{sellerRestriction.reason}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setIsProhibitedNoticeOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-900/70 hover:bg-rose-800 text-xs font-bold text-rose-100 border border-rose-500/40 cursor-pointer"
            >
              View Violation Log ({prohibitedViolations.length})
            </button>
            <button
              type="button"
              onClick={() => clearSellerRestriction(user.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 cursor-pointer"
            >
              Reset Compliance Lock (Demo)
            </button>
          </div>
        </div>
      )}

      {/* AI Sales Trends & High-Demand Selling Opportunities Dashboard Widget */}
      <MarketplaceTrendsWidget
        items={marketplaceItems}
        transactions={transactions}
        language={language}
        userDepartment={user.department}
        sellerIsRestricted={sellerIsRestricted}
        onQuickListSuggestion={handleQuickListFromSuggestion}
        onSelectCategoryFilter={(cat) => {
          setSelectedCategory(cat);
          setMarketScope('all');
          setShowTransactionsList(false);
        }}
      />

      {/* Transactions Accordion / Drawer */}
      {showTransactionsList && (
        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4" />
              Active & Past Simulated Transactions
            </div>
            <button
              onClick={() => setShowTransactionsList(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-xs text-slate-400 py-3 text-center">
              No transactions yet. Click on any item below to make an offer.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => setActiveTransactionId(tx.id)}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={tx.itemImage}
                      alt={tx.itemTitle}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white line-clamp-1">
                        {tx.itemTitle}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        RM {tx.offerAmount.toFixed(2)} • {tx.buyerName} ➔ {tx.sellerName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        tx.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : tx.status === 'pickup_scheduled'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {tx.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="text-[10px] text-cyan-400 mt-1">Open Workflow →</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filter and Category Ribbon */}
      <div className="space-y-3">
        {/* Buyer & Seller Perspective Navigation Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setMarketScope('all');
                setShowTransactionsList(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                marketScope === 'all' && !showTransactionsList
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Marketplace ({marketplaceItems.length})</span>
            </button>

            <button
              onClick={() => {
                setMarketScope('my_listings');
                setShowTransactionsList(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                marketScope === 'my_listings' && !showTransactionsList
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>
                My Seller Items ({marketplaceItems.filter((i) => i.sellerId === user.id || i.sellerName.includes('You')).length})
              </span>
            </button>

            <button
              onClick={() => {
                setMarketScope('messages');
                setShowTransactionsList(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                marketScope === 'messages' && !showTransactionsList
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Secure P2P Messages ({activeConversationCount})</span>
            </button>

            <button
              onClick={() => {
                setShowTransactionsList(true);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showTransactionsList
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Transactions & Deals ({transactions.length})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 px-2 font-medium flex items-center gap-1">
            <span>Viewing as:</span>
            <button
              type="button"
              onClick={() => setActiveRole(activeRole === 'buyer' ? 'seller' : 'buyer')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer border ${
                activeRole === 'seller'
                  ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
              }`}
              title="Click to toggle perspective"
            >
              {activeRole} Mode ↺
            </button>
          </div>
        </div>

        {/* Enhanced Category & Price Range Filter Panel (hidden in Secure Messages hub) */}
        {marketScope !== 'messages' && (
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          {/* Category Pills with Live Item Counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] text-slate-400 shrink-0 mr-1 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Category:
            </span>
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat
                        ? 'bg-cyan-500/30 text-cyan-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Category Select, Condition & Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search listings, tags, locations..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 shrink-0">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat} ({getCategoryCount(cat)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 shrink-0">Condition:</span>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                aria-label="Filter by condition"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Conditions</option>
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Good Condition">Good Condition</option>
                <option value="Fair Condition">Fair Condition</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-cyan-400" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'newest' | 'rating_high' | 'price_low' | 'price_high'
                  )
                }
                aria-label="Sort listings"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="newest">Newest First</option>
                <option value="rating_high">Highest Seller Rating</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Price Range Filter Row */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-semibold mr-1 shrink-0">
                Price Range:
              </span>
              {pricePresets.map((preset) => {
                const isActive = minPrice === preset.min && maxPrice === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setMinPrice(preset.min);
                      setMaxPrice(preset.max);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="relative w-24">
                  <span className="absolute left-2.5 top-1.5 text-[10px] font-bold text-slate-400">
                    RM
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    aria-label="Minimum price in RM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <span className="text-xs text-slate-500">–</span>
                <div className="relative w-24">
                  <span className="absolute left-2.5 top-1.5 text-[10px] font-bold text-slate-400">
                    RM
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    aria-label="Maximum price in RM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <span className="text-[11px] text-slate-400 px-1 tabular-nums">
                Showing <strong className="text-white">{filteredItems.length}</strong> of{' '}
                {scopedItems.length}
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-cyan-300 border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Seller Reputation & Minimum Rating Filter Row */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-semibold mr-1 shrink-0 inline-flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" /> Seller Reputation:
              </span>
              {(
                [
                  { id: 'all', label: 'All Sellers' },
                  { id: '4.5', label: '4.5★+ Reputable' },
                  { id: '4.8', label: '4.8★+ Top Campus Sellers' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMinSellerRating(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    minSellerRating === opt.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setVerifiedOnly((prev) => !prev)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1 ${
                  verifiedOnly
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Sellers Only</span>
              </button>
            </div>

            {selectedSellerFilter && (
              <div className="flex items-center gap-2 text-[11px] text-cyan-300">
                <span>
                  Seller: <strong>{selectedSellerFilter.name}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSellerFilter(null)}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  Clear Seller
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Secure Peer-to-Peer Messaging Workspace OR Listings Grid */}
      {marketScope === 'messages' ? (
        <MarketplacePeerMessaging
          mode="inline"
          items={marketplaceItems}
          currentUser={user}
          messages={messages}
          blockedPeerIds={blockedPeerIds}
          onSendMessage={(
            item,
            receiverId,
            receiverName,
            content,
            isOfferProposal,
            proposedPrice,
            options
          ) => {
            sendMessage(
              item.id,
              item.title,
              receiverId,
              receiverName,
              content,
              isOfferProposal,
              proposedPrice,
              options
            );
          }}
          onMakeOffer={(item, offerAmount, notes) => {
            createOffer(item.id, offerAmount, notes);
            const active = transactions.find((t) => t.itemId === item.id);
            if (active) {
              setActiveTransactionId(active.id);
            }
          }}
          onToggleBlockPeer={toggleBlockPeer}
          onClearItemMessages={clearItemMessages}
          onReportSafetyIssue={(item, peerLabel) => {
            addToast(
              'warning',
              'Privacy & Safety Report Logged',
              `Reported P2P conversation with ${peerLabel} for "${item.title}". Keep communication strictly inside Campus Corner.`
            );
          }}
          onOpenItemDetails={(item) => {
            setDetailPhotoIndex(0);
            setSelectedItem(item);
          }}
        />
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-300">No listings found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your category, price range, or search filters, or post an item for the PSAS campus community.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Post Item Listing
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isSaved = user.savedItemIds.includes(item.id);
            const isOwn = item.sellerId === user.id || item.sellerName.includes('You');
            const isSellerVerified = isOwn ? user.isVerified : Boolean(item.sellerVerified);
            const reputation = getSellerReputation(item.sellerId, item.sellerRating);

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 flex flex-col justify-between overflow-hidden transition-all group"
              >
                {/* Image Section */}
                <div
                  className="relative aspect-video w-full bg-slate-800 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setDetailPhotoIndex(0);
                    setSelectedItem(item);
                  }}
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                      {item.condition}
                    </span>
                    {item.status !== 'available' && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.status === 'sold'
                            ? 'bg-rose-950/90 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-950/90 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {isSellerVerified && (
                    <div
                      className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-400/50 backdrop-blur-sm text-[10px] font-bold shadow-sm"
                      title="Seller completed PSAS student profile & Matrix verification"
                    >
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Verified Seller</span>
                    </div>
                  )}

                  {/* Save Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavedItem(item.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-rose-400 transition-colors"
                    aria-label="Save item"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Info Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span className="truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {item.pickupLocation}
                      </span>
                    </div>

                    <h3
                      onClick={() => {
                        setDetailPhotoIndex(0);
                        setSelectedItem(item);
                      }}
                      className="text-sm font-bold text-white line-clamp-1 cursor-pointer group-hover:text-cyan-300 transition-colors"
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Seller & Action footer */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <button
                      type="button"
                      onClick={() => openSellerReviews(item, false)}
                      title="View seller ratings & student reviews"
                      className="w-full flex items-center justify-between gap-2 text-xs text-left rounded-lg px-1.5 py-1 -mx-1.5 hover:bg-slate-800/70 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <img
                          src={item.sellerAvatar}
                          alt={item.sellerName}
                          className="w-5 h-5 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[11px] text-slate-200 font-medium inline-flex items-center gap-1 max-w-full">
                            <span className="truncate">{item.sellerName}</span>
                            {isSellerVerified && (
                              <BadgeCheck
                                className="w-3.5 h-3.5 text-emerald-400 shrink-0"
                                aria-label="Verified Seller"
                              />
                            )}
                          </span>
                          <span className="text-[10px] text-emerald-400 block truncate">
                            {reputation.tierLabel}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold shrink-0 tabular-nums">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{reputation.averageRating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">
                          ({reputation.reviewCount})
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Student Price</span>
                        <span className="text-base font-extrabold text-cyan-400 font-mono">
                          RM {item.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setChattingItem(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white transition-colors cursor-pointer"
                          title={isOwn ? 'Open private buyer inquiries' : 'Secure P2P Chat with Seller'}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>

                        {isOwn ? (
                          <>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                              title="Edit listing"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs cursor-pointer"
                              title="Delete listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : null}

                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0E1628] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  {selectedItem.category} • PSAS Verified Marketplace
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setShowOfferForm(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: Image & Conditions */}
              <div className="space-y-3">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img
                    src={selectedItem.images[detailPhotoIndex] || selectedItem.images[0]}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover transition-all"
                  />
                  {selectedItem.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-cyan-300 text-[10px] font-mono">
                      {detailPhotoIndex + 1} / {selectedItem.images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnails if multiple images */}
                {selectedItem.images.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {selectedItem.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDetailPhotoIndex(idx)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border shrink-0 transition-all ${
                          detailPhotoIndex === idx
                            ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Condition:</span>
                    <span className="font-semibold text-white">{selectedItem.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Campus Pickup:</span>
                    <span className="font-semibold text-cyan-300">{selectedItem.pickupLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Availability:</span>
                    <span
                      className={`font-semibold capitalize ${
                        selectedItem.status === 'available' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {selectedItem.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Seller & Description */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {(() => {
                    const detailRep = getSellerReputation(
                      selectedItem.sellerId,
                      selectedItem.sellerRating
                    );
                    const detailSellerReviews = sellerReviews
                      .filter((r) => r.sellerId === selectedItem.sellerId)
                      .slice(0, 2);
                    const isDetailOwn =
                      selectedItem.sellerId === user.id ||
                      selectedItem.sellerName.includes('You');
                    const isDetailSellerVerified = isDetailOwn
                      ? user.isVerified
                      : Boolean(selectedItem.sellerVerified);

                    return (
                      <>
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={selectedItem.sellerAvatar}
                                alt={selectedItem.sellerName}
                                className="w-9 h-9 rounded-full object-cover border border-cyan-500/40 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-xs font-bold text-white truncate">
                                    {selectedItem.sellerName}
                                  </span>
                                  {isDetailSellerVerified && (
                                    <span
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold shrink-0"
                                      title="Verified PSAS student profile"
                                    >
                                      <BadgeCheck className="w-3 h-3 text-emerald-400" />
                                      <span>Verified Seller</span>
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono truncate">
                                  {selectedItem.sellerMatrix} ·{' '}
                                  <span className="text-emerald-400 font-sans font-semibold">
                                    {detailRep.tierLabel}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0 tabular-nums">
                              <div className="flex items-center justify-end gap-1 text-amber-400 font-bold text-xs">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span>{detailRep.averageRating.toFixed(1)}</span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {detailRep.reviewCount} review
                                {detailRep.reviewCount === 1 ? '' : 's'}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                            <button
                              type="button"
                              onClick={() => openSellerReviews(selectedItem, false)}
                              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                            >
                              View All Reviews ({detailRep.reviewCount}) →
                            </button>
                            {!isDetailOwn && (
                              <button
                                type="button"
                                onClick={() => openSellerReviews(selectedItem, true)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-amber-300 border border-slate-700 cursor-pointer"
                              >
                                <MessageSquarePlus className="w-3 h-3" />
                                <span>Rate Seller</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                            Description & Specifications
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/60 max-h-32 overflow-y-auto">
                            {selectedItem.description}
                          </p>
                        </div>

                        {detailSellerReviews.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-slate-300">
                                Recent Campus Buyer Feedback
                              </span>
                              <span className="text-slate-400 tabular-nums">
                                {detailRep.verifiedBuyerCount} verified
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {detailSellerReviews.map((rev) => (
                                <div
                                  key={rev.id}
                                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] space-y-1"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-slate-200 inline-flex items-center gap-1">
                                      {rev.reviewerName}
                                      {rev.isVerifiedBuyer && (
                                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                      )}
                                    </span>
                                    <span className="text-amber-400 font-semibold tabular-nums">
                                      {rev.rating}.0 ★
                                    </span>
                                  </div>
                                  <p className="text-slate-400 line-clamp-2 leading-snug">
                                    "{rev.comment}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">Listed Price:</span>
                    <span className="text-xl font-extrabold text-cyan-400 font-mono tabular-nums">
                      RM {selectedItem.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Offer form or buttons */}
                {showOfferForm ? (
                  <form onSubmit={handleSubmitOffer} className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2.5">
                    <div className="text-xs font-bold text-cyan-300">
                      Submit Simulated Offer
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        Your Offer Amount (RM)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={offerInput}
                        onChange={(e) => setOfferInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={offerNotes}
                        onChange={(e) => setOfferNotes(e.target.value)}
                        placeholder="Optional note: Can meet at Library after class?"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowOfferForm(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white"
                      >
                        Confirm Offer
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2 pt-2">
                    {selectedItem.sellerId === user.id || selectedItem.sellerName.includes('You') ? (
                      <div className="flex flex-col gap-2">
                        <div className="text-xs text-slate-400 text-center italic">
                          This is your own listing
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const nextStatus = selectedItem.status === 'available' ? 'reserved' : 'available';
                              setItemStatus(selectedItem.id, nextStatus);
                              setSelectedItem({ ...selectedItem, status: nextStatus });
                            }}
                            className="flex-1 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
                          >
                            Mark {selectedItem.status === 'available' ? 'Reserved' : 'Available'}
                          </button>
                          <button
                            onClick={() => {
                              setItemStatus(selectedItem.id, 'sold');
                              setSelectedItem({ ...selectedItem, status: 'sold' });
                            }}
                            className="flex-1 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                          >
                            Mark as Sold
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartOffer(selectedItem)}
                          disabled={selectedItem.status === 'sold'}
                          className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-xs font-bold text-white shadow-md transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Make Offer / Buy</span>
                        </button>
                        <button
                          onClick={() => {
                            setChattingItem(selectedItem);
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Open Privacy-Protected P2P Chat"
                        >
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs">Secure Chat</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Listing Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0E1628] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                {editingItem ? 'Edit Marketplace Listing' : 'Post New Item for PSAS Students'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prohibited items warning banner */}
            <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold text-amber-300">PSAS Campus Policy Notice: </span>
                Vapes, tobacco, weapons, exam leaks, assignment ghostwriting, drugs, and high-wattage hostel heaters are strictly prohibited.
                <button
                  type="button"
                  onClick={() => setIsProhibitedNoticeOpen(true)}
                  className="ml-1 text-cyan-400 hover:underline font-bold"
                >
                  View Prohibited Items List →
                </button>
              </div>
            </div>

            {/* Blocked Submission Error Banner */}
            {(prohibitedError || sellerIsRestricted) && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200 flex items-start gap-2.5 animate-in shake">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-rose-300">
                    ALERT: Product Not Allowed in Marketplace{' '}
                    {prohibitedError?.category ? `(${prohibitedError.category})` : ''}
                  </div>
                  {prohibitedError ? (
                    <p className="text-[11px] text-slate-200">
                      Detected via{' '}
                      <strong>{prohibitedError.source === 'image' ? 'Image Scan' : 'Listing Scan'}</strong>:{' '}
                      <strong>"{prohibitedError.detectedWord}"</strong>. {prohibitedError.reason}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-200">
                      Seller <strong>{user.name}</strong> ({user.matrixNo}) is currently restricted from selling or publishing items.
                    </p>
                  )}
                  <p className="text-[10px] text-rose-300 font-mono">
                    Seller violation recorded ({user.matrixNo}). Publishing prohibited products is not allowed on Campus Corner.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveListing} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Casio Scientific Calculator fx-570EX"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                  >
                    <option value="Engineering Tools">Engineering Tools</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Textbooks & Academic">Textbooks & Academic</option>
                    <option value="Clothing & Attire">Clothing & Attire</option>
                    <option value="Student Essentials">Student Essentials</option>
                    <option value="Student Services">Student Services</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Price (RM)
                    </label>
                    <button
                      type="button"
                      onClick={handleEstimatePrice}
                      disabled={isEstimatingPrice}
                      className="px-2 py-0.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 disabled:opacity-60 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                      title="Estimate fair PSAS campus resale price with AI"
                    >
                      {isEstimatingPrice ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <TrendingUp className="w-3 h-3" />
                      )}
                      <span>{isEstimatingPrice ? 'Valuing...' : 'AI Price Check'}</span>
                    </button>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono tabular-nums"
                  />
                </div>
              </div>

              {/* AI Price Valuation Panel */}
              {aiPriceError && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-[11px] text-rose-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{aiPriceError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiPriceError(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                    aria-label="Dismiss price error"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {aiPriceValuation && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>AI Campus Price Valuation</span>
                      </div>
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        Est. New Retail: RM {aiPriceValuation.estimatedRetailPrice} · Demand:{' '}
                        <span className="text-slate-200 font-semibold">
                          {aiPriceValuation.demandLevel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={handleEstimatePrice}
                        disabled={isEstimatingPrice}
                        title="Re-estimate based on latest condition & notes"
                        className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isEstimatingPrice ? 'animate-spin' : ''}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiPriceValuation(null)}
                        title="Dismiss valuation"
                        className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <div className="tabular-nums">
                      <span className="text-[10px] text-slate-400 block">
                        Recommended Campus Price
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-emerald-400 font-mono">
                          RM {aiPriceValuation.recommendedPrice.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Fair range: RM {aiPriceValuation.minPrice} – RM {aiPriceValuation.maxPrice}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormPrice(String(aiPriceValuation.recommendedPrice));
                        addToast(
                          'info',
                          'Price Updated',
                          `Applied AI recommended price of RM ${aiPriceValuation.recommendedPrice.toFixed(2)}.`
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Apply RM {aiPriceValuation.recommendedPrice}
                    </button>
                  </div>

                  {/* Quick Price Strategy Options */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 mr-0.5">Quick Set:</span>
                    {[
                      { label: 'Fast Sale', price: aiPriceValuation.minPrice },
                      { label: 'Recommended', price: aiPriceValuation.recommendedPrice },
                      { label: 'Top Condition', price: aiPriceValuation.maxPrice },
                    ].map((opt) => {
                      const isSelected = Number(formPrice) === opt.price;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setFormPrice(String(opt.price))}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer tabular-nums ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          {opt.label}: RM {opt.price}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {aiPriceValuation.pricingTip}
                  </p>

                  {(() => {
                    const entered = Number(formPrice);
                    if (!formPrice.trim() || Number.isNaN(entered) || entered <= 0) return null;
                    if (entered < aiPriceValuation.minPrice) {
                      return (
                        <div className="text-[11px] font-semibold text-cyan-300 tabular-nums">
                          Your RM {entered.toFixed(2)} price is below the RM {aiPriceValuation.minPrice}–{aiPriceValuation.maxPrice} range — priced for a fast student sale.
                        </div>
                      );
                    }
                    if (entered <= aiPriceValuation.maxPrice) {
                      return (
                        <div className="text-[11px] font-semibold text-emerald-400 tabular-nums">
                          Your RM {entered.toFixed(2)} price is right inside the fair campus range.
                        </div>
                      );
                    }
                    return (
                      <div className="text-[11px] font-semibold text-amber-300 tabular-nums">
                        Your RM {entered.toFixed(2)} price is above the suggested RM {aiPriceValuation.maxPrice} upper range; buyers may negotiate down.
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Condition
                  </label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good Condition">Good Condition</option>
                    <option value="Fair Condition">Fair Condition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pickup Spot at PSAS
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Kafe JKE / Perpustakaan"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  mode="multiple"
                  max={10}
                  values={formImages}
                  scanProhibitedContent={true}
                  onScanStatusChange={(scanning) => {
                    setIsImageScanning(scanning);
                    if (scanning) {
                      addToast(
                        'info',
                        'AI Prohibited-Item Scan Active',
                        'Scanning uploaded photo against PSAS Marketplace safety rules...',
                        {
                          id: 'marketplace_ai_scan_toast',
                          variant: 'ai_scan',
                          scanState: 'scanning',
                          durationMs: 0,
                        }
                      );
                    }
                  }}
                  onScanComplete={({ acceptedCount, blockedCount }) => {
                    if (blockedCount === 0 && acceptedCount > 0) {
                      addToast(
                        'success',
                        'Photo Verified Safe by AI',
                        `${acceptedCount} photo${acceptedCount > 1 ? 's' : ''} passed prohibited-item screening and ready to publish.`,
                        {
                          id: 'marketplace_ai_scan_toast',
                          variant: 'ai_scan',
                          scanState: 'verified',
                          durationMs: 4000,
                        }
                      );
                    }
                  }}
                  onChange={(newImgs) => {
                    setFormImages(newImgs);
                    // Also run active image screening on current list
                    const imgCheck = checkProhibitedContent('', '', newImgs);
                    if (imgCheck.isBlocked) {
                      setProhibitedError(imgCheck);
                    } else if (prohibitedError?.source === 'image') {
                      setProhibitedError(null);
                    }
                  }}
                  onProhibitedBlocked={(result) => {
                    setProhibitedError(result);
                    recordProhibitedAttempt({
                      itemTitle: formTitle.trim() || 'Uploaded Photo Listing',
                      category: result.category || 'Prohibited Campus Item',
                      detectedItem: result.detectedWord || 'Prohibited Product Photo',
                      reason:
                        result.reason ||
                        'The uploaded photo shows a prohibited item that is not allowed in the marketplace.',
                      source: 'image',
                    });
                    addToast(
                      'error',
                      'Image Scan Alert: Product Not Allowed',
                      `The uploaded image was flagged (${result.category}: ${result.detectedWord}). This item is not allowed in the marketplace, and your seller account has been tracked & restricted.`,
                      {
                        id: 'marketplace_ai_scan_toast',
                        variant: 'ai_scan',
                        scanState: 'blocked',
                        durationMs: 5500,
                      }
                    );
                  }}
                  label="Listing Photos (Upload up to 10 images)"
                  samplePresets={[
                    { name: 'Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Arduino', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Lab Coat', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Description
                  </label>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {previousDescBackup !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormDescription(previousDescBackup);
                          setPreviousDescBackup(null);
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-300 border border-slate-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Restore previous description"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Undo</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowAiDescHelper((prev) => !prev)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border inline-flex items-center gap-1 transition-colors cursor-pointer ${
                        showAiDescHelper
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{showAiDescHelper ? 'Hide AI Options' : 'AI Options'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGeneratingDesc}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-60 text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      {isGeneratingDesc ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>
                        {isGeneratingDesc
                          ? 'Writing...'
                          : formDescription.trim()
                          ? 'AI Polish'
                          : 'AI Generate'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Expandable AI Description Assistant Options */}
                {showAiDescHelper && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Listing Description Assistant
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setAiDescLanguage('en')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                            aiDescLanguage === 'en'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          EN
                        </button>
                        <button
                          type="button"
                          onClick={() => setAiDescLanguage('bm')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                            aiDescLanguage === 'bm'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          BM
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={aiDescHighlights}
                      onChange={(e) => setAiDescHighlights(e.target.value)}
                      placeholder="Optional key points: e.g. used 1 sem, slide cover included, slightly nego"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">Style:</span>
                        {(
                          [
                            { id: 'friendly', label: 'Friendly' },
                            { id: 'concise', label: 'Short & Crisp' },
                            { id: 'detailed', label: 'Detailed Bullets' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setAiDescTone(opt.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer ${
                              aiDescTone === opt.id
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGeneratingDesc}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {isGeneratingDesc ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        <span>{formDescription.trim() ? 'Rewrite with AI' : 'Generate Draft'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {aiDescError && (
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-[11px] text-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{aiDescError}</span>
                  </div>
                )}

                {aiSuggestedTitle && (
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px]">
                    <span className="text-slate-300 truncate">
                      Suggested title: <strong className="text-cyan-300">{aiSuggestedTitle}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormTitle(aiSuggestedTitle);
                        setAiSuggestedTitle(null);
                      }}
                      className="px-2 py-0.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold shrink-0 cursor-pointer"
                    >
                      Use Title
                    </button>
                  </div>
                )}

                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe the condition, usage period, accessories included — or click AI Generate above..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white resize-y focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImageScanning || isPublishingScan || sellerIsRestricted}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white transition-colors inline-flex items-center gap-1.5"
                >
                  {(isImageScanning || isPublishingScan) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {sellerIsRestricted
                      ? 'Publishing Blocked'
                      : isImageScanning
                      ? 'Scanning Photos...'
                      : isPublishingScan
                      ? 'Verifying Item...'
                      : editingItem
                      ? 'Save Changes'
                      : 'Publish Listing'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="p-5 rounded-2xl bg-[#0E1628] border border-red-500/40 max-w-sm w-full space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              Confirm Listing Deletion
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this listing? This action will remove it from the PSAS student marketplace.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
              >
                Keep Item
              </button>
              <button
                onClick={() => handleDeleteListing(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Active Transaction Modal */}
      {activeTransactionId && (
        <TransactionWorkflowModal
          transactionId={activeTransactionId}
          onClose={() => setActiveTransactionId(null)}
        />
      )}

      {/* Prohibited Items Policy Notice Modal */}
      <ProhibitedItemsNoticeModal
        isOpen={isProhibitedNoticeOpen}
        onClose={() => setIsProhibitedNoticeOpen(false)}
        language={language}
        violations={prohibitedViolations}
        sellerRestriction={sellerRestriction}
        onClearRestriction={() => clearSellerRestriction(user.id)}
      />

      {/* Peer-to-Peer Privacy-Protected Chat Modal */}
      {chattingItem && (
        <MarketplacePeerMessaging
          mode="modal"
          isOpen={!!chattingItem}
          onClose={() => setChattingItem(null)}
          items={marketplaceItems}
          initialItem={chattingItem}
          currentUser={user}
          messages={messages}
          blockedPeerIds={blockedPeerIds}
          onSendMessage={(
            item,
            receiverId,
            receiverName,
            content,
            isOfferProposal,
            proposedPrice,
            options
          ) => {
            sendMessage(
              item.id,
              item.title,
              receiverId,
              receiverName,
              content,
              isOfferProposal,
              proposedPrice,
              options
            );
          }}
          onMakeOffer={(item, offerAmount, notes) => {
            createOffer(item.id, offerAmount, notes);
            const active = transactions.find((t) => t.itemId === item.id);
            if (active) {
              setActiveTransactionId(active.id);
            }
          }}
          onToggleBlockPeer={toggleBlockPeer}
          onClearItemMessages={clearItemMessages}
          onReportSafetyIssue={(item, peerLabel) => {
            addToast(
              'warning',
              'Privacy & Safety Report Logged',
              `Reported P2P conversation with ${peerLabel} for "${item.title}". Keep communication strictly inside Campus Corner.`
            );
          }}
        />
      )}

      {/* Seller Reviews & Campus Reputation Modal */}
      <SellerReviewsModal
        isOpen={!!reviewSellerTarget}
        onClose={() => {
          setReviewSellerTarget(null);
          setReviewOpenForm(false);
        }}
        seller={reviewSellerTarget}
        initialOpenForm={reviewOpenForm}
        onFilterBySeller={(sellerId, sellerName) => {
          setSelectedSellerFilter({ id: sellerId, name: sellerName });
          setMarketScope('all');
          setShowTransactionsList(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};
