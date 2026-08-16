import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

interface ContactPageProps {
  onBackToHome: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToHome }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'General Inquiry',
      message: ''
    });
  };

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
            <span className="text-[#0ea5e9] font-bold">Contact & Support</span>
          </nav>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f8fafc] border border-slate-200 hover:border-[#0ea5e9] text-xs font-semibold text-slate-700 hover:text-[#0ea5e9] transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Page Header */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0f9ff] border border-[#0ea5e9]/20 text-[#0ea5e9] text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-[#0ea5e9]" /> Customer Care & Inquiries
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#0f172a]">
            How Can We Help You Today?
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Have questions about an existing order, shipping timeframes, green banana storage, or wholesale partnership inquiries? Reach out anytime — we respond within 24 hours.
          </p>
        </section>

        {/* Contact Methods Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <a
            href="tel:+18005552262"
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#0ea5e9] transition-all group block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Toll-Free Helpline</p>
            <h3 className="font-bold text-sm text-[#0f172a] mt-1">+1 (800) 555-BANANA</h3>
            <p className="text-xs text-slate-500 mt-1">Mon – Sat: 8:00 AM – 7:00 PM EST</p>
          </a>

          <a
            href="mailto:support@bananaji.com"
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#22c55e] transition-all group block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#22c55e] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Email Support</p>
            <h3 className="font-bold text-sm text-[#0f172a] mt-1">support@bananaji.com</h3>
            <p className="text-xs text-slate-500 mt-1">24/7 inbox monitored daily</p>
          </a>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs block">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dispatch Speed</p>
            <h3 className="font-bold text-sm text-[#0f172a] mt-1">Same-Day Harvest</h3>
            <p className="text-xs text-slate-500 mt-1">Orders before 2 PM ship same day</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs block">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headquarters</p>
            <h3 className="font-bold text-sm text-[#0f172a] mt-1">Organic Valley, CA</h3>
            <p className="text-xs text-slate-500 mt-1">Highland Estate Fulfillment Hub</p>
          </div>
        </section>

        {/* Contact Form & Help Center Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
            <div className="space-y-1">
              <h2 className="font-serif font-bold text-2xl text-[#0f172a]">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500">
                Fill out the form below and our customer care team will get back to you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#22c55e] mx-auto animate-bounce" />
                <h3 className="font-serif font-bold text-xl text-[#0f172a]">
                  Thank You, {formData.name || 'Valued Customer'}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your inquiry regarding <strong>"{formData.subject}"</strong> has been successfully received. We have sent a confirmation note to <strong>{formData.email}</strong>.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:border-[#0ea5e9] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                  <button
                    onClick={onBackToHome}
                    className="px-6 py-2.5 rounded-xl bg-[#22c55e] text-white font-bold text-xs hover:bg-[#16a34a] transition-colors cursor-pointer"
                  >
                    Back to Store
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Sohag"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#0ea5e9] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#0ea5e9] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#0ea5e9] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#0ea5e9] focus:bg-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Status & Delivery">Order Status & Delivery</option>
                      <option value="Product Freshness & Storage">Product Freshness & Storage</option>
                      <option value="Wholesale & Bulk Orders">Wholesale & Bulk Orders</option>
                      <option value="Refund & Return Support">Refund & Return Support</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Message Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please let us know your question or requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#0ea5e9] focus:bg-white resize-y"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0f172a] hover:bg-[#0ea5e9] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#22c55e]" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Help Center & Policies */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#0ea5e9]">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-[#0f172a]">Help Center Quick Answers</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <p className="font-bold text-slate-800">📦 How fast is shipping?</p>
                  <p className="text-slate-600 leading-relaxed">
                    Orders are processed same-day. Standard domestic shipping delivers within 1–2 business days in thermal-insulated boxes.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <p className="font-bold text-slate-800">🍌 100% Unripe Guarantee</p>
                  <p className="text-slate-600 leading-relaxed">
                    If any bunches arrive overripe or bruised, send us a photo within 24 hours for a prompt replacement or full refund.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <p className="font-bold text-slate-800">💼 Wholesale Inquiries</p>
                  <p className="text-slate-600 leading-relaxed">
                    We supply bakeries, meal prep kitchens, and health food stores with bulk raw banana flour and crate quantities.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#f0f9ff] rounded-3xl p-6 border border-[#0ea5e9]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#22c55e]">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-serif font-bold text-sm text-[#0f172a]">Guaranteed Secure & Fresh</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our customer happiness team is dedicated to providing friendly, fast, and helpful service.
              </p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};
