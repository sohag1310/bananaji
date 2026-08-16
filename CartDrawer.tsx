import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (discountAmount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn font-sans">
      <div className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#0ea5e9]/20">
          {/* Header */}
          <div className="p-8 bg-[#f0f9ff] border-b border-[#0ea5e9]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white font-bold shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-black text-[#0f172a]">Your Cart</h2>
                <p className="text-[10px] uppercase tracking-widest text-[#78350f] font-semibold">{items.reduce((acc, i) => acc + i.quantity, 0)} Items Selected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full hover:bg-[#0ea5e9]/20 text-[#0f172a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner font-bold">
                  🍌
                </div>
                <h3 className="font-serif font-bold text-[#0f172a] text-xl">Your basket is empty</h3>
                <p className="text-xs text-[#78350f] max-w-xs mx-auto font-sans leading-relaxed">
                  Explore our farm-fresh products to fill your basket.
                </p>
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-full bg-[#0f172a] text-white text-xs uppercase tracking-[0.2em] font-bold shadow-md hover:bg-[#0ea5e9] transition-all"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 rounded-2xl bg-[#f0f9ff] border border-[#0ea5e9]/20 relative shadow-2xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-white shrink-0 border border-[#0ea5e9]/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-[#0f172a] text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[10px] uppercase tracking-wider text-[#78350f] mb-1">Stage: {item.selectedRipeness || item.product.ripeness}</p>
                    <p className="text-sm font-serif font-black text-[#22c55e]">
                      ৳{Math.round(item.product.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#0ea5e9]/30 rounded-full bg-white overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-[#0f172a] hover:bg-[#0ea5e9]/20 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-[#0f172a]">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-[#0f172a] hover:bg-[#0ea5e9]/20 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#78350f] hover:text-rose-600 transition-colors p-1.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-8 bg-[#f0f9ff] border-t border-[#0ea5e9]/20 space-y-5">
              {/* Totals Breakdown */}
              <div className="space-y-2.5 text-xs font-sans text-[#78350f]">
                <div className="flex justify-between text-base font-serif font-black text-[#0f172a]">
                  <span>Total</span>
                  <span>৳{Math.round(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onCheckout(0)}
                className="w-full py-4 rounded-full bg-[#0f172a] hover:bg-[#0ea5e9] text-white text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#22c55e]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
