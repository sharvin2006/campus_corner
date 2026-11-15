import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StudentStore, StoreProduct } from '../types';
import { translations } from '../data/translations';
import { ImageUploader } from '../components/ImageUploader';
import {
  Store,
  Plus,
  ShoppingBag,
  Star,
  MessageCircle,
  MapPin,
  Tag,
  CheckCircle2,
  X,
  Package,
  ArrowRight,
  Sparkles,
  Edit,
  Trash2,
  Clock,
  Search,
  Filter,
  Check,
  Eye,
  Camera,
  Layers,
  Phone,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const StoresScreen: React.FC = () => {
  const {
    stores,
    storeOrders,
    placeStoreOrder,
    updateStoreOrderStatus,
    createStore,
    updateStore,
    deleteStore,
    addProductToStore,
    updateStoreProduct,
    deleteStoreProduct,
    toggleProductStock,
    language,
    user,
    activeRole,
    setActiveRole
  } = useApp();
  const t = translations[language];

  // Tab State: 'browse', 'post_product', 'my_stores', 'orders'
  const [activeTab, setActiveTab] = useState<'browse' | 'post_product' | 'my_stores' | 'orders'>('browse');

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Modals & Selected items
  const [selectedStore, setSelectedStore] = useState<StudentStore | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{ store: StudentStore; product: StoreProduct } | null>(null);
  const [isCreateStoreModalOpen, setIsCreateStoreModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StudentStore | null>(null);

  // Dedicated Product Post / Edit State
  const [targetStoreId, setTargetStoreId] = useState<string>('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(10);
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategoryTag, setProdCategoryTag] = useState('Best Sellers');
  const [prodPrepTime, setProdPrepTime] = useState('Instant / Ready Stock');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodIsPopular, setProdIsPopular] = useState(false);
  const [prodImages, setProdImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80'
  ]);

  // Store Creation / Edit Form State
  const [storeName, setStoreName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [storeCategory, setStoreCategory] = useState<StudentStore['category']>('Food & Beverage');
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80');
  const [logoImage, setLogoImage] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80');
  const [whatsappContact, setWhatsappContact] = useState(user.phone || '+60 12-345 6789');
  const [pickupPoint, setPickupPoint] = useState('Lobi Asrama Kolej Kediaman PSAS');
  const [operatingHours, setOperatingHours] = useState('4:00 PM - 10:30 PM (Setiap Hari)');
  const [catalogCategoriesInput, setCatalogCategoriesInput] = useState('Best Sellers, Combos, Ala Carte');

  // Active Catalog Tab inside Store Modal
  const [storeModalCatalogTab, setStoreModalCatalogTab] = useState<string>('All');

  // Direct In-App Ordering Modal State (For Buyer and Seller checkout)
  const [isOrderingModalOpen, setIsOrderingModalOpen] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderingProduct, setOrderingProduct] = useState<{ store: StudentStore; product: StoreProduct } | null>(null);

  // Identify student's own stores
  const myStores = useMemo(() => {
    return stores.filter(
      (s) => s.ownerId === user.id || s.ownerName === user.name || s.ownerMatrix === user.matrixNo
    );
  }, [stores, user]);

  // If user opens post product tab and no store selected, auto-select their first store or the first available store
  React.useEffect(() => {
    if (!targetStoreId && stores.length > 0) {
      if (myStores.length > 0) {
        setTargetStoreId(myStores[0].id);
      } else {
        setTargetStoreId(stores[0].id);
      }
    }
  }, [myStores, stores, targetStoreId]);

  // Reset Product Form
  const resetProductForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdPrice(10);
    setProdDesc('');
    setProdCategoryTag('Best Sellers');
    setProdPrepTime('Instant / Ready Stock');
    setProdInStock(true);
    setProdIsPopular(false);
    setProdImages(['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80']);
  };

  // Populate Product Form for Editing
  const startEditProduct = (store: StudentStore, prod: StoreProduct) => {
    setTargetStoreId(store.id);
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdDesc(prod.description);
    setProdCategoryTag(prod.categoryTag || 'General');
    setProdPrepTime(prod.prepTime || 'Instant / Ready Stock');
    setProdInStock(prod.inStock);
    setProdIsPopular(!!prod.isPopular);
    setProdImages(prod.images && prod.images.length > 0 ? prod.images : [prod.image]);
    setActiveTab('post_product');
  };

  // Open store creation or edit modal
  const openStoreModal = (storeToEdit?: StudentStore) => {
    if (storeToEdit) {
      setEditingStore(storeToEdit);
      setStoreName(storeToEdit.name);
      setTagline(storeToEdit.tagline);
      setDescription(storeToEdit.description);
      setStoreCategory(storeToEdit.category);
      setBannerImage(storeToEdit.bannerImage);
      setLogoImage(storeToEdit.logoImage);
      setWhatsappContact(storeToEdit.whatsappContact);
      setPickupPoint(storeToEdit.pickupPoint);
      setOperatingHours(storeToEdit.operatingHours || '4:00 PM - 10:30 PM');
      setCatalogCategoriesInput(storeToEdit.catalogCategories?.join(', ') || 'Best Sellers, Combos, Ala Carte');
    } else {
      setEditingStore(null);
      setStoreName('');
      setTagline('');
      setDescription('');
      setStoreCategory('Food & Beverage');
      setBannerImage('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80');
      setLogoImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80');
      setWhatsappContact(user.phone || '+60 12-345 6789');
      setPickupPoint('Lobi Asrama Kolej Kediaman PSAS');
      setOperatingHours('4:00 PM - 10:30 PM (Setiap Hari)');
      setCatalogCategoriesInput('Best Sellers, Combos, Ala Carte');
    }
    setIsCreateStoreModalOpen(true);
  };

  // Handle Store Form Submit
  const handleStoreFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCats = catalogCategoriesInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (editingStore) {
      updateStore(editingStore.id, {
        name: storeName,
        tagline,
        description,
        category: storeCategory,
        bannerImage,
        logoImage,
        whatsappContact,
        pickupPoint,
        operatingHours,
        catalogCategories: parsedCats.length > 0 ? parsedCats : ['General'],
      });
      // also update selectedStore if currently viewed
      if (selectedStore && selectedStore.id === editingStore.id) {
        setSelectedStore((prev) =>
          prev
            ? {
                ...prev,
                name: storeName,
                tagline,
                description,
                category: storeCategory,
                bannerImage,
                logoImage,
                whatsappContact,
                pickupPoint,
                operatingHours,
                catalogCategories: parsedCats.length > 0 ? parsedCats : ['General'],
              }
            : null
        );
      }
    } else {
      createStore({
        name: storeName,
        tagline,
        description,
        category: storeCategory,
        bannerImage,
        logoImage,
        whatsappContact,
        pickupPoint,
        operatingHours,
        catalogCategories: parsedCats.length > 0 ? parsedCats : ['General', 'Best Sellers'],
        products: [],
      });
    }
    setIsCreateStoreModalOpen(false);
  };

  // Handle Product Save Submit (New or Edit)
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStoreId) return;

    const primaryImage = prodImages.length > 0 ? prodImages[0] : 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80';

    if (editingProductId) {
      updateStoreProduct(targetStoreId, editingProductId, {
        name: prodName,
        price: Number(prodPrice),
        description: prodDesc,
        image: primaryImage,
        images: prodImages,
        inStock: prodInStock,
        categoryTag: prodCategoryTag.trim() || 'General',
        prepTime: prodPrepTime,
        isPopular: prodIsPopular,
      });
      // update selectedStore if currently in modal
      if (selectedStore && selectedStore.id === targetStoreId) {
        setSelectedStore((prev) =>
          prev
            ? {
                ...prev,
                products: prev.products.map((p) =>
                  p.id === editingProductId
                    ? {
                        ...p,
                        name: prodName,
                        price: Number(prodPrice),
                        description: prodDesc,
                        image: primaryImage,
                        images: prodImages,
                        inStock: prodInStock,
                        categoryTag: prodCategoryTag.trim() || 'General',
                        prepTime: prodPrepTime,
                        isPopular: prodIsPopular,
                      }
                    : p
                ),
              }
            : null
        );
      }
    } else {
      addProductToStore(targetStoreId, {
        name: prodName,
        price: Number(prodPrice),
        description: prodDesc,
        image: primaryImage,
        images: prodImages,
        inStock: prodInStock,
        categoryTag: prodCategoryTag.trim() || 'General',
        prepTime: prodPrepTime,
        isPopular: prodIsPopular,
      });
      // update selectedStore if currently open
      if (selectedStore && selectedStore.id === targetStoreId) {
        const newProductObj: StoreProduct = {
          id: 'prod_' + Date.now(),
          name: prodName,
          price: Number(prodPrice),
          description: prodDesc,
          image: primaryImage,
          images: prodImages,
          inStock: prodInStock,
          categoryTag: prodCategoryTag.trim() || 'General',
          prepTime: prodPrepTime,
          isPopular: prodIsPopular,
        };
        setSelectedStore((prev) =>
          prev
            ? {
                ...prev,
                products: [newProductObj, ...prev.products],
              }
            : null
        );
      }
    }

    resetProductForm();
    // Navigate back to view stores
    setActiveTab('browse');
  };

  // Filtered stores
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesCat = selectedCategory === 'All' || store.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        store.name.toLowerCase().includes(q) ||
        store.tagline.toLowerCase().includes(q) ||
        store.description.toLowerCase().includes(q) ||
        store.products.some((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));

      const matchesStock = !onlyInStock || store.products.some((p) => p.inStock);

      return matchesCat && matchesSearch && matchesStock;
    });
  }, [stores, selectedCategory, searchQuery, onlyInStock]);

  const currentTargetStore = stores.find((s) => s.id === targetStoreId);

  // Suggested preset tags based on store category
  const suggestedTags = useMemo(() => {
    if (!currentTargetStore) return ['Best Sellers', 'Combo Murah', 'Ready Stock', 'Hot Item'];
    if (currentTargetStore.category === 'Food & Beverage') {
      return ['Best Sellers', 'Makanan Panas', 'Kudapan Siswa', 'Minuman Sejuk', 'Pek Percubaan', 'Combo Asrama'];
    }
    if (currentTargetStore.category === 'Tech & Printing Services') {
      return ['Format & Windows', 'Servis Hardware', 'Cetakan Assignment', 'Binding & Laminate', 'Aksesori PC'];
    }
    if (currentTargetStore.category === 'Fashion & Merch') {
      return ['T-Shirt PSAS', 'Tote Bag', 'Lanyard Kolej', 'Sticker Pack', 'Hijab & Pin'];
    }
    return ['Handmade Craft', 'Cenderamata', 'Kait Benang', 'Art Prints', 'Custom Gift'];
  }, [currentTargetStore]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#1F102B] to-[#2D0B2F] border border-pink-500/20 shadow-xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-52 h-52 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/70 border border-pink-500/40 text-pink-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>PSAS Student Entrepreneurship Stores & Catalogs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gerai Siswa & Katalog Produk Usahawan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Platform keusahawanan siswa Politeknik Sultan Azlan Shah. Pelajar bebas membuka gerai, memuat naik katalog produk berbilang foto, mengurus stok barang, dan menerima tempahan terus melalui WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => {
                resetProductForm();
                setActiveTab('post_product');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Post Product to Catalog</span>
            </button>

            <button
              onClick={() => openStoreModal()}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-pink-500/40 text-pink-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Open New Store</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Badges */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-slate-400 text-[11px] block">Active Student Stores</span>
            <span className="text-white font-bold text-base">{stores.length} Gerai Kampus</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-slate-400 text-[11px] block">Products in Catalogs</span>
            <span className="text-pink-300 font-bold text-base">
              {stores.reduce((acc, s) => acc + s.products.length, 0)} Item Tersedia
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-slate-400 text-[11px] block">Student Verification</span>
            <span className="text-cyan-400 font-bold text-base flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Kad Matrik PSAS
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-slate-400 text-[11px] block">Campus Ordering</span>
            <span className="text-emerald-400 font-bold text-base flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> 1-Tap WhatsApp
            </span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'browse'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Browse Stores & Catalogs</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-950/60 text-[10px]">
            {filteredStores.length}
          </span>
        </button>

        <button
          onClick={() => {
            resetProductForm();
            setActiveTab('post_product');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'post_product'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Post / Update Product into Catalog</span>
          {editingProductId && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px]">
              Editing
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my_stores')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'my_stores'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Store & Catalog Inventory</span>
          <span className="px-1.5 py-0.5 rounded-full bg-pink-950 text-pink-300 text-[10px] border border-pink-500/30">
            {myStores.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Store Orders & Tracking</span>
          <span className="px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-500/30">
            {storeOrders.length}
          </span>
        </button>
      </div>

      {/* TAB 1: BROWSE STORES & CATALOGS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search store name, product, brownies, sambal, formatting, crafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 overflow-x-auto">
                {['All', 'Food & Beverage', 'Tech & Printing Services', 'Fashion & Merch', 'Arts & Crafts'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-1.5 text-xs text-slate-300 ml-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-slate-700 text-pink-600 focus:ring-pink-500 bg-slate-950"
                />
                <span className="text-[11px]">Ready Stock Only</span>
              </label>
            </div>
          </div>

          {/* Stores Grid */}
          {filteredStores.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 space-y-3">
              <Store className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Stores or Products Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No student storefront matched your filter. Try adjusting your query or be the first to post products to this catalog!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setOnlyInStock(false);
                }}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredStores.map((store) => {
                const isMine = store.ownerId === user.id || store.ownerMatrix === user.matrixNo;

                return (
                  <div
                    key={store.id}
                    className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/40 overflow-hidden flex flex-col justify-between transition-all shadow-lg group"
                  >
                    <div>
                      {/* Banner with Logo and Badges */}
                      <div className="relative h-40 w-full bg-slate-800 overflow-hidden">
                        <img
                          src={store.bannerImage}
                          alt={store.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap justify-end">
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-950/85 text-pink-300 border border-pink-500/30 backdrop-blur-sm">
                            {store.category}
                          </span>
                          {isMine && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                              My Store
                            </span>
                          )}
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-950/85 text-amber-300 border border-amber-500/30">
                            PSAS VENDOR
                          </span>
                        </div>

                        <div className="absolute -bottom-4 left-5 flex items-end gap-3">
                          <img
                            src={store.logoImage}
                            alt={store.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-950 bg-slate-900 shadow-xl"
                          />
                        </div>
                      </div>

                      {/* Store Details Body */}
                      <div className="pt-6 px-5 pb-3 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-extrabold text-white leading-tight">
                              {store.name}
                            </h3>
                            <p className="text-xs text-pink-300 font-medium mt-0.5">
                              {store.tagline}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400 font-extrabold text-xs px-2 py-1 rounded-lg bg-amber-950/40 border border-amber-500/20 shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{store.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {store.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                          <span className="text-slate-300 font-medium">
                            Vendor: <strong className="text-white">{store.ownerName}</strong> ({store.ownerMatrix})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3 h-3 text-pink-400" />
                            {store.pickupPoint}
                          </span>
                        </div>

                        {/* Interactive Catalog Preview Showcase */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
                            <span className="flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-pink-400" />
                              Catalog Items ({store.products.length})
                            </span>
                            <span className="text-[10px] font-normal text-cyan-400">
                              {store.orderCount} Orders Fulfilled
                            </span>
                          </div>

                          {store.products.length === 0 ? (
                            <div className="p-4 text-center rounded-xl bg-slate-950/50 border border-dashed border-slate-800">
                              <p className="text-xs text-slate-400">Katalog masih kosong.</p>
                              <button
                                onClick={() => {
                                  setTargetStoreId(store.id);
                                  resetProductForm();
                                  setActiveTab('post_product');
                                }}
                                className="mt-2 text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center justify-center gap-1 mx-auto"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Post first product to this catalog
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2.5">
                              {store.products.slice(0, 4).map((prod) => (
                                <div
                                  key={prod.id}
                                  onClick={() => setSelectedProduct({ store, product: prod })}
                                  className="group/item relative p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-pink-500/50 cursor-pointer flex items-center gap-2.5 transition-all"
                                >
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform"
                                    />
                                    {prod.images && prod.images.length > 1 && (
                                      <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/80 text-[8px] font-mono text-white rounded-tl">
                                        +{prod.images.length}
                                      </span>
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="text-[11px] font-bold text-white truncate group-hover/item:text-pink-300">
                                      {prod.name}
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                      <div className="text-[11px] font-extrabold text-pink-400 font-mono">
                                        RM {prod.price.toFixed(2)}
                                      </div>
                                      <span
                                        className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                                          prod.inStock
                                            ? 'text-emerald-400 bg-emerald-950/60'
                                            : 'text-rose-400 bg-rose-950/60'
                                        }`}
                                      >
                                        {prod.inStock ? 'Ready' : 'Out'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 px-5 pt-3 flex items-center justify-between border-t border-slate-800 bg-slate-950/40">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setTargetStoreId(store.id);
                            resetProductForm();
                            setActiveTab('post_product');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-pink-950/60 hover:bg-pink-900/60 border border-pink-500/30 text-pink-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Post Product</span>
                        </button>

                        {isMine && (
                          <button
                            onClick={() => openStoreModal(store)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                            title="Edit Store Profile"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedStore(store);
                          setStoreModalCatalogTab('All');
                        }}
                        className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-all shadow-md shadow-pink-600/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Open Full Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POST / UPDATE PRODUCT INTO CATALOG FORM */}
      {activeTab === 'post_product' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-pink-500/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-pink-400 uppercase tracking-wider">
                  PSAS Student Storefront Inventory System
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                  <Package className="w-5 h-5 text-pink-400" />
                  {editingProductId ? 'Update Catalog Product Item' : 'Post New Product into Store Catalog'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Students can publish products, upload up to 10 product photos, tag catalog collections, set pricing, and manage stock visibility.
                </p>
              </div>

              {editingProductId && (
                <button
                  onClick={resetProductForm}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold cursor-pointer"
                >
                  Discard Edit
                </button>
              )}
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-5">
              {/* Target Store Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Target Student Storefront / Gerai</span>
                  <button
                    type="button"
                    onClick={() => openStoreModal()}
                    className="text-[11px] text-pink-400 hover:text-pink-300 font-medium"
                  >
                    + Open new store first
                  </button>
                </label>
                <select
                  value={targetStoreId}
                  onChange={(e) => setTargetStoreId(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category}) • Owner: {s.ownerName}
                    </option>
                  ))}
                </select>
                {currentTargetStore && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    📍 Pickup point: <strong className="text-slate-200">{currentTargetStore.pickupPoint}</strong> | WhatsApp: <strong className="text-cyan-300">{currentTargetStore.whatsappContact}</strong>
                  </p>
                )}
              </div>

              {/* Product Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Product / Service Title *
                  </label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    required
                    placeholder="e.g. Sambal Hitam Behrang (Pek 150g) / Format Windows 11 FYP"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Price (RM) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                      RM
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Catalog Category Tag & Preparation Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Catalog Category / Menu Section
                  </label>
                  <input
                    type="text"
                    value={prodCategoryTag}
                    onChange={(e) => setProdCategoryTag(e.target.value)}
                    placeholder="e.g. Best Sellers, Kudapan, Combos"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                  {/* Quick Preset Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-500 self-center">Presets:</span>
                    {suggestedTags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setProdCategoryTag(tag)}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors ${
                          prodCategoryTag === tag
                            ? 'bg-pink-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Preparation / Readiness Time
                  </label>
                  <select
                    value={prodPrepTime}
                    onChange={(e) => setProdPrepTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Instant / Ready Stock">Instant / Ready Stock (Siap Segera)</option>
                    <option value="Made to Order (5-15 mins)">Made to Order (5-15 mins)</option>
                    <option value="Same Day Pickup (Petang)">Same Day Pickup (Petang)</option>
                    <option value="Pre-order 1 Day">Pre-order 1 Day (Tempah 1 Hari Awal)</option>
                    <option value="Weekend Special">Weekend Special (Sabtu & Ahad)</option>
                  </select>
                </div>
              </div>

              {/* Multiple Product Images Upload (Up to 10 photos) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-pink-400" />
                      Product Photos & Catalog Gallery (Up to 10 Images)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Upload local files from device, paste web URLs, or choose sample student presets. The first image will be the primary catalog card thumbnail.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-pink-400">
                    {prodImages.length} / 10
                  </span>
                </div>

                <ImageUploader
                  mode="multiple"
                  values={prodImages}
                  onChange={setProdImages}
                  max={10}
                  label="Add Product Photo"
                  samplePresets={[
                    { name: 'Brownies Box', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Matcha Frappe', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Sambal Tumis', url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Laptop Repair', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Crochet Flower', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Campus Merch', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80' },
                  ]}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Product Description & Ingredients / Inclusions *
                </label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  rows={3}
                  required
                  placeholder="Detailkan rasa, bahan-bahan, saiz bungkusan, promosi pembelian melebihi 2 unit, atau servis yang disediakan..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              {/* Status Toggles: In Stock & Popular */}
              <div className="flex flex-wrap items-center gap-6 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={prodInStock}
                    onChange={(e) => setProdInStock(e.target.checked)}
                    className="rounded border-slate-700 text-pink-600 focus:ring-pink-500 bg-slate-950 w-4 h-4"
                  />
                  <span>
                    Item In Stock & Ready for Ordering (<strong className={prodInStock ? 'text-emerald-400' : 'text-rose-400'}>{prodInStock ? 'Tersedia' : 'Habis Stok'}</strong>)
                  </span>
                </label>

                <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={prodIsPopular}
                    onChange={(e) => setProdIsPopular(e.target.checked)}
                    className="rounded border-slate-700 text-pink-600 focus:ring-pink-500 bg-slate-950 w-4 h-4"
                  />
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    Mark as "Best Seller / Popular Pick"
                  </span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    resetProductForm();
                    setActiveTab('browse');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-xs font-bold text-white shadow-lg shadow-pink-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>{editingProductId ? 'Save Product Changes' : 'Post Product to Catalog'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: MY STORE & INVENTORY MANAGEMENT */}
      {activeTab === 'my_stores' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-pink-400" />
                My PSAS Storefronts & Catalog Inventory
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Manage your active campus stores, adjust stock status on the fly, edit prices, and add new catalog items.
              </p>
            </div>

            <button
              onClick={() => openStoreModal()}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Another Storefront</span>
            </button>
          </div>

          {myStores.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 space-y-3">
              <Store className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">You don't have a registered store yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Start your micro-business venture today! Sell homemade desserts, dorm services, assignment prints, or campus crafts.
              </p>
              <button
                onClick={() => openStoreModal()}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white cursor-pointer"
              >
                Launch Your First Store
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {myStores.map((store) => (
                <div
                  key={store.id}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-pink-500/30 shadow-xl space-y-5"
                >
                  {/* Store Header & Controls */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={store.logoImage}
                        alt={store.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-800"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-white">{store.name}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-500/30 font-semibold">
                            {store.category}
                          </span>
                        </div>
                        <p className="text-xs text-pink-300 font-medium mt-0.5">{store.tagline}</p>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                          <span>📍 {store.pickupPoint}</span>
                          <span>•</span>
                          <span>📞 {store.whatsappContact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <button
                        onClick={() => {
                          setTargetStoreId(store.id);
                          resetProductForm();
                          setActiveTab('post_product');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Product</span>
                      </button>

                      <button
                        onClick={() => openStoreModal(store)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Storefront Profile"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete storefront "${store.name}"?`)) {
                            deleteStore(store.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                        title="Delete Storefront"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Catalog Inventory Table / Cards */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-pink-400" />
                        Catalog Inventory Items ({store.products.length})
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Click stock switch to toggle availability in real-time
                      </span>
                    </div>

                    {store.products.length === 0 ? (
                      <div className="p-6 text-center rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 space-y-2">
                        <p className="text-xs text-slate-400">Katalog gerai ini belum mempunyai produk.</p>
                        <button
                          onClick={() => {
                            setTargetStoreId(store.id);
                            resetProductForm();
                            setActiveTab('post_product');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white cursor-pointer"
                        >
                          + Post First Product
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {store.products.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-pink-500/40 flex items-start justify-between gap-3 transition-all"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-14 h-14 rounded-xl object-cover bg-slate-800 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                                  <span>{prod.name}</span>
                                  {prod.isPopular && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                                      POPULAR
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                  {prod.description}
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="text-xs font-extrabold text-pink-400 font-mono">
                                    RM {prod.price.toFixed(2)}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    • {prod.categoryTag || 'General'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                              {/* Stock Switch */}
                              <button
                                onClick={() => toggleProductStock(store.id, prod.id)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                  prod.inStock
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                }`}
                              >
                                {prod.inStock ? 'Ready Stock' : 'Out of Stock'}
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => startEditProduct(store, prod)}
                                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Remove product "${prod.name}" from catalog?`)) {
                                      deleteStoreProduct(store.id, prod.id);
                                    }
                                  }}
                                  className="p-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 transition-colors cursor-pointer"
                                  title="Remove Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STORE ORDERS & FULFILLMENT (FOR BUYER & SELLER) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#191528] to-slate-900 border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-pink-400" />
                <span>Campus Store Orders & Handover Tracker</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Real-time ordering system connecting student customers with dorm and campus vendors.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Active Role:</span>
              <button
                type="button"
                onClick={() => setActiveRole(activeRole === 'buyer' ? 'seller' : 'buyer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                  activeRole === 'seller'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                    : 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                }`}
              >
                {activeRole} Perspective ↺
              </button>
            </div>
          </div>

          {storeOrders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore student menus in "Browse Stores & Catalogs" and click "Buy / Order Now" to place a campus order!
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Browse Catalogs Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storeOrders.map((ord) => {
                const isBuyer = ord.buyerId === user.id || ord.buyerName.includes(user.name);
                const isSeller = ord.sellerId === user.id || myStores.some((s) => s.id === ord.storeId);

                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/40 space-y-4 shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={ord.productImage}
                          alt={ord.productName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800"
                        />
                        <div>
                          <div className="text-[10px] font-mono text-pink-400 font-bold">
                            ORDER #{ord.id.slice(-6).toUpperCase()}
                          </div>
                          <h4 className="text-sm font-bold text-white leading-tight">
                            {ord.quantity}x {ord.productName}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            Store: <strong className="text-slate-200">{ord.storeName}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                            ord.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : ord.status === 'ready_for_pickup'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                              : ord.status === 'accepted'
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                              : ord.status === 'cancelled'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {ord.status.replace('_', ' ')}
                        </span>
                        <div className="text-sm font-extrabold text-pink-400 font-mono mt-1">
                          RM {ord.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                      <div>
                        <span className="text-slate-500 text-[10px] block font-semibold">CUSTOMER:</span>
                        <span className="font-semibold text-white">{ord.buyerName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{ord.buyerMatrix}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-semibold">PICKUP POINT:</span>
                        <span className="font-semibold text-pink-300">{ord.pickupPoint}</span>
                        <span className="text-[10px] text-slate-400 block">{ord.buyerPhone}</span>
                      </div>
                    </div>

                    {ord.notes && (
                      <div className="text-xs text-slate-300 italic p-2.5 rounded-lg bg-slate-950/40 border border-slate-850">
                        Order Note: "{ord.notes}"
                      </div>
                    )}

                    {/* Operational controls for Seller and Buyer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                      <div className="text-[10px] text-slate-400">
                        Date: {ord.createdAt}
                      </div>

                      {/* Controls according to status and role */}
                      <div className="flex items-center gap-1.5">
                        {ord.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateStoreOrderStatus(ord.id, 'cancelled')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs text-slate-300 cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStoreOrderStatus(ord.id, 'accepted')}
                              className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white shadow-sm cursor-pointer"
                            >
                              Accept Order
                            </button>
                          </>
                        )}

                        {ord.status === 'accepted' && (
                          <button
                            type="button"
                            onClick={() => updateStoreOrderStatus(ord.id, 'ready_for_pickup')}
                            className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-sm cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Ready for Pickup</span>
                          </button>
                        )}

                        {ord.status === 'ready_for_pickup' && (
                          <button
                            type="button"
                            onClick={() => updateStoreOrderStatus(ord.id, 'completed')}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Complete & Handover</span>
                          </button>
                        )}

                        {ord.status === 'completed' && (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FULL STOREFRONT & CATALOG MODAL */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0E1628] border border-pink-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-8">
            {/* Modal Banner */}
            <div className="relative h-44 sm:h-52 w-full bg-slate-800">
              <img
                src={selectedStore.bannerImage}
                alt={selectedStore.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1628] via-[#0E1628]/40 to-transparent" />

              <button
                onClick={() => setSelectedStore(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute -bottom-4 left-6 flex items-end gap-3 z-10">
                <img
                  src={selectedStore.logoImage}
                  alt={selectedStore.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-[#0E1628] bg-slate-900 shadow-2xl"
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 pt-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-wider">
                      {selectedStore.category} • PSAS Student Entrepreneur
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {selectedStore.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-pink-300 font-medium">
                    {selectedStore.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTargetStoreId(selectedStore.id);
                      resetProductForm();
                      setSelectedStore(null);
                      setActiveTab('post_product');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post Item to Catalog</span>
                  </button>
                </div>
              </div>

              {/* Story & Campus Logistics */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  {selectedStore.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Vendor Student:</span>
                    <strong className="text-white">{selectedStore.ownerName}</strong> ({selectedStore.ownerMatrix})
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pickup & Handover Point:</span>
                    <strong className="text-pink-300">{selectedStore.pickupPoint}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Operating Hours:</span>
                    <strong className="text-emerald-300">{selectedStore.operatingHours || 'Petang & Malam'}</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Catalog Collections Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Package className="w-4 h-4 text-pink-400" />
                    <span>Menu & Products Catalog ({selectedStore.products.length})</span>
                  </h4>

                  {/* Category Pill Switcher */}
                  <div className="flex items-center gap-1 overflow-x-auto max-w-[65%]">
                    <button
                      onClick={() => setStoreModalCatalogTab('All')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                        storeModalCatalogTab === 'All'
                          ? 'bg-pink-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    {(selectedStore.catalogCategories || []).map((catName) => (
                      <button
                        key={catName}
                        onClick={() => setStoreModalCatalogTab(catName)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                          storeModalCatalogTab === catName
                            ? 'bg-pink-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {catName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catalog Items Grid */}
                {selectedStore.products.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 space-y-2">
                    <Package className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">Tiada item di dalam katalog gerai ini lagi.</p>
                    <button
                      onClick={() => {
                        setTargetStoreId(selectedStore.id);
                        resetProductForm();
                        setSelectedStore(null);
                        setActiveTab('post_product');
                      }}
                      className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white cursor-pointer"
                    >
                      + Tambah Produk Pertama
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-80 overflow-y-auto pr-1">
                    {selectedStore.products
                      .filter((p) => storeModalCatalogTab === 'All' || p.categoryTag === storeModalCatalogTab)
                      .map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => setSelectedProduct({ store: selectedStore, product: prod })}
                          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 cursor-pointer flex items-start gap-3 transition-all hover:bg-slate-900"
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                            {prod.images && prod.images.length > 1 && (
                              <span className="absolute bottom-0 right-0 px-1 py-0.5 bg-black/80 text-[8px] font-mono text-white rounded-tl">
                                +{prod.images.length}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white truncate flex items-center justify-between">
                              <span className="truncate">{prod.name}</span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-medium shrink-0 ml-1 ${
                                  prod.inStock
                                    ? 'text-emerald-400 bg-emerald-950/80'
                                    : 'text-rose-400 bg-rose-950/80'
                                }`}
                              >
                                {prod.inStock ? 'Ready' : 'Out'}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {prod.description}
                            </div>

                            <div className="flex items-center justify-between mt-1.5">
                              <div className="text-xs font-extrabold text-pink-400 font-mono">
                                RM {prod.price.toFixed(2)}
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {prod.prepTime || 'Ready Stock'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Direct Ordering Action */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-slate-900 border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    Place Order Directly with Student Vendor
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Connect via WhatsApp with pre-filled store details and pickup inquiry.
                  </p>
                </div>

                <a
                  href={`https://wa.me/${selectedStore.whatsappContact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Salam ${selectedStore.name}, saya berminat untuk menempah barangan dari katalog anda di PSAS Student Stores.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Vendor ({selectedStore.whatsappContact})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL & MULTI-PHOTO GALLERY MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0E1628] border border-pink-500/40 rounded-3xl shadow-2xl p-6 text-slate-100 my-8 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-pink-400 uppercase tracking-wider">
                  {selectedProduct.store.name} • Catalog Product
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {selectedProduct.product.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Display */}
            <div className="space-y-2">
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                <img
                  src={selectedProduct.product.image}
                  alt={selectedProduct.product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      selectedProduct.product.inStock
                        ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-950/90 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {selectedProduct.product.inStock ? 'In Stock (Ready)' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Multi-Photo Thumbnails */}
              {selectedProduct.product.images && selectedProduct.product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedProduct.product.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`${selectedProduct.product.name} thumb ${idx}`}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-900 cursor-pointer hover:border-pink-500"
                      onClick={() => {
                        // set as preview image
                        setSelectedProduct({
                          ...selectedProduct,
                          product: {
                            ...selectedProduct.product,
                            image: imgUrl,
                          },
                        });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Price & Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">Harga Jualan:</span>
                  <div className="text-xl font-black text-pink-400 font-mono">
                    RM {selectedProduct.product.price.toFixed(2)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Kategori Menu:</span>
                  <span className="text-xs font-semibold text-white">
                    {selectedProduct.product.categoryTag || 'General'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {selectedProduct.product.description}
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div>
                  ⏱️ <strong>Masa Penyediaan:</strong> {selectedProduct.product.prepTime || 'Ready Stock'}
                </div>
                <div>
                  📍 <strong>Lokasi Ambilan:</strong> {selectedProduct.store.pickupPoint}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <button
                onClick={() => {
                  const s = selectedProduct.store;
                  const p = selectedProduct.product;
                  setSelectedProduct(null);
                  startEditProduct(s, p);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Product</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!selectedProduct.product.inStock}
                  onClick={() => {
                    setOrderingProduct(selectedProduct);
                    setOrderQuantity(1);
                    setOrderNotes('');
                    setIsOrderingModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-pink-600/30 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy / Order Now</span>
                </button>

                <a
                  href={`https://wa.me/${selectedProduct.store.whatsappContact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Salam ${selectedProduct.store.name}, saya ingin menempah: "${selectedProduct.product.name}" (RM ${selectedProduct.product.price.toFixed(
                      2
                    )}). Adakah stok masih tersedia untuk pickup di ${selectedProduct.store.pickupPoint}?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Order via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT STORE MODAL */}
      {isCreateStoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0E1628] border border-pink-500/40 rounded-3xl shadow-2xl p-6 text-slate-100 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-pink-400" />
                {editingStore ? 'Update Student Storefront Profile' : 'Launch Your PSAS Student Storefront'}
              </h3>
              <button
                onClick={() => setIsCreateStoreModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStoreFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Business / Storefront Name *
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  placeholder="e.g. Kenanga Dorm Bites & Craft Hub"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Storefront Category *
                  </label>
                  <select
                    value={storeCategory}
                    onChange={(e) => setStoreCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Food & Beverage">Food & Beverage (Makanan & Minuman)</option>
                    <option value="Tech & Printing Services">Tech & Printing Services</option>
                    <option value="Fashion & Merch">Fashion & Merch</option>
                    <option value="Arts & Crafts">Arts & Crafts (Kraf & Cenderamata)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Pickup Point at PSAS *
                  </label>
                  <input
                    type="text"
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    required
                    placeholder="e.g. Kafe Kenanga / Lobi Blok C JTMK"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tagline / Catchphrase *
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                  placeholder="e.g. Resepi Asli Tok Wan • Jimat & Sedap Bilik Asrama"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    WhatsApp Contact Number *
                  </label>
                  <input
                    type="text"
                    value={whatsappContact}
                    onChange={(e) => setWhatsappContact(e.target.value)}
                    required
                    placeholder="+60 12-345 6789"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Operating / Availability Hours
                  </label>
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="e.g. 5:00 PM - 10:30 PM (Setiap Hari)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Catalog Section Tabs (Comma separated)
                </label>
                <input
                  type="text"
                  value={catalogCategoriesInput}
                  onChange={(e) => setCatalogCategoriesInput(e.target.value)}
                  placeholder="e.g. Bakery, Minuman, Combos, Handmade"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  These categories will appear as filter tabs in your public storefront catalog.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Store Story & Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  required
                  placeholder="Describe your student venture, products offered, and special campus promotions..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Logo and Banner Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <ImageUploader
                    value={logoImage}
                    onChange={setLogoImage}
                    label="Storefront Logo"
                    aspect="square"
                    samplePresets={[
                      { name: 'Food Logo', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80' },
                      { name: 'Tech Logo', url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=200&auto=format&fit=crop&q=80' }
                    ]}
                  />
                </div>

                <div>
                  <ImageUploader
                    value={bannerImage}
                    onChange={setBannerImage}
                    label="Store Banner Header"
                    aspect="video"
                    samplePresets={[
                      { name: 'Culinary Banner', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80' },
                      { name: 'Tech Banner', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80' }
                    ]}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateStoreModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  {editingStore ? 'Save Store Changes' : 'Publish Storefront'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DIRECT BUY & ORDER CONFIRMATION MODAL */}
      {isOrderingModalOpen && orderingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0E1628] border border-pink-500/40 rounded-3xl shadow-2xl p-6 text-slate-100 my-8 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Place Campus Order
                  </h3>
                  <p className="text-[11px] text-pink-300">
                    {orderingProduct.store.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOrderingModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <img
                src={orderingProduct.product.image}
                alt={orderingProduct.product.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-800"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">
                  {orderingProduct.product.name}
                </h4>
                <div className="text-[11px] text-pink-400 font-mono font-bold mt-0.5">
                  RM {orderingProduct.product.price.toFixed(2)} each
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-pink-400" />
                  <span className="truncate">{orderingProduct.store.pickupPoint}</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold text-white font-mono w-6 text-center">
                    {orderQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(orderQuantity + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Special Instructions / Requests (Optional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Kurang manis, extra sos, or pickup around 5:30 PM..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Customer Details Display */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Student Buyer:</span>
                  <strong className="text-white">{user.name} ({user.matrixNo})</strong>
                </div>
                <div className="flex justify-between">
                  <span>Contact Phone:</span>
                  <strong className="text-slate-300">{user.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <strong className="text-pink-300">Cash on Handover / DuitNow QR Demo</strong>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-pink-950/40 border border-pink-500/30">
                <span className="text-xs font-bold text-slate-200">Total Due on Pickup:</span>
                <span className="text-lg font-black text-pink-400 font-mono">
                  RM {(orderingProduct.product.price * orderQuantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsOrderingModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  placeStoreOrder({
                    storeId: orderingProduct.store.id,
                    storeName: orderingProduct.store.name,
                    productId: orderingProduct.product.id,
                    productName: orderingProduct.product.name,
                    productImage: orderingProduct.product.image,
                    price: orderingProduct.product.price,
                    quantity: orderQuantity,
                    totalPrice: orderingProduct.product.price * orderQuantity,
                    pickupPoint: orderingProduct.store.pickupPoint,
                    notes: orderNotes.trim() || undefined,
                  });
                  setIsOrderingModalOpen(false);
                  setSelectedProduct(null);
                  setActiveTab('orders');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-xs font-bold text-white shadow-lg shadow-pink-600/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Place Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
