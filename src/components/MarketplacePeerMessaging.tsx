import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig, motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Eye,
  Send,
  X,
  DollarSign,
  MapPin,
  Search,
  Ban,
  Flag,
  Trash2,
  AlertTriangle,
  MessageCircle,
  CheckCircle2,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { ChatMessage, MarketplaceItem, UserProfile } from '../types';
import {
  SAFE_CAMPUS_MEETUP_SPOTS,
  computeP2PSessionCode,
  getFirstNameOnly,
  getMaskedStudentHandle,
  maskMatrixNumber,
  scanMessagePrivacy,
} from '../utils/chatPrivacy';

interface MarketplacePeerMessagingProps {
  mode: 'inline' | 'modal';
  isOpen?: boolean;
  onClose?: () => void;
  items: MarketplaceItem[];
  initialItem?: MarketplaceItem | null;
  currentUser: UserProfile;
  messages: ChatMessage[];
  blockedPeerIds: string[];
  onSendMessage: (
    item: MarketplaceItem,
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
  onMakeOffer?: (item: MarketplaceItem, offerAmount: number, notes?: string) => void;
  onToggleBlockPeer: (peerId: string, peerName?: string) => void;
  onClearItemMessages: (itemId: string) => void;
  onReportSafetyIssue?: (item: MarketplaceItem, peerLabel: string) => void;
  onOpenItemDetails?: (item: MarketplaceItem) => void;
}

export const MarketplacePeerMessaging: React.FC<MarketplacePeerMessagingProps> = ({
  mode,
  isOpen = true,
  onClose,
  items,
  initialItem = null,
  currentUser,
  messages,
  blockedPeerIds,
  onSendMessage,
  onMakeOffer,
  onToggleBlockPeer,
  onClearItemMessages,
  onReportSafetyIssue,
  onOpenItemDetails,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(
    initialItem?.id || items[0]?.id || ''
  );
  const [threadSearch, setThreadSearch] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [maskIdentity, setMaskIdentity] = useState<boolean>(true);
  const [autoRedactPii, setAutoRedactPii] = useState<boolean>(true);
  const [showOfferBar, setShowOfferBar] = useState<boolean>(false);
  const [offerPriceInput, setOfferPriceInput] = useState<string>('');
  const [showPrivacyInfo, setShowPrivacyInfo] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync selectedItemId when initialItem changes in modal or deep-link
  useEffect(() => {
    if (initialItem?.id) {
      setSelectedItemId(initialItem.id);
      setOfferPriceInput(initialItem.price.toString());
    }
  }, [initialItem?.id, initialItem?.price]);

  // Build ordered list of conversation threads (items with messages first, then other active listings)
  const conversationThreads = useMemo(() => {
    const searchLower = threadSearch.trim().toLowerCase();

    const mapped = items.map((item) => {
      const itemMsgs = messages.filter((m) => m.itemId === item.id);
      const lastMsg = itemMsgs[itemMsgs.length - 1] || null;
      const isSeller =
        item.sellerId === currentUser.id || item.sellerName.includes('You');
      const peerId = isSeller ? 'usr_buyer_inquiry' : item.sellerId;
      const peerMasked = isSeller
        ? 'PSAS Buyer (Verified)'
        : getMaskedStudentHandle(item.sellerName, item.sellerMatrix, 'Seller');

      return {
        item,
        itemMsgs,
        lastMsg,
        isSeller,
        peerId,
        peerMasked,
        isBlocked: blockedPeerIds.includes(peerId),
      };
    });

    const filtered = searchLower
      ? mapped.filter(
          (t) =>
            t.item.title.toLowerCase().includes(searchLower) ||
            t.peerMasked.toLowerCase().includes(searchLower) ||
            t.item.sellerName.toLowerCase().includes(searchLower) ||
            t.item.category.toLowerCase().includes(searchLower)
        )
      : mapped;

    return filtered.sort((a, b) => {
      if (a.itemMsgs.length > 0 && b.itemMsgs.length === 0) return -1;
      if (a.itemMsgs.length === 0 && b.itemMsgs.length > 0) return 1;
      if (a.lastMsg && b.lastMsg) {
        return b.lastMsg.timestamp.localeCompare(a.lastMsg.timestamp);
      }
      return b.item.views - a.item.views;
    });
  }, [items, messages, currentUser.id, blockedPeerIds, threadSearch]);

  const activeThread = useMemo(() => {
    if (mode === 'modal' && initialItem) {
      return (
        conversationThreads.find((t) => t.item.id === initialItem.id) || {
          item: initialItem,
          itemMsgs: messages.filter((m) => m.itemId === initialItem.id),
          lastMsg: null,
          isSeller:
            initialItem.sellerId === currentUser.id ||
            initialItem.sellerName.includes('You'),
          peerId:
            initialItem.sellerId === currentUser.id
              ? 'usr_buyer_inquiry'
              : initialItem.sellerId,
          peerMasked:
            initialItem.sellerId === currentUser.id
              ? 'PSAS Buyer (Verified)'
              : getMaskedStudentHandle(
                  initialItem.sellerName,
                  initialItem.sellerMatrix,
                  'Seller'
                ),
          isBlocked: blockedPeerIds.includes(
            initialItem.sellerId === currentUser.id
              ? 'usr_buyer_inquiry'
              : initialItem.sellerId
          ),
        }
      );
    }
    return (
      conversationThreads.find((t) => t.item.id === selectedItemId) ||
      conversationThreads[0] ||
      null
    );
  }, [mode, initialItem, conversationThreads, selectedItemId, messages, currentUser.id, blockedPeerIds]);

  const activeItem = activeThread?.item || null;
  const activeMessages = activeThread?.itemMsgs || [];
  const isSeller = activeThread?.isSeller ?? false;
  const peerId = activeThread?.peerId || '';
  const isPeerBlocked = activeThread?.isBlocked ?? false;

  const peerDisplayName = useMemo(() => {
    if (!activeItem) return 'PSAS Student';
    if (isSeller) return 'PSAS Student Buyer';
    return maskIdentity
      ? getMaskedStudentHandle(activeItem.sellerName, activeItem.sellerMatrix, 'Seller')
      : getFirstNameOnly(activeItem.sellerName);
  }, [activeItem, isSeller, maskIdentity]);

  const senderDisplayName = useMemo(() => {
    const roleLabel = isSeller ? 'Seller' : 'Buyer';
    return maskIdentity
      ? getMaskedStudentHandle(currentUser.name, currentUser.matrixNo, roleLabel)
      : getFirstNameOnly(currentUser.name);
  }, [isSeller, maskIdentity, currentUser.name, currentUser.matrixNo]);

  const sessionCode = useMemo(() => {
    if (!activeItem) return 'P2P-SAFE';
    return computeP2PSessionCode(activeItem.id, peerId, currentUser.id);
  }, [activeItem, peerId, currentUser.id]);

  // Real-time PII scan of current draft
  const draftPrivacyScan = useMemo(() => scanMessagePrivacy(inputText), [inputText]);

  useEffect(() => {
    if (activeItem) {
      setOfferPriceInput(activeItem.price.toString());
      setShowOfferBar(false);
    }
  }, [activeItem?.id]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, activeMessages.length, activeItem?.id]);

  if (mode === 'modal' && !isOpen) return null;

  const dispatchMessage = (
    rawContent: string,
    isOfferProposal = false,
    proposedPrice?: number
  ) => {
    if (!activeItem || isPeerBlocked) return;
    const trimmed = rawContent.trim();
    if (!trimmed) return;

    const scan = scanMessagePrivacy(trimmed);
    const finalContent = autoRedactPii && scan.hasSensitiveData ? scan.sanitizedText : trimmed;
    const redactedCount = autoRedactPii ? scan.redactedCount : 0;

    onSendMessage(
      activeItem,
      peerId,
      peerDisplayName,
      finalContent,
      isOfferProposal,
      proposedPrice,
      {
        isPrivacyMasked: maskIdentity,
        senderDisplayName,
        redactedPiiCount: redactedCount,
      }
    );
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeItem || isPeerBlocked) return;
    dispatchMessage(inputText);
    setInputText('');
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem || isPeerBlocked) return;
    const parsed = parseFloat(offerPriceInput);
    if (!parsed || parsed <= 0) return;

