import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  KeyRound, 
  X, 
  ShieldCheck, 
  Edit3, 
  Scissors, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Package, 
  ShoppingBag, 
  Settings, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Save, 
  Eye, 
  EyeOff, 
  Search,
  ExternalLink,
  ChevronRight,
  Upload,
  BookOpen,
  Sliders,
  Layers,
  Phone,
  Mail,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Bell,
  Clock,
  User,
  ArrowRight,
  Filter,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Globe,
  Tag,
  Printer,
  XCircle,
  Ban,
  RefreshCw,
  FileText,
  CheckCheck,
  Undo2
} from 'lucide-react';
import { Product, Category, Order, BannerItem, BlogPost, SiteConfig, FilterConfig } from '../types';
import { CATEGORIES, DEFAULT_FILTER_CONFIG, DEFAULT_SITE_CONFIG } from '../data';
import { 
  getAdminPasswordFromFirebase, 
  saveAdminPasswordToFirebase, 
  saveSiteContentToFirebase, 
  getSiteContentFromFirebase,
  syncProductsToFirebase,
  deleteProductFromFirebase,
  syncHeroBannersToFirebase,
  syncBlogPostsToFirebase,
  updateOrderStatusInFirebase,
  confirmOrderInFirebase,
  cancelOrderInFirebase,
  deleteOrderFromFirebase,
  syncSiteConfigToFirebase,
  getSiteConfigFromFirebase,
  syncFilterConfigToFirebase,
  getFilterConfigFromFirebase,
  SiteContentData
} from '../lib/dbService';

