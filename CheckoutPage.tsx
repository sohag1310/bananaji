import React, { useState, useEffect } from 'react';
import { CartItem, Order, UserProfile, ShippingDetails } from '../types';
import { 
  Banana, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  ArrowRight, 
  ArrowLeft,
  ShoppingBag, 
  Loader2,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Lock,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { saveOrderToFirebase } from '../lib/dbService';
import { User as FirebaseUser } from 'firebase/auth';

interface CheckoutPageProps {
  items: CartItem[];
  currentUser?: FirebaseUser | null;
  userProfile?: UserProfile | null;
  onOrderComplete: (order: Order) => void;
  onBackToHome: () => void;
}

// Popular Cities/Districts in Bangladesh
const BANGLADESH_CITIES = [
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
  'Cumilla',
  'Gazipur',
  'Narayanganj',
  'Bogra',
  'Cox\'s Bazar',
  'Other / Outside City'
];

// Predefined Zones mapped by City for direct selection
const CITY_ZONES: Record<string, string[]> = {
  'Dhaka': [
    'Uttara',
    'Gulshan 1',
    'Gulshan 2',
    'Banani',
    'Dhanmondi',
    'Mirpur (1-14)',
    'Mohakhali / DOHS',
    'Bashundhara R/A',
    'Baridhara / DOHS',
    'Badda / Rampura',
    'Motijheel / Dilkusha',
    'Mohammadpur',
    'Lalmatia',
    'Tejgaon / Farmgate',
    'Paltan / Shantinagar',
    'Khilgaon / Malibagh',
    'Old Dhaka (Puran Dhaka)',
    'Jatrabari',
    'Savar',
    'Keraniganj',
    'Other / Custom Zone'
  ],
  'Chattogram': [
    'Agrabad C/A',
    'GEC Circle / Nasirabad',
    'Panchlaish / OR Nizam Rd',
    'Halishahar',
    'Chawkbazar',
    'Khulshi / DOHS',
    'Kotwali / Anderkilla',
    'Muradpur / Bahaddarhat',
    'Patenga / Airport Area',
    'Other / Custom Zone'
  ],
  'Sylhet': [
    'Zindabazar',
    'Amberkhana',
    'Shibganj',
    'Uposhohor',
    'Kumarpara',
    'Subidbazar',
    'Mira Bazar',
    'Other / Custom Zone'
  ],
  'Rajshahi': [
    'Shaheb Bazar',
    'Motihar / RU Area',
    'Kazihata',
    'Boalia',
    'Laxmipur',
    'Other / Custom Zone'
  ],
  'Khulna': [
    'Shibbari',
    'Sonadanga',
    'Daulatpur',
    'Boyra',
    'Khalishpur',
    'Other / Custom Zone'
  ],
  'Barishal': [
    'Sadullapur',
    'Natun Bazar',
    'Band Road',
    'Rupatali',
    'Other / Custom Zone'
  ],
  'Rangpur': [
    'Dhap',
    'Jahaj Company Mor',
    'Modern Mor',
    'Radhaballav',
    'Other / Custom Zone'
  ],
  'Mymensingh': [
    'Town Hall / Ganginar Par',
    'Charpara',
    'Kashor',
    'Other / Custom Zone'
  ],
  'Cumilla': [
    'Kandirpar',
    'Badurtala',
    'Shashongachha',
    'Other / Custom Zone'
  ],
  'Gazipur': [
    'Gazipur Chowrasta',
    'Tongi',
    'Board Bazar',
    'Konabari',
    'Other / Custom Zone'
  ],
  'Narayanganj': [
    'Chashara',
    '2 No Rail Gate',
    'Fatullah',
    'Siddhirganj',
    'Other / Custom Zone'
  ],
  'Bogra': [
    'Sathmatha',
    'Thonthonia',
    'Jaleshwaritola',
    'Other / Custom Zone'
  ],
  'Cox\'s Bazar': [
    'Kolatoli',
    'Laboni Beach Road',
    'Main Town / Jhawtala',
    'Other / Custom Zone'
  ]
};

const DEFAULT_ZONES = [
  'Central Area',
  'North Zone',
  'South Zone',
  'East Zone',
  'West Zone',
  'Suburban Area',
  'Other / Custom Zone'
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  currentUser,
  userProfile,
  onOrderComplete,
  onBackToHome,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer & Shipping Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [customCity, setCustomCity] = useState('');
  const [selectedZone, setSelectedZone] = useState('Uttara');
  const [customZone, setCustomZone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bkash' | 'nagad'>('cash_on_delivery');

  // Mobile Payment Deep Linking & Verification State
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [deepLinkTriggered, setDeepLinkTriggered] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [hasCompletedPaymentIntent, setHasCompletedPaymentIntent] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Mobile Gateways Configuration
  const MOBILE_GATEWAYS = {
    bkash: {
      name: 'bKash',
      color: '#e2136e',
      badgeBg: 'bg-pink-100 text-pink-800 border-pink-200',
      headerGradient: 'from-[#e2136e] to-[#be0e5c]',
      boxBg: 'bg-pink-50/70 border-pink-200/90',
      accentText: 'text-[#e2136e]',
      number: '01700-123456',
      rawNumber: '01700123456',
      accountType: 'Personal / Merchant Wallet',
      reference: 'BANANAJI',
      appScheme: 'bkash://',
      appStoreUrl: 'https://apps.apple.com/app/bkash/id1439246187',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.bKash.customerapp',
      ussdCode: '*247#',
      intentPackage: 'com.bKash.customerapp'
    },
    nagad: {
      name: 'Nagad',
      color: '#ea580c',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
      headerGradient: 'from-[#f97316] to-[#ea580c]',
      boxBg: 'bg-orange-50/70 border-orange-200/90',
      accentText: 'text-[#ea580c]',
      number: '01800-654321',
      rawNumber: '01800654321',
      accountType: 'Personal / Merchant Wallet',
      reference: 'BANANAJI',
      appScheme: 'nagad://',
      appStoreUrl: 'https://apps.apple.com/app/nagad/id1471844874',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.konasl.nagad',
      ussdCode: '*167#',
      intentPackage: 'com.konasl.nagad'
    }
  };

  // Pre-fill user data if authenticated
  useEffect(() => {
    setStep('form');
    setIsSubmitting(false);
    setErrors({});

    if (userProfile || currentUser) {
      if (!fullName) {
        setFullName(userProfile?.displayName || currentUser?.displayName || '');
      }
      if (!email) {
        setEmail(userProfile?.email || currentUser?.email || '');
      }
      if (!phone) {
        setPhone(userProfile?.phoneNumber || currentUser?.phoneNumber || '');
      }
    }
  }, [currentUser, userProfile]);

  // Keep senderNumber in sync with phone if empty
  useEffect(() => {
    if (!senderNumber && phone) {
      setSenderNumber(phone);
    }
  }, [phone]);

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(label);
        setTimeout(() => setCopiedField(null), 2500);
      }).catch(() => {
        fallbackCopyText(text, label);
      });
    } else {
      fallbackCopyText(text, label);
    }
  };

  const fallbackCopyText = (text: string, label: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
  };

  // Paste TrxID helper
  const handlePasteTrxId = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setTransactionId(text.trim().toUpperCase());
          if (errors.transactionId) setErrors(prev => ({ ...prev, transactionId: '' }));
        }
      }
    } catch (err) {
      console.error('Clipboard paste failed:', err);
    }
  };

  // 1-Click Deep Link Handler
  const handleTriggerDeepLink = (gatewayKey: 'bkash' | 'nagad') => {
    const gw = MOBILE_GATEWAYS[gatewayKey];
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    setHasCompletedPaymentIntent(true);
    setDeepLinkTriggered(true);

    if (isMobile) {
      setIsRedirecting(true);

      const ref = 'BANANAJI';
      const payableAmount = Math.round(grandTotal);
      
      // Preferred scheme
      let deepLinkUri = `${gw.appScheme}payment?receiver=${gw.rawNumber}&amount=${payableAmount}&ref=${ref}`;
      if (gatewayKey === 'nagad') {
        deepLinkUri = `${gw.appScheme}sendmoney?account=${gw.rawNumber}&amount=${payableAmount}&ref=${ref}`;
      }

      // Android Intent Fallback
      if (isAndroid) {
        const intentUrl = `intent://payment?receiver=${gw.rawNumber}&amount=${payableAmount}&ref=${ref}#Intent;package=${gw.intentPackage};scheme=${gatewayKey};end;`;
        // Navigate
        window.location.href = intentUrl;
      } else {
        window.location.href = deepLinkUri;
      }

      // Graceful timeout to stop redirect spinner if user is still in browser
      setTimeout(() => {
        setIsRedirecting(false);
      }, 3000);
    } else {
      // Desktop user: open manual guidance and copy ready
      setShowManualGuide(true);
    }
  };

  // Update zone options default when city changes
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
    
    const availableZones = CITY_ZONES[newCity] || DEFAULT_ZONES;
    if (availableZones && availableZones.length > 0) {
      setSelectedZone(availableZones[0]);
    } else {
      setSelectedZone('Other / Custom Zone');
    }
    setCustomZone('');
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 60;
  const grandTotal = subtotal + deliveryFee;
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const currentZoneList = CITY_ZONES[city] || DEFAULT_ZONES;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required for delivery contact.';
    } else {
      const cleanPhone = phone.replace(/[\s-]/g, '');
      if (cleanPhone.length < 8) {
        newErrors.phone = 'Please provide a valid contact number.';
      }
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required for order receipts.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!address.trim()) {
      newErrors.address = 'Street / House / Delivery address is required.';
    }

    const effectiveCity = city === 'Other / Outside City' ? customCity.trim() : city;
    if (!effectiveCity) {
      newErrors.city = 'Please specify your City or District.';
    }

    const effectiveZone = selectedZone === 'Other / Custom Zone' ? customZone.trim() : selectedZone;
    if (!effectiveZone) {
      newErrors.zone = 'Please select or enter your delivery Zone / Area.';
    }

    // For bKash and Nagad payment validation
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      if (!senderNumber.trim()) {
        newErrors.senderNumber = `Please provide the ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} sender number.`;
      }
      if (!transactionId.trim()) {
        newErrors.transactionId = 'Transaction ID (TrxID) is required to verify your mobile payment.';
      } else if (transactionId.trim().length < 4) {
        newErrors.transactionId = 'Please enter a valid Transaction ID (TrxID).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    if (items.length === 0) {
      alert('Your cart has no items to order. Please add products before placing an order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const effectiveCity = city === 'Other / Outside City' ? (customCity.trim() || 'Other') : city;
      const effectiveZone = selectedZone === 'Other / Custom Zone' ? (customZone.trim() || 'General Area') : selectedZone;
      
      const shippingAddress: ShippingDetails = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: effectiveCity,
        zone: effectiveZone,
        zipCode: zipCode.trim() || undefined,
      };

      const orderId = `BJ-${Math.floor(100000 + Math.random() * 900000)}`;
      const estDate = new Date(Date.now() + 86400000 * 2);
      const estDateStr = estDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const isMobilePayment = paymentMethod === 'bkash' || paymentMethod === 'nagad';
      const cleanTrxId = transactionId.trim().toUpperCase() || undefined;
      const cleanSender = senderNumber.trim() || phone.trim() || undefined;

      const newOrder: Order = {
        id: orderId,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        items: [...items],
        subtotal,
        deliveryFee,
        total: grandTotal,
        paymentMethod,
        paymentStatus: isMobilePayment ? 'Pending Verification' : 'Pending',
        status: 'Harvesting',
        transactionId: cleanTrxId,
        senderNumber: cleanSender,
        shippingAddress,
        estimatedDelivery: estDateStr,
        userId: currentUser?.uid || undefined
      };

      // Record manual verification to backend endpoint if mobile payment
      if (isMobilePayment && cleanTrxId) {
        try {
          await fetch('/api/payments/verify-manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              gateway: paymentMethod,
              senderNumber: cleanSender,
              transactionId: cleanTrxId,
              amount: grandTotal
            })
          });
        } catch (apiErr) {
          console.warn('Backend payment log note:', apiErr);
        }
      }

      // Save to Firebase Firestore
      await saveOrderToFirebase(newOrder);

      setCompletedOrder(newOrder);
      onOrderComplete(newOrder);
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Something went wrong placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS / CONFIRMATION FULL PAGE
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#f0f9ff] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Success Banner Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md text-center space-y-6">
            <div className="w-20 h-20 bg-[#22c55e]/15 text-[#22c55e] rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border border-[#22c55e]/30 animate-bounce">
              🍌
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3.5 py-1 bg-[#22c55e]/10 text-[#22c55e] rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Order Placed Successfully
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#0f172a]">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                Your order has been recorded. Our highland growers are preparing your fresh green harvest. We'll keep you updated via phone and email.
              </p>
            </div>

            {/* Receipt Details Box */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-5 sm:p-6 text-left text-xs sm:text-sm space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold block">Order Number</span>
                  <span className="font-mono text-lg sm:text-xl font-bold text-[#0f172a]">{completedOrder?.id}</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold block">Estimated Delivery</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {completedOrder?.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#0ea5e9]">
                  <Truck className="w-4 h-4" /> Shipping Destination
                </div>
                <p className="font-bold text-slate-800 text-sm">{completedOrder?.shippingAddress.fullName}</p>
                <p className="text-slate-600">📞 {completedOrder?.shippingAddress.phone} • ✉️ {completedOrder?.shippingAddress.email}</p>
                <p className="text-slate-700 font-medium">📍 {completedOrder?.shippingAddress.address}, {completedOrder?.shippingAddress.zone}, {completedOrder?.shippingAddress.city} {completedOrder?.shippingAddress.zipCode ? `(${completedOrder?.shippingAddress.zipCode})` : ''}</p>
              </div>

              {/* Ordered Items Breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold block">Ordered Harvest</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {completedOrder?.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200/70">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-200 shrink-0" 
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{item.product.name}</p>
                          <p className="text-[11px] text-slate-500">{item.quantity} × ৳{Math.round(item.product.price)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        ৳{Math.round(item.product.price * item.quantity).toLocaleString('en-US')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary of Payment */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 flex-wrap">
                    <span>Payment Method:</span>
                    {completedOrder?.paymentMethod === 'cash_on_delivery' && (
                      <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        💵 Cash on Delivery
                      </span>
                    )}
                    {completedOrder?.paymentMethod === 'bkash' && (
                      <span className="font-bold text-pink-700 bg-pink-100/80 px-2 py-0.5 rounded-md">
                        📱 bKash Mobile Wallet
                      </span>
                    )}
                    {completedOrder?.paymentMethod === 'nagad' && (
                      <span className="font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-md">
                        📱 Nagad Mobile Wallet
                      </span>
                    )}
                    {completedOrder?.paymentMethod === 'card' && (
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        💳 Debit / Credit Card
                      </span>
                    )}

                    {completedOrder?.paymentStatus === 'Pending Verification' && (
                      <span className="font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Verification
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 mr-2">Grand Total:</span>
                    <span className="text-xl sm:text-2xl font-serif font-black text-[#22c55e]">
                      ৳{Math.round(completedOrder?.total || 0).toLocaleString('en-US')}
                    </span>
                  </div>
                </div>

                {/* Mobile Payment TrxID & Sender Details */}
                {(completedOrder?.paymentMethod === 'bkash' || completedOrder?.paymentMethod === 'nagad') && (
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {completedOrder?.senderNumber && (
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Sender Number</span>
                          <span className="font-mono font-bold text-slate-800">{completedOrder.senderNumber}</span>
                        </div>
                      )}
                      {completedOrder?.transactionId && (
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Transaction ID (TrxID)</span>
                          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                            {completedOrder.transactionId}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Our desk is cross-checking your TrxID with the telecom gateway.
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Back to Home Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#0f172a] hover:bg-[#0ea5e9] text-white text-xs sm:text-sm uppercase tracking-wider font-bold rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Return to Shop Catalog
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // FULL PAGE CHECKOUT & DELIVERY FORM
  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#0f172a] font-sans pb-16">
      
      {/* Top Breadcrumb Header Bar */}
      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200/80 pb-3">
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
              Shop Catalog
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-[#0ea5e9] font-bold">
              Customer & Delivery Information
            </span>
          </nav>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-[#0ea5e9] text-xs font-semibold text-slate-700 hover:text-[#0ea5e9] transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </button>
        </div>
      </div>

      {/* Main Full-Page Layout Container */}
      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        
        {/* Page Title & Trust Badges */}
        <div className="mb-6">
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#0f172a]">
            Customer & Delivery Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Please fill in your delivery destination and contact details to receive fresh farm-direct bananas.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-xl mx-auto my-8">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
            <h2 className="text-xl font-serif font-bold text-slate-800">Your Cart is Currently Empty</h2>
            <p className="text-xs text-slate-500">Add some fresh bananas or artisanal products to proceed with checkout.</p>
            <button
              type="button"
              onClick={onBackToHome}
              className="px-6 py-2.5 bg-[#0ea5e9] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#0284c7] transition-all cursor-pointer"
            >
              Browse Shop
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* LEFT COLUMN: Customer, Shipping & Payment Form (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* SECTION 1: Customer Contact Information */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-serif font-bold text-slate-900">
                      Customer Contact Information
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      We'll use these details to contact you regarding delivery confirmation.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                        }}
                        placeholder="e.g. Alex Rahman"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                          errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        } rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all`}
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                          }}
                          placeholder="017XXXXXXXX or +8801..."
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                            errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                          } rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all`}
                        />
                      </div>
                      {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                          }}
                          placeholder="customer@example.com"
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                            errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                          } rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all`}
                        />
                      </div>
                      {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Shipping & Delivery Address */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-serif font-bold text-slate-900">
                      Shipping & Delivery Destination
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Where should our courier team deliver your order?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Street / House Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Street Address / House / Flat / Road <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                        }}
                        placeholder="e.g. House 42, Road 11, Block D"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                          errors.address ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        } rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all`}
                      />
                    </div>
                    {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
                  </div>

                  {/* City, Direct Zone Selection & ZIP Code Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* City / District */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        City / District <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all cursor-pointer"
                      >
                        {BANGLADESH_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {city === 'Other / Outside City' && (
                        <input
                          type="text"
                          placeholder="Type City name"
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
                          className="w-full mt-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-[#0ea5e9]"
                        />
                      )}
                      {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    {/* Zone Direct Selection Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Select Zone / Area <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedZone}
                        onChange={(e) => {
                          setSelectedZone(e.target.value);
                          if (errors.zone) setErrors(prev => ({ ...prev, zone: '' }));
                        }}
                        className={`w-full px-3.5 py-3 bg-slate-50 border ${
                          errors.zone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        } rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all cursor-pointer`}
                      >
                        {currentZoneList.map((z) => (
                          <option key={z} value={z}>{z}</option>
                        ))}
                      </select>
                      {selectedZone === 'Other / Custom Zone' && (
                        <input
                          type="text"
                          placeholder="Type your Zone / Area name"
                          value={customZone}
                          onChange={(e) => {
                            setCustomZone(e.target.value);
                            if (errors.zone) setErrors(prev => ({ ...prev, zone: '' }));
                          }}
                          className="w-full mt-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-[#0ea5e9]"
                        />
                      )}
                      {errors.zone && <p className="text-[11px] text-red-500 mt-1">{errors.zone}</p>}
                    </div>

                    {/* Postal / Zip Code Field */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Postal / ZIP Code
                      </label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="e.g. 1230"
                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Payment Method Selection */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-serif font-bold text-slate-900">
                      Payment Method & Gateway
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Select your preferred payment channel. 1-Click App Redirection is available for bKash & Nagad.
                    </p>
                  </div>
                </div>

                {/* Payment Option Radio Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  
                  {/* OPTION 1: Cash on Delivery */}
                  <label 
                    className={`flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-[#22c55e] bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={() => setPaymentMethod('cash_on_delivery')}
                        className="mt-0.5 text-[#22c55e] focus:ring-[#22c55e]"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                          <Banknote className="w-4 h-4 text-[#22c55e]" />
                          <span>Cash on Delivery</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Pay cash upon receiving harvest at your doorstep.
                        </p>
                      </div>
                    </div>
                    <span className="self-start text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full mt-1">
                      Cash Payment
                    </span>
                  </label>

                  {/* OPTION 2: bKash (1-Click App Redirection) */}
                  <label 
                    className={`flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-[#e2136e] bg-pink-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="mt-0.5 text-[#e2136e] focus:ring-[#e2136e]"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                          <Smartphone className="w-4 h-4 text-[#e2136e]" />
                          <span className="text-[#e2136e]">bKash App</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          1-Click Deep Link directly to bKash Mobile App.
                        </p>
                      </div>
                    </div>
                    <span className="self-start text-[10px] font-bold text-pink-700 bg-pink-100/80 px-2 py-0.5 rounded-full mt-1">
                      ⚡ 1-Click App
                    </span>
                  </label>

                  {/* OPTION 3: Nagad (1-Click App Redirection) */}
                  <label 
                    className={`flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'nagad'
                        ? 'border-[#f97316] bg-orange-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="mt-0.5 text-[#f97316] focus:ring-[#f97316]"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                          <Smartphone className="w-4 h-4 text-[#f97316]" />
                          <span className="text-[#ea580c]">Nagad App</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          1-Click Deep Link directly to Nagad Mobile App.
                        </p>
                      </div>
                    </div>
                    <span className="self-start text-[10px] font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full mt-1">
                      ⚡ 1-Click App
                    </span>
                  </label>

                  {/* OPTION 4: Debit & Credit Card (DISABLED / BLACK & WHITE / COMING SOON) */}
                  <div 
                    className="flex flex-col justify-between p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-100/70 grayscale opacity-65 cursor-not-allowed select-none relative overflow-hidden"
                    title="Debit & Credit Card payments are currently being integrated and will be available soon."
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        disabled
                        checked={false}
                        className="mt-0.5 text-slate-400 cursor-not-allowed"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700">
                            <CreditCard className="w-4 h-4 text-slate-600" />
                            <span>Card</span>
                          </div>
                          <span className="text-[9px] uppercase tracking-wider font-extrabold bg-slate-800 text-white px-2 py-0.5 rounded-full">
                            Coming Soon
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Visa, Mastercard, Amex
                        </p>
                      </div>
                    </div>
                    <span className="self-start text-[9px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full mt-1">
                      Inactive
                    </span>
                  </div>

                </div>

                {/* ------------------------------------------------------------- */}
                {/* 1. CASH ON DELIVERY DETAILS                                   */}
                {/* ------------------------------------------------------------- */}
                {paymentMethod === 'cash_on_delivery' && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-3 animate-fadeIn">
                    <Banknote className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-0.5">Cash on Delivery Active</p>
                      <p className="text-emerald-800 text-[11px] leading-relaxed">
                        Please keep <strong className="font-bold text-emerald-950">৳{Math.round(grandTotal).toLocaleString('en-US')}</strong> ready in cash to hand to our courier executive when your order arrives.
                      </p>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 2. bKash / Nagad 1-CLICK APP REDIRECTION & VERIFICATION CARD  */}
                {/* ------------------------------------------------------------- */}
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 animate-fadeIn ${MOBILE_GATEWAYS[paymentMethod].boxBg}`}>
                    
                    {/* Gateway Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${MOBILE_GATEWAYS[paymentMethod].headerGradient} shadow-sm`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif font-black text-slate-900 text-sm sm:text-base">
                              {MOBILE_GATEWAYS[paymentMethod].name} 1-Click Mobile App Checkout
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${MOBILE_GATEWAYS[paymentMethod].badgeBg}`}>
                              Official Number
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Pre-fills our recipient number & payable total for instant authorization.
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Exact Payable Amount</span>
                        <span className="text-base sm:text-lg font-serif font-black text-[#0f172a]">
                          ৳{Math.round(grandTotal).toLocaleString('en-US')}
                        </span>
                      </div>
                    </div>

                    {/* Gateway Recipient & Amount Quick-Copy Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      
                      {/* Recipient Number */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Recipient Number
                          </span>
                          <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                            {MOBILE_GATEWAYS[paymentMethod].number}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(MOBILE_GATEWAYS[paymentMethod].rawNumber, 'number')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedField === 'number' ? (
                            <>
                              <Check className="w-3 h-3 text-[#22c55e]" />
                              <span className="text-[#22c55e]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Exact Amount */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Exact Amount (BDT)
                          </span>
                          <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                            ৳{Math.round(grandTotal)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(String(Math.round(grandTotal)), 'amount')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedField === 'amount' ? (
                            <>
                              <Check className="w-3 h-3 text-[#22c55e]" />
                              <span className="text-[#22c55e]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Reference Code */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Reference Code
                          </span>
                          <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                            {MOBILE_GATEWAYS[paymentMethod].reference}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(MOBILE_GATEWAYS[paymentMethod].reference, 'ref')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedField === 'ref' ? (
                            <>
                              <Check className="w-3 h-3 text-[#22c55e]" />
                              <span className="text-[#22c55e]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                    {/* Prominent 1-Click Mobile App Deep Link Button */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleTriggerDeepLink(paymentMethod)}
                        disabled={isRedirecting}
                        className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r ${MOBILE_GATEWAYS[paymentMethod].headerGradient} hover:brightness-105 active:scale-[0.99]`}
                      >
                        {isRedirecting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Opening {MOBILE_GATEWAYS[paymentMethod].name} App...</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-4 h-4" />
                            <span>
                              ⚡ Pay with {MOBILE_GATEWAYS[paymentMethod].name} App (৳{Math.round(grandTotal).toLocaleString('en-US')})
                            </span>
                            <ArrowRight className="w-4 h-4 opacity-75" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-500 px-1">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Deep Link directly opens installed app on iOS / Android.
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowManualGuide(!showManualGuide)}
                          className="text-[#0ea5e9] font-bold hover:underline cursor-pointer"
                        >
                          {showManualGuide ? 'Hide Manual Guide' : 'Need USSD / Desktop Instructions?'}
                        </button>
                      </div>
                    </div>

                    {/* Step-by-Step Manual & USSD Fallback Guide */}
                    {showManualGuide && (
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-800">
                          <span>Manual Send Money / USSD Guide</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Dial: {MOBILE_GATEWAYS[paymentMethod].ussdCode}
                          </span>
                        </div>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                          <li>Open your {MOBILE_GATEWAYS[paymentMethod].name} Mobile App or dial <strong className="text-slate-800">{MOBILE_GATEWAYS[paymentMethod].ussdCode}</strong>.</li>
                          <li>Select <strong>Send Money</strong> or <strong>Payment</strong>.</li>
                          <li>Enter Recipient Number: <strong className="font-mono text-slate-900">{MOBILE_GATEWAYS[paymentMethod].number}</strong>.</li>
                          <li>Enter Exact Amount: <strong className="font-mono text-slate-900">৳{Math.round(grandTotal)}</strong>.</li>
                          <li>Enter Reference: <strong className="font-mono text-slate-900">{MOBILE_GATEWAYS[paymentMethod].reference}</strong> and enter your secret PIN to confirm.</li>
                          <li>Copy the <strong>Transaction ID (TrxID)</strong> from your SMS receipt and paste it below.</li>
                        </ol>
                        
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-3 text-[10px] text-slate-500">
                          <span>Don't have the app yet?</span>
                          <a 
                            href={MOBILE_GATEWAYS[paymentMethod].playStoreUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#0ea5e9] font-bold hover:underline flex items-center gap-0.5"
                          >
                            Google Play <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <span>•</span>
                          <a 
                            href={MOBILE_GATEWAYS[paymentMethod].appStoreUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#0ea5e9] font-bold hover:underline flex items-center gap-0.5"
                          >
                            App Store <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Post-Payment Verification Inputs ("I Have Completed Payment") */}
                    <div className="pt-4 border-t border-slate-200/80 space-y-4">
                      
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                            Step 2: Confirm Your Payment Reference
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Enter the Sender Phone Number and Transaction ID (TrxID) after completing payment.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Sender Phone Number */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Sender {MOBILE_GATEWAYS[paymentMethod].name} Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              value={senderNumber}
                              onChange={(e) => {
                                setSenderNumber(e.target.value);
                                if (errors.senderNumber) setErrors(prev => ({ ...prev, senderNumber: '' }));
                              }}
                              placeholder="017XXXXXXXX"
                              className={`w-full pl-10 pr-4 py-3 bg-white border ${
                                errors.senderNumber ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                              } rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] transition-all`}
                            />
                          </div>
                          {errors.senderNumber && <p className="text-[11px] text-red-500 mt-1">{errors.senderNumber}</p>}
                        </div>

                        {/* Transaction ID (TrxID) */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold text-slate-700">
                              Transaction ID (TrxID) <span className="text-red-500">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={handlePasteTrxId}
                              className="text-[10px] font-bold text-[#0ea5e9] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-2.5 h-2.5" /> Paste TrxID
                            </button>
                          </div>
                          <div className="relative">
                            <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                            <input
                              type="text"
                              required
                              value={transactionId}
                              onChange={(e) => {
                                setTransactionId(e.target.value.toUpperCase());
                                if (errors.transactionId) setErrors(prev => ({ ...prev, transactionId: '' }));
                              }}
                              placeholder="e.g. BL84K9X2J"
                              className={`w-full pl-10 pr-4 py-3 bg-white border ${
                                errors.transactionId ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                              } rounded-2xl text-xs sm:text-sm text-slate-900 font-mono uppercase tracking-wider focus:outline-none focus:border-[#0ea5e9] transition-all`}
                            />
                          </div>
                          {errors.transactionId && <p className="text-[11px] text-red-500 mt-1">{errors.transactionId}</p>}
                        </div>

                      </div>

                      {/* Status Notice Banner */}
                      <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-200/90 text-[11px] text-amber-900 flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          <strong>Order Status: Pending Verification.</strong> Once placed, our payment desk will verify your TrxID with {MOBILE_GATEWAYS[paymentMethod].name} and immediately pack your fresh harvest.
                        </p>
                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* RIGHT COLUMN: Order Summary & Confirmation CTA (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
              
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="font-serif font-bold text-base text-slate-900">
                    Order Summary
                  </h2>
                  <span className="text-xs bg-[#0ea5e9]/10 text-[#0ea5e9] px-2.5 py-0.5 rounded-full font-bold">
                    {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}
                  </span>
                </div>

                {/* Items List */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between pt-3 first:pt-0">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-12 h-12 rounded-xl object-cover bg-[#f0f9ff] border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[190px]">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Qty: {item.quantity} × ৳{Math.round(item.product.price)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">
                        ৳{Math.round(item.product.price * item.quantity).toLocaleString('en-US')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="pt-4 border-t border-slate-200/80 space-y-2 text-xs sm:text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">৳{Math.round(subtotal).toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery Fee:</span>
                    {deliveryFee === 0 ? (
                      <span className="font-bold text-[#22c55e] text-xs">FREE (Orders &gt; ৳500)</span>
                    ) : (
                      <span className="font-bold text-slate-900">৳{deliveryFee}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Payment Method:</span>
                    {paymentMethod === 'cash_on_delivery' && (
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px]">
                        💵 Cash on Delivery
                      </span>
                    )}
                    {paymentMethod === 'bkash' && (
                      <span className="font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md text-[11px]">
                        📱 bKash
                      </span>
                    )}
                    {paymentMethod === 'nagad' && (
                      <span className="font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md text-[11px]">
                        📱 Nagad
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-baseline text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                    <span>Total Payable:</span>
                    <span className="text-xl sm:text-2xl font-serif font-black text-[#22c55e]">
                      ৳{Math.round(grandTotal).toLocaleString('en-US')}
                    </span>
                  </div>
                </div>

                {/* Confirm & Place Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs sm:text-sm uppercase tracking-wider font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Recording Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Security and Guarantee Badges */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>100% Guaranteed Fresh</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#0ea5e9]" />
                    <span>Safe & Verified</span>
                  </div>
                </div>

              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};