    const proposalText = `Proposed offer of RM ${parsed.toFixed(2)} for "${activeItem.title}". Can we meet safely at ${activeItem.pickupLocation}?`;
    dispatchMessage(proposalText, true, parsed);
    onMakeOffer?.(
      activeItem,
      parsed,
      `Private P2P offer via secure chat (${activeItem.pickupLocation})`
    );
    setShowOfferBar(false);
  };

  const renderThreadWorkspace = () => {
    if (!activeItem) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Listing Selected</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Select a listing conversation on the left to start privacy-protected campus messaging.
          </p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Peer & Privacy Header */}
        <div className="p-3.5 sm:p-4 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              {maskIdentity || isSeller ? (
                <div className="w-10 h-10 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                  <EyeOff className="w-4 h-4" />
                </div>
              ) : (
                <img
                  src={activeItem.sellerAvatar}
                  alt={peerDisplayName}
                  className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                />
              )}
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                  isPeerBlocked ? 'bg-rose-500' : 'bg-emerald-400'
                }`}
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-sm font-bold text-white truncate">{peerDisplayName}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/35 inline-flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>{sessionCode}</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span className="font-mono">
                  {isSeller
                    ? 'Matrix: PSAS-HIDDEN'
                    : `Matrix: ${maskMatrixNumber(activeItem.sellerMatrix)}`}
                </span>
                <span>·</span>
                <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Phone & Email Hidden
                </span>
              </div>
            </div>
          </div>

          {/* Privacy & Safety Action Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setMaskIdentity((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border inline-flex items-center gap-1 transition-colors cursor-pointer ${
                maskIdentity
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle whether your name is masked behind a PSAS Student Alias"
            >
              {maskIdentity ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{maskIdentity ? 'Alias Active' : 'First Name'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAutoRedactPii((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border inline-flex items-center gap-1 transition-colors cursor-pointer ${
                autoRedactPii
                  ? 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Automatically redact phone numbers, emails, IC numbers, and external links"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>PII Guard: {autoRedactPii ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPrivacyInfo((prev) => !prev)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title="Privacy details & safety options"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            <button
              type="button"
              onClick={() => onToggleBlockPeer(peerId, peerDisplayName)}
              className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                isPeerBlocked
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-slate-800 hover:bg-rose-950/70 text-slate-300 hover:text-rose-300 border-slate-700'
              }`}
              title={isPeerBlocked ? 'Unblock peer' : 'Block peer'}
            >
              <Ban className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onReportSafetyIssue?.(activeItem, peerDisplayName)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-950/60 text-slate-300 hover:text-amber-300 border border-slate-700 cursor-pointer"
              title="Report suspicious or off-platform request"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>

            {activeMessages.length > 0 && (
              <button
                type="button"
                onClick={() => onClearItemMessages(activeItem.id)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 cursor-pointer"
                title="Clear local thread history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {mode === 'modal' && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer ml-0.5"
                aria-label="Close messaging modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Privacy Protection Summary Drawer */}
        {showPrivacyInfo && (
          <div className="px-4 py-2.5 bg-emerald-950/40 border-b border-emerald-500/30 text-[11px] text-emerald-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="space-y-0.5">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>PSAS Student Privacy Protection Active</span>
              </div>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                Your handle appears as <strong className="text-white">{senderDisplayName}</strong>. Phone numbers, emails, MyKad IDs, full Matrix IDs, and off-platform links are guarded automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPrivacyInfo(false)}
              className="text-[10px] font-semibold text-emerald-300 hover:underline cursor-pointer"
            >
              Hide
            </button>
          </div>
        )}

        {/* Item Context & Offer Bar */}
        <div className="px-3.5 py-2.5 bg-slate-950/75 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 shrink-0 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={activeItem.images[0]}
              alt={activeItem.title}
              className="w-9 h-9 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700"
            />
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onOpenItemDetails?.(activeItem)}
                className="font-semibold text-white hover:text-cyan-300 block truncate text-xs text-left cursor-pointer"
              >
                {activeItem.title}
              </button>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="text-cyan-400 font-mono font-bold">
                  RM {activeItem.price.toFixed(2)}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  {activeItem.pickupLocation}
                </span>
              </div>
            </div>
          </div>

          {!isSeller && !isPeerBlocked && (
            <button
              type="button"
              onClick={() => setShowOfferBar((prev) => !prev)}
              className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-[11px] font-bold transition-all inline-flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <DollarSign className="w-3 h-3" />
              <span>Propose Price</span>
            </button>
          )}
        </div>

        {/* Offer Proposal Form */}
        {showOfferBar && !isSeller && !isPeerBlocked && (
          <form
            onSubmit={handleOfferSubmit}
            className="px-3.5 py-2.5 bg-cyan-950/40 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 shrink-0"
          >
            <span className="text-[11px] text-slate-200 font-semibold">
              Propose Safe Offer:
            </span>
            <div className="flex items-center gap-1.5 flex-1 max-w-[170px]">
              <span className="text-xs text-slate-400 font-mono">RM</span>
              <input
                type="number"
                step="0.5"
                min="1"
                value={offerPriceInput}
                onChange={(e) => setOfferPriceInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white cursor-pointer"
              >
                Send Offer
              </button>
              <button
                type="button"
                onClick={() => setShowOfferBar(false)}
                className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </form>
        )}

        {/* Blocked Peer Banner */}
        {isPeerBlocked && (
          <div className="px-4 py-2.5 bg-rose-950/70 border-b border-rose-500/40 text-xs text-rose-200 flex items-center justify-between gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-400" />
              <span>You blocked this peer for privacy. Messaging is paused.</span>
            </span>
            <button
              type="button"
              onClick={() => onToggleBlockPeer(peerId, peerDisplayName)}
              className="px-2.5 py-1 rounded-lg bg-rose-900 hover:bg-rose-800 text-[11px] font-bold text-white cursor-pointer"
            >
              Unblock
            </button>
          </div>
        )}

        {/* Message Thread Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0A101D]/90">
          {activeMessages.length === 0 ? (
            <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-4 space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">
                Private Campus P2P Channel Ready
              </h4>
              <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                Communicate directly without exposing your personal phone number, email, or full Matrix ID. Arrange handovers strictly at public PSAS campus spots.
              </p>
              {!isPeerBlocked && (
                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  {[
                    'Hi, is this item still available?',
                    'Can we inspect & deal at Perpustakaan PSAS Lobby?',
                    'Is the price slightly negotiable for a PSAS student?',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => dispatchMessage(preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            activeMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const displayedContent = autoRedactPii
                ? scanMessagePrivacy(msg.content).sanitizedText
                : msg.content;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                      isMine
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-xs shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span
                        className={`font-bold inline-flex items-center gap-1 ${
                          isMine ? 'text-cyan-100' : 'text-cyan-400'
                        }`}
                      >
                        {(msg.isPrivacyMasked || maskIdentity) && (
                          <EyeOff className="w-2.5 h-2.5" />
                        )}
                        <span>
                          {isMine
                            ? msg.isPrivacyMasked
                              ? `${msg.senderName} (You)`
                              : 'You'
                            : maskIdentity
                            ? getMaskedStudentHandle(
                                msg.senderName,
                                undefined,
                                isSeller ? 'Buyer' : 'Seller'
                              )
                            : getFirstNameOnly(msg.senderName)}
                        </span>
                      </span>

                      {(msg.redactedPiiCount ?? 0) > 0 && (
                        <span className="px-1.5 py-0.2 rounded bg-black/25 text-[9px] font-semibold text-emerald-200">
                          PII Protected
                        </span>
                      )}
                    </div>

                    {msg.isOfferProposal && msg.proposedPrice && (
                      <div className="p-2 rounded-xl bg-black/30 border border-white/20 mb-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold">Safe Offer Proposal</span>
                        <span className="text-xs font-extrabold text-amber-300 font-mono">
                          RM {msg.proposedPrice.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap break-words">{displayedContent}</p>

                    <div
                      className={`text-[9px] text-right font-mono mt-1 flex items-center justify-end gap-1 ${
                        isMine ? 'text-cyan-100/80' : 'text-slate-500'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 opacity-80" />
                      <span>{msg.timestamp.slice(-5)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Safe Campus Meetup Quick-Picker + Real-Time PII Warning */}
        {!isPeerBlocked && (
          <div className="bg-slate-900/95 border-t border-slate-800 shrink-0">
            <div className="px-3 py-1.5 border-b border-slate-800/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
              <span className="text-slate-400 font-semibold shrink-0 inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> Safe Meetup:
              </span>
              {SAFE_CAMPUS_MEETUP_SPOTS.map((spot) => (
                <button
                  key={spot}
                  type="button"
                  onClick={() =>
                    setInputText(
                      `Can we meet safely at ${spot} to inspect the item?`
                    )
                  }
                  className="px-2 py-0.5 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 whitespace-nowrap transition-colors cursor-pointer"
                >
                  {spot}
                </button>
              ))}
            </div>

            {draftPrivacyScan.hasSensitiveData && (
              <div className="px-3 py-2 bg-amber-950/60 border-b border-amber-500/40 text-[11px] text-amber-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    Privacy Guard detected:{' '}
                    <strong>{draftPrivacyScan.findings.join(', ')}</strong>.{' '}
                    {autoRedactPii
                      ? 'Auto-Redact is ON and will mask this before sending.'
                      : 'Keep personal contacts private inside PSAS chat.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setInputText(draftPrivacyScan.sanitizedText)}
                  className="px-2 py-0.5 rounded bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-[10px] font-bold text-amber-100 cursor-pointer"
                >
                  Redact Draft Now
                </button>
              </div>
            )}

            <form
              onSubmit={handleSendSubmit}
              className="p-3 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${peerDisplayName} privately as ${senderDisplayName}...`}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white shadow-md transition-all cursor-pointer"
                title="Send Privacy-Protected Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  if (mode === 'modal') {
    return (
      <MotionConfig reducedMotion="user">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-[#0E1628] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[620px] max-h-[92vh] text-slate-100 my-auto"
          >
            {renderThreadWorkspace()}
          </motion.div>
        </div>
      </MotionConfig>
    );
  }

  // Inline two-pane Secure Messaging Hub inside MarketplaceScreen
  return (
    <MotionConfig reducedMotion="user">
      <div className="rounded-2xl bg-[#0E1628] border border-cyan-500/30 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px] max-h-[720px]">
        {/* Left Pane: Conversations List */}
        <div className="md:col-span-4 lg:col-span-4 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/60 flex flex-col min-h-[220px] max-h-[300px] md:max-h-[720px]">
          <div className="p-3.5 border-b border-slate-800 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  P2P Secure Chats
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                Privacy Shield
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
                placeholder="Search item or masked peer..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {conversationThreads.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No matching marketplace conversations found.
              </div>
            ) : (
              conversationThreads.map((thread) => {
                const isSelected = activeItem?.id === thread.item.id;
                const previewText = thread.lastMsg
                  ? autoRedactPii
                    ? scanMessagePrivacy(thread.lastMsg.content).sanitizedText
                    : thread.lastMsg.content
                  : 'Tap to start privacy-protected P2P chat';

                return (
                  <button
                    key={thread.item.id}
                    type="button"
                    onClick={() => setSelectedItemId(thread.item.id)}
                    className={`w-full p-3 text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-l-2 border-l-cyan-400'
                        : 'hover:bg-slate-900/80'
                    }`}
                  >
                    <img
                      src={thread.item.images[0]}
                      alt={thread.item.title}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {thread.peerMasked}
                        </span>
                        {thread.itemMsgs.length > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 shrink-0">
                            {thread.itemMsgs.length}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-medium text-cyan-300 truncate mt-0.5">
                        {thread.item.title}
                      </div>
                      <div className="flex items-center justify-between gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 truncate">
                          {previewText}
                        </span>
                        {thread.isBlocked && (
                          <span className="text-[9px] text-rose-400 font-bold shrink-0">
                            Blocked
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active P2P Conversation */}
        <div className="md:col-span-8 lg:col-span-8 flex flex-col min-h-[400px] max-h-[720px]">
          {renderThreadWorkspace()}
        </div>
      </div>
    </MotionConfig>
  );
};