interface AdminPanelProps {
  isPasswordModalOpen: boolean;
  onClosePasswordModal: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  heroBanners: BannerItem[];
  setHeroBanners: React.Dispatch<React.SetStateAction<BannerItem[]>>;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  siteConfig?: SiteConfig;
  setSiteConfig?: React.Dispatch<React.SetStateAction<SiteConfig>>;
  filterConfig?: FilterConfig;
  setFilterConfig?: React.Dispatch<React.SetStateAction<FilterConfig>>;
  siteContent?: SiteContentData | null;
  setSiteContent?: React.Dispatch<React.SetStateAction<SiteContentData | null>>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isPasswordModalOpen,
  onClosePasswordModal,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  products,
  setProducts,
  orders,
  setOrders,
  heroBanners,
  setHeroBanners,
  blogPosts,
  setBlogPosts,
  siteConfig = DEFAULT_SITE_CONFIG,
  setSiteConfig,
  filterConfig = DEFAULT_FILTER_CONFIG,
  setFilterConfig,
  siteContent,
  setSiteContent
}) => {
  // Password Verification State
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [currentAdminPassword, setCurrentAdminPassword] = useState('9221');

  // Change Password Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);

  // Admin Dashboard Modal State
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<
    'banners' | 'filters' | 'branding' | 'products' | 'blogs' | 'orders' | 'elements' | 'incontext' | 'security'
  >('banners');

  // In-Context Super Edit Modes
  const [textEditActive, setTextEditActive] = useState(false);
  const [deleteModeActive, setDeleteModeActive] = useState(false);
  const [imageSwapActive, setImageSwapActive] = useState(false);

  // Overrides refs
  const textOverridesRef = useRef<Record<string, string>>({});
  const imageOverridesRef = useRef<Record<string, string>>({});
  const hiddenElementsRef = useRef<string[]>([]);

  // Search & Toast State
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<'all' | 'cod' | 'bkash' | 'nagad'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Order Management Cancellation & Invoice Modals
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReasonSelected, setCancelReasonSelected] = useState('Customer requested cancellation');
  const [cancelCustomReason, setCancelCustomReason] = useState('');
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [isProcessingOrderAction, setIsProcessingOrderAction] = useState(false);

  // Banner Form State
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [bannerForm, setBannerForm] = useState<Partial<BannerItem>>({
    title: '',
    subtitle: '',
    image: '',
    alt: ''
  });

  // Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    tagline: '',
    category: 'Kolar Chips',
    price: 150,
    originalPrice: 180,
    rating: 5.0,
    reviewCount: 25,
    image: '',
    origin: 'Munshiganj Eco Banana Groves',
    sweetnessIndex: 1,
    ripeness: 'Green / Firm',
    organic: true,
    bestseller: false,
    description: 'Crispy artisanal golden chips packed in an airtight foil snack pouch.',
    benefits: ['Zero trans fats', 'Cooked in pure cold-pressed coconut oil', 'Rich in natural potassium'],
    nutrition: {
      calories: 140,
      potassium: '460 mg',
      fiber: '3.8 g',
      vitaminB6: '25% DV'
    }
  });

  // Blog Post Form State
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    category: 'Nutrition & Health',
    tag: 'Superfood',
    author: 'Banana Ji Culinary Team',
    readTime: '5 min read',
    date: 'August 2026',
    excerpt: '',
    content: [''],
    keyPoints: [''],
    image: ''
  });

  // Category & Ripeness Filter Form State
  const [filterForm, setFilterForm] = useState<FilterConfig>(filterConfig || DEFAULT_FILTER_CONFIG);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  const [newRipenessInput, setNewRipenessInput] = useState('');
  const [editingRipenessIndex, setEditingRipenessIndex] = useState<number | null>(null);
  const [editingRipenessValue, setEditingRipenessValue] = useState('');

  // Branding & Site Identity Form State
  const [brandingForm, setBrandingForm] = useState<SiteConfig>(siteConfig || DEFAULT_SITE_CONFIG);

  // Site Elements / General Settings Form State
  const [siteSettingsForm, setSiteSettingsForm] = useState({
    siteTitle: 'Banana Ji | Premium Artisanal Raw Bananas & Fruit Chips',
    announcementText: '',
    contactPhone: '+880 1712-345678',
    contactEmail: 'hello@bananaji.store',
    contactAddress: 'Munshiganj Eco Groves & Gulshan Distribution Center, Dhaka',
    deliveryFeeInsideDhaka: 60,
    deliveryFeeOutsideDhaka: 120,
    currencySymbol: '৳'
  });

  // Global Delete Confirmation Modal State (replaces browser confirm/alert)
  interface DeleteTarget {
    type: 'order' | 'product' | 'banner' | 'blog' | 'category' | 'ripeness';
    id: string | number;
    title: string;
    subtitle?: string;
    badge?: string;
  }
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isExecutingDelete, setIsExecutingDelete] = useState(false);


  // Fetch admin password & saved site content on mount
  useEffect(() => {
    const initData = async () => {
      const pass = await getAdminPasswordFromFirebase();
      setCurrentAdminPassword(pass);

      const savedData = await getSiteContentFromFirebase();
      if (savedData) {
        if (savedData.textOverrides) textOverridesRef.current = savedData.textOverrides;
        if (savedData.imageOverrides) imageOverridesRef.current = savedData.imageOverrides;
        if (savedData.hiddenElements) hiddenElementsRef.current = savedData.hiddenElements;
        if (savedData.siteSettings) {
          setSiteSettingsForm((prev) => ({
            ...prev,
            ...savedData.siteSettings
          }));
        }
        applyAllSiteOverrides();
      }

      const fbSite = await getSiteConfigFromFirebase();
      if (fbSite) {
        setBrandingForm(fbSite);
        setSiteConfig?.(fbSite);
      }

      const fbFilter = await getFilterConfigFromFirebase();
      if (fbFilter) {
        setFilterForm(fbFilter);
        setFilterConfig?.(fbFilter);
      }
    };
    initData();
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Helper: File Upload from User Gallery
  const handleGalleryUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (base64Url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onSuccess(reader.result);
        triggerToast('Image loaded successfully from your gallery!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Reload latest admin password whenever modal opens
  useEffect(() => {
    if (isPasswordModalOpen) {
      getAdminPasswordFromFirebase().then((pass) => {
        if (pass) setCurrentAdminPassword(pass);
      });
    }
  }, [isPasswordModalOpen]);

  // -------------------------------------------------------------------------
  // PASSWORD VERIFICATION
  // -------------------------------------------------------------------------
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const freshPass = await getAdminPasswordFromFirebase();
      const targetPass = (freshPass || currentAdminPassword || '9221').trim();
      if (passwordInput.trim() === targetPass) {
        setIsAdminLoggedIn(true);
        setIsAdminDashboardOpen(true);
        onClosePasswordModal();
        setPasswordInput('');
        setPasswordError(null);
      } else {
        setPasswordError('Invalid Security Code. Please check and try again.');
      }
    } catch {
      if (passwordInput.trim() === currentAdminPassword.trim()) {
        setIsAdminLoggedIn(true);
        setIsAdminDashboardOpen(true);
        onClosePasswordModal();
        setPasswordInput('');
        setPasswordError(null);
      } else {
        setPasswordError('Invalid Security Code. Please check and try again.');
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setPasswordError('New code must be at least 4 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Codes do not match');
      return;
    }

    const success = await saveAdminPasswordToFirebase(newPassword);
    if (success) {
      setCurrentAdminPassword(newPassword);
      setPasswordSuccessMsg('Admin passcode successfully updated in Firebase!');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError(null);
      setTimeout(() => setPasswordSuccessMsg(null), 4000);
    } else {
      setPasswordError('Failed to save new code to Firebase. Try again.');
    }
  };

  // -------------------------------------------------------------------------
  // 1. HERO BANNERS CRUD
  // -------------------------------------------------------------------------
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.image || !bannerForm.title) {
      alert('Please provide banner title and image.');
      return;
    }

    let updatedBanners: BannerItem[];
    if (editingBanner) {
      updatedBanners = heroBanners.map((b) =>
        b.id === editingBanner.id
          ? ({
              ...b,
              ...bannerForm,
              alt: bannerForm.alt || bannerForm.title || ''
            } as BannerItem)
          : b
      );
    } else {
      const newBanner: BannerItem = {
        id: Date.now(),
        image: bannerForm.image,
        title: bannerForm.title,
        subtitle: bannerForm.subtitle || '',
        alt: bannerForm.alt || bannerForm.title
      };
      updatedBanners = [...heroBanners, newBanner];
    }

    setHeroBanners(updatedBanners);
    setIsAddingBanner(false);
    setEditingBanner(null);
    setBannerForm({ title: '', subtitle: '', image: '', alt: '' });

    await syncHeroBannersToFirebase(updatedBanners);
    triggerToast('Hero Banners updated & saved to Firebase!');
  };

  const handleDeleteBanner = (id: number | string) => {
    if (heroBanners.length <= 1) {
      triggerToast('You must have at least 1 hero banner on the website.');
      return;
    }
    const targetBanner = heroBanners.find(b => b.id === id);
    setDeleteTarget({
      type: 'banner',
      id: id,
      title: 'Delete Hero Banner',
      subtitle: `Title: "${targetBanner?.title || 'Banner Slide'}". This slide will be removed from your homepage slider.`,
      badge: 'Hero Slide'
    });
  };

  // -------------------------------------------------------------------------
  // 2. PRODUCTS CRUD
  // -------------------------------------------------------------------------
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.image) {
      alert('Please fill in product name, price, and image.');
      return;
    }

    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? ({
              ...p,
              ...productForm
            } as Product)
          : p
      );
    } else {
      const newProd: Product = {
        id: `chip-${Date.now().toString().slice(-4)}`,
        name: productForm.name || 'New Snack Pack',
        tagline: productForm.tagline || 'Fresh gourmet chip packaging',
        category: (productForm.category as Category) || 'Kolar Chips',
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        rating: Number(productForm.rating || 5.0),
        reviewCount: Number(productForm.reviewCount || 0),
        image: productForm.image || '',
        origin: productForm.origin || 'Organic Groves',
        sweetnessIndex: Number(productForm.sweetnessIndex || 1),
        ripeness: (productForm.ripeness as any) || 'Green / Firm',
        organic: Boolean(productForm.organic),
        bestseller: Boolean(productForm.bestseller),
        description: productForm.description || '',
        benefits: Array.isArray(productForm.benefits) ? productForm.benefits : ['100% natural', 'Crispy texture'],
        nutrition: productForm.nutrition || {
          calories: 140,
          potassium: '450 mg',
          fiber: '3.8 g',
          vitaminB6: '25% DV'
        },
        reviews: []
      };
      updatedProducts = [newProd, ...products];
    }

    setProducts(updatedProducts);
    setIsAddingProduct(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      tagline: '',
      category: 'Kolar Chips',
      price: 150,
      image: ''
    });

    await syncProductsToFirebase(updatedProducts);
    triggerToast('Product catalog updated & synced to Firebase!');
  };

  const handleDeleteProduct = (id: string) => {
    const targetProd = products.find(p => p.id === id);
    setDeleteTarget({
      type: 'product',
      id: id,
      title: `Delete Product "${targetProd?.name || 'Snack Pack'}"`,
      subtitle: `Price: ৳${targetProd?.price || 0}. This product will be permanently removed from your catalog and database.`,
      badge: targetProd?.category || 'Product'
    });
  };

  // -------------------------------------------------------------------------
  // 3. BLOG POSTS CRUD
  // -------------------------------------------------------------------------
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.image || !blogForm.excerpt) {
      alert('Please fill in title, excerpt, and image.');
      return;
    }

    const contentArray = typeof blogForm.content === 'string'
      ? (blogForm.content as string).split('\n\n').filter(Boolean)
      : (blogForm.content || ['']);

    let updatedPosts: BlogPost[];
    if (editingBlog) {
      updatedPosts = blogPosts.map((b) =>
        b.id === editingBlog.id
          ? ({
              ...b,
              ...blogForm,
              content: contentArray
            } as BlogPost)
          : b
      );
    } else {
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        title: blogForm.title || 'New Harvest Story',
        excerpt: blogForm.excerpt || '',
        content: contentArray,
        date: blogForm.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: blogForm.readTime || '4 min read',
        category: blogForm.category || 'Nutrition & Health',
        author: blogForm.author || 'Banana Ji Culinary Team',
        image: blogForm.image || '',
        tag: blogForm.tag || 'Guide',
        keyPoints: blogForm.keyPoints || ['Rich in nutrition', 'Sustainable practices']
      };
      updatedPosts = [newPost, ...blogPosts];
    }

    setBlogPosts(updatedPosts);
    setIsAddingBlog(false);
    setEditingBlog(null);
    setBlogForm({ title: '', excerpt: '', image: '', content: [''] });

    await syncBlogPostsToFirebase(updatedPosts);
    triggerToast('Blog post saved & synced to Firebase!');
  };

  const handleDeleteBlog = (id: string) => {
    if (blogPosts.length <= 1) {
      triggerToast('You must have at least 1 blog post.');
      return;
    }
    const targetBlog = blogPosts.find(b => b.id === id);
    setDeleteTarget({
      type: 'blog',
      id: id,
      title: `Delete Blog Article`,
      subtitle: `"${targetBlog?.title || 'Story'}" by ${targetBlog?.author || 'Banana Ji'}. This article will be removed from the Harvest Journal.`,
      badge: 'Harvest Journal'
    });
  };

  // -------------------------------------------------------------------------
  // 4. ORDERS MANAGEMENT (Confirmation, Cancellation, Progress & Invoices)
  // -------------------------------------------------------------------------
  const handleUpdateOrderStatus = async (
    orderId: string, 
    newStatus: Order['status'], 
    newPaymentStatus?: Order['paymentStatus'],
    extraFields?: any
  ) => {
    try {
      setIsProcessingOrderAction(true);
      const updated = orders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: newStatus,
            paymentStatus: newPaymentStatus || ord.paymentStatus,
            ...(extraFields || {})
          };
        }
        return ord;
      });
      setOrders(updated);
      await updateOrderStatusInFirebase(orderId, newStatus, newPaymentStatus, extraFields);
      triggerToast(`Order status updated to "${newStatus}" in Firebase!`);
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order in database.');
    } finally {
      setIsProcessingOrderAction(false);
    }
  };

  const handleConfirmOrder = async (order: Order) => {
    try {
      setIsProcessingOrderAction(true);
      const newStatus = 'Confirmed';
      const newPaymentStatus = order.paymentMethod === 'cash_on_delivery' 
        ? (order.paymentStatus || 'Pending')
        : 'Verified';
      const confirmedAt = new Date().toISOString();

      const updated = orders.map((ord) => {
        if (ord.id === order.id) {
          return {
            ...ord,
            status: newStatus as any,
            paymentStatus: newPaymentStatus as any,
            confirmedAt
          };
        }
        return ord;
      });
      setOrders(updated);
      await confirmOrderInFirebase(order.id, 'Confirmed by Admin');
      triggerToast(`Order #${order.id.slice(-6)} has been CONFIRMED!`);
    } catch (err) {
      console.error('Error confirming order:', err);
      alert('Failed to confirm order. Please try again.');
    } finally {
      setIsProcessingOrderAction(false);
    }
  };

  const handleOpenCancelModal = (order: Order) => {
    setCancelModalOrder(order);
    setCancelReasonSelected('Customer requested cancellation');
    setCancelCustomReason('');
  };

  const handleExecuteCancellation = async () => {
    if (!cancelModalOrder) return;
    try {
      setIsProcessingOrderAction(true);
      const finalReason = cancelReasonSelected === 'Other'
        ? (cancelCustomReason.trim() || 'Cancelled by store administrator')
        : (cancelCustomReason.trim() ? `${cancelReasonSelected} - ${cancelCustomReason.trim()}` : cancelReasonSelected);

      const cancelledAt = new Date().toISOString();
      const updated = orders.map((ord) => {
        if (ord.id === cancelModalOrder.id) {
          return {
            ...ord,
            status: 'Cancelled' as const,
            cancellationReason: finalReason,
            cancelledAt
          };
        }
        return ord;
      });
      setOrders(updated);
      await cancelOrderInFirebase(cancelModalOrder.id, finalReason);
      triggerToast(`Order #${cancelModalOrder.id.slice(-6)} has been CANCELLED.`);
      setCancelModalOrder(null);
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order.');
    } finally {
      setIsProcessingOrderAction(false);
    }
  };

  const handleReactivateOrder = async (orderId: string) => {
    try {
      setIsProcessingOrderAction(true);
      const updated = orders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'Confirmed' as const,
            cancellationReason: undefined,
            cancelledAt: undefined
          };
        }
        return ord;
      });
      setOrders(updated);
      await updateOrderStatusInFirebase(orderId, 'Confirmed', undefined, {
        cancellationReason: '',
        cancelledAt: ''
      });
      triggerToast(`Order #${orderId.slice(-6)} restored and set to Confirmed!`);
    } catch (err) {
      console.error('Error reactivating order:', err);
    } finally {
      setIsProcessingOrderAction(false);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    setDeleteTarget({
      type: 'order',
      id: orderId,
      title: `Delete Order #${orderId.slice(-8).toUpperCase()}`,
      subtitle: `Customer: ${targetOrder?.shippingAddress?.fullName || 'Customer'} (৳${targetOrder?.total || 0}). This customer order record will be permanently deleted from the database.`,
      badge: targetOrder?.status || 'Pending'
    });
  };

  // Filtered Orders Calculation
  const filteredOrders = orders.filter((ord) => {
    // Payment filter
    if (orderPaymentFilter === 'cod' && ord.paymentMethod !== 'cash_on_delivery') return false;
    if (orderPaymentFilter === 'bkash' && ord.paymentMethod !== 'bkash') return false;
    if (orderPaymentFilter === 'nagad' && ord.paymentMethod !== 'nagad') return false;

    // Status filter
    if (orderStatusFilter === 'pending' && ord.status !== 'Pending') return false;
    if (orderStatusFilter === 'confirmed' && ord.status !== 'Confirmed') return false;
    if (orderStatusFilter === 'active' && !['Confirmed', 'Processing', 'Harvesting', 'Quality Check', 'Eco Packaging', 'Out for Delivery'].includes(ord.status)) return false;
    if (orderStatusFilter === 'delivered' && ord.status !== 'Delivered') return false;
    if (orderStatusFilter === 'cancelled' && ord.status !== 'Cancelled') return false;
    if (
      orderStatusFilter !== 'all' && 
      orderStatusFilter !== 'pending' && 
      orderStatusFilter !== 'confirmed' && 
      orderStatusFilter !== 'active' && 
      orderStatusFilter !== 'delivered' && 
      orderStatusFilter !== 'cancelled' && 
      ord.status !== orderStatusFilter
    ) return false;

    // Search query
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchName = (ord.shippingAddress?.fullName || '').toLowerCase().includes(q);
      const matchPhone = (ord.shippingAddress?.phone || '').toLowerCase().includes(q);
      const matchId = (ord.id || '').toLowerCase().includes(q);
      const matchTrx = (ord.transactionId || '').toLowerCase().includes(q);
      const matchCity = (ord.shippingAddress?.city || '').toLowerCase().includes(q);
      const matchZone = (ord.shippingAddress?.zone || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchId || matchTrx || matchCity || matchZone;
    }
    return true;
  });

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const confirmedOrdersCount = orders.filter(o => o.status === 'Confirmed' || o.status === 'Processing').length;
  const inPrepOrdersCount = orders.filter(o => ['Harvesting', 'Quality Check', 'Eco Packaging', 'Out for Delivery'].includes(o.status)).length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'Cancelled').length;
  const activeOrdersCount = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Delivered').length;

  const codOrdersCount = orders.filter(o => o.paymentMethod === 'cash_on_delivery').length;
  const digitalOrdersCount = orders.filter(o => o.paymentMethod === 'bkash' || o.paymentMethod === 'nagad' || o.paymentMethod === 'card').length;
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0);

  // -------------------------------------------------------------------------
  // 5. CATEGORIES & RIPENESS FILTER HANDLERS (Hero Sub-Menu & Filters)
  // -------------------------------------------------------------------------
  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (filterForm.categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      alert('This category already exists.');
      return;
    }
    const updated = {
      ...filterForm,
      categories: [...filterForm.categories, trimmed]
    };
    setFilterForm(updated);
    setNewCategoryInput('');
  };

  const handleUpdateCategory = (index: number) => {
    const trimmed = editingCategoryValue.trim();
    if (!trimmed) return;
    const updatedCategories = [...filterForm.categories];
    updatedCategories[index] = trimmed;
    const updated = {
      ...filterForm,
      categories: updatedCategories
    };
    setFilterForm(updated);
    setEditingCategoryIndex(null);
    setEditingCategoryValue('');
  };

  const handleDeleteCategory = (index: number) => {
    if (filterForm.categories.length <= 1) {
      triggerToast('You must have at least 1 category tab.');
      return;
    }
    const target = filterForm.categories[index];
    setDeleteTarget({
      type: 'category',
      id: index,
      title: `Delete Category Tab "${target}"`,
      subtitle: `This category button will be removed from hero sub-menu navigation and filters.`,
      badge: 'Category Tab'
    });
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= filterForm.categories.length) return;
    const updatedCategories = [...filterForm.categories];
    const temp = updatedCategories[index];
    updatedCategories[index] = updatedCategories[newIdx];
    updatedCategories[newIdx] = temp;
    setFilterForm({
      ...filterForm,
      categories: updatedCategories
    });
  };

  const handleAddRipeness = () => {
    const trimmed = newRipenessInput.trim();
    if (!trimmed) return;
    if (filterForm.ripenessFilters.some(r => r.toLowerCase() === trimmed.toLowerCase())) {
      alert('This ripeness grade already exists.');
      return;
    }
    const updated = {
      ...filterForm,
      ripenessFilters: [...filterForm.ripenessFilters, trimmed]
    };
    setFilterForm(updated);
    setNewRipenessInput('');
  };

  const handleUpdateRipeness = (index: number) => {
    const trimmed = editingRipenessValue.trim();
    if (!trimmed) return;
    const updatedRipeness = [...filterForm.ripenessFilters];
    updatedRipeness[index] = trimmed;
    const updated = {
      ...filterForm,
      ripenessFilters: updatedRipeness
    };
    setFilterForm(updated);
    setEditingRipenessIndex(null);
    setEditingRipenessValue('');
  };

  const handleDeleteRipeness = (index: number) => {
    if (filterForm.ripenessFilters.length <= 1) {
      triggerToast('You must have at least 1 ripeness option.');
      return;
    }
    const target = filterForm.ripenessFilters[index];
    setDeleteTarget({
      type: 'ripeness',
      id: index,
      title: `Delete Ripeness Option "${target}"`,
      subtitle: `This option filter badge will be removed from store sub-filters.`,
      badge: 'Ripeness Filter'
    });
  };

  // Master Confirmed Deletion Executor
  const executeConfirmedDeletion = async () => {
    if (!deleteTarget) return;
    try {
      setIsExecutingDelete(true);
      const { type, id } = deleteTarget;

      if (type === 'order') {
        const orderId = String(id);
        const updated = orders.filter((o) => o.id !== orderId);
        setOrders(updated);
        await deleteOrderFromFirebase(orderId);
        triggerToast('Order record permanently removed from database.');
      } else if (type === 'product') {
        const prodId = String(id);
        const updated = products.filter((p) => p.id !== prodId);
        setProducts(updated);
        await deleteProductFromFirebase(prodId);
        triggerToast('Product deleted from store & database.');
      } else if (type === 'banner') {
        const updated = heroBanners.filter((b) => b.id !== id);
        setHeroBanners(updated);
        await syncHeroBannersToFirebase(updated);
        triggerToast('Hero banner deleted & updated in Firebase.');
      } else if (type === 'blog') {
        const blogId = String(id);
        const updated = blogPosts.filter((b) => b.id !== blogId);
        setBlogPosts(updated);
        await syncBlogPostsToFirebase(updated);
        triggerToast('Blog post deleted from Firebase.');
      } else if (type === 'category') {
        const index = Number(id);
        const updatedCategories = filterForm.categories.filter((_, i) => i !== index);
        const updated = {
          ...filterForm,
          categories: updatedCategories
        };
        setFilterForm(updated);
        setFilterConfig?.(updated);
        await syncFilterConfigToFirebase(updated);
        triggerToast('Category tab removed & saved to Firebase.');
      } else if (type === 'ripeness') {
        const index = Number(id);
        const updatedRipeness = filterForm.ripenessFilters.filter((_, i) => i !== index);
        const updated = {
          ...filterForm,
          ripenessFilters: updatedRipeness
        };
        setFilterForm(updated);
        setFilterConfig?.(updated);
        await syncFilterConfigToFirebase(updated);
        triggerToast('Ripeness option removed & saved to Firebase.');
      }
    } catch (err) {
      console.error('Error during deletion:', err);
      triggerToast('Failed to delete item from database.');
    } finally {
      setIsExecutingDelete(false);
      setDeleteTarget(null);
    }
  };

  const handleMoveRipeness = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= filterForm.ripenessFilters.length) return;
    const updatedRipeness = [...filterForm.ripenessFilters];
    const temp = updatedRipeness[index];
    updatedRipeness[index] = updatedRipeness[newIdx];
    updatedRipeness[newIdx] = temp;
    setFilterForm({
      ...filterForm,
      ripenessFilters: updatedRipeness
    });
  };

  const handleSaveFilterConfig = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFilterConfig?.(filterForm);
    const success = await syncFilterConfigToFirebase(filterForm);
    if (success) {
      triggerToast('Categories & Ripeness Filters saved to Firebase!');
    } else {
      triggerToast('Filter changes saved locally.');
    }
  };

  // -------------------------------------------------------------------------
  // 6. BRANDING & SITE IDENTITY HANDLERS (A to Z Master Branding)
  // -------------------------------------------------------------------------
  const handleSaveBrandingConfig = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSiteConfig?.(brandingForm);
    const success = await syncSiteConfigToFirebase(brandingForm);
    if (success) {
      triggerToast('Website Logo, Branding & Info saved to Firebase!');
    } else {
      triggerToast('Branding changes saved locally.');
    }
  };

  // -------------------------------------------------------------------------
  // 7. SITE SETTINGS / ELEMENTS SAVE
  // -------------------------------------------------------------------------
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveSiteContentToFirebase({
      siteSettings: siteSettingsForm
    });
    if (success) {
      triggerToast('Site general settings & elements updated in Firebase!');
    }
  };

  // -------------------------------------------------------------------------
  // DOM OVERRIDES ENGINE
  // -------------------------------------------------------------------------
  const applyAllSiteOverrides = () => {
    if (Object.keys(textOverridesRef.current).length > 0) {
      const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const val = node.nodeValue?.trim();
          if (val && textOverridesRef.current[val]) {
            node.nodeValue = textOverridesRef.current[val];
          }
        } else {
          node.childNodes.forEach(walk);
        }
      };
      walk(document.body);
    }
  };

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/* 1. PASSWORD PROMPT MODAL (Triggered by full stop in blog image)    */}
      {/* ----------------------------------------------------------------- */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative space-y-6">
            <button
              onClick={onClosePasswordModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#22c55e] border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-7 h-7 text-[#0ea5e9]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-black text-2xl text-[#0f172a]">
                Admin Portal Verification
              </h3>
              <p className="text-xs text-slate-600">
                Please enter your 4-digit master admin security code to access website controls, order feeds & live database editor.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Security Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Enter security code (e.g. 9221)"
                    maxLength={12}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-[#0f172a] focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all shadow-inner"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-rose-500 font-semibold mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {passwordError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Default Code: <strong className="font-mono text-slate-700">9221</strong></span>
                <span className="text-[#22c55e] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Firebase Firestore
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" /> Unlock Admin Controls
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 2. FLOATING ADMIN QUICK LAUNCHER (When Admin is logged in)         */}
      {/* ----------------------------------------------------------------- */}
      {isAdminLoggedIn && !isAdminDashboardOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <button
            onClick={() => setIsAdminDashboardOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#0f172a] text-white text-xs font-bold shadow-2xl border-2 border-[#22c55e] hover:scale-105 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#22c55e]" />
            <span>Admin Console</span>
            {orders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-mono">
                {orders.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 3. MAIN COMPREHENSIVE ADMIN PANEL MODAL                           */}
      {/* ----------------------------------------------------------------- */}
      {isAdminLoggedIn && isAdminDashboardOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-6xl w-full h-[94vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden relative">
            
            {/* TOP HEADER */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#22c55e] border border-emerald-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-black text-lg sm:text-xl text-white flex items-center gap-2">
                    Banana Ji Master Admin Panel
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#22c55e] border border-emerald-500/30 text-[10px] font-mono uppercase tracking-wider">
                      Firebase Connected
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live content management, orders monitoring, hero banners & database sync
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    setIsAdminDashboardOpen(false);
                    triggerToast('Admin logged out successfully');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Lock / Logout
                </button>
                <button
                  onClick={() => setIsAdminDashboardOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* NOTIFICATION / MESSAGE BAR FOR ORDERS & UPDATES */}
            <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-sky-950/80 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Bell className="w-4 h-4 text-[#22c55e] animate-pulse" />
                <span>
                  🔔 Real-Time Order Feed: <strong>{orders.length} Total Orders</strong> ({codOrdersCount} Cash on Delivery, {digitalOrdersCount} bKash/Nagad with TrxID)
                </span>
              </div>
              <div className="text-slate-400 text-[11px] flex items-center gap-3 font-mono">
                <span>Database: ai-studio-bananaji-d276f7eb</span>
                <span className="text-[#22c55e]">● Live Active</span>
              </div>
            </div>

            {/* NAVIGATION TABS */}
            <div className="bg-slate-950/60 px-6 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveAdminTab('banners')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeAdminTab === 'banners'
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Hero Banners ({heroBanners.length})
              </button>

              <button
                onClick={() => setActiveAdminTab('filters')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeAdminTab === 'filters'
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Filter className="w-3.5 h-3.5" /> Sub-Menu & Chips Filters ({filterForm.categories.length})
              </button>

              <button
                onClick={() => setActiveAdminTab('branding')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeAdminTab === 'branding'
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Logo & Master Branding
              </button>

              <button
                onClick={() => setActiveAdminTab('products')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeAdminTab === 'products'
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Package className="w-3.5 h-3.5" /> Products ({products.length})
              </button>

              <button
                onClick={() => setActiveAdminTab('blogs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeAdminTab === 'blogs'
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Blog Posts ({blogPosts.length})
              </button>

              <button
                onClick={() => setActiveAdminTab('orders')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeAdminTab === 'orders'
                    ? 'bg-[#22c55e] text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Customer Orders ({orders.length})
              </button>

              <button
                onClick={() => setActiveAdminTab('elements')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeAdminTab === 'elements'
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" /> Store Fees & General
              </button>

              <button
                onClick={() => setActiveAdminTab('incontext')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeAdminTab === 'incontext'
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Live In-Context Click Editor
              </button>

              <button
                onClick={() => setActiveAdminTab('security')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeAdminTab === 'security'
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Security & Passcode
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* ========================================================================= */}
              {/* TAB 1: HERO BANNERS MANAGEMENT                                            */}
              {/* ========================================================================= */}
              {activeAdminTab === 'banners' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white">
                        Hero Carousel Banners ({heroBanners.length} Active Banners)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Adjust number of hero banners, upload directly from your gallery, change titles, or delete banners.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingBanner(null);
                        setBannerForm({ title: '', subtitle: '', image: '', alt: '' });
                        setIsAddingBanner(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add New Hero Banner
                    </button>
                  </div>

                  {/* Banners Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {heroBanners.map((banner, index) => (
                      <div
                        key={banner.id || index}
                        className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700 p-4 space-y-3 flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                            <img
                              src={banner.image}
                              alt={banner.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md">
                              Slide 0{index + 1}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-white text-sm">{banner.title}</h4>
                            {banner.subtitle && (
                              <p className="text-xs text-slate-400 mt-1">{banner.subtitle}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-700/80 pt-3 text-xs">
                          <button
                            onClick={() => {
                              setEditingBanner(banner);
                              setBannerForm(banner);
                              setIsAddingBanner(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit Banner
                          </button>

                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add / Edit Banner Modal Form */}
                  {isAddingBanner && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-700 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="font-serif font-bold text-lg text-white">
                            {editingBanner ? 'Edit Hero Banner' : 'Add New Hero Banner'}
                          </h3>
                          <button
                            onClick={() => setIsAddingBanner(false)}
                            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
                          <div>
                            <label className="font-bold text-slate-300 block mb-1">Banner Title</label>
                            <input
                              type="text"
                              value={bannerForm.title || ''}
                              onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                              placeholder="e.g. Artisanal Golden Kolar Chips"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                              required
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-300 block mb-1">Subtitle / Caption</label>
                            <input
                              type="text"
                              value={bannerForm.subtitle || ''}
                              onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                              placeholder="e.g. Vacuum-fried golden rings with pure cold-pressed coconut oil"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                            />
                          </div>

                          {/* Image Upload from Gallery + URL input */}
                          <div className="space-y-2">
                            <label className="font-bold text-slate-300 block">Banner Image</label>
                            
                            {/* Gallery File Picker Button */}
                            <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-dashed border-slate-600 text-slate-300 hover:text-white cursor-pointer transition-colors font-semibold">
                              <Upload className="w-4 h-4 text-[#22c55e]" />
                              <span>Upload from Photo Gallery</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleGalleryUpload(e, (url) => setBannerForm({ ...bannerForm, image: url }))}
                              />
                            </label>

                            <div className="text-center text-[11px] text-slate-500">OR paste image URL below:</div>

                            <input
                              type="url"
                              value={bannerForm.image || ''}
                              onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                              placeholder="https://..."
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                            />

                            {bannerForm.image && (
                              <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                                <img src={bannerForm.image} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => setIsAddingBanner(false)}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold cursor-pointer flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" /> Save Banner to Firebase
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB: HERO SUB-MENU & CATEGORY FILTERS MANAGEMENT                          */}
              {/* ========================================================================= */}
              {activeAdminTab === 'filters' && (
                <div className="space-y-6">
                  {/* Category Tabs Header */}
                  <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                        <Filter className="w-5 h-5 text-[#0ea5e9]" />
                        Hero Sub-Menu & Category Tabs ({filterForm.categories.length} Categories)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Edit, add, reorder, or delete the category tabs displayed right beneath the hero banner (e.g. All, Kolar Chips, Pineapple Chips, etc.).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveFilterConfig()}
                      className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                    >
                      <Save className="w-4 h-4" /> Save Category Filters to Firebase
                    </button>
                  </div>

                  {/* 1. Add New Category */}
                  <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#22c55e]" /> Add New Category Tab
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCategory();
                          }
                        }}
                        placeholder="e.g. Jackfruit Chips, Cassava Crisps, Taro Crunch..."
                        className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#0ea5e9]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-5 py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Tab
                      </button>
                    </div>
                  </div>

                  {/* 2. Active Categories List */}
                  <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">
                        Current Category Tabs Order (Directly reflected under Hero Banner)
                      </h4>
                      <span className="text-xs text-slate-400">Drag or use arrow buttons to reorder</span>
                    </div>

                    <div className="space-y-2.5">
                      {filterForm.categories.map((cat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-900/90 border border-slate-750 p-3 rounded-xl gap-3 flex-wrap sm:flex-nowrap"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                            <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            
                            {editingCategoryIndex === idx ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={editingCategoryValue}
                                  onChange={(e) => setEditingCategoryValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleUpdateCategory(idx);
                                    if (e.key === 'Escape') setEditingCategoryIndex(null);
                                  }}
                                  className="px-3 py-1 bg-slate-800 border border-[#0ea5e9] rounded-lg text-sm text-white focus:outline-none flex-1"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCategory(idx)}
                                  className="p-1.5 bg-[#22c55e] text-white rounded-lg hover:bg-[#16a34a]"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCategoryIndex(null)}
                                  className="p-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white text-sm">{cat}</span>
                                {cat === 'All' && (
                                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                                    Default All Tab
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Reorder Buttons */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveCategory(idx, 'up')}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === filterForm.categories.length - 1}
                              onClick={() => handleMoveCategory(idx, 'down')}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Button */}
                            {editingCategoryIndex !== idx && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategoryIndex(idx);
                                  setEditingCategoryValue(cat);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-sky-400 font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(idx)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Ripeness & Grade Sub-Filter Section */}
                  <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#22c55e]" />
                        Ripeness & Roast Grade Sub-Filters (Appears underneath category tabs)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Edit the ripeness label and option badges (e.g. "All Ripeness" / "All returnees", "Green / Firm", "Crispy Roasted").
                      </p>
                    </div>

                    {/* Ripeness Label Field */}
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-750 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      <label className="text-xs font-bold text-slate-300 whitespace-nowrap">
                        Ripeness Filter Label:
                      </label>
                      <input
                        type="text"
                        value={filterForm.ripenessLabel || 'Ripeness:'}
                        onChange={(e) => setFilterForm({ ...filterForm, ripenessLabel: e.target.value })}
                        className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#0ea5e9] flex-1 min-w-[150px]"
                        placeholder="e.g. Ripeness: or Roast Style:"
                      />
                    </div>

                    {/* Add New Ripeness Grade */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newRipenessInput}
                        onChange={(e) => setNewRipenessInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddRipeness();
                          }
                        }}
                        placeholder="e.g. Kettle Fried, Sweet Honey Glazed, Extra Crispy..."
                        className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                      />
                      <button
                        type="button"
                        onClick={handleAddRipeness}
                        className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Grade
                      </button>
                    </div>

                    {/* Ripeness Badges List */}
                    <div className="space-y-2">
                      {filterForm.ripenessFilters.map((rip, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-900/90 border border-slate-750 p-2.5 rounded-xl gap-2"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>

                            {editingRipenessIndex === idx ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={editingRipenessValue}
                                  onChange={(e) => setEditingRipenessValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleUpdateRipeness(idx);
                                    if (e.key === 'Escape') setEditingRipenessIndex(null);
                                  }}
                                  className="px-2 py-1 bg-slate-800 border border-[#0ea5e9] rounded text-xs text-white focus:outline-none flex-1"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateRipeness(idx)}
                                  className="p-1 bg-[#22c55e] text-white rounded hover:bg-[#16a34a]"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingRipenessIndex(null)}
                                  className="p-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="font-medium text-white text-xs">{rip}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveRipeness(idx, 'up')}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === filterForm.ripenessFilters.length - 1}
                              onClick={() => handleMoveRipeness(idx, 'down')}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>

                            {editingRipenessIndex !== idx && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingRipenessIndex(idx);
                                  setEditingRipenessValue(rip);
                                }}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-sky-400 font-semibold"
                              >
                                Edit
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteRipeness(idx)}
                              className="p-1 rounded bg-red-950/40 hover:bg-red-900 text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Save Action */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveFilterConfig()}
                      className="px-6 py-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Save All Category & Ripeness Changes
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB: WEBSITE LOGO & MASTER BRANDING (A to Z)                              */}
              {/* ========================================================================= */}
              {activeAdminTab === 'branding' && (
                <form onSubmit={handleSaveBrandingConfig} className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#0ea5e9]" />
                        Website Logo & Master Branding (A to Z Editability)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Customize your website logo, company name, brand colors, top announcement text, and contact hotlines.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                    >
                      <Save className="w-4 h-4" /> Save Branding to Firebase
                    </button>
                  </div>

                  {/* 1. Website Logo Section */}
                  <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#0ea5e9]" /> Website Logo
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                      {/* Logo Preview */}
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-750 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden">
                          {brandingForm.logoUrl ? (
                            <img src={brandingForm.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-2xl">🍌</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">Live Logo Preview</span>
                        {brandingForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setBrandingForm({ ...brandingForm, logoUrl: '' })}
                            className="text-[11px] text-red-400 hover:underline cursor-pointer"
                          >
                            Remove Logo Image
                          </button>
                        )}
                      </div>

                      {/* Upload Controls */}
                      <div className="md:col-span-2 space-y-3">
                        <label className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-750 border-2 border-dashed border-slate-600 text-slate-200 hover:text-white cursor-pointer transition-colors font-semibold text-xs">
                          <Upload className="w-4 h-4 text-[#22c55e]" />
                          <span>Upload New Logo from Photo Gallery</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleGalleryUpload(e, (url) =>
                                setBrandingForm({ ...brandingForm, logoUrl: url })
                              )
                            }
                          />
                        </label>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400 block">
                            Or enter Logo Image URL:
                          </label>
                          <input
                            type="url"
                            value={brandingForm.logoUrl || ''}
                            onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                            placeholder="https://example.com/logo.png"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Website Name & Titles */}
                  <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
                    <h4 className="font-bold text-white text-sm">
                      Brand Name & Typography Display
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Brand Prefix (First Word)
                        </label>
                        <input
                          type="text"
                          value={brandingForm.brandPrefix || 'BANANA'}
                          onChange={(e) => setBrandingForm({ ...brandingForm, brandPrefix: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9] font-serif uppercase tracking-wider"
                          placeholder="BANANA"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Brand Highlight / Suffix (Second Word)
                        </label>
                        <input
                          type="text"
                          value={brandingForm.brandSuffix || 'JI'}
                          onChange={(e) => setBrandingForm({ ...brandingForm, brandSuffix: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-emerald-400 focus:outline-none focus:border-[#0ea5e9] font-serif uppercase tracking-wider font-bold"
                          placeholder="JI"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Full Store Display Title
                        </label>
                        <input
                          type="text"
                          value={brandingForm.siteName || 'Banana Ji Organic Emporium'}
                          onChange={(e) => setBrandingForm({ ...brandingForm, siteName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                          placeholder="Banana Ji Organic Emporium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Website Tagline / Slogan
                        </label>
                        <input
                          type="text"
                          value={brandingForm.tagline || 'Artisanal Raw Bananas & Crispy Fruit Chips'}
                          onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                          placeholder="Artisanal Raw Bananas & Crispy Fruit Chips"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Footer / About Description
                        </label>
                        <input
                          type="text"
                          value={brandingForm.description || ''}
                          onChange={(e) => setBrandingForm({ ...brandingForm, description: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                          placeholder="Pure organic fruit chips and farm fresh green harvest..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Top Announcement Bar */}
                  <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#22c55e]" /> Top Announcement Bar
                      </h4>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={brandingForm.showAnnouncement ?? true}
                          onChange={(e) => setBrandingForm({ ...brandingForm, showAnnouncement: e.target.checked })}
                          className="rounded text-[#22c55e] focus:ring-0"
                        />
                        <span>Enable Announcement Bar</span>
                      </label>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Announcement Text Message
                      </label>
                      <input
                        type="text"
                        value={brandingForm.announcementText || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, announcementText: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                        placeholder="🌿 Pure Cold-Pressed Coconut Oil Kettle Chips & Organic Green Harvest Direct from Groves"
                      />
                    </div>
                  </div>

                  {/* 4. Contact Information & Customer Support */}
                  <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#0ea5e9]" /> Contact Information & Support
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Customer Care Hotline
                        </label>
                        <input
                          type="text"
                          value={brandingForm.contactPhone || ''}
                          onChange={(e) => setBrandingForm({ ...brandingForm, contactPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                          placeholder="+880 1712-345678"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Support Email Address
                        </label>
                        <input
                          type="email"
                          value={brandingForm.contactEmail || ''}
                          onChange={(e) => setBrandingForm({ ...brandingForm, contactEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                          placeholder="hello@bananaji.store"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Physical Store / Warehouse Address
                        </label>
                        <input
                          type="text"
                          value={brandingForm.contactAddress || ''}
                          onChange={(e) => setBrandingForm({ ...brandingForm, contactAddress: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                          placeholder="Munshiganj Eco Groves & Gulshan Distribution Center, Dhaka"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Working Hours
                        </label>
                        <input
                          type="text"
                          value={brandingForm.workingHours || '8:00 AM - 10:00 PM (Daily)'}
                          onChange={(e) => setBrandingForm({ ...brandingForm, workingHours: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                          placeholder="8:00 AM - 10:00 PM (Daily)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Footer Copyright */}
                  <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
                    <h4 className="font-bold text-white text-sm">Footer Copyright & Legal</h4>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Copyright Notice Text
                      </label>
                      <input
                        type="text"
                        value={brandingForm.footerCopyright || '© 2026 Banana Ji Organic Emporium. All rights reserved'}
                        onChange={(e) => setBrandingForm({ ...brandingForm, footerCopyright: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                        placeholder="© 2026 Banana Ji Organic Emporium. All rights reserved"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                    >
                      <Save className="w-4 h-4" /> Save All Branding & Logo Settings
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: PRODUCTS MANAGEMENT                                                */}
              {/* ========================================================================= */}
              {activeAdminTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white">
                        Product Catalog & Packaged Snacks ({products.length} Products)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Edit product packaging photos, prices, names, nutrition, and descriptions.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setProductForm({
                            name: '',
                            tagline: '',
                            category: 'Kolar Chips',
                            price: 150,
                            image: ''
                          });
                          setIsAddingProduct(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Product
                      </button>
                    </div>
                  </div>

                  {/* Products Table / List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products
                      .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase()))
                      .map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700 p-4 space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                              <span className="absolute top-2 left-2 bg-[#0ea5e9] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                                {prod.category}
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-white text-sm truncate max-w-[180px]">{prod.name}</h4>
                                <span className="font-bold text-[#22c55e] text-sm">৳{prod.price}</span>
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{prod.tagline}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-700/80 pt-3 text-xs">
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setProductForm(prod);
                                setIsAddingProduct(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Add / Edit Product Modal */}
                  {isAddingProduct && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-slate-700 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="font-serif font-bold text-lg text-white">
                            {editingProduct ? 'Edit Product' : 'Add New Packaged Snack'}
                          </h3>
                          <button
                            onClick={() => setIsAddingProduct(false)}
                            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="font-bold text-slate-300 block mb-1">Product Name</label>
                              <input
                                type="text"
                                value={productForm.name || ''}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                placeholder="e.g. Artisanal Rock Salt Kolar Chips (150g)"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                                required
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-300 block mb-1">Category</label>
                              <select
                                value={productForm.category || 'Kolar Chips'}
                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Category })}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                              >
                                {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="font-bold text-slate-300 block mb-1">Tagline</label>
                            <input
                              type="text"
                              value={productForm.tagline || ''}
                              onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                              placeholder="e.g. Nitrogen-sealed pouch of ultra-thin golden green banana crisps"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                            />
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="font-bold text-slate-300 block mb-1">Price (৳)</label>
                              <input
                                type="number"
                                value={productForm.price || ''}
                                onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                                required
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-300 block mb-1">Original Price (৳)</label>
                              <input
                                type="number"
                                value={productForm.originalPrice || ''}
                                onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-300 block mb-1">Origin / Farm</label>
                              <input
                                type="text"
                                value={productForm.origin || ''}
                                onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                              />
                            </div>
                          </div>

                          {/* Image upload */}
                          <div className="space-y-2">
                            <label className="font-bold text-slate-300 block">Product Packaging Image</label>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-dashed border-slate-600 text-slate-300 hover:text-white cursor-pointer transition-colors font-semibold">
                              <Upload className="w-4 h-4 text-[#22c55e]" />
                              <span>Upload Packaging Photo from Gallery</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleGalleryUpload(e, (url) => setProductForm({ ...productForm, image: url }))}
                              />
                            </label>

                            <input
                              type="url"
                              value={productForm.image || ''}
                              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                              placeholder="Or paste image URL (https://...)"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                            />

                            {productForm.image && (
                              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                                <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="font-bold text-slate-300 block mb-1">Description</label>
                            <textarea
                              rows={3}
                              value={productForm.description || ''}
                              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => setIsAddingProduct(false)}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold cursor-pointer flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" /> Save Product to Firebase
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: BLOG POSTS MANAGEMENT                                              */}
              {/* ========================================================================= */}
              {activeAdminTab === 'blogs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white">
                        Harvest Journal & Blog Posts ({blogPosts.length} Articles)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Modify articles, upload new images, change titles, authors, and recipes.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingBlog(null);
                        setBlogForm({
                          title: '',
                          category: 'Nutrition & Health',
                          tag: 'Superfood',
                          author: 'Banana Ji Team',
                          readTime: '4 min read',
                          date: 'August 2026',
                          excerpt: '',
                          content: [''],
                          image: ''
                        });
                        setIsAddingBlog(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Blog Article
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blogPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700 p-4 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 bg-[#0ea5e9] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                              {post.category}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-white text-sm line-clamp-2">{post.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1">{post.excerpt}</p>
                            <span className="text-[11px] text-slate-500 block mt-2">By {post.author} • {post.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-700/80 pt-3 text-xs">
                          <button
                            onClick={() => {
                              setEditingBlog(post);
                              setBlogForm({
                                ...post,
                                content: post.content
                              });
                              setIsAddingBlog(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit Article
                          </button>

                          <button
                            onClick={() => handleDeleteBlog(post.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add / Edit Blog Modal Form */}
                  {isAddingBlog && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-slate-700 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="font-serif font-bold text-lg text-white">
                            {editingBlog ? 'Edit Blog Article' : 'Add New Blog Article'}
                          </h3>
                          <button
                            onClick={() => setIsAddingBlog(false)}
                            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
                          <div>
                            <label className="font-bold text-slate-300 block mb-1">Article Title</label>
                            <input
                              type="text"
                              value={blogForm.title || ''}
                              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                              placeholder="e.g. 5 Incredible Health Benefits of Unripe Green Bananas"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="font-bold text-slate-300 block mb-1">Category</label>
                              <input
                                type="text"
                                value={blogForm.category || ''}
                                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                                placeholder="Nutrition & Health"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                              />
                            </div>
                            <div>
                              <label className="font-bold text-slate-300 block mb-1">Author</label>
                              <input
                                type="text"
                                value={blogForm.author || ''}
                                onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                                placeholder="Dr. Evelyn Ward"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                              />
                            </div>
                            <div>
                              <label className="font-bold text-slate-300 block mb-1">Read Time</label>
                              <input
                                type="text"
                                value={blogForm.readTime || ''}
                                onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                                placeholder="5 min read"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                              />
                            </div>
                          </div>

                          {/* Image upload */}
                          <div className="space-y-2">
                            <label className="font-bold text-slate-300 block">Featured Image</label>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-dashed border-slate-600 text-slate-300 hover:text-white cursor-pointer transition-colors font-semibold">
                              <Upload className="w-4 h-4 text-[#22c55e]" />
                              <span>Upload Image from Gallery</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleGalleryUpload(e, (url) => setBlogForm({ ...blogForm, image: url }))}
                              />
                            </label>

                            <input
                              type="url"
                              value={blogForm.image || ''}
                              onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                              placeholder="Or paste image URL (https://...)"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-300 block mb-1">Excerpt / Summary</label>
                            <textarea
                              rows={2}
                              value={blogForm.excerpt || ''}
                              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                              required
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-300 block mb-1">Article Content (Separate paragraphs by empty lines)</label>
                            <textarea
                              rows={5}
                              value={Array.isArray(blogForm.content) ? blogForm.content.join('\n\n') : (blogForm.content || '')}
                              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value.split('\n\n') })}
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => setIsAddingBlog(false)}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold cursor-pointer flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" /> Save Article to Firebase
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: CUSTOMER ORDERS MANAGEMENT (COD, bKash, Nagad with TrxID)          */}
              {/* ========================================================================= */}
              {activeAdminTab === 'orders' && (
                <div className="space-y-6">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
                      <span className="text-xs text-slate-400 font-semibold">Total Orders</span>
                      <div className="text-2xl font-bold font-mono text-white flex items-center justify-between">
                        <span>{totalOrdersCount}</span>
                        <ShoppingBag className="w-5 h-5 text-[#0ea5e9]" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono block">৳{totalRevenue.toLocaleString()} Net Revenue</span>
                    </div>

                    <div className="bg-amber-950/30 p-4 rounded-2xl border border-amber-800/40 space-y-1">
                      <span className="text-xs text-amber-300 font-semibold">Pending Verification</span>
                      <div className="text-2xl font-bold font-mono text-amber-400 flex items-center justify-between">
                        <span>{pendingOrdersCount}</span>
                        <Clock className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-[11px] text-amber-300/80 block">Requires Confirmation</span>
                    </div>

                    <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/50 space-y-1">
                      <span className="text-xs text-emerald-300 font-semibold">Confirmed / In Prep</span>
                      <div className="text-2xl font-bold font-mono text-[#22c55e] flex items-center justify-between">
                        <span>{confirmedOrdersCount + inPrepOrdersCount}</span>
                        <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                      </div>
                      <span className="text-[11px] text-emerald-400/80 block">Active & Verified</span>
                    </div>

                    <div className="bg-rose-950/30 p-4 rounded-2xl border border-rose-800/40 space-y-1">
                      <span className="text-xs text-rose-300 font-semibold">Cancelled Orders</span>
                      <div className="text-2xl font-bold font-mono text-rose-400 flex items-center justify-between">
                        <span>{cancelledOrdersCount}</span>
                        <Ban className="w-5 h-5 text-rose-400" />
                      </div>
                      <span className="text-[11px] text-rose-400/80 block">Cancelled Records</span>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-3 text-xs">
                    {/* Status Filter Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-700/60">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-400 mr-1 flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-[#0ea5e9]" /> Status:
                        </span>
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter('all')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            orderStatusFilter === 'all' ? 'bg-[#0ea5e9] text-white shadow-md' : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          All ({totalOrdersCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter('pending')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            orderStatusFilter === 'pending' ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'bg-slate-700/80 text-amber-300 hover:bg-slate-700'
                          }`}
                        >
                          ⏳ Pending ({pendingOrdersCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter('confirmed')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            orderStatusFilter === 'confirmed' ? 'bg-[#22c55e] text-white shadow-md' : 'bg-slate-700/80 text-emerald-300 hover:bg-slate-700'
                          }`}
                        >
                          ✓ Confirmed ({confirmedOrdersCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter('active')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            orderStatusFilter === 'active' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-700/80 text-sky-300 hover:bg-slate-700'
                          }`}
                        >
                          🍌 In Prep / Delivery ({inPrepOrdersCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter('delivered')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            orderStatusFilter === 'delivered' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-700/80 text-teal-300 hover:bg-slate-700'
                          }`}
                        >
                          🎉 Delivered ({deliveredOrdersCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter('cancelled')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            orderStatusFilter === 'cancelled' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-700/80 text-rose-300 hover:bg-slate-700'
                          }`}
                        >
                          🚫 Cancelled ({cancelledOrdersCount})
                        </button>
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search name, phone, TrxID, city..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                        />
                      </div>
                    </div>

                    {/* Payment Method Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-400 flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5" /> Payment Method:
                      </span>
                      <button
                        type="button"
                        onClick={() => setOrderPaymentFilter('all')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          orderPaymentFilter === 'all' ? 'bg-slate-600 text-white font-bold' : 'bg-slate-900/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        All Payments
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderPaymentFilter('cod')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          orderPaymentFilter === 'cod' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-900/60 text-emerald-400 hover:text-emerald-300'
                        }`}
                      >
                        💵 Cash on Delivery ({codOrdersCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderPaymentFilter('bkash')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          orderPaymentFilter === 'bkash' ? 'bg-pink-600 text-white font-bold' : 'bg-slate-900/60 text-pink-400 hover:text-pink-300'
                        }`}
                      >
                        📱 bKash ({orders.filter(o => o.paymentMethod === 'bkash').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderPaymentFilter('nagad')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          orderPaymentFilter === 'nagad' ? 'bg-orange-600 text-white font-bold' : 'bg-slate-900/60 text-orange-400 hover:text-orange-300'
                        }`}
                      >
                        ⚡ Nagad ({orders.filter(o => o.paymentMethod === 'nagad').length})
                      </button>
                    </div>
                  </div>

                  {/* Orders Cards List */}
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/60 space-y-2">
                      <ShoppingBag className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-sm text-slate-400 font-semibold">No customer orders matching the current filter.</p>
                      {orderSearch && (
                        <button
                          onClick={() => { setOrderSearch(''); setOrderStatusFilter('all'); setOrderPaymentFilter('all'); }}
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((ord) => {
                        const isCancelled = ord.status === 'Cancelled';
                        const isConfirmed = ord.status === 'Confirmed';
                        const isPending = ord.status === 'Pending' || (!ord.status && !isCancelled);

                        return (
                          <div
                            key={ord.id}
                            className={`rounded-2xl border p-5 space-y-4 shadow-md transition-all ${
                              isCancelled 
                                ? 'bg-slate-900/90 border-rose-900/60 opacity-90' 
                                : isPending
                                  ? 'bg-slate-800/95 border-amber-500/50 ring-1 ring-amber-500/20'
                                  : isConfirmed
                                    ? 'bg-slate-800/90 border-emerald-500/40'
                                    : 'bg-slate-800/90 border-slate-700'
                            }`}
                          >
                            {/* Order Card Header */}
                            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-700/80 pb-3">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="font-mono font-bold text-white text-sm bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
                                  Order #{ord.id.slice(-8).toUpperCase()}
                                </span>
                                
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> {ord.date || ord.createdAt}
                                </span>

                                {/* ORDER STATUS BADGE */}
                                {isCancelled ? (
                                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-extrabold flex items-center gap-1.5 animate-pulse">
                                    <Ban className="w-3.5 h-3.5" /> Cancelled Order
                                  </span>
                                ) : isPending ? (
                                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> Pending Verification
                                  </span>
                                ) : isConfirmed ? (
                                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-[#22c55e] border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-bold flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5" /> {ord.status}
                                  </span>
                                )}

                                {/* PAYMENT METHOD BADGE */}
                                {ord.paymentMethod === 'cash_on_delivery' ? (
                                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5" /> Cash on Delivery (COD)
                                  </span>
                                ) : ord.paymentMethod === 'bkash' ? (
                                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 text-xs font-bold flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5" /> bKash Digital
                                  </span>
                                ) : ord.paymentMethod === 'nagad' ? (
                                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-bold flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5" /> Nagad Digital
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-bold">
                                    Digital Card Payment
                                  </span>
                                )}
                              </div>

                              {/* RIGHT HEADER ACTIONS: TOTAL & BUTTONS */}
                              <div className="flex items-center gap-3">
                                <span className={`text-lg font-bold font-mono ${isCancelled ? 'line-through text-slate-500' : 'text-[#22c55e]'}`}>
                                  Total: ৳{ord.total}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => setInvoiceModalOrder(ord)}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                  title="View and print invoice receipt"
                                >
                                  <Printer className="w-3.5 h-3.5 text-sky-400" />
                                  <span className="hidden sm:inline">Invoice</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(ord.id)}
                                  className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-700/60 cursor-pointer"
                                  title="Delete order record permanently"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* CANCELLATION NOTICE BANNER (IF CANCELLED) */}
                            {isCancelled && (
                              <div className="bg-rose-950/40 border border-rose-700/60 rounded-xl p-3 text-xs flex items-center justify-between flex-wrap gap-2 text-rose-200">
                                <div className="space-y-0.5">
                                  <div className="font-bold flex items-center gap-1.5 text-rose-300">
                                    <Ban className="w-4 h-4 text-rose-400" /> Order Cancelled
                                  </div>
                                  <p className="text-[11px] text-rose-200/90">
                                    <strong>Reason:</strong> {ord.cancellationReason || 'Cancelled by store administrator'}
                                    {ord.cancelledAt && ` (${new Date(ord.cancelledAt).toLocaleString()})`}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  disabled={isProcessingOrderAction}
                                  onClick={() => handleReactivateOrder(ord.id)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-600/40 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Undo2 className="w-3.5 h-3.5" /> Re-open / Restore Order
                                </button>
                              </div>
                            )}

                            {/* DIGITAL PAYMENT DETAILS CALLOUT (TRANSACTION ID & SENDER PHONE) */}
                            {(ord.paymentMethod === 'bkash' || ord.paymentMethod === 'nagad' || ord.transactionId) && (
                              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-pink-500/30 flex items-center justify-between flex-wrap gap-4 text-xs">
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                                    Digital Payment Verification Details:
                                  </span>
                                  <div className="flex items-center gap-4 flex-wrap">
                                    {ord.transactionId && (
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-slate-300">TrxID:</span>
                                        <strong className="font-mono text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-800">
                                          {ord.transactionId}
                                        </strong>
                                      </div>
                                    )}
                                    {ord.senderNumber && (
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-slate-300">Sender Number:</span>
                                        <strong className="font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                                          {ord.senderNumber}
                                        </strong>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-slate-400">Payment Status:</span>
                                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                    ord.paymentStatus === 'Verified' || ord.paymentStatus === 'Paid'
                                      ? 'bg-emerald-500/20 text-[#22c55e] border-emerald-500/30'
                                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  }`}>
                                    {ord.paymentStatus || 'Pending Verification'}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Customer Shipping & Items Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {/* Customer & Address */}
                              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-[#0ea5e9]" /> Customer Information:
                                </span>
                                <p className="text-slate-200 font-semibold text-sm">{ord.shippingAddress?.fullName}</p>
                                <p className="text-slate-300 flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-[#22c55e]" /> 
                                  <a href={`tel:${ord.shippingAddress?.phone}`} className="hover:underline font-mono text-[#22c55e]">
                                    {ord.shippingAddress?.phone}
                                  </a>
                                </p>
                                {ord.shippingAddress?.email && (
                                  <p className="text-slate-400 flex items-center gap-1.5">
                                    <Mail className="w-3 h-3 text-slate-400" /> {ord.shippingAddress.email}
                                  </p>
                                )}
                                <p className="text-slate-400 flex items-start gap-1.5 pt-1">
                                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                  <span>{ord.shippingAddress?.address}, {ord.shippingAddress?.city} {ord.shippingAddress?.zone && `(${ord.shippingAddress.zone})`}</span>
                                </p>
                                {ord.shippingAddress?.deliveryMessage && (
                                  <p className="text-amber-300/90 text-[11px] bg-amber-950/30 p-2 rounded-lg border border-amber-800/40 mt-1">
                                    <strong>Customer Note:</strong> {ord.shippingAddress.deliveryMessage}
                                  </p>
                                )}
                              </div>

                              {/* Ordered Items List */}
                              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 space-y-2 flex flex-col justify-between">
                                <div>
                                  <span className="font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                                    <Package className="w-3.5 h-3.5 text-[#0ea5e9]" /> Ordered Items ({ord.items?.length || 0}):
                                  </span>
                                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                    {ord.items?.map((item, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300 border-b border-slate-800/80 pb-1">
                                        <span className="truncate max-w-[200px]">
                                          {item.product?.name} <span className="text-slate-400">× {item.quantity}</span>
                                        </span>
                                        <span className="font-mono text-[#22c55e]">৳{(item.product?.price || 0) * item.quantity}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Status Update Dropdown */}
                                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                                  <span className="font-bold text-slate-400">Order Progress:</span>
                                  <select
                                    value={ord.status}
                                    disabled={isProcessingOrderAction}
                                    onChange={(e) => {
                                      const newSt = e.target.value as Order['status'];
                                      if (newSt === 'Cancelled') {
                                        handleOpenCancelModal(ord);
                                      } else {
                                        handleUpdateOrderStatus(ord.id, newSt);
                                      }
                                    }}
                                    className="px-3 py-1 bg-slate-800 border border-slate-600 rounded-lg text-white font-bold focus:outline-none focus:border-[#22c55e] cursor-pointer"
                                  >
                                    <option value="Pending">⏳ Pending Approval</option>
                                    <option value="Confirmed">✓ Confirmed</option>
                                    <option value="Processing">🌱 Processing</option>
                                    <option value="Harvesting">🍌 Fresh Harvesting</option>
                                    <option value="Quality Check">🔍 Quality Inspected</option>
                                    <option value="Eco Packaging">📦 Eco Packaging</option>
                                    <option value="Out for Delivery">🚚 Out for Delivery</option>
                                    <option value="Delivered">🎉 Delivered</option>
                                    <option value="Cancelled">🚫 Cancelled</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* EXPLICIT ACTION BUTTONS (CONFIRM / CANCEL) */}
                            <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                {ord.confirmedAt && !isCancelled && (
                                  <span className="text-[11px] text-emerald-400/90 flex items-center gap-1 font-medium">
                                    <CheckCheck className="w-3.5 h-3.5" /> Confirmed on {new Date(ord.confirmedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {!isCancelled ? (
                                  <>
                                    {isPending && (
                                      <button
                                        type="button"
                                        disabled={isProcessingOrderAction}
                                        onClick={() => handleConfirmOrder(ord)}
                                        className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                                      >
                                        <Check className="w-4 h-4" /> Confirm Order
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      disabled={isProcessingOrderAction}
                                      onClick={() => handleOpenCancelModal(ord)}
                                      className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                      <Ban className="w-3.5 h-3.5" /> Cancel Order
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={isProcessingOrderAction}
                                    onClick={() => handleReactivateOrder(ord.id)}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                                  >
                                    <Undo2 className="w-3.5 h-3.5" /> Restore & Confirm Order
                                  </button>
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

              {/* ========================================================================= */}
              {/* TAB 5: SITE ELEMENTS & GENERAL SETTINGS                                   */}
              {/* ========================================================================= */}
              {activeAdminTab === 'elements' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <h3 className="font-serif font-bold text-lg text-white">
                      Website General Elements & Contact Information
                    </h3>
                    <p className="text-xs text-slate-400">
                      Customize announcement banners, store phone hotline, delivery charges, and site metadata.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSiteSettings} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Top Announcement Bar Text</label>
                      <input
                        type="text"
                        value={siteSettingsForm.announcementText}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, announcementText: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Store Hotline Phone</label>
                        <input
                          type="text"
                          value={siteSettingsForm.contactPhone}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contactPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Support Email</label>
                        <input
                          type="email"
                          value={siteSettingsForm.contactEmail}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contactEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Store Physical / Distribution Address</label>
                      <input
                        type="text"
                        value={siteSettingsForm.contactAddress}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contactAddress: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Delivery Charge Inside Dhaka (৳)</label>
                        <input
                          type="number"
                          value={siteSettingsForm.deliveryFeeInsideDhaka}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, deliveryFeeInsideDhaka: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Delivery Charge Outside Dhaka (৳)</label>
                        <input
                          type="number"
                          value={siteSettingsForm.deliveryFeeOutsideDhaka}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, deliveryFeeOutsideDhaka: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-3 border-t border-slate-700">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                      >
                        <Save className="w-4 h-4" /> Save Site Elements to Firebase
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 6: IN-CONTEXT LIVE EDITOR                                             */}
              {/* ========================================================================= */}
              {activeAdminTab === 'incontext' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <h3 className="font-serif font-bold text-lg text-white">
                      Live In-Context Click & Edit Mode
                    </h3>
                    <p className="text-xs text-slate-400">
                      Enable direct visual editing on any text or section across the live web page.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-[#0ea5e9]" /> Click-to-Edit Text
                      </h4>
                      <p className="text-xs text-slate-400">
                        Turns the entire website text into editable content. Click any heading or paragraph on the page to type changes.
                      </p>
                      <button
                        onClick={() => {
                          setTextEditActive(!textEditActive);
                          setIsAdminDashboardOpen(false);
                          triggerToast(textEditActive ? 'Text editing mode disabled' : 'Text editing mode active! Click any text on the page to edit.');
                        }}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          textEditActive ? 'bg-amber-500 text-black' : 'bg-[#0ea5e9] text-white'
                        }`}
                      >
                        {textEditActive ? 'Disable Text Edit Mode' : 'Activate Text Edit on Page'}
                      </button>
                    </div>

                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-emerald-400" /> Save All Overrides to Database
                      </h4>
                      <p className="text-xs text-slate-400">
                        Synchronize all custom text and visual changes made on the site into Firebase Firestore.
                      </p>
                      <button
                        onClick={async () => {
                          await saveSiteContentToFirebase({
                            textOverrides: textOverridesRef.current,
                            imageOverrides: imageOverridesRef.current,
                            hiddenElements: hiddenElementsRef.current
                          });
                          triggerToast('All site customizations saved to Firebase!');
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs cursor-pointer shadow-md transition-colors"
                      >
                        Save Current Overrides to Firebase
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 7: SECURITY & PASSCODE                                                */}
              {/* ========================================================================= */}
              {activeAdminTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <h3 className="font-serif font-bold text-lg text-white">
                      Admin Security & Passcode Configuration
                    </h3>
                    <p className="text-xs text-slate-400">
                      Update the master admin passcode used to unlock the panel. Current code is saved in Firebase Firestore.
                    </p>
                  </div>

                  <div className="max-w-md bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4 text-xs">
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-700">
                      <span className="text-slate-400">Current Security Passcode:</span>
                      <strong className="font-mono text-[#22c55e] text-sm tracking-widest">{currentAdminPassword}</strong>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">New Security Passcode</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new 4+ character code"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Confirm New Passcode</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new code"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0ea5e9]"
                          required
                        />
                      </div>

                      {passwordSuccessMsg && (
                        <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> {passwordSuccessMsg}
                        </p>
                      )}

                      {passwordError && (
                        <p className="text-rose-400 font-semibold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" /> {passwordError}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-4 h-4" /> Update Master Passcode in Firebase
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANCEL ORDER CONFIRMATION MODAL                                           */}
      {/* ========================================================================= */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-600/50 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleIn text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400">
                <Ban className="w-5 h-5" />
                <h3 className="font-bold text-lg text-white">Cancel Customer Order</h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Brief */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-white">#{cancelModalOrder.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-bold text-slate-200">{cancelModalOrder.shippingAddress?.fullName} ({cancelModalOrder.shippingAddress?.phone})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Order Total:</span>
                <span className="font-mono font-bold text-[#22c55e]">৳{cancelModalOrder.total} ({cancelModalOrder.items?.length || 0} items)</span>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Select Cancellation Reason:
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  'Customer requested cancellation via phone call',
                  'Customer unreachable / phone switched off',
                  'Fresh harvest / item temporarily out of stock',
                  'Duplicate order placed accidentally',
                  'Customer refused Cash on Delivery delivery',
                  'Other'
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      cancelReasonSelected === reason 
                        ? 'bg-rose-950/40 border-rose-500/60 text-white' 
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReasonSelected === reason}
                      onChange={(e) => setCancelReasonSelected(e.target.value)}
                      className="accent-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Custom Details */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Additional Notes / Custom Explanation (Optional):
              </label>
              <textarea
                rows={2}
                value={cancelCustomReason}
                onChange={(e) => setCancelCustomReason(e.target.value)}
                placeholder="Add any specific details regarding this cancellation..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isProcessingOrderAction}
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
              >
                Keep Order Active
              </button>
              <button
                type="button"
                disabled={isProcessingOrderAction}
                onClick={handleExecuteCancellation}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg transition-colors"
              >
                <Ban className="w-4 h-4" /> Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INVOICE & RECEIPT MODAL                                                   */}
      {/* ========================================================================= */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2 text-[#166534]">
                <FileText className="w-5 h-5 text-[#22c55e]" />
                <span className="font-bold text-sm text-slate-700">Official Order Invoice</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceModalOrder(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Content Area */}
            <div id="banana-ji-printable-invoice" className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍌</span>
                    <h1 className="font-serif font-black text-2xl text-[#166534] tracking-tight">BANANA JI</h1>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Farm-Fresh Organic Harvest & Artisanal Chips</p>
                  <p className="text-[11px] text-slate-400 mt-1">Hotline: +880 1712-345678 | Munshiganj, BD</p>
                </div>

                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-800 mb-1">
                    INV-#{invoiceModalOrder.id.slice(-8).toUpperCase()}
                  </div>
                  <p className="text-xs text-slate-500">Date: {invoiceModalOrder.date || invoiceModalOrder.createdAt || new Date().toLocaleDateString()}</p>
                  <div className="mt-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      invoiceModalOrder.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : invoiceModalOrder.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      Status: {invoiceModalOrder.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer & Delivery Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Billed & Shipped To:</span>
                  <p className="font-bold text-slate-900 text-sm">{invoiceModalOrder.shippingAddress?.fullName}</p>
                  <p className="text-slate-600 font-mono">{invoiceModalOrder.shippingAddress?.phone}</p>
                  {invoiceModalOrder.shippingAddress?.email && (
                    <p className="text-slate-500">{invoiceModalOrder.shippingAddress.email}</p>
                  )}
                  <p className="text-slate-700 pt-0.5">
                    {invoiceModalOrder.shippingAddress?.address}, {invoiceModalOrder.shippingAddress?.city} {invoiceModalOrder.shippingAddress?.zone && `(${invoiceModalOrder.shippingAddress.zone})`}
                  </p>
                </div>

                <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Payment Details:</span>
                  <p className="font-bold text-slate-800 capitalize">
                    {invoiceModalOrder.paymentMethod === 'cash_on_delivery' 
                      ? '💵 Cash on Delivery (COD)' 
                      : invoiceModalOrder.paymentMethod === 'bkash'
                        ? '📱 bKash Digital Payment'
                        : invoiceModalOrder.paymentMethod === 'nagad'
                          ? '⚡ Nagad Digital Payment'
                          : 'Digital Card Payment'
                    }
                  </p>
                  {invoiceModalOrder.transactionId && (
                    <p className="text-slate-600">TrxID: <strong className="font-mono text-pink-600">{invoiceModalOrder.transactionId}</strong></p>
                  )}
                  {invoiceModalOrder.senderNumber && (
                    <p className="text-slate-600">Sender Phone: <strong className="font-mono text-slate-800">{invoiceModalOrder.senderNumber}</strong></p>
                  )}
                  <p className="text-slate-600">Payment Status: <strong className="text-emerald-600">{invoiceModalOrder.paymentStatus || 'Verified'}</strong></p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Unit Price</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoiceModalOrder.items?.map((item, i) => (
                      <tr key={i}>
                        <td className="py-2.5 font-medium text-slate-800">
                          {item.product?.name}
                          {item.ripeness && (
                            <span className="block text-[10px] text-slate-500 font-normal">Ripeness: {item.ripeness}</span>
                          )}
                        </td>
                        <td className="py-2.5 text-center text-slate-600 font-mono">{item.quantity}</td>
                        <td className="py-2.5 text-right text-slate-600 font-mono">৳{item.product?.price || 0}</td>
                        <td className="py-2.5 text-right font-bold text-slate-900 font-mono">৳{(item.product?.price || 0) * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="border-t border-slate-200 pt-4 flex flex-col items-end text-xs space-y-1.5">
                <div className="w-64 flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">৳{invoiceModalOrder.subtotal || invoiceModalOrder.total}</span>
                </div>
                {invoiceModalOrder.deliveryCharge !== undefined && (
                  <div className="w-64 flex justify-between text-slate-600">
                    <span>Delivery Charge:</span>
                    <span className="font-mono">৳{invoiceModalOrder.deliveryCharge}</span>
                  </div>
                )}
                <div className="w-64 flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                  <span>Grand Total:</span>
                  <span className="font-mono text-[#166534]">৳{invoiceModalOrder.total}</span>
                </div>
              </div>

              {/* Cancellation Notice on invoice if cancelled */}
              {invoiceModalOrder.status === 'Cancelled' && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800">
                  <strong>Order Cancelled:</strong> {invoiceModalOrder.cancellationReason || 'Cancelled by store admin'}
                </div>
              )}

              {/* Footer Note */}
              <div className="text-center text-[11px] text-slate-400 border-t border-slate-200 pt-4">
                Thank you for choosing Banana Ji! For questions or harvest inquiries, call +880 1712-345678.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global In-App Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Confirm Permanent Deletion
                  </h3>
                  {deleteTarget.badge && (
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {deleteTarget.badge}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={isExecutingDelete}
                onClick={() => setDeleteTarget(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-white font-bold text-sm">
                {deleteTarget.title}
              </p>
              {deleteTarget.subtitle && (
                <p className="text-slate-400 leading-relaxed">
                  {deleteTarget.subtitle}
                </p>
              )}
              <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl text-rose-300 text-[11px] flex items-center gap-2 mt-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>This action cannot be undone. It will be removed from Firestore and local storage.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                disabled={isExecutingDelete}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExecutingDelete}
                onClick={executeConfirmedDeletion}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-lg hover:shadow-rose-600/30"
              >
                {isExecutingDelete ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
          <span>{saveToast}</span>
        </div>
      )}
    </>
  );
};
