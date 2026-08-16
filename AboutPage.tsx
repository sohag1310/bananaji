import React from 'react';
import { ArrowLeft, ChevronRight, Leaf, ShieldCheck, TreePine, Award, Users, Heart, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

interface AboutPageProps {
  onBackToHome: () => void;
  onOpenContact?: () => void;
  onOpenBlog?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToHome, onOpenContact, onOpenBlog }) => {
  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#0f172a] font-sans pb-20">
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
            <span className="text-[#0ea5e9] font-bold">About Banana Ji</span>
          </nav>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f8fafc] border border-slate-200 hover:border-[#0ea5e9] text-xs font-semibold text-slate-700 hover:text-[#0ea5e9] transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </button>
        </div>
      </div>

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {/* Hero Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-6 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0f9ff] border border-[#0ea5e9]/20 text-[#0ea5e9] text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-[#22c55e]" /> Our Story & Heritage
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#0f172a] max-w-3xl mx-auto leading-tight">
            Earth's Premier Boutique for Farm-Fresh <span className="text-[#22c55e]">Unripe Green Bananas</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Founded on the belief that raw, unripened bananas are one of nature's greatest functional superfoods, Banana Ji delivers pristine green harvest bunches, pure prebiotic starch flours, and artisanal plantains directly from tropical highland groves.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
            <button
              onClick={onBackToHome}
              className="px-6 py-3 rounded-2xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Explore Green Harvest
            </button>
            <button
              onClick={onOpenContact}
              className="px-6 py-3 rounded-2xl bg-white border border-slate-300 hover:border-[#0ea5e9] text-slate-700 hover:text-[#0ea5e9] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Contact Our Team
            </button>
          </div>
        </section>

        {/* Pillars / Values Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#0f172a]">
              Why Choose Banana Ji?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              We focus strictly on premium quality, ethical agriculture, and preserving raw nutritional potency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#22c55e] flex items-center justify-center">
                <TreePine className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0f172a]">Ethically Farm-Direct</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We partner directly with smallholder farming cooperatives in tropical highland valleys, ensuring fair-trade compensations and sustainable regenerative soil practices.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0f172a]">100% Pesticide & Chemical Free</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero artificial ripening gas, zero ethylene chambers, and zero wax coatings. What you receive is pure, natural, crisp green produce exactly as picked from the tree.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#f59e0b] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0f172a]">Cold-Chain Freshness</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our specialized temperature-monitored packaging locks in the crispness and moisture, preventing premature yellowing during transit to your kitchen.
              </p>
            </div>
          </div>
        </section>

        {/* Nutritional & Health Focus Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#22c55e] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Functional Superfood
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#0f172a]">
                The Power of Resistant Starch (RS2)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Unlike ripe yellow bananas which are high in simple sugars, unripe green bananas are packed with resistant starch — a unique prebiotic fiber that resists digestion in the small intestine and ferments in the large intestine.
              </p>
              
              <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span><strong>Microbiome Fuel:</strong> Nourishes beneficial gut bacteria and promotes short-chain fatty acid (butyrate) production.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span><strong>Low Glycemic Response:</strong> Sustains long-lasting satiety without spiking blood glucose levels.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span><strong>Culinary Versatility:</strong> Perfect for savory curries, boiled dishes, gluten-free baking, and crisp air-fried chips.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#f0f9ff] rounded-2xl p-6 sm:p-8 border border-[#0ea5e9]/20 space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#0f172a]">Our Quality Commitment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every bunch of Banana Ji green bananas undergoes rigorous manual grading to verify firmness, stem integrity, and absence of blemishes before shipping.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="font-serif font-bold text-xl text-[#0ea5e9]">100%</p>
                  <p className="text-[11px] font-semibold text-slate-600">Freshness Guaranteed</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="font-serif font-bold text-xl text-[#22c55e]">Zero</p>
                  <p className="text-[11px] font-semibold text-slate-600">Ripening Chemicals</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif font-black text-2xl text-[#0f172a] flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#0ea5e9]" /> Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">Everything you need to know about purchasing and storing green bananas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-sm text-[#0f172a]">How should I store unripe green bananas?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                To keep them firm and green, store them in a cool, well-ventilated dry area away from direct sunlight and apples. To prolong green firmness for weeks, store them inside the vegetable crisper drawer of your refrigerator.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-sm text-[#0f172a]">Can I eat them raw or should they be cooked?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unripe bananas are very firm and high in starch. They are commonly boiled, steamed, fried, or added to savory stews and curries. Our green banana flour can be blended directly into smoothies or used in gluten-free baking.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-sm text-[#0f172a]">Where are your bananas harvested?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We ethically partner with verified organic smallholder farmers across tropical belts in Bangladesh, India, and Sri Lanka known for traditional heirloom Cavendish and Saba varieties.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-sm text-[#0f172a]">What is your return & satisfaction policy?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If your order arrives damaged or fails our strict green firmness standard, simply message our customer support team within 24 hours for an immediate hassle-free replacement or refund.
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="text-center py-6 space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#0f172a]">Ready to experience the freshest green harvest?</h3>
          <button
            onClick={onBackToHome}
            className="px-8 py-3.5 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Start Shopping Now
          </button>
        </div>

      </main>
    </div>
  );
};
