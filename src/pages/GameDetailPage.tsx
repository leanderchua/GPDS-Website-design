import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  Check, 
  Zap, 
  CreditCard, 
  Star, 
  AlertCircle, 
  X, 
  ArrowRight,
  Info,
  Sparkles,
  Smartphone,
  Bookmark
} from 'lucide-react';
import { GAMES, PAYMENT_METHODS, VOUCHERS } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { assetUrl } from '../utils/assets';
import { PaymentModal } from '../components/topup/PaymentModal';
import { DenominationItem, PaymentMethod } from '../types';

export const GameDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();

  const slug = params.gameId || 'mobile-legends';
  const game = GAMES.find(g => g.slug === slug) || GAMES[0];

  // Top-Up Form State
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [selectedItem, setSelectedItem] = useState<DenominationItem>(
    game.denominations.find(d => d.isPopular) || game.denominations[0]
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountPhp: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  // UI state
  const [selectedItemTab, setSelectedItemTab] = useState<'All' | 'Passes' | 'Diamonds'>('All');
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<string>('All');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [formError, setFormError] = useState('');

  // Auto-fill saved accounts if user has one for this game
  useEffect(() => {
    if (user) {
      const match = user.savedAccounts.find(a => a.gameId === game.slug || a.gameId === game.id);
      if (match) {
        setUserId(match.userId);
        if (match.serverId) setServerId(match.serverId);
      }
    }
  }, [game, user]);

  // When game changes, reset default denomination
  useEffect(() => {
    setSelectedItem(game.denominations.find(d => d.isPopular) || game.denominations[0]);
    setFormError('');
  }, [game]);

  // Filter denominations
  const filteredDenominations = game.denominations.filter(d => {
    if (selectedItemTab === 'All') return true;
    if (selectedItemTab === 'Passes') return d.category === 'Passes';
    if (selectedItemTab === 'Diamonds') return d.category === 'Diamonds';
    return true;
  });

  // Filter payment methods
  const filteredPaymentMethods = PAYMENT_METHODS.filter(p => {
    if (selectedPaymentCategory === 'All') return true;
    return p.category === selectedPaymentCategory;
  });

  // Apply voucher calculation
  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCodeInput.trim()) return;

    const voucher = VOUCHERS.find(
      v => v.code.toUpperCase() === promoCodeInput.trim().toUpperCase()
    );

    if (!voucher) {
      setPromoError('Invalid promo code. Check code or try GPDSFIRST50');
      return;
    }

    if (selectedItem.pricePhp < voucher.minSpendPhp) {
      setPromoError(`Requires minimum purchase of ${formatPrice(voucher.minSpendPhp)}`);
      return;
    }

    let discount = 0;
    if (voucher.discountFixedPhp) {
      discount = voucher.discountFixedPhp;
    } else if (voucher.discountPercent) {
      discount = Math.round((selectedItem.pricePhp * voucher.discountPercent) / 100);
    }

    setAppliedVoucher({
      code: voucher.code,
      discountPhp: discount
    });
  };

  const handleRemovePromo = () => {
    setAppliedVoucher(null);
    setPromoCodeInput('');
    setPromoError('');
  };

  // Calculations
  const subtotal = selectedItem ? selectedItem.pricePhp : 0;
  const discountPhp = appliedVoucher ? appliedVoucher.discountPhp : 0;
  const fee = selectedPayment 
    ? (subtotal * selectedPayment.feePercent) / 100 + selectedPayment.feeFixedPhp 
    : 0;
  const total = Math.max(0, subtotal - discountPhp + fee);

  const handleCheckoutClick = () => {
    setFormError('');

    if (!userId.trim()) {
      setFormError(`Please enter your ${game.idLabel}.`);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    if (game.requiresServerId && !serverId.trim()) {
      setFormError(`Please enter your ${game.serverIdLabel || 'Server ID'}.`);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address to receive your order invoice.');
      return;
    }

    setIsPaymentModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. GAME HEADER BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-brand-cardBorder bg-[#141026]">
        {/* Banner background with overlay */}
        <div className="absolute inset-0 h-48 sm:h-56">
          <img
            src={game.bannerImage}
            alt={game.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = assetUrl('/steam-deck.jpg');
            }}
            className="w-full h-full object-cover opacity-35 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141026] via-[#141026]/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8 pt-20 sm:pt-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <img
              src={game.image}
              alt={game.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = assetUrl('/steam-wallet-card.svg');
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-brand-gold shadow-2xl shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-brand-gold/15 text-brand-gold text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-brand-gold/30">
                  {game.category}
                </span>
                <span className="bg-green-500/15 text-green-400 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {game.deliveryTime}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                  <strong className="text-white">{game.rating}</strong> ({game.reviewsCount.toLocaleString()} reviews)
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-display font-black text-white">
                {game.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                {game.description}
              </p>
            </div>
          </div>

          {/* Quick Support Badge */}
          <div className="hidden lg:flex items-center gap-3 p-3 rounded-2xl bg-brand-card/90 border border-brand-cardBorder shrink-0 text-xs">
            <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">Direct Server API</div>
              <div className="text-gray-400 text-[11px]">No game login required</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN 4-STEP WIZARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: Steps 1, 2, 3, 4 */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* STEP 1: ACCOUNT DETAILS */}
          <div className="p-6 sm:p-7 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-gold text-brand-dark font-display font-black text-sm flex items-center justify-center shadow-gold-glow">
                  1
                </div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                  Enter Account Information
                </h2>
              </div>

              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-goldLight font-bold underline transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>How to find ID?</span>
              </button>
            </div>

            {/* Saved Accounts Autofill Chips (if logged in) */}
            {user && user.savedAccounts.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-brand-gold" /> Saved Gamer IDs (Click to Autofill):
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.savedAccounts.map(acc => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setUserId(acc.userId);
                        if (acc.serverId) setServerId(acc.serverId);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-brand-cardLight hover:bg-brand-gold/20 border border-brand-cardBorder hover:border-brand-gold/50 text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                    >
                      <span className="text-brand-gold font-bold">{acc.nickname}</span>
                      <span className="text-gray-400">({acc.userId}{acc.serverId ? ` - ${acc.serverId}` : ''})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  {game.idLabel} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder={game.idPlaceholder}
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-gray-500 outline-none transition-all"
                />
              </div>

              {game.requiresServerId && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    {game.serverIdLabel || 'Zone ID'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={game.serverIdPlaceholder || 'e.g. 1234'}
                    value={serverId}
                    onChange={e => setServerId(e.target.value)}
                    className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-gray-500 outline-none transition-all"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 bg-brand-gold/5 p-3 rounded-xl border border-brand-gold/15">
              <Info className="w-4 h-4 text-brand-gold shrink-0" />
              <span>
                Make sure your {game.idLabel} is accurate. Top-ups are delivered automatically within 1 to 5 minutes upon checkout.
              </span>
            </div>
          </div>

          {/* STEP 2: SELECT DENOMINATION */}
          <div className="p-6 sm:p-7 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-gold text-brand-dark font-display font-black text-sm flex items-center justify-center shadow-gold-glow">
                  2
                </div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                  Select Item / Diamond Denomination
                </h2>
              </div>

              {/* Sub-tabs for denominations */}
              <div className="flex items-center gap-1 bg-[#0E0A1C] p-1 rounded-xl border border-brand-cardBorder self-start sm:self-auto">
                {(['All', 'Passes', 'Diamonds'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSelectedItemTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedItemTab === tab
                        ? 'bg-brand-gold text-brand-dark font-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Denomination Tiles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {filteredDenominations.map(denom => {
                const isSelected = selectedItem?.id === denom.id;
                return (
                  <div
                    key={denom.id}
                    onClick={() => setSelectedItem(denom)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-brand-gold/10 border-brand-gold shadow-gold-glow scale-[1.02]'
                        : 'bg-[#181329] border-brand-cardBorder hover:border-brand-gold/40 hover:bg-[#1D1733]'
                    }`}
                  >
                    {denom.isPopular && (
                      <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-dark font-display font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Best Value
                      </span>
                    )}

                    <div>
                      <h4 className="font-display font-bold text-sm sm:text-base text-white leading-tight">
                        {denom.name}
                      </h4>
                      {denom.bonus && denom.bonus > 0 ? (
                        <span className="inline-block mt-1 text-[11px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.2 rounded border border-green-500/20">
                          +{denom.bonus} Bonus Diamonds
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 pt-3 border-t border-brand-cardBorder/60 flex items-baseline justify-between">
                      <span className="text-base sm:text-lg font-display font-black text-brand-gold">
                        {formatPrice(denom.pricePhp)}
                      </span>
                      {denom.originalPricePhp && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(denom.originalPricePhp)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="p-6 sm:p-7 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-gold text-brand-dark font-display font-black text-sm flex items-center justify-center shadow-gold-glow">
                  3
                </div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                  Select Payment Method
                </h2>
              </div>

              {/* Payment filter tabs */}
              <div className="flex items-center gap-1 bg-[#0E0A1C] p-1 rounded-xl border border-brand-cardBorder overflow-x-auto self-start sm:self-auto scrollbar-none">
                {['All', 'E-Wallet', 'Bank Transfer / QR', 'Cards', 'Global / Crypto'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPaymentCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      selectedPaymentCategory === cat
                        ? 'bg-brand-gold text-brand-dark font-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.replace('Bank Transfer / QR', 'QRPH')}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPaymentMethods.map(pm => {
                const isSelected = selectedPayment?.id === pm.id;
                const methodFee = (subtotal * pm.feePercent) / 100 + pm.feeFixedPhp;
                const netPrice = Math.max(0, subtotal - discountPhp + methodFee);

                return (
                  <div
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-brand-gold/10 border-brand-gold shadow-gold-glow'
                        : 'bg-[#181329] border-brand-cardBorder hover:border-brand-gold/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: pm.color }}
                      >
                        {pm.id === 'gcash' ? 'GCash' : pm.id === 'maya' ? 'Maya' : pm.id === 'qrph' ? 'QRPH' : pm.name.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{pm.name}</h4>
                          {pm.badge && (
                            <span className="text-[9px] font-extrabold text-brand-gold bg-brand-gold/15 px-1.5 py-0.2 rounded border border-brand-gold/30">
                              {pm.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Fee: {pm.feePercent}% {pm.feeFixedPhp > 0 ? `+ ₱${pm.feeFixedPhp}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display font-black text-sm text-white">
                        {formatPrice(netPrice)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: CONTACT & VOUCHER CODE */}
          <div className="p-6 sm:p-7 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-gold text-brand-dark font-display font-black text-sm flex items-center justify-center shadow-gold-glow">
                4
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                Receipt Delivery & Promo Code
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Email Address (for Invoice & Receipt) <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. gamer@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Mobile Number (Optional for SMS receipt)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 09171234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none"
                />
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-brand-cardBorder">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Have a Promo or Streamer Code?
              </label>

              {appliedVoucher ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-xs">
                  <div className="flex items-center gap-2 text-green-400 font-bold">
                    <Check className="w-4 h-4" />
                    <span>Code applied: <strong>{appliedVoucher.code}</strong> (-{formatPrice(appliedVoucher.discountPhp)})</span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-red-400 hover:underline font-semibold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. GPDSFIRST50)"
                    value={promoCodeInput}
                    onChange={e => setPromoCodeInput(e.target.value)}
                    className="grow bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono placeholder-gray-500 outline-none"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-extrabold text-xs uppercase tracking-wider hover:opacity-95 shadow-gold-glow transition-all shrink-0"
                  >
                    Apply Code
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {promoError}
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Sticky Order Summary Card */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#1C1733] to-[#120E22] border border-brand-gold/40 shadow-2xl space-y-5">
            <h3 className="font-display font-bold text-lg text-white border-b border-brand-cardBorder pb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-gold" /> Order Summary
            </h3>

            {/* Summary Details */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-gray-300">
                <span>Game</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <img src={game.image} alt={game.name} className="w-4 h-4 rounded" />
                  {game.name}
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span>Selected Pack</span>
                <span className="font-bold text-brand-gold">{selectedItem.name}</span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span>Target UID</span>
                <span className="font-mono font-bold text-white">
                  {userId ? `${userId}${serverId ? ` (${serverId})` : ''}` : 'Not entered yet'}
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span>Payment</span>
                <span className="font-semibold text-white">{selectedPayment.name}</span>
              </div>

              <div className="pt-3 border-t border-brand-cardBorder space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discountPhp > 0 && (
                  <div className="flex justify-between text-green-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(discountPhp)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Payment Gateway Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>

                <div className="pt-2 border-t border-brand-cardBorder flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total Amount</span>
                  <span className="text-xl font-display font-black text-brand-gold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-gold text-brand-dark font-display font-black text-sm uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Buy Now • {formatPrice(total)}
            </button>

            <div className="text-[11px] text-center text-gray-400 space-y-1">
              <p className="flex items-center justify-center gap-1 text-green-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Satisfaction & 10x Money-Back Guarantee
              </p>
              <p>Delivered automatically in 1 to 5 minutes.</p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. INTERACTIVE HOW-TO-FIND-UID MODAL */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#151125] border border-brand-gold/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-brand-cardBorder">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-gold" /> {game.guideTitle}
              </h3>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-gray-300">
              {game.guideInstructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-brand-card border border-brand-cardBorder">
                  <div className="w-6 h-6 rounded-lg bg-brand-gold/20 text-brand-gold font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-xs text-brand-gold font-medium">
              💡 Tip: Once you order, we save your UID to your GPDS Gamer Dashboard for 1-click automatic top-ups next time!
            </div>

            <button
              onClick={() => setIsGuideOpen(false)}
              className="w-full py-3 bg-brand-gold text-brand-dark font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-gold-glow"
            >
              Got it, continue order
            </button>
          </div>
        </div>
      )}

      {/* 4. PAYMENT CHECKOUT MODAL */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        game={game}
        item={selectedItem}
        paymentMethod={selectedPayment}
        userId={userId}
        serverId={serverId}
        email={email}
        phone={phone}
        discountPhp={discountPhp}
        promoCode={appliedVoucher?.code}
      />

    </div>
  );
};
