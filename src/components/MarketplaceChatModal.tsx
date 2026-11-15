import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  X,
  ShieldCheck,
  Tag,
  DollarSign,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MarketplaceItem, ChatMessage, UserProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: MarketplaceItem;
  currentUser: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (content: string, isOfferProposal?: boolean, proposedPrice?: number) => void;
  onMakeOffer?: (offerAmount: number, notes?: string) => void;
}

export const MarketplaceChatModal: React.FC<Props> = ({
  isOpen,
  onClose,
  item,
  currentUser,
  messages,
  onSendMessage,
  onMakeOffer
}) => {
  const [inputText, setInputText] = useState('');
  const [showOfferBar, setShowOfferBar] = useState(false);
  const [offerPriceInput, setOfferPriceInput] = useState(item.price.toString());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSeller = currentUser.id === item.sellerId || item.sellerName.includes(currentUser.name);
  const recipientName = isSeller ? 'Buyer' : item.sellerName;

  // Filter messages for this specific item
  const itemMessages = messages.filter((m) => m.itemId === item.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, itemMessages.length]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSendOfferProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(offerPriceInput);
    if (!parsed || parsed <= 0) return;

    const proposalText = `Proposed simulated offer of RM ${parsed.toFixed(2)} for ${item.title}. Can we arrange pickup at ${item.pickupLocation}?`;
    onSendMessage(proposalText, true, parsed);

    if (onMakeOffer) {
      onMakeOffer(parsed, `Offered via chat negotiation at ${item.pickupLocation}`);
    }

    setShowOfferBar(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0E1628] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] text-slate-100 my-auto animate-in fade-in zoom-in-95">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <img
                src={item.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={recipientName}
                className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white truncate">{recipientName}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" /> PSAS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {isSeller ? 'Customer Inquiry' : `Seller Rating: ${item.sellerRating.toFixed(1)} ★`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Context Ribbon */}
        <div className="p-2.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-8 h-8 rounded-lg object-cover bg-slate-800 shrink-0"
            />
            <div className="min-w-0">
              <span className="font-semibold text-white block truncate text-[11px]">
                {item.title}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">
                Listed Price: RM {item.price.toFixed(2)}
              </span>
            </div>
          </div>

          {!isSeller && (
            <button
              onClick={() => setShowOfferBar(!showOfferBar)}
              className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <DollarSign className="w-3 h-3" />
              <span>Propose Price</span>
            </button>
          )}
        </div>

        {/* Offer proposal drawer */}
        {showOfferBar && (
          <form
            onSubmit={handleSendOfferProposal}
            className="p-3 bg-cyan-950/40 border-b border-cyan-500/30 flex items-center justify-between gap-2 shrink-0 animate-in slide-in-from-top-2"
          >
            <div className="text-[11px] text-slate-300 font-semibold">
              Propose Offer:
            </div>
            <div className="flex items-center gap-1.5 flex-1 max-w-[160px]">
              <span className="text-xs text-slate-400 font-mono">RM</span>
              <input
                type="number"
                step="0.5"
                value={offerPriceInput}
                onChange={(e) => setOfferPriceInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-sm cursor-pointer"
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
          </form>
        )}

        {/* Safety Tip Banner */}
        <div className="px-3 py-1.5 bg-slate-950/90 text-[10px] text-slate-400 border-b border-slate-800/80 flex items-center justify-between gap-2 shrink-0">
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3 h-3 text-cyan-400" />
            Pickup spot: <strong className="text-white">{item.pickupLocation}</strong>
          </span>
          <span className="text-[9px] text-emerald-400 font-semibold">
            PSAS Verified Safe Chat
          </span>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0A101D]/90">
          {itemMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-white">Start Safe Negotiation</h4>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Ask about item condition, test dates, and confirm campus handover points around Politeknik Sultan Azlan Shah.
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {[
                  'Is this still available?',
                  'Can we meet at Perpustakaan?',
                  'Can nego price slightly?'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      onSendMessage(preset);
                    }}
                    className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-[10px] text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            itemMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

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
                    {!isMine && (
                      <div className="text-[10px] font-bold text-cyan-400 mb-0.5">
                        {msg.senderName}
                      </div>
                    )}

                    {msg.isOfferProposal && msg.proposedPrice && (
                      <div className="p-2 rounded-xl bg-black/30 border border-white/20 mb-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold">Offer Proposal</span>
                        <span className="text-xs font-extrabold text-amber-300 font-mono">
                          RM {msg.proposedPrice.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    <div
                      className={`text-[9px] text-right font-mono mt-1 ${
                        isMine ? 'text-cyan-200/80' : 'text-slate-500'
                      }`}
                    >
                      {msg.timestamp.slice(-5)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message to negotiate or arrange meetup..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white shadow-md shadow-cyan-950 transition-all cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
