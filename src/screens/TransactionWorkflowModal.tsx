import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction, DisputeReport } from '../types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  X,
  Star,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  ArrowRight,
  Send,
  Flag
} from 'lucide-react';

interface Props {
  transactionId: string;
  onClose: () => void;
}

export const TransactionWorkflowModal: React.FC<Props> = ({
  transactionId,
  onClose,
}) => {
  const {
    transactions,
    acceptOffer,
    schedulePickup,
    completeTransaction,
    cancelTransaction,
    submitDispute,
    user,
    activeRole,
    setActiveRole,
  } = useApp();

  const tx = transactions.find((t) => t.id === transactionId);

  // Local form states
  const [pickupLoc, setPickupLoc] = useState('Perpustakaan PSAS Level 1');
  const [pickupDate, setPickupDate] = useState('2026-10-15 15:30');
  const [pickupNotes, setPickupNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('Item was in exact condition described. Great PSAS peer seller!');
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState<DisputeReport['reason']>('Item not as described');
  const [disputeDesc, setDisputeDesc] = useState('');

  if (!tx) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-center text-white">
          <p className="text-sm">Transaction not found.</p>
          <button onClick={onClose} className="mt-3 px-4 py-1.5 rounded-lg bg-cyan-600 text-xs">
            Close
          </button>
        </div>
      </div>
    );
  }

  // True perspective or controlled by activeRole switcher for full tester functionality
  const isActualSeller = tx.sellerId === user.id || tx.sellerName.includes('You');
  const isActualBuyer = tx.buyerId === user.id || tx.buyerName.includes('You');
  const isSellerPerspective = activeRole === 'seller' || isActualSeller;
  const isBuyerPerspective = activeRole === 'buyer' || isActualBuyer;

  const steps = [
    { key: 'offer_made', label: '1. Offer Proposed' },
    { key: 'accepted', label: '2. Seller Accepted' },
    { key: 'pickup_scheduled', label: '3. Campus Meetup Arranged' },
    { key: 'completed', label: '4. Deal Completed & Reviewed' },
  ];

  const currentStepIndex =
    tx.status === 'offer_made'
      ? 0
      : tx.status === 'accepted'
      ? 1
      : tx.status === 'pickup_scheduled'
      ? 2
      : tx.status === 'completed'
      ? 3
      : -1;

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDispute(tx.id, disputeReason, disputeDesc);
    setShowDispute(false);
    setDisputeDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0E1628] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={tx.itemImage}
              alt={tx.itemTitle}
              className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700"
            />
            <div>
              <div className="text-xs text-cyan-400 font-mono">
                Transaction ID: #{tx.id}
              </div>
              <h3 className="text-base font-bold text-white leading-tight">
                {tx.itemTitle}
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                Between <span className="text-slate-200 font-medium">{tx.buyerName}</span> &{' '}
                <span className="text-slate-200 font-medium">{tx.sellerName}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Payment Notice Banner with Perspective Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 mb-5">
          <div className="flex items-start gap-2.5">
            <CreditCard className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-cyan-300 font-semibold uppercase">
                Demonstration Transaction Sandbox:
              </strong>{' '}
              Testing flow for <strong>{tx.paymentMethod}</strong>. Currently viewing as:{' '}
              <span className={`font-bold uppercase px-1.5 py-0.5 rounded text-[10px] ${
                activeRole === 'seller' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
              }`}>
                {activeRole.toUpperCase()} PERSPECTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-slate-900/90 p-1 rounded-lg border border-slate-700">
            <span className="text-[10px] text-slate-400 px-1 font-semibold">Test as:</span>
            <button
              type="button"
              onClick={() => setActiveRole('buyer')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                activeRole === 'buyer'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('seller')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                activeRole === 'seller'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Seller
            </button>
          </div>
        </div>

        {/* Workflow Progression Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {steps.map((st, i) => {
            const isFinished = currentStepIndex > i || tx.status === 'completed';
            const isCurrent = currentStepIndex === i && tx.status !== 'completed';
            return (
              <div
                key={st.key}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isFinished
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex justify-center mb-1">
                  {isFinished ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className={`w-4 h-4 ${isCurrent ? 'text-cyan-400 animate-spin' : 'text-slate-600'}`} />
                  )}
                </div>
                <div className="text-[10px] font-medium leading-tight">{st.label}</div>
              </div>
            );
          })}
        </div>

        {/* Content based on status */}
        <div className="space-y-4">
          {/* Status 1: Offer Made */}
          {tx.status === 'offer_made' && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Proposed Offer Amount:</span>
                <span className="text-lg font-extrabold text-cyan-400">
                  RM {tx.offerAmount.toFixed(2)}
                </span>
              </div>

              {tx.pickupNotes && (
                <div className="text-xs text-slate-300 italic p-2.5 rounded bg-slate-950/60 border border-slate-850">
                  Buyer Note: "{tx.pickupNotes}"
                </div>
              )}

              <div className="pt-2 flex flex-wrap gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => cancelTransaction(tx.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                >
                  Decline / Cancel
                </button>
                <button
                  type="button"
                  onClick={() => acceptOffer(tx.id)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Accept Offer (RM {tx.offerAmount.toFixed(2)})
                </button>
              </div>
            </div>
          )}

          {/* Status 2: Offer Accepted - Arrange Pickup */}
          {tx.status === 'accepted' && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Step 3: Arrange Physical Campus Meetup Point
              </div>
              <p className="text-xs text-slate-400">
                Politeknik Sultan Azlan Shah encourages meeting in public, well-lit spaces such as the library lobby, student cafe, or department offices.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Pickup Location at PSAS
                  </label>
                  <select
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200"
                  >
                    <option value="Perpustakaan PSAS Level 1">Perpustakaan PSAS Level 1</option>
                    <option value="Kafeteria Utama Kolej Kediaman">Kafeteria Utama Kolej Kediaman</option>
                    <option value="Lobi Blok Pentadbiran & HEP">Lobi Blok Pentadbiran & HEP</option>
                    <option value="Pondok Pos Pengawal Utama (Pintu Masuk)">Pondok Pos Pengawal Utama</option>
                    <option value="Dataran Gemilang PSAS">Dataran Gemilang PSAS</option>
                    <option value="Kafeteria Blok Kenanga">Kafeteria Blok Kenanga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Agreed Date & Time
                  </label>
                  <input
                    type="text"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    placeholder="e.g. 2026-10-15 at 3:30 PM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Meetup Instructions / Landmark
                </label>
                <input
                  type="text"
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                  placeholder="e.g., Near the main automated return counter, wearing black jacket"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => schedulePickup(tx.id, pickupLoc, pickupDate, pickupNotes)}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Meetup Arrangement
                </button>
              </div>
            </div>
          )}

          {/* Status 3: Pickup Scheduled - Confirm Completion */}
          {tx.status === 'pickup_scheduled' && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Meetup: {tx.pickupLocation}
                </div>
                <div className="text-slate-300">
                  📅 {tx.pickupDateTime} {tx.pickupNotes && `• Note: "${tx.pickupNotes}"`}
                </div>
                <div className="text-cyan-300 font-mono text-[11px]">
                  Amount Due on Handover: RM {tx.offerAmount.toFixed(2)}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Have both parties verified the item and handed over the simulated payment?
                </label>

                <div className="space-y-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Rate this peer trade:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 rounded hover:scale-110 transition-transform ${
                            rating >= star ? 'text-amber-400' : 'text-slate-600'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write a brief review comment for the student seller..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowDispute(true)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Report Dispute / No-Show
                  </button>

                  <button
                    type="button"
                    onClick={() => completeTransaction(tx.id, rating, reviewComment)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Deal Completed
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status 4: Completed View */}
          {tx.status === 'completed' && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Trade Successfully Completed
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Item handover finished at {tx.pickupLocation} for RM {tx.offerAmount.toFixed(2)}.
                </p>
              </div>

              {tx.reviewRating && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-left max-w-sm mx-auto">
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {[...Array(tx.reviewRating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-slate-400 text-[10px] ml-1">Verified Student Review</span>
                  </div>
                  <p className="text-slate-300 italic text-[11px]">
                    "{tx.reviewComment}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Dispute Drawer Modal */}
          {showDispute && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-red-300">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Report Problem with this Transaction
                </span>
                <button
                  type="button"
                  onClick={() => setShowDispute(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleDisputeSubmit} className="space-y-2.5">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Dispute Reason
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="Item not as described">Item not as described</option>
                    <option value="No show for pickup">No show for agreed pickup</option>
                    <option value="Payment dispute">Dispute over payment</option>
                    <option value="Counterfeit or prohibited">Counterfeit or prohibited item</option>
                    <option value="Harassment">Inappropriate behaviour / Harassment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Detailed Explanation
                  </label>
                  <textarea
                    value={disputeDesc}
                    onChange={(e) => setDisputeDesc(e.target.value)}
                    required
                    placeholder="Provide details for campus mediation review..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowDispute(false)}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white"
                  >
                    Submit Dispute Report
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
