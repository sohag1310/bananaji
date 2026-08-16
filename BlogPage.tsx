import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  BookOpen, 
  Clock, 
  Calendar, 
  Tag, 
  Search, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  User,
  Info,
  Maximize2,
  X,
  Camera
} from 'lucide-react';
import { BlogPost, BannerItem } from '../types';
import { Hero } from './Hero';

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: '5 Incredible Health Benefits of Unripe Green Bananas & Resistant Starch',
    excerpt: 'Discover why raw green bananas are packed with RS2 resistant starch, prebiotic fiber, and essential minerals for gut microbiome health.',
    content: [
      'Unripe green bananas have long been celebrated in traditional culinary systems across Asia and the Caribbean, but modern nutritional science is now confirming what traditional healers have known for centuries: raw green bananas are a nutritional powerhouse.',
      'Unlike yellow bananas that have converted their carbohydrates into simple sugars (fructose and glucose), green bananas are rich in RS2 resistant starch. Resistant starch passes through the stomach and small intestine undigested, reaching the colon where it serves as food for beneficial prebiotic microbes.',
      'When your gut microbiota ferments this resistant starch, it produces short-chain fatty acids (SCFAs), predominantly butyrate. Butyrate is the primary energy source for the cells lining your colon and plays a pivotal role in reducing inflammation and strengthening the intestinal barrier.',
      'Moreover, green bananas have a very low glycemic index (GI), making them an ideal functional carbohydrate for individuals looking to maintain balanced blood glucose and steady energy without post-meal fatigue.',
      'From supporting metabolic wellness to enhancing digestive regularity and nutrient absorption, integrating unripe green bananas or green banana flour into your daily diet provides profound everyday benefits.'
    ],
    keyPoints: [
      'Contains up to 80% resistant starch (RS2) before ripening',
      'Naturally promotes gut microbiota diversity and butyrate production',
      'Very low glycemic index for sustained energy and satiety',
      'Rich in potassium, magnesium, vitamin B6, and vitamin C'
    ],
    date: 'August 10, 2026',
    readTime: '5 min read',
    category: 'Nutrition & Health',
    author: 'Dr. Evelyn Ward, Nutritional Biochemist',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80',
    tag: 'Superfood'
  },
  {
    id: 'blog-2',
    title: 'Artisanal Green Banana Flour: How to Bake & Cook with Resistant Starch',
    excerpt: 'A comprehensive culinary guide to using gluten-free, grain-free green banana flour in breads, pancakes, and daily smoothies.',
    content: [
      'Green banana flour is rapidly becoming the gold standard in functional, grain-free baking. Made from freshly harvested, dehydrated green bananas, this fine pale powder possesses a neutral, slightly nutty flavor that does NOT taste like ripe sweet bananas.',
      'Because of its extraordinarily high starch density, you typically need to use 25% to 30% LESS green banana flour in baking recipes compared to conventional wheat flour.',
      'To preserve the beneficial resistant starch (which can break down at high temperatures), you can add a single tablespoon of raw green banana flour directly into morning protein smoothies, overnight oats, yogurt bowls, or salad dressings.',
      'When cooked, it transforms into an exceptional natural thickening agent for savory stews, creamy plant-based sauces, and traditional gravies without requiring cornstarch or artificial gums.'
    ],
    keyPoints: [
      'Naturally 100% gluten-free, grain-free, and paleo-friendly',
      'Use 25-30% less volume than standard wheat flour',
      'Neutral flavor suitable for both sweet and savory dishes',
      'Superb natural thickener for soups, curries, and sauces'
    ],
    date: 'August 05, 2026',
    readTime: '6 min read',
    category: 'Culinary Recipes',
    author: 'Chef Marcus Vance',
    image: 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&w=1200&q=80',
    tag: 'Baking & Recipes'
  },
  {
    id: 'blog-3',
    title: 'From Highland Groves to Table: Our Zero-Chemical Harvest Protocol',
    excerpt: 'Learn how Banana Ji collaborates with smallholder generational farmers to deliver pristine unripened fruit with zero ethylene exposure.',
    content: [
      'The journey of every Banana Ji green banana begins in pesticide-free highland groves where volcanic soil and natural rainfall cultivate vigorous, mineral-rich banana plants.',
      'Standard commercial supermarkets rely heavily on artificial ethylene ripening gas chambers to force bananas into premature uniform yellow color. At Banana Ji, we do the exact opposite: our produce is hand-cut at peak unripened density.',
      'Immediately after harvest, bunches are washed in purified cold mountain spring water, sorted for firmness and stem thickness, and packed into breathable, thermal-regulated cartons.',
      'This specialized cold-chain protocol ensures that when your parcel arrives, each banana is as crisp, solid, and vibrant green as if it was picked this morning.'
    ],
    keyPoints: [
      'Hand-picked at peak green firmness in tropical groves',
      'Strictly zero artificial ripening gases or ethylene treatment',
      'Direct fair-trade contracts supporting local farming communities',
      'Thermal-regulated cold chain packaging for home delivery'
    ],
    date: 'July 28, 2026',
    readTime: '4 min read',
    category: 'Sustainability',
    author: 'Tariq Rahman, Head of Agriculture',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
    tag: 'Farming'
  },
  {
    id: 'blog-4',
    title: 'Authentic Traditional Raw Banana Curry & Crispy Plantain Chips',
    excerpt: 'Master the timeless South Asian Kacha Kela curry infused with mustard seeds, coconut milk, and aromatic spices.',
    content: [
      'In traditional Bengali and South Indian households, "Kacha Kela" (raw green banana) is treated as a beloved vegetable rather than a fruit. When cooked gently, the firm flesh absorbs aromatic spices and creates a melt-in-your-mouth texture reminiscent of tender baby potatoes.',
      'To prepare a classic green banana curry, peel the tough outer skin with a sharp paring knife, slice into thick rounds, and soak briefly in water with a pinch of turmeric to maintain its vibrant color.',
      'Sauté with mustard seeds, cumin, green chillies, and ginger, then simmer in fresh coconut milk until tender. Serve warm with fragrant basmati rice.',
      'For snack enthusiasts, thin mandoline slices can be air-fried or kettle-cooked with cold-pressed coconut oil and pink Himalayan rock salt for the crispiest, guilt-free plantain chips imaginable.'
    ],
    keyPoints: [
      'Tender, savory texture resembling artisanal root vegetables',
      'Absorbs robust marinades and spice blends seamlessly',
      'High in fiber and potassium for hearty plant-based meals',
      'Versatile for frying, roasting, boiling, and mashing'
    ],
    date: 'July 15, 2026',
    readTime: '7 min read',
    category: 'Culinary Recipes',
    author: 'Amina Choudhury',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    tag: 'Recipe'
  }
];

