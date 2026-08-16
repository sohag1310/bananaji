import React, { useState, useRef } from 'react';
import { Product, Review } from '../types';
import { 
  ChevronRight, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Sparkles,
  Star,
  Camera,
  Upload,
  X,
  CheckCircle2,
  MessageSquare,
  Image as ImageIcon,
  ShoppingCart
} from 'lucide-react';

interface ProductDetailsPageProps {
  product: Product;
  allProducts: Product[];
  onBackToHome: () => void;
  onSelectProduct: (product: Product) => void;
  onAddReview?: (productId: string, newReview: Review) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onBuyNow?: (product: Product, quantity?: number) => void;
  currentUser?: any;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  allProducts,
  onBackToHome,
  onSelectProduct,
  onAddReview,
  onAddToCart,
  onBuyNow,
  currentUser,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Review Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= 99) {
      setQuantity(newQty);
    }
  };

  // Image Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          if (loadEvent.target?.result) {
            setAttachedImages((prev) => [...prev, loadEvent.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setAttachedImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setAttachedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Rating & Comment
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      showToast('⚠️ Please write a brief comment before submitting.');
      return;
    }

    setIsSubmitting(true);

    const authorName = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Customer');

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      author: authorName,
      rating: rating,
      date: new Date().toISOString().split('T')[0],
      comment: commentText.trim(),
      verified: true,
      images: attachedImages.length > 0 ? [...attachedImages] : undefined,
    };

    if (onAddReview) {
      onAddReview(product.id, newReview);
    }

    // Reset Form
    setTimeout(() => {
      setIsSubmitting(false);
      setCommentText('');
      setRating(5);
      setAttachedImages([]);
      setIsFormOpen(false);
      showToast('🌟 Thank you! Your rating and comment have been saved.');
    }, 400);
  };

  // Calculate current reviews & average
  const reviewsList = product.reviews || [];
  const averageRating = reviewsList.length > 0
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
    : product.rating.toFixed(1);

  // Rating label helper
  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5: return '5 Stars - Exceptional Quality';
      case 4: return '4 Stars - Very Good & Fresh';
      case 3: return '3 Stars - Average Harvest';
      case 2: return '2 Stars - Below Expectations';
      case 1: return '1 Star - Unsatisfied';
      default: return '';
    }
  };

  // Related products
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 1))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans pb-16">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#0ea5e9]/30 text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#22c55e] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Enlarged Image Lightbox Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2 border border-white/20">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={enlargedImage}
              alt="Customer Attachment Fullscreen"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="max-w-[1850px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2 sm:pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200/80 pb-2 sm:pb-3">
          <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <button 
              onClick={onBackToHome}
              className="hover:text-[#0ea5e9] transition-colors flex items-center gap-1 cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <button 
              onClick={onBackToHome}
              className="hover:text-[#0ea5e9] transition-colors cursor-pointer"
            >
              Shop
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-[#0ea5e9] font-bold truncate max-w-[180px] sm:max-w-[300px]">
              {product.name}
            </span>
          </nav>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-[#0ea5e9] text-xs font-semibold text-slate-700 hover:text-[#0ea5e9] transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </button>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1850px] mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/80 shadow-xs items-center">
          
          {/* Left Side: Product Image (Optimized height for mobile without giant blank space) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative aspect-[4/3] sm:aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-xl sm:rounded-2xl overflow-hidden bg-[#f0f9ff] border border-[#0ea5e9]/20 shadow-xs">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Side: Product Info & Purchase */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-3 sm:space-y-4">
            
            {/* Product Title */}
            <h1 className="font-serif font-black text-xl sm:text-2xl lg:text-3xl text-[#0f172a] leading-snug">
              {product.name}
            </h1>

            {/* Pricing Display */}
            <div className="flex items-baseline gap-2.5">
              <span className="font-serif font-black text-2xl sm:text-3xl text-[#22c55e]">
                ৳{Math.round(product.price).toLocaleString('en-US')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-sans text-base text-slate-400 line-through">
                  ৳{Math.round(product.originalPrice).toLocaleString('en-US')}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector + Buy Now */}
            <div className="pt-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Quantity Selector */}
                <div className="flex items-center">
                  <span className="text-xs font-bold text-slate-700 mr-2 uppercase tracking-wider">Qty:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 text-slate-600 hover:text-[#0ea5e9] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-10 text-center text-xs sm:text-sm font-bold text-[#0f172a] focus:outline-none border-x border-slate-200 py-1"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 99}
                      className="p-2 text-slate-600 hover:text-[#0ea5e9] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal calculation */}
                <div className="text-xs text-slate-500 font-medium">
                  Subtotal: <span className="font-bold text-[#22c55e] text-sm">৳{Math.round(product.price * quantity).toLocaleString('en-US')}</span>
                </div>
              </div>

              {/* Primary Action CTAs: Buy Now & Add to Cart Side by Side */}
              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onBuyNow) {
                      onBuyNow(product, quantity);
                    } else if (onAddToCart) {
                      onAddToCart(product, quantity);
                    }
                  }}
                  className="h-10 px-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs sm:text-sm font-sans font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer"
                >
                  <span className="truncate">Buy Now</span>
                </button>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onAddToCart) {
                      onAddToCart(product, quantity);
                    }
                    showToast(`🛒 Added ${quantity} × ${product.name} to cart!`);
                  }}
                  className="h-10 px-3 rounded-xl bg-sky-400 hover:bg-sky-500 text-white text-xs sm:text-sm font-sans font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-white shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">Add to Cart</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Customer Ratings, Comments & Image Attachments Section */}
      <div className="max-w-[1850px] mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200/80 shadow-xs space-y-5">
          
          {/* Header & Rating Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#0f172a]">
                  Customer Reviews & Ratings
                </h3>
                <span className="px-2.5 py-0.5 bg-[#22c55e]/10 text-[#22c55e] rounded-full text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center text-[#f59e0b]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(Number(averageRating))
                          ? 'fill-[#f59e0b] text-[#f59e0b]'
                          : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-[#0f172a]">{averageRating} out of 5</span>
                <span className="text-slate-400">•</span>
                <span>{reviewsList.length} Customer {reviewsList.length === 1 ? 'Comment' : 'Comments'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-4 py-2 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {isFormOpen ? 'Close Form' : 'Write a Review'}
            </button>
          </div>

          {/* Interactive Review & Image Upload Form */}
          {isFormOpen && (
            <form onSubmit={handleReviewSubmit} className="bg-[#f0f9ff]/70 border border-[#0ea5e9]/20 rounded-2xl p-4 sm:p-5 space-y-4">
              <div>
                <h4 className="font-serif font-bold text-base text-[#0f172a] mb-0.5">
                  Rate this Product & Leave a Comment
                </h4>
                <p className="text-xs text-slate-600">
                  Share your honest feedback, rating, and attach real photos of the product you received.
                </p>
              </div>

              {/* 1. Star Rating Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                        title={`${star} star`}
                      >
                        <Star
                          className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'fill-[#f59e0b] text-[#f59e0b]'
                              : 'text-slate-300 fill-slate-100'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700 ml-1.5">
                    {getRatingLabel(hoverRating || rating)}
                  </span>
                </div>
              </div>

              {/* Comment Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Your Comment / Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your experience: How was the freshness, taste, texture, or delivery quality?"
                  className="w-full p-3 bg-white rounded-xl border border-slate-200 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/20 text-xs sm:text-sm text-[#0f172a] focus:outline-none shadow-2xs resize-y"
                />
              </div>

              {/* Product Image Attachments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#0ea5e9]" />
                    Attach Product Photos (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-bold text-[#0ea5e9] hover:underline cursor-pointer"
                  >
                    {showUrlInput ? 'Use file upload' : '+ Paste Image URL'}
                  </button>
                </div>

                {showUrlInput ? (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Paste direct image link (https://...)"
                      className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-[#0ea5e9] text-xs text-[#0f172a] focus:outline-none shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3.5 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Add Photo
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="customer-review-image-upload"
                    />
                    <label
                      htmlFor="customer-review-image-upload"
                      className="border-2 border-dashed border-[#0ea5e9]/40 hover:border-[#0ea5e9] bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:bg-[#f0f9ff]/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        Click to browse & upload images from your device
                      </p>
                      <p className="text-[10px] text-slate-400">
                        PNG, JPG, WEBP formats supported
                      </p>
                    </label>
                  </div>
                )}

                {/* Image Previews */}
                {attachedImages.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
                    {attachedImages.map((imgUrl, index) => (
                      <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#0ea5e9]/30 bg-slate-100 shrink-0 group">
                        <img
                          src={imgUrl}
                          alt={`Attachment preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                          title="Remove image"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#0f172a] hover:bg-[#0ea5e9] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Saving Review...'
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
                      Submit Review & Rating
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* Customer Reviews & Comments List */}
          <div className="space-y-4">
            {reviewsList.length === 0 ? (
              <div className="text-center py-12 px-4 bg-[#f8fafc] rounded-2xl border border-slate-200/60 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#0f172a]">
                  No comments or reviews yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Be the first customer to share your thoughts, rating, and photos for {product.name}!
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Leave First Comment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-[#0ea5e9]/40 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
                  >
                    <div>
                      {/* Top Author & Stars */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#0ea5e9]/15 text-[#0ea5e9] font-bold text-xs flex items-center justify-center uppercase">
                            {rev.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#0f172a]">{rev.author}</span>
                              {rev.verified && (
                                <span className="text-[10px] text-[#22c55e] font-semibold flex items-center">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>

                        {/* Star display */}
                        <div className="flex items-center text-[#f59e0b]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating
                                  ? 'fill-[#f59e0b] text-[#f59e0b]'
                                  : 'text-slate-200 fill-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-slate-700 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Attached Images Gallery if any */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mb-2">
                          <ImageIcon className="w-3 h-3 text-[#0ea5e9]" />
                          Customer Photos ({rev.images.length})
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {rev.images.map((imgUrl, imgIdx) => (
                            <button
                              key={imgIdx}
                              type="button"
                              onClick={() => setEnlargedImage(imgUrl)}
                              className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 hover:border-[#0ea5e9] shrink-0 group cursor-zoom-in transition-all"
                              title="Click to enlarge"
                            >
                              <img
                                src={imgUrl}
                                alt={`Customer attachment ${imgIdx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      <div className="max-w-[1850px] mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#0f172a]">
              Related Products
            </h3>
          </div>
          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-[#0ea5e9] hover:underline cursor-pointer"
          >
            View All Products &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {relatedProducts.map((relProd) => (
            <div
              key={relProd.id}
              onClick={() => {
                onSelectProduct(relProd);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f0f9ff]">
                <img
                  src={relProd.image}
                  alt={relProd.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#0f172a] line-clamp-2 leading-tight group-hover:text-[#0ea5e9] transition-colors">
                    {relProd.name}
                  </h4>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-serif font-black text-sm text-[#22c55e]">
                    ৳{Math.round(relProd.price).toLocaleString('en-US')}
                  </span>
                  <span className="text-[10px] font-bold text-[#0ea5e9] group-hover:translate-x-0.5 transition-transform">
                    View &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
