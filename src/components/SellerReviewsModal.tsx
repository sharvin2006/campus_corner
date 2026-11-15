import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  ShieldAlert,
  ThumbsUp,
  MessageSquarePlus,
  CheckCircle2,
  Filter,
  ShoppingBag,
  Award,
} from 'lucide-react';

export interface SellerReviewTarget {
  sellerId: string;
  sellerName: string;
  sellerMatrix: string;
  sellerAvatar?: string;
  sellerRating?: number;
  itemId?: string;
  itemTitle?: string;
}

interface SellerReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: SellerReviewTarget | null;
  initialOpenForm?: boolean;
  onFilterBySeller?: (sellerId: string, sellerName: string) => void;
}

const REVIEW_TAG_OPTIONS = [
  'On-Time Meetup',
  'Item As Described',
  'Friendly Seller',
  'Fast Reply',
  'Fair Student Price',
  'Safe Campus Spot',
];

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export const SellerReviewsModal: React.FC<SellerReviewsModalProps> = ({
  isOpen,
  onClose,
  seller,
  initialOpenForm = false,
  onFilterBySeller,
}) => {
  const {
    user,
    marketplaceItems,
    sellerReviews,
    addSellerReview,
    toggleReviewHelpful,
    getSellerReputation,
    isSellerRestricted,
  } = useApp();

  const [showWriteForm, setShowWriteForm] = useState(initialOpenForm);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'On-Time Meetup',
    'Item As Described',
  ]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [starFilter, setStarFilter] = useState<'all' | '5' | '4' | 'low'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    if (isOpen && seller) {
      setShowWriteForm(initialOpenForm && seller.sellerId !== user.id);
      setRatingInput(5);
      setCommentInput('');
      setSelectedTags(['On-Time Meetup', 'Item As Described']);
      setSelectedItemId(seller.itemId || '');
      setStarFilter('all');
      setVerifiedOnly(false);
    }
  }, [isOpen, seller, initialOpenForm, user.id]);

  if (!isOpen || !seller) return null;

  const isOwnProfile = seller.sellerId === user.id;
  const restricted = isSellerRestricted(seller.sellerId);
  const reputation = getSellerReputation(seller.sellerId, seller.sellerRating);
  const sellerListings = marketplaceItems.filter(
    (item) => item.sellerId === seller.sellerId
  );

  const allReviewsForSeller = sellerReviews.filter(
    (rev) => rev.sellerId === seller.sellerId
  );

  const filteredReviews = allReviewsForSeller.filter((rev) => {
    if (verifiedOnly && !rev.isVerifiedBuyer) return false;
    if (starFilter === '5') return rev.rating === 5;
    if (starFilter === '4') return rev.rating === 4;
    if (starFilter === 'low') return rev.rating <= 3;
    return true;
  });

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedItem = sellerListings.find((i) => i.id === selectedItemId);
    const ok = addSellerReview({
      sellerId: seller.sellerId,
      sellerName: seller.sellerName,
      sellerMatrix: seller.sellerMatrix,
      rating: ratingInput,
      comment: commentInput,
      tags: selectedTags,
      itemId: matchedItem?.id || seller.itemId,
      itemTitle: matchedItem?.title || seller.itemTitle,
    });
    if (ok) {
      setCommentInput('');
      setShowWriteForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0E1628] border border-cyan-500/30 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 my-8 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={
                seller.sellerAvatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
              }
              alt={seller.sellerName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-cyan-500/40 shrink-0 bg-slate-800"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {seller.sellerName}
                </h3>
                {restricted ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Selling Restricted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <Award className="w-3.5 h-3.5" />
                    {reputation.tierLabel}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5 tabular-nums">
                <span className="font-mono">{seller.sellerMatrix}</span>
                <span aria-hidden="true">·</span>
                <span>{sellerListings.length} active listing{sellerListings.length === 1 ? '' : 's'}</span>
                <span aria-hidden="true">·</span>
                <span>{reputation.verifiedBuyerCount} verified buyer review{reputation.verifiedBuyerCount === 1 ? '' : 's'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close seller reviews"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reputation Overview & Star Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="sm:col-span-2 flex flex-col justify-center sm:border-r border-slate-800 sm:pr-4">
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-3xl font-extrabold text-white">
                {reputation.reviewCount > 0
                  ? reputation.averageRating.toFixed(1)
                  : (seller.sellerRating || 0).toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 my-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(reputation.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 tabular-nums">
              Based on <strong className="text-slate-200">{reputation.reviewCount}</strong> campus review
              {reputation.reviewCount === 1 ? '' : 's'}
            </p>

            {onFilterBySeller && sellerListings.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onFilterBySeller(seller.sellerId, seller.sellerName);
                  onClose();
                }}
                className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-cyan-300 border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Filter Listings ({sellerListings.length})</span>
              </button>
            )}
          </div>

          <div className="sm:col-span-3 space-y-1.5 justify-center flex flex-col">
            {([5, 4, 3, 2, 1] as const).map((starLevel) => {
              const count = reputation.breakdown[starLevel];
              const pct =
                reputation.reviewCount > 0
                  ? Math.round((count / reputation.reviewCount) * 100)
                  : 0;
              return (
                <div key={starLevel} className="flex items-center gap-2 text-xs tabular-nums">
                  <span className="w-7 text-slate-300 font-medium shrink-0">
                    {starLevel}★
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-[11px] text-slate-400 shrink-0">
                    {count}
                  </span>
                </div>
              );
            })}

            {reputation.topTags.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300">
                <span className="text-slate-400 font-medium">Top Strengths:</span>
                {reputation.topTags.map((t, idx) => (
                  <span key={t.tag} className="inline-flex items-center gap-1 tabular-nums">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>
                      {t.tag} ({t.count})
                    </span>
                    {idx < reputation.topTags.length - 1 && (
                      <span className="text-slate-600 ml-1" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Row: Write Review CTA & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Filter:
            </span>
            {(
              [
                { id: 'all', label: `All (${allReviewsForSeller.length})` },
                { id: '5', label: `5★ (${reputation.breakdown[5]})` },
                { id: '4', label: `4★ (${reputation.breakdown[4]})` },
                {
                  id: 'low',
                  label: `≤3★ (${
                    reputation.breakdown[3] +
                    reputation.breakdown[2] +
                    reputation.breakdown[1]
                  })`,
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStarFilter(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                  starFilter === opt.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setVerifiedOnly((v) => !v)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1 ${
                verifiedOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Buyers</span>
            </button>
          </div>

          {!isOwnProfile && (
            <button
              type="button"
              onClick={() => setShowWriteForm((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>{showWriteForm ? 'Cancel Review' : 'Rate & Review Seller'}</span>
            </button>
          )}
        </div>

        {/* Write a Review Form */}
        {showWriteForm && !isOwnProfile && (
          <form
            onSubmit={handleSubmitReview}
            className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-cyan-300">
                Submit Review for {seller.sellerName}
              </span>
              <span className="text-[11px] text-slate-400">
                Posting as {user.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-medium">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      aria-label={`Rate ${star} stars`}
                      className="p-1 rounded hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          ratingInput >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-amber-400 ml-1">
                  {ratingInput}.0 · {RATING_LABELS[ratingInput]}
                </span>
              </div>

              {sellerListings.length > 0 && (
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  aria-label="Select purchased item"
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 max-w-xs"
                >
                  <option value="">General Seller Experience</option>
                  {sellerListings.map((item) => (
                    <option key={item.id} value={item.id}>
                      Item: {item.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <span className="block text-[11px] text-slate-400 mb-1.5">
                Highlight Seller Strengths (Optional):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {REVIEW_TAG_OPTIONS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Your Review Comment
              </label>
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                rows={3}
                required
                placeholder="Share item accuracy, meetup punctuality at PSAS, and communication..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowWriteForm(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Publish Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews Feed */}
        <div className="space-y-3">
          {filteredReviews.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
              {allReviewsForSeller.length === 0
                ? 'No student reviews recorded for this seller yet. Be the first to review after your campus meetup!'
                : 'No reviews match the selected star or verified buyer filter.'}
            </div>
          ) : (
            filteredReviews.map((rev) => {
              const hasVotedHelpful = (rev.helpfulVoterIds || []).includes(user.id);
              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-white">{rev.reviewerName}</span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {rev.reviewerMatrix}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                        <span
                          className={`text-[11px] font-semibold inline-flex items-center gap-1 ${
                            rev.isVerifiedBuyer ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {rev.isVerifiedBuyer && <ShieldCheck className="w-3 h-3" />}
                          {rev.isVerifiedBuyer ? 'Verified Buyer' : 'Campus Peer'}
                        </span>
                      </div>

                      {rev.itemTitle && (
                        <div className="text-[11px] text-cyan-300 mt-0.5">
                          Item: {rev.itemTitle}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 tabular-nums">
                        {rev.createdAt}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">{rev.comment}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="text-[11px] text-slate-400">
                      {rev.tags && rev.tags.length > 0 ? rev.tags.join(' · ') : ''}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleReviewHelpful(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer tabular-nums ${
                        hasVotedHelpful
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