const CATEGORIES = ['All', 'Nutrition & Health', 'Culinary Recipes', 'Sustainability'];

interface BlogPageProps {
  posts?: BlogPost[];
  heroBanners?: BannerItem[];
  onBackToHome: () => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenAdminPrompt: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ 
  posts = DEFAULT_BLOG_POSTS, 
  heroBanners,
  onBackToHome, 
  onOpenAdminPrompt 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState<{
    post: BlogPost;
    isLast: boolean;
  } | null>(null);

  const displayPosts = (posts && posts.length > 0) ? posts : DEFAULT_BLOG_POSTS;

  const filteredPosts = displayPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#0f172a] font-sans pb-20">
      {/* 1. HERO BANNER INTEGRATION INTO BLOG SECTION */}
      <div className="w-full border-b border-slate-200/80 bg-slate-950">
        <Hero 
          banners={heroBanners} 
          titlePrefix="Journal & Harvest Insights" 
          onShopClick={() => setActiveArticle(displayPosts[0] || null)}
        />
      </div>

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-24 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between flex-wrap gap-3">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button 
              onClick={onBackToHome}
              className="hover:text-[#0ea5e9] transition-colors flex items-center gap-1 cursor-pointer font-semibold"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button 
              onClick={() => setActiveArticle(null)}
              className={`hover:text-[#0ea5e9] transition-colors cursor-pointer ${!activeArticle ? 'text-[#0ea5e9] font-bold' : ''}`}
            >
              Harvest Journal
            </button>
            {activeArticle && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#0ea5e9] font-bold truncate max-w-[200px] sm:max-w-[300px]">
                  {activeArticle.title}
                </span>
              </>
            )}
          </nav>

          <button
            onClick={() => {
              if (activeArticle) {
                setActiveArticle(null);
              } else {
                onBackToHome();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f8fafc] border border-slate-200 hover:border-[#0ea5e9] text-xs font-semibold text-slate-700 hover:text-[#0ea5e9] transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {activeArticle ? 'Back to Journal' : 'Back to Store'}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* If user is reading an individual article */}
        {activeArticle ? (
          <article className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-[#f0f9ff] text-[#0ea5e9] border border-[#0ea5e9]/20 text-xs font-bold uppercase tracking-wider">
                  {activeArticle.category}
                </span>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activeArticle.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}</span>
                </div>
              </div>

              <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#0f172a] leading-tight">
                {activeArticle.title}
              </h1>

              <div className="flex items-center justify-between border-y border-slate-100 py-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-800">{activeArticle.author}</span>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-[#0ea5e9] hover:underline font-semibold cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copiedLink ? 'Link Copied!' : 'Share Article'}
                </button>
              </div>
            </div>

            {/* Featured Image with Clickable Image Details */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xs bg-slate-100 group">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  const isLast = displayPosts.findIndex(p => p.id === activeArticle.id) === displayPosts.length - 1;
                  setPreviewImageModal({ post: activeArticle, isLast });
                }}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" /> View Image Details
              </button>
            </div>

            {/* Key Takeaways Box */}
            {activeArticle.keyPoints && (
              <div className="bg-[#f0f9ff] rounded-2xl p-6 border border-[#0ea5e9]/20 space-y-3">
                <h3 className="font-serif font-bold text-base text-[#0f172a] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#22c55e]" /> Key Insights & Takeaways
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {activeArticle.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Content Paragraphs */}
            <div className="space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
              {activeArticle.content.map((paragraph, index) => {
                const isLastPost = displayPosts.findIndex(p => p.id === activeArticle.id) === displayPosts.length - 1;
                const isLastParagraph = index === activeArticle.content.length - 1;

                if (isLastPost && isLastParagraph) {
                  // The full stop at the end of the last paragraph/details of the last image
                  const textWithoutPeriod = paragraph.endsWith('.') ? paragraph.slice(0, -1) : paragraph;
                  return (
                    <p key={index}>
                      {textWithoutPeriod}
                      {/* The secret clickable full stop trigger */}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAdminPrompt();
                        }}
                        title="."
                        className="cursor-pointer text-slate-700 hover:text-[#0ea5e9] select-none font-bold text-base px-0.5 inline-block transition-colors"
                      >
                        .
                      </span>
                    </p>
                  );
                }

                return <p key={index}>{paragraph}</p>;
              })}
            </div>

            {/* Image Details Caption Box with Secret Full-Stop trigger */}
            {(() => {
              const isLastPost = displayPosts.findIndex(p => p.id === activeArticle.id) === displayPosts.length - 1;
              return (
                <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">Image Documentation: </span>
                    <span>High-resolution archival botanical capture of {activeArticle.title}. Sourced directly from Banana Ji harvest co-ops and zero-chemical artisanal processing</span>
                    {isLastPost ? (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAdminPrompt();
                        }}
                        title="."
                        className="cursor-pointer text-slate-600 hover:text-[#0ea5e9] font-bold text-base px-0.5 inline-block select-none transition-colors"
                      >
                        .
                      </span>
                    ) : (
                      <span>.</span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Bottom Actions */}
            <div className="border-t border-slate-100 pt-6 flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> View All Articles
              </button>

              <button
                onClick={onBackToHome}
                className="px-6 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Shop Banana Ji Snacks
              </button>
            </div>
          </article>
        ) : (
          /* Article Grid & Listing View */
          <div className="space-y-10">
            {/* Header / Hero */}
            <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] border border-[#0ea5e9]/20 text-[#0ea5e9] text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#0ea5e9]" /> Banana Ji Journal & Culinary Guide
              </div>
              <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#0f172a]">
                Stories, Health Insights & Raw Harvest Recipes
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Explore science-backed guides on resistant starch, gut health nutrition, traditional recipes, and sustainable farming.
              </p>

              {/* Search and Category Filter */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
                <div className="relative w-full sm:flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search articles, recipes, health guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0f172a] focus:outline-none focus:border-[#0ea5e9] focus:bg-white"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#0f172a] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Articles Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post, postIdx) => {
                const isLastPost = postIdx === filteredPosts.length - 1;
                return (
                  <div
                    key={post.id || postIdx}
                    className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail with Direct Image Details Click */}
                      <div className="h-56 overflow-hidden relative bg-slate-100">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          onClick={() => {
                            setPreviewImageModal({ post, isLast: isLastPost });
                          }}
                        />
                        <span className="absolute top-3 left-3 bg-[#0f172a]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {post.tag}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImageModal({ post, isLast: isLastPost });
                          }}
                          className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/90 backdrop-blur-sm text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          title="View image details"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                          <span>{post.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                        </div>

                        <h3 
                          onClick={() => {
                            setActiveArticle(post);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="font-serif font-bold text-lg sm:text-xl text-[#0f172a] group-hover:text-[#0ea5e9] transition-colors leading-snug cursor-pointer"
                        >
                          {post.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Image details mini-bar on card */}
                        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <span className="truncate max-w-[200px]">Photo: {post.author}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImageModal({ post, isLast: isLastPost });
                            }}
                            className="text-[#0ea5e9] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Info className="w-3 h-3" /> Details
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0ea5e9]">
                      <button
                        onClick={() => {
                          setActiveArticle(post);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Read Full Article</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        )}
      </main>

      {/* 2. IMAGE DETAILS MODAL (WITH SECRET FULL STOP ON LAST IMAGE) */}
      {previewImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 relative p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#0ea5e9]" />
                <h3 className="font-serif font-black text-lg sm:text-xl text-[#0f172a]">
                  Image Details & Photographic Metadata
                </h3>
              </div>
              <button
                onClick={() => setPreviewImageModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-res Image View */}
            <div className="rounded-2xl overflow-hidden shadow-inner bg-slate-950 aspect-video relative">
              <img
                src={previewImageModal.post.image}
                alt={previewImageModal.post.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-mono">
                {previewImageModal.post.tag}
              </span>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Associated Article</span>
                <span className="font-bold text-slate-800 text-sm block">{previewImageModal.post.title}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Author & Field Origin</span>
                <span className="font-bold text-slate-800 text-sm block">{previewImageModal.post.author}</span>
              </div>
            </div>

            {/* Image Details Narrative with Secret Full Stop */}
            <div className="bg-[#f0f9ff] border border-[#0ea5e9]/20 rounded-2xl p-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="font-bold text-[#0f172a] block mb-1">Archival Photographic Description:</span>
              <span>
                Visual documentation of sustainable raw green banana harvests, cold-pressed artisanal processing, and organic farming methods practiced by Banana Ji local growers. All produce photographed is non-GMO, zero ethylene treated, and harvested at peak natural firm density
              </span>
              {previewImageModal.isLast ? (
                /* The secret full stop on the details of the last image */
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImageModal(null);
                    onOpenAdminPrompt();
                  }}
                  title="."
                  className="cursor-pointer text-[#0f172a] hover:text-[#0ea5e9] font-bold text-lg px-0.5 inline-block select-none transition-colors"
                >
                  .
                </span>
              ) : (
                <span>.</span>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewImageModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                Close Details
              </button>
              <button
                onClick={() => {
                  setActiveArticle(previewImageModal.post);
                  setPreviewImageModal(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Read Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
