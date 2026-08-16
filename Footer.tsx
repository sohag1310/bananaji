import React from 'react';
import { Banana, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, ArrowRight, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from '../data';

interface FooterProps {
  onSecretAdminClick?: () => void;
  onOpenAbout?: () => void;
  onOpenBlog?: () => void;
  onOpenContact?: () => void;
  onOpenTracking?: () => void;
  siteConfig?: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onSecretAdminClick,
  onOpenAbout,
  onOpenBlog,
  onOpenContact,
  siteConfig = DEFAULT_SITE_CONFIG
}) => {
  const scrollToCatalog = () => {
    const el = document.getElementById('shop-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const brandPrefix = siteConfig.brandPrefix || 'BANANA';
  const brandSuffix = siteConfig.brandSuffix || 'JI';

  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-12 border-t border-[#0ea5e9]/20 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">

        {/* Main Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-sky-900/50">
          
          {/* Brand Info & Socials */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {siteConfig.logoUrl ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#22c55e]/40 shadow-md flex items-center justify-center bg-white shrink-0">
                  <img 
                    src={siteConfig.logoUrl} 
                    alt={siteConfig.siteName || "Logo"} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-[#22c55e] rounded-full flex items-center justify-center text-white shadow-md shrink-0">
                  <Banana className="w-5 h-5 fill-white" />
                </div>
              )}
              <div>
                <span className="text-2xl font-serif font-black tracking-tighter text-white flex items-center">
                  {brandPrefix} <span className="text-[#22c55e] ml-1.5">{brandSuffix}</span>
                </span>
              </div>
            </div>

            <p className="text-sky-200/80 text-xs leading-relaxed max-w-sm">
              {siteConfig.description || 'Your premier boutique source for ethically harvested, firm unripened green bananas, resistant starch flour, and artisanal crispy snacks.'}
            </p>

            {/* Social Links */}
            <div className="pt-1 flex items-center gap-3">
              <a 
                href={siteConfig.socialLinks?.instagram || "https://www.instagram.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#E4405F] hover:text-white flex items-center justify-center text-sky-300 transition-all hover:scale-110 shadow-sm cursor-pointer"
                title="Follow Banana Ji on Instagram"
                aria-label="Follow Banana Ji on Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a 
                href={siteConfig.socialLinks?.facebook || "https://www.facebook.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#1877F2] hover:text-white flex items-center justify-center text-sky-300 transition-all hover:scale-110 shadow-sm cursor-pointer"
                title="Follow Banana Ji on Facebook"
                aria-label="Follow Banana Ji on Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a 
                href={siteConfig.socialLinks?.twitter || "https://x.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#0ea5e9] hover:text-white flex items-center justify-center text-sky-300 transition-all hover:scale-110 shadow-sm cursor-pointer"
                title="Follow Banana Ji on X (Twitter)"
                aria-label="Follow Banana Ji on X (Twitter)"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a 
                href={siteConfig.socialLinks?.youtube || "https://www.youtube.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#FF0000] hover:text-white flex items-center justify-center text-sky-300 transition-all hover:scale-110 shadow-sm cursor-pointer"
                title="Subscribe to Banana Ji on YouTube"
                aria-label="Subscribe to Banana Ji on YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Customer Care & Contacts */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0ea5e9]">Customer Care & Support</h4>
            
            <div className="space-y-2.5 text-xs text-sky-200/80">
              <a 
                href={`tel:${siteConfig.contactPhone?.replace(/\s+/g, '') || '+8801712345678'}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors group cursor-pointer"
                title="Call Customer Care"
                aria-label={`Call Customer Care at ${siteConfig.contactPhone || '+880 1712-345678'}`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>Hotline: {siteConfig.contactPhone || '+880 1712-345678'}</span>
              </a>
              <a 
                href={`mailto:${siteConfig.contactEmail || 'hello@bananaji.store'}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors group cursor-pointer"
                title="Send Email Support"
                aria-label={`Send email to ${siteConfig.contactEmail || 'hello@bananaji.store'}`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[#22c55e] group-hover:bg-[#22c55e] group-hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span>Email: {siteConfig.contactEmail || 'hello@bananaji.store'}</span>
              </a>
              <button 
                type="button"
                onClick={onOpenContact} 
                className="flex items-start gap-2.5 hover:text-white transition-colors group cursor-pointer text-left"
                title="View Location & Office"
                aria-label="View Location & Office details"
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>{siteConfig.contactAddress || 'Munshiganj Eco Groves & Gulshan Distribution Center, Dhaka'}</span>
              </button>
            </div>
          </div>

          {/* Column 3: Green Harvest Catalog */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0ea5e9] mb-4">Green Harvest</h4>
            <ul className="space-y-2.5 text-xs text-sky-200/80">
              <li><button onClick={scrollToCatalog} className="hover:text-white transition-colors cursor-pointer">Cavendish Crown</button></li>
              <li><button onClick={scrollToCatalog} className="hover:text-white transition-colors cursor-pointer">Blue Java Varieties</button></li>
              <li><button onClick={scrollToCatalog} className="hover:text-white transition-colors cursor-pointer">Green Banana Flour</button></li>
              <li><button onClick={scrollToCatalog} className="hover:text-white transition-colors cursor-pointer">Plantain Crisps</button></li>
              <li><button onClick={scrollToCatalog} className="hover:text-white transition-colors cursor-pointer">Resistant Starch Powder</button></li>
              <li><button onClick={onOpenContact} className="hover:text-white transition-colors cursor-pointer">Wholesale Enquiries</button></li>
            </ul>
          </div>

          {/* Column 4: Emporium Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0ea5e9] mb-4">Emporium Links</h4>
            <ul className="space-y-2.5 text-xs text-sky-200/80">
              <li><button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#22c55e]" /> About Emporium</button></li>
              <li><button onClick={onOpenBlog} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#22c55e]" /> Harvest Journal</button></li>
              <li><button onClick={onOpenContact} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#22c55e]" /> Help & Support</button></li>
              <li><button onClick={scrollToCatalog} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-amber-400" /> Crispy Roasted Packs</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Legal Links & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-sky-300/60">
          {/* Legal Links */}
          <div className="flex gap-6 uppercase tracking-wider text-[10px] font-medium items-center">
            <button onClick={onOpenContact} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={onOpenContact} className="hover:text-white transition-colors cursor-pointer">Terms of Service</button>
            <button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer">Sustainability</button>
          </div>

          {/* Copyright with Secret Admin Full Stop (.) */}
          <p>
            {siteConfig.footerCopyright ? siteConfig.footerCopyright.replace(/\.$/, '') : '© 2026 Banana Ji Organic Emporium. All rights reserved'}
            <span
              onClick={onSecretAdminClick}
              className="cursor-pointer select-none text-sky-300/60 hover:text-sky-300 transition-colors"
              title="Admin Portal"
            >
              .
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
};
