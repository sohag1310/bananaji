import React, { useState, useRef, useEffect } from 'react';
import { Search, Banana, Menu, X, XCircle, ShoppingCart, User as UserIcon, LogIn, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';
import { UserProfile, SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from '../data';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenTracking?: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: any) => void;
  onOpenBlog?: () => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  currentUser?: User | null;
  userProfile?: UserProfile | null;
  onOpenAuth?: (mode?: 'signin' | 'signup' | 'profile') => void;
  onGoHome?: () => void;
  siteConfig?: SiteConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  cartCount = 0,
  onOpenCart,
  selectedCategory,
  setSelectedCategory,
  onOpenBlog,
  onOpenAbout,
  onOpenContact,
  currentUser,
  userProfile,
  onOpenAuth,
  onGoHome,
  siteConfig = DEFAULT_SITE_CONFIG
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleHomeClick = () => {
    onGoHome?.();
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductsClick = () => {
    onGoHome?.();
    setSelectedCategory('All');
    const el = document.getElementById('shop-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const toggleSearchExpand = () => {
    setIsSearchExpanded((prev) => !prev);
    if (!isSearchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const brandPrefix = siteConfig.brandPrefix || 'BANANA';
  const brandSuffix = siteConfig.brandSuffix || 'JI';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0ea5e9]/20 shadow-xs">
      {/* Dynamic Top Announcement Bar (Editable in Admin) */}
      {siteConfig.showAnnouncement && siteConfig.announcementText && (
        <div className="bg-[#0f172a] text-sky-200 py-1.5 px-4 text-[11px] font-sans text-center tracking-wide border-b border-sky-900/50 flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-[#22c55e] shrink-0" />
          <span className="truncate">{siteConfig.announcementText}</span>
        </div>
      )}

      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between gap-4 sm:gap-6">
        {/* Dynamic Brand Logo & Editorial Links */}
        <div className="flex items-center gap-6 xl:gap-10 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleHomeClick}>
            {siteConfig.logoUrl ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#22c55e]/30 shadow-md flex items-center justify-center bg-white group-hover:scale-105 transition-transform shrink-0">
                <img 
                  src={siteConfig.logoUrl} 
                  alt={siteConfig.siteName || "Logo"} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-[#22c55e] rounded-full flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform text-white shrink-0">
                <Banana className="w-5 h-5 fill-white" />
              </div>
            )}
            <div>
              <span className="text-2xl font-serif font-black tracking-tighter text-[#0f172a] flex items-center">
                {brandPrefix} <span className="text-[#22c55e] ml-1.5">{brandSuffix}</span>
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#0f172a]/80">
            <button onClick={handleHomeClick} className="hover:text-[#0ea5e9] transition-colors cursor-pointer">Home</button>
            <button onClick={handleProductsClick} className="hover:text-[#0ea5e9] transition-colors cursor-pointer">Products</button>
            <button onClick={onOpenBlog} className="hover:text-[#0ea5e9] transition-colors cursor-pointer">Blog</button>
            <button onClick={onOpenAbout} className="hover:text-[#0ea5e9] transition-colors cursor-pointer">About Us</button>
            <button onClick={onOpenContact} className="hover:text-[#0ea5e9] transition-colors cursor-pointer">Contact</button>
          </nav>
        </div>

        {/* Search Bar / Search Option and Add to Cart Option */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 justify-end font-sans text-xs">
          {/* Main Desktop Search Input Box */}
          <div className="hidden sm:flex items-center relative w-full max-w-[200px] md:max-w-[240px] lg:max-w-[280px] transition-all">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-[#f8fafc] border border-slate-200 rounded-full text-xs font-sans text-[#0f172a] placeholder-slate-400 focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/20 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Clear search"
              >
                <XCircle className="w-4 h-4 text-slate-400 hover:text-slate-700" />
              </button>
            )}
          </div>

          {/* Search Button for Mobile / Small Screens */}
          <button
            onClick={toggleSearchExpand}
            className="sm:hidden p-2 text-[#0f172a] hover:text-[#0ea5e9] transition-colors cursor-pointer"
            title="Search Products"
            aria-label="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account / Sign-In Option (Clean layout without surrounding circles/borders) */}
          {currentUser ? (
            <button
              onClick={() => onOpenAuth?.('profile')}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-[#0f172a] hover:text-[#0ea5e9] transition-colors cursor-pointer shrink-0"
              title="My Account"
              aria-label="My Account"
            >
              <UserIcon className="w-4 h-4 text-black" />
              <span className="hidden sm:inline-block font-semibold text-xs text-[#0f172a] max-w-[95px] truncate">
                {currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Account'}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth?.('signin')}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-[#0f172a] hover:text-[#0ea5e9] transition-colors cursor-pointer shrink-0"
              title="Sign In / Account"
              aria-label="Sign In"
            >
              <UserIcon className="w-4 h-4 text-black" />
              <span className="hidden sm:inline font-semibold">Sign In</span>
            </button>
          )}

          {/* Cart Icon Option next to search */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-[#0f172a] hover:text-[#0ea5e9] transition-colors cursor-pointer group shrink-0"
            title="Open Cart"
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform text-[#0f172a]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#22c55e] text-white rounded-full text-[10px] font-bold shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#0f172a] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Expand Drawer */}
      {isSearchExpanded && (
        <div className="sm:hidden px-4 pb-3 pt-1 border-t border-[#0ea5e9]/10 bg-[#f0f9ff] animate-fadeIn">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-full text-xs text-[#0f172a] placeholder-slate-400 focus:outline-none focus:border-[#0ea5e9]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer flex items-center justify-center"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#0ea5e9]/20 px-6 py-6 space-y-4 font-sans">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#f8fafc] border border-slate-200 rounded-full text-xs text-[#0f172a] placeholder-slate-400 focus:outline-none focus:border-[#0ea5e9]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer flex items-center justify-center"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex flex-col space-y-3 text-xs uppercase tracking-[0.2em] font-bold text-[#0f172a]">
            <button onClick={() => { handleHomeClick(); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-[#0ea5e9]">Home</button>
            <button onClick={() => { handleProductsClick(); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-[#0ea5e9]">Products</button>
            <button onClick={() => { onOpenCart?.(); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-[#0ea5e9] flex items-center justify-between">
              <span>Cart</span>
              {cartCount > 0 && <span className="bg-sky-500 text-white text-[10px] px-2 py-0.5 rounded-full">{cartCount} items</span>}
            </button>
            <button 
              onClick={() => { 
                onOpenAuth?.(currentUser ? 'profile' : 'signin'); 
                setMobileMenuOpen(false); 
              }} 
              className="text-left py-1 hover:text-[#0ea5e9] flex items-center justify-between text-[#0f172a]"
            >
              <span>{currentUser ? `Account (${currentUser.displayName?.split(' ')[0] || 'User'})` : 'Sign In / Register'}</span>
              <UserIcon className="w-4 h-4 text-black" />
            </button>
            <button onClick={() => { onOpenBlog?.(); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-[#0ea5e9]">Blog</button>
            <button onClick={() => { onOpenAbout?.(); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-[#0ea5e9]">About Us</button>
            <button onClick={() => { onOpenContact?.(); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-[#0ea5e9]">Contact</button>
          </div>
        </div>
      )}
    </header>
  );
};


