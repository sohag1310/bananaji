import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { BannerItem } from '../types';

// Locally bundled high-resolution panoramic hero banners (Artisanal Chips collection)
import bannerCollarChips from '../assets/images/banner_collar_chips_1786832190569.jpg';
import bannerPineappleChips from '../assets/images/banner_pineapple_chips_1786832203710.jpg';
import bannerMedleyChips from '../assets/images/banner_medley_chips_1786832215673.jpg';
import bannerPlantainChips from '../assets/images/banner_plantain_chips_1786828119817.jpg';

interface HeroProps {
  banners?: BannerItem[];
  onShopClick?: () => void;
  titlePrefix?: string;
}

export const DEFAULT_HERO_BANNERS: BannerItem[] = [
  {
    id: 1,
    image: bannerCollarChips,
    title: 'Artisanal Golden Kolar Chips',
    alt: 'Banner 1 - Crispy Golden Thinly-Sliced Banana Collar Chips',
    subtitle: 'Kettle-cooked in pure coconut oil & pink Himalayan rock salt'
  },
  {
    id: 2,
    image: bannerPineappleChips,
    title: 'Sweet & Tangy Pineapple Crisps',
    alt: 'Banner 2 - Vacuum-Fried Golden Pineapple Ring Chips',
    subtitle: '100% natural fruit rings dehydrated below 45°C'
  },
  {
    id: 3,
    image: bannerMedleyChips,
    title: 'Exotic Tropical Fruit & Root Medley',
    alt: 'Banner 3 - Gourmet Assorted Fruit and Root Chips Spread',
    subtitle: 'Crispy purple sweet potato, taro root & jackfruit chips'
  },
  {
    id: 4,
    image: bannerPlantainChips,
    title: 'Artisan Kettle-Cooked Plantain Chips',
    alt: 'Banner 4 - Artisan Kettle Cooked Plantain & Banana Chips',
    subtitle: 'Thick ridged cut seasoned with cracked black pepper'
  }
];

const SLIDE_INTERVAL_MS = 5000; // 5 seconds per banner

export const Hero: React.FC<HeroProps> = ({ banners = DEFAULT_HERO_BANNERS, onShopClick, titlePrefix }) => {
  const activeBanners = (banners && banners.length > 0) ? banners : DEFAULT_HERO_BANNERS;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep current slide within bounds if banner count changes dynamically in Admin
  useEffect(() => {
    if (currentSlide >= activeBanners.length) {
      setCurrentSlide(0);
    }
  }, [activeBanners.length, currentSlide]);

  // Preload all banner images into memory
  useEffect(() => {
    activeBanners.forEach((banner) => {
      if (banner.image) {
        const img = new Image();
        img.src = banner.image;
      }
    });
  }, [activeBanners]);

  // Safe Next Slide Handler
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  // Safe Prev Slide Handler
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  // Go to a specific slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Robust 5-Second Interval Timer
  useEffect(() => {
    if (isPaused || activeBanners.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, SLIDE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide, currentSlide, activeBanners.length]);

  return (
    <section 
      aria-label="Promotional Hero Banners"
      className="relative w-full max-w-[1920px] mx-auto overflow-hidden bg-slate-950 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Responsive Banner Container */}
      <div className="relative w-full h-[240px] sm:h-[380px] md:h-[480px] lg:h-[560px] xl:h-[620px] overflow-hidden bg-slate-900">
        {activeBanners.map((banner, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={banner.id || index}
              onClick={onShopClick}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              title={`Banner ${index + 1}: ${banner.title} (Click to explore)`}
            >
              {/* High-quality banner image */}
              <img
                src={banner.image}
                alt={banner.alt || banner.title}
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="sync"
                className="w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out scale-100 group-hover:scale-[1.01]"
              />

              {/* Gradient overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Floating Banner Title & Subtitle */}
              {banner.title && (
                <div className="absolute bottom-14 sm:bottom-20 left-4 sm:left-12 max-w-xl text-white space-y-1 pointer-events-none drop-shadow-md">
                  {titlePrefix && (
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#0ea5e9]/90 text-[11px] font-bold uppercase tracking-wider text-white mb-1">
                      {titlePrefix}
                    </span>
                  )}
                  <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-black text-white leading-tight">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Previous Banner Button */}
        {activeBanners.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous Banner"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Next Banner Button */}
        {activeBanners.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next Banner"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Bottom Banner Indicators & Control Bar */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-6 left-0 right-0 z-20 px-4 sm:px-8 flex items-center justify-center sm:justify-between max-w-7xl mx-auto pointer-events-none">
            
            {/* Navigation Pills */}
            <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto bg-black/40 backdrop-blur-md px-3.5 sm:px-5 py-2 rounded-full border border-white/10 shadow-md">
              {activeBanners.map((banner, index) => {
                const isActive = index === currentSlide;
                return (
                  <button
                    key={banner.id || index}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(index);
                    }}
                    className="py-1 px-0.5 cursor-pointer group/dot flex items-center gap-1.5"
                    aria-label={`Go to Banner ${index + 1}`}
                  >
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isActive 
                          ? 'w-8 sm:w-10 bg-[#22c55e]' 
                          : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Slide Counter and Play/Pause Toggle */}
            <div className="hidden sm:flex items-center gap-3 pointer-events-auto bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white/90 text-xs font-mono shadow-md">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="hover:text-[#22c55e] transition-colors cursor-pointer p-0.5"
                title={isPaused ? 'Resume banner rotation' : 'Pause banner rotation'}
                aria-label={isPaused ? 'Resume rotation' : 'Pause rotation'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-[#22c55e]" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <span className="text-xs font-bold text-white tracking-wider">
                0{currentSlide + 1} <span className="text-white/40">/ 0{activeBanners.length}</span>
              </span>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};
