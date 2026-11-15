import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  Save,
  CheckCircle2,
  Heart,
  ShoppingBag,
  History,
  Star,
  BookOpen,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Camera,
  X
} from 'lucide-react';
import { ImageUploader, compressImageFile } from '../components/ImageUploader';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    activeRole,
    setActiveRole,
    updateUser,
    toggleVerifiedStatus,
    marketplaceItems,
    transactions,
    storeOrders,
    toggleSavedItem,
    setCurrentTab,
    language
  } = useApp();

  const t = translations[language];

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'saved' | 'history' | 'store_orders'>('listings');

  // Edit fields
  const [name, setName] = useState(user.name);
  const [matrixNo, setMatrixNo] = useState(user.matrixNo);
  const [department, setDepartment] = useState(user.department);
  const [course, setCourse] = useState(user.course);
  const [semester, setSemester] = useState(user.semester);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [interestInput, setInterestInput] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleQuickAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const compressed = await compressImageFile(file, 400, 400, 0.85);
      updateUser({ avatarUrl: compressed });
      setAvatarUrl(compressed);
    } catch (err) {
      console.error('Failed to update avatar photo', err);
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  React.useEffect(() => {
    setName(user.name);
    setMatrixNo(user.matrixNo);
    setDepartment(user.department);
    setCourse(user.course);
    setSemester(user.semester);
    setPhone(user.phone);
    setBio(user.bio);
    setAvatarUrl(user.avatarUrl);
  }, [user]);

  // User's own items
  const myListings = marketplaceItems.filter(
    (item) => item.sellerId === user.id || item.sellerName.includes('You')
  );

  // Saved items
  const savedItems = marketplaceItems.filter((item) =>
    user.savedItemIds.includes(item.id)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      matrixNo,
      department,
      course,
      semester,
      phone,
      bio,
      avatarUrl,
    });
    setIsEditing(false);
  };

  const handleAddInterest = () => {
    if (!interestInput.trim()) return;
    if (!user.interests.includes(interestInput.trim())) {
      updateUser({
        interests: [...user.interests, interestInput.trim()],
      });
    }
    setInterestInput('');
  };

  const handleRemoveInterest = (tag: string) => {
    updateUser({
      interests: user.interests.filter((i) => i !== tag),
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#111A33] to-[#0D152B] border border-cyan-500/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="relative shrink-0 group">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md group-hover:brightness-75 transition-all"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 rounded-2xl text-white text-[10px] font-bold transition-opacity cursor-pointer"
                title="Upload Profile Picture"
              >
                <Camera className="w-5 h-5 mb-0.5 text-cyan-400" />
                <span>{isUploadingAvatar ? 'Saving...' : 'Upload'}</span>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleQuickAvatarUpload}
                className="hidden"
              />
              <button
                onClick={toggleVerifiedStatus}
                className={`absolute -bottom-2 -right-2 p-1.5 rounded-xl border text-[10px] font-bold shadow-lg transition-transform hover:scale-105 z-10 ${
                  user.isVerified
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-amber-600 border-amber-400 text-white'
                }`}
                title="Click to toggle Verified / Demo status"
              >
                {user.isVerified ? '✓ VERIFIED' : 'DEMO'}
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {user.name}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-cyan-500/30">
                  {user.matrixNo}
                </span>
              </div>

              <div className="text-xs text-slate-300 font-medium">
                {user.course}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
                <span>{user.department}</span>
                <span>·</span>
                <span>Semester {user.semester}</span>
                <span>·</span>
                <span>{user.phone}</span>
              </div>

              <p className="text-xs text-slate-300 max-w-xl leading-relaxed pt-1">
                "{user.bio}"
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            {/* Active Role Quick Toggle */}
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 shadow-inner">
              <span className="text-[10px] text-slate-400 font-semibold uppercase px-1">Role:</span>
              <button
                type="button"
                onClick={() => setActiveRole('buyer')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeRole === 'seller'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Seller
              </button>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>

            {/* Verification Status Banner Button */}
            <button
              onClick={toggleVerifiedStatus}
              className={`p-2.5 rounded-xl border text-xs text-left max-w-xs transition-all ${
                user.isVerified
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {user.isVerified ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {user.isVerified
                    ? 'Verified Student (PSAS SPMP)'
                    : 'Demo Student Account'}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 mt-1 leading-snug">
                {user.isVerified
                  ? 'Active matriculation ID verified via academic portal.'
                  : 'Click to test transition to verified badge.'}
              </p>
            </button>
          </div>
        </div>

        {/* Interests Section */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Interests & Focus:
              </span>
              {user.interests.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 flex items-center gap-1.5"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveInterest(tag)}
                    className="text-slate-500 hover:text-rose-400"
                    title="Remove interest"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="Add interest tag..."
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAddInterest}
                className="px-2.5 py-1 rounded-lg bg-cyan-600 text-xs font-semibold text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form Drawer */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4 animate-in fade-in"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Edit Student Profile Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Matrix Number
              </label>
              <input
                type="text"
                value={matrixNo}
                onChange={(e) => setMatrixNo(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Title
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Semester
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              mode="single"
              value={avatarUrl}
              onChange={setAvatarUrl}
              label="Student Profile Picture / Avatar (Upload from Device or Camera)"
              aspect="square"
              samplePresets={[
                { name: 'Student 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
                { name: 'Student 2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
                { name: 'Student 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
                { name: 'Student 4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bio / Campus Introduction
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Profile Modules Tabs: Listings, Saved Items, Transactions History */}
      <div className="space-y-4">
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 gap-1">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'listings'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Active Listings ({myListings.length})
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saved Favourites ({savedItems.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Deal History ({transactions.length})
          </button>

          <button
            onClick={() => setActiveTab('store_orders')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'store_orders'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Store Orders ({storeOrders.length})
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div className="space-y-3">
            {myListings.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                You have not listed any items yet. Visit the Marketplace to post your first textbook or tool.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-800"
                      />
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.category} • RM {item.price.toFixed(2)}
                        </div>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                            item.status === 'available'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentTab('marketplace')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Items */}
        {activeTab === 'saved' && (
          <div className="space-y-3">
            {savedItems.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                No saved items. Click the heart icon on any marketplace item to save it here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-800"
                      />
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-cyan-400 font-semibold font-mono">
                          RM {item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSavedItem(item.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-white text-xs"
                        title="Remove from saved"
                      >
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </button>
                      <button
                        onClick={() => setCurrentTab('marketplace')}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs text-white"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Transaction History */}
        {activeTab === 'history' && (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tx.itemImage}
                    alt={tx.itemTitle}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                  />
                  <div>
                    <div className="font-bold text-white">{tx.itemTitle}</div>
                    <div className="text-[11px] text-slate-400">
                      Amount: RM {tx.offerAmount.toFixed(2)} • Date: {tx.updatedAt}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      tx.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {tx.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Store Orders */}
        {activeTab === 'store_orders' && (
          <div className="space-y-2">
            {storeOrders.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                No campus store orders yet. Browse student stores to buy items or receive orders as a vendor.
              </div>
            ) : (
              storeOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setCurrentTab('stores')}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={ord.productImage}
                      alt={ord.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                    />
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{ord.quantity}x {ord.productName}</span>
                        <span className="text-[10px] text-pink-400 font-mono">({ord.storeName})</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Total: <strong className="text-white">RM {ord.totalPrice.toFixed(2)}</strong> • Pickup: {ord.pickupPoint}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                        ord.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : ord.status === 'ready_for_pickup'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                          : ord.status === 'accepted'
                          ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {ord.status.replace('_', ' ')}
                    </span>
                    <div className="text-[10px] text-pink-400 mt-1">Manage in Stores →</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
