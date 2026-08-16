import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS, DEFAULT_SITE_CONFIG, DEFAULT_FILTER_CONFIG } from './data';
import { Product, Category, CartItem, Order, Review, UserProfile, BannerItem, BlogPost, SiteConfig, FilterConfig } from './types';
import { 
  getProductsFromFirebase, 
  syncProductsToFirebase, 
  addProductReviewToFirebase, 
  getUserProfileFromFirebase,
  getHeroBannersFromFirebase,
  getBlogPostsFromFirebase,
  getOrdersFromFirebase,
  getSiteConfigFromFirebase,
  getFilterConfigFromFirebase
} from './lib/dbService';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { Hero, DEFAULT_HERO_BANNERS } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { AccountPage } from './components/AccountPage';
import { AboutPage } from './components/AboutPage';
import { BlogPage, DEFAULT_BLOG_POSTS } from './components/BlogPage';
import { ContactPage } from './components/ContactPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedRipeness, setSelectedRipeness] = useState<string>('All Ripeness');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dynamic Site & Filter Configurations (Synced with Firebase)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>(DEFAULT_FILTER_CONFIG);

  // Dynamic Hero Banners and Blog Posts (Synced with Firebase)
  const [heroBanners, setHeroBanners] = useState<BannerItem[]>(DEFAULT_HERO_BANNERS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);

  // Full-Screen Page States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAccountPageOpen, setIsAccountPageOpen] = useState(false);
  const [accountInitialMode, setAccountInitialMode] = useState<'signin' | 'signup' | 'profile'>('signin');
  const [isAboutPageOpen, setIsAboutPageOpen] = useState(false);
  const [isBlogPageOpen, setIsBlogPageOpen] = useState(false);
  const [isContactPageOpen, setIsContactPageOpen] = useState(false);
  const [isCheckoutPageOpen, setIsCheckoutPageOpen] = useState(false);

  // Unified page navigation handler
  const navigateTo = (
    page: 'home' | 'about' | 'blog' | 'contact' | 'account' | 'checkout',
    options?: { mode?: 'signin' | 'signup' | 'profile' }
  ) => {
    setSelectedProduct(null);
    setIsAccountPageOpen(page === 'account');
    setIsAboutPageOpen(page === 'about');
    setIsBlogPageOpen(page === 'blog');
    setIsContactPageOpen(page === 'contact');
    setIsCheckoutPageOpen(page === 'checkout');

    if (page === 'account') {
      setAccountInitialMode(options?.mode || (currentUser ? 'profile' : 'signin'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getUserProfileFromFirebase(user.uid);
          if (profile) {
            setUserProfile(profile as UserProfile);
          } else {
            setUserProfile({
              uid: user.uid,
              displayName: user.displayName || 'Valued Member',
              email: user.email || '',
              phoneNumber: user.phoneNumber || '',
              photoURL: user.photoURL || '',
              providerId: user.providerData[0]?.providerId || 'password',
              createdAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.error('Error fetching user profile:', e);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Admin state
  const [adminPasswordModalOpen, setAdminPasswordModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Sync products, banners, blogs, orders with Firebase Firestore
  useEffect(() => {
    const initData = async () => {
      // 1. Products Sync
      const fbProducts = await getProductsFromFirebase();
      if (fbProducts && fbProducts.length > 0 && fbProducts.some(p => p.id === 'chip-01')) {
        const demoReviewIds = new Set(['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10']);
        const isExcludedReview = (r: any) => {
          if (!r) return true;
          if (demoReviewIds.has(r.id)) return true;
          const author = (r.author || '').trim().toLowerCase();
          if (author.includes('tamin') || author.includes('tamim')) return true;
          return false;
        };

        const cleanedProducts = fbProducts.map((p) => {
          if (p.reviews && p.reviews.some(isExcludedReview)) {
            const realReviews = p.reviews.filter((r) => !isExcludedReview(r));
            const newRating = realReviews.length > 0
              ? Number((realReviews.reduce((acc, r) => acc + r.rating, 0) / realReviews.length).toFixed(1))
              : 5.0;
            const newReviewCount = realReviews.length;

            addProductReviewToFirebase(p.id, realReviews, newRating, newReviewCount);

            return {
              ...p,
              reviews: realReviews,
              rating: newRating,
              reviewCount: newReviewCount,
            };
          }
          return p;
        });

        const mergedProducts = cleanedProducts.map((p) => {
          const freshLocal = PRODUCTS.find(lp => lp.id === p.id);
          if (freshLocal) {
            return {
              ...p,
              image: freshLocal.image,
              name: freshLocal.name,
              tagline: freshLocal.tagline,
              description: freshLocal.description,
              benefits: freshLocal.benefits,
            };
          }
          return p;
        });

        setProducts(mergedProducts);

        setSelectedProduct((currentSel) => {
          if (!currentSel) return null;
          const updated = mergedProducts.find(p => p.id === currentSel.id);
          return updated || currentSel;
        });
      } else {
        setProducts(PRODUCTS);
        await syncProductsToFirebase(PRODUCTS);
      }

      // 2. Hero Banners Sync
      const fbBanners = await getHeroBannersFromFirebase();
      if (fbBanners && fbBanners.length > 0) {
        setHeroBanners(fbBanners);
      }

      // 3. Blog Posts Sync
      const fbBlogs = await getBlogPostsFromFirebase();
      if (fbBlogs && fbBlogs.length > 0) {
        setBlogPosts(fbBlogs);
      }

      // 4. Orders Sync
      const fbOrders = await getOrdersFromFirebase();
      if (fbOrders && fbOrders.length > 0) {
        setOrders(fbOrders);
      }

      // 5. Site Config Sync
      const fbSite = await getSiteConfigFromFirebase();
      if (fbSite) {
        setSiteConfig(fbSite);
      }

      // 6. Filter Config Sync
      const fbFilter = await getFilterConfigFromFirebase();
      if (fbFilter) {
        setFilterConfig(fbFilter);
      }
    };

    initData();
  }, []);

  // Cart & Checkout state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 1, selectedRipeness: 'Green / Firm' }
  ]);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  // Initial demo order
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'BJ-884920',
      date: '2026-08-10',
      items: [{ product: PRODUCTS[1], quantity: 2, selectedRipeness: 'Green / Firm' }],
      total: 350,
      paymentMethod: 'bkash',
      paymentStatus: 'Verified',
      transactionId: '9K8JLA98X',
      senderNumber: '01712345678',
      status: 'Out for Delivery',
      shippingAddress: {
        fullName: 'Alex Sohag',
        phone: '+880 1712-345678',
        email: 'alex@example.com',
        address: '742 Evergreen Terrace, House 12',
        city: 'Dhaka',
        zone: 'Gulshan 2',
        zipCode: '1212',
        deliveryMessage: 'Near the park gate, please call before delivery.'
      },
      estimatedDelivery: '2026-08-12'
    }
  ]);

  // Modals state
  const [cartOpen, setCartOpen] = useState(false);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      const matchesRipeness =
        selectedRipeness === 'All Ripeness' || product.ripeness === selectedRipeness;

      return matchesSearch && matchesCategory && matchesRipeness;
    });
  }, [products, searchQuery, selectedCategory, selectedRipeness]);

  // Cart actions
  const handleAddToCart = (product: Product, quantity = 1, ripeness?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedRipeness: ripeness || product.ripeness }];
    });
    setCartOpen(true);
  };

  // Direct Buy Now action: Opens checkout directly with this product
  const handleBuyNow = (product: Product, quantity = 1, ripeness?: string) => {
    const itemToBuy: CartItem = {
      product,
      quantity,
      selectedRipeness: ripeness || product.ripeness
    };
    setCheckoutItems([itemToBuy]);
    setCartOpen(false);
    navigateTo('checkout');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderComplete = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  const handleAddReview = (productId: string, newReview: Review) => {
    setProducts((prevProducts) => {
      return prevProducts.map((prod) => {
        if (prod.id === productId) {
          const currentReviews = prod.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const newRating = Number(
            (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          const newReviewCount = (prod.reviewCount || 0) + 1;

          const updatedProduct: Product = {
            ...prod,
            reviews: updatedReviews,
            rating: newRating,
            reviewCount: newReviewCount,
          };

          setSelectedProduct(updatedProduct);

          addProductReviewToFirebase(productId, updatedReviews, newRating, newReviewCount);

          return updatedProduct;
        }
        return prod;
      });
    });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-main-content min-h-screen bg-[#f0f9ff] text-[#0f172a] font-sans selection:bg-[#0ea5e9] selection:text-white">
      {/* Navigation with Dynamic Branding */}
      <Navbar
        siteConfig={siteConfig}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q) {
            setSelectedProduct(null);
            setIsAccountPageOpen(false);
            setIsAboutPageOpen(false);
            setIsBlogPageOpen(false);
            setIsContactPageOpen(false);
            setIsCheckoutPageOpen(false);
          }
        }}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          navigateTo('home');
        }}
        onOpenBlog={() => navigateTo('blog')}
        onOpenAbout={() => navigateTo('about')}
        onOpenContact={() => navigateTo('contact')}
        currentUser={currentUser}
        userProfile={userProfile}
        onGoHome={() => navigateTo('home')}
        onOpenAuth={(mode) => navigateTo('account', { mode })}
      />

      {/* Main Content View: Full Pages OR Product Details OR Home Catalog */}
      {isAccountPageOpen ? (
        <AccountPage
          currentUser={currentUser}
          userProfile={userProfile}
          initialMode={accountInitialMode}
          onBackToHome={() => navigateTo('home')}
        />
      ) : isAboutPageOpen ? (
        <AboutPage
          onBackToHome={() => navigateTo('home')}
          onOpenContact={() => navigateTo('contact')}
          onOpenBlog={() => navigateTo('blog')}
        />
      ) : isBlogPageOpen ? (
        <BlogPage
          posts={blogPosts}
          heroBanners={heroBanners}
          onBackToHome={() => navigateTo('home')}
          onOpenAbout={() => navigateTo('about')}
          onOpenContact={() => navigateTo('contact')}
          onOpenAdminPrompt={() => setAdminPasswordModalOpen(true)}
        />
      ) : isContactPageOpen ? (
        <ContactPage
          onBackToHome={() => navigateTo('home')}
        />
      ) : isCheckoutPageOpen ? (
        <CheckoutPage
          items={checkoutItems}
          currentUser={currentUser}
          userProfile={userProfile}
          onOrderComplete={handleOrderComplete}
          onBackToHome={() => navigateTo('home')}
        />
      ) : selectedProduct ? (
        <ProductDetailsPage
          product={selectedProduct}
          allProducts={products}
          onBackToHome={() => navigateTo('home')}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setIsAccountPageOpen(false);
            setIsAboutPageOpen(false);
            setIsBlogPageOpen(false);
            setIsContactPageOpen(false);
            setIsCheckoutPageOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddReview={handleAddReview}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          currentUser={currentUser}
        />
      ) : (
        <>
          {/* Rotating Hero Banner (Synced with Firebase) */}
          <Hero
            banners={heroBanners}
            onShopClick={() => {
              const catalogElement = document.getElementById('shop-catalog');
              if (catalogElement) {
                catalogElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          <main id="shop-catalog" className="scroll-mt-24 pt-4">
            <CategoryFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedRipeness={selectedRipeness}
              setSelectedRipeness={setSelectedRipeness}
              categories={filterConfig.categories}
              ripenessLabel={filterConfig.ripenessLabel}
              ripenessFilters={filterConfig.ripenessFilters}
            />

            <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 space-y-4 bg-white rounded-3xl border border-[#0ea5e9]/20 shadow-xs">
                  <div className="w-16 h-16 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    🍌
                  </div>
                  <h3 className="font-serif font-bold text-[#0f172a] text-xl">No products found matching your filters</h3>
                  <p className="text-xs text-[#78350f]">Try adjusting your search terms or clearing the ripeness filter.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedRipeness('All Ripeness');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#0ea5e9] text-white text-xs font-semibold hover:bg-[#0284c7] transition-colors shadow-xs cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3.5 sm:gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsAccountPageOpen(false);
                        setIsAboutPageOpen(false);
                        setIsBlogPageOpen(false);
                        setIsContactPageOpen(false);
                        setIsCheckoutPageOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {/* Footer with Dynamic Branding & Secret Admin Portal Trigger */}
      <Footer
        siteConfig={siteConfig}
        onSecretAdminClick={() => setAdminPasswordModalOpen(true)}
        onOpenAbout={() => navigateTo('about')}
        onOpenBlog={() => navigateTo('blog')}
        onOpenContact={() => navigateTo('contact')}
      />

      {/* Slide-over Cart */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          if (cartItems.length === 0) return;
          setCheckoutItems(cartItems);
          setCartOpen(false);
          navigateTo('checkout');
        }}
      />

      {/* Master Admin Portal System */}
      <AdminPanel
        isPasswordModalOpen={adminPasswordModalOpen}
        onClosePasswordModal={() => setAdminPasswordModalOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
        heroBanners={heroBanners}
        setHeroBanners={setHeroBanners}
        blogPosts={blogPosts}
        setBlogPosts={setBlogPosts}
        siteConfig={siteConfig}
        setSiteConfig={setSiteConfig}
        filterConfig={filterConfig}
        setFilterConfig={setFilterConfig}
      />
    </div>
  );
}
