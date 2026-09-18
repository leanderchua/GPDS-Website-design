import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Clock, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Gamepad2, 
  Ticket, 
  Headphones, 
  Award,
  TrendingUp,
  Percent,
  Copy,
  Check,
  Search,
  Smartphone,
  Gift,
  Tag,
  ArrowUpRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  OFFICIAL_SLIDERS, 
  OFFICIAL_CATEGORIES, 
  OFFICIAL_PRODUCTS, 
  OFFICIAL_BLOGS, 
  OFFICIAL_FAQS,
  OfficialProduct 
} from '../data/officialData';
import { useCurrency } from '../context/CurrencyContext';
import { useRouter, Link } from '../context/RouterContext';
import { EsportsHeroBackground } from '../components/home/EsportsHeroBackground';
import { assetUrl } from '../utils/assets';

export const HomePage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { navigate } = useRouter();

  // Carousel slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Category & search filter
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [gameSearchQuery, setGameSearchQuery] = useState('');

  // Interactive UI states
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<number | null>(OFFICIAL_FAQS[0]?.id || 1);

  // Collapsible section & items states
  const [isGamesOpen, setIsGamesOpen] = useState(true);
  const [isGamesExpanded, setIsGamesExpanded] = useState(false);
  const [isVouchersOpen, setIsVouchersOpen] = useState(true);
  const [isVouchersExpanded, setIsVouchersExpanded] = useState(false);
  const [isFilteredExpanded, setIsFilteredExpanded] = useState(false);

  // Auto-advance hero carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % OFFICIAL_SLIDERS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2200);
  };

  // Filter products by selected category and search query
  const filteredProducts = OFFICIAL_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(gameSearchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(gameSearchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategoryKey === 'all') return true;
    if (selectedCategoryKey === 'trending-games') return product.id % 2 === 0;
    if (selectedCategoryKey === 'new-release') return product.id % 3 === 0;
    if (selectedCategoryKey === 'popular-games') return (product.reviewsCount || 0) > 200;
    if (selectedCategoryKey === 'games') return product.category === 'Games';
    if (selectedCategoryKey === 'voucher') return product.category === 'Voucher' || product.isGiftCard;
    if (selectedCategoryKey === 'others') return product.category === 'Others';
    if (selectedCategoryKey === 'gift-card') return product.isGiftCard;

    return product.category.toLowerCase().includes(selectedCategoryKey.replace('-', ' '));
  });

  // Dedicated popular games vs vouchers split
  const popularGames = OFFICIAL_PRODUCTS.filter(p => !p.isGiftCard && p.category !== 'Voucher' && p.category !== 'Gift Card');
  const voucherProducts = OFFICIAL_PRODUCTS.filter(p => p.isGiftCard || p.category === 'Voucher' || p.category === 'Gift Card');

  const streamerCodes = [
    { code: 'BHADZKI', streamer: 'Angelo Leoncio', discount: '₱50 OFF', role: 'GPDS Founder' },
    { code: 'PROGAMER', streamer: 'ShadowSlayer', discount: '5% OFF', role: 'MLBB Mythical Glory' },
    { code: 'VALOPH', streamer: 'JettCarry', discount: '5% OFF', role: 'Radiant Tier' },
    { code: 'GPDSVIP', streamer: 'Official VIP', discount: 'VIP Reseller Rates', role: 'Reseller Pass' },
  ];

  const renderProductCard = (product: OfficialProduct) => (
    <div
      key={product.id}
      onClick={() => navigate(`/games/${product.slug}`)}
      className="group relative rounded-2xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 p-2.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Image & Discount Badge */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40 mb-2">
        <img
          src={product.picture}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = assetUrl('/steam-wallet-card.svg');
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountTag && (
          <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-red-600/90 text-white font-display font-black text-[9px] uppercase tracking-wider shadow-sm">
            {product.discountTag}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-1 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-brand-cyan uppercase font-semibold tracking-wider block truncate">
            {product.category}
          </span>
          <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-brand-gold transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-brand-cardBorder/50 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-400 block">Starts at</span>
            <span className="text-xs font-black text-brand-gold">
              {formatPrice(product.minPrice)}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[10px] text-yellow-400 font-semibold">
            <Star className="w-3 h-3 fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION & PROMOTIONAL CAROUSEL */}
      <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-14 overflow-hidden bg-transparent">
        {/* Dynamic Moving E-Sports Arena Stage Background */}
        <EsportsHeroBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Official Headline & Lead Copy */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant 1-5 Min Delivery via GCash, Maya & QRPH</span>
              </div>

              {/* Exact H1 & H2 from official site */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight tracking-tight">
                  GPDS Game Shop: <br />
                  <span className="text-gradient-gold">Cheapest Gaming Top Up Philippines</span>
                </h1>
                <h2 className="text-sm sm:text-base font-display font-bold text-brand-goldLight tracking-wide">
                  Instant MLBB Diamonds & Honor of Kings Tokens
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Get the best deals on Mobile Legends diamonds, Honor of Kings tokens, and other popular game vouchers. Enjoy instant delivery via GCash, Maya, and GrabPay. The most trusted gaming top-up site for Filipino gamers.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigate('/games/mobile-legends')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" /> Top Up MLBB Diamonds
                </button>
                <button
                  onClick={() => navigate('/games')}
                  className="px-6 py-3 rounded-xl bg-brand-card/80 hover:bg-brand-cardLight border border-brand-cardBorder hover:border-brand-gold/50 text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  <Gamepad2 className="w-4 h-4 text-brand-gold" /> Explore All Games
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-brand-cardBorder/60 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-lg sm:text-xl font-display font-black text-white">500K+</div>
                  <div className="text-[10px] text-gray-400 font-medium">Delivered Orders</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-lg sm:text-xl font-display font-black text-brand-gold">1-5 Min</div>
                  <div className="text-[10px] text-gray-400 font-medium">Auto Dispatch</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-lg sm:text-xl font-display font-black text-brand-cyan">100%</div>
                  <div className="text-[10px] text-gray-400 font-medium">Safe & Authorized</div>
                </div>
              </div>
            </div>

            {/* Right: Official Interactive Carousel Slider Card with Dynamic Cyber Glass & Illuminated Brackets */}
            <div 
              className="lg:col-span-6 relative"
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {/* Dynamic Tactical Corner Brackets */}
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-brand-gold z-30 pointer-events-none drop-shadow-[0_0_8px_rgba(240,192,48,0.9)]" />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-brand-cyan z-30 pointer-events-none drop-shadow-[0_0_8px_rgba(0,240,255,0.9)]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-brand-cyan z-30 pointer-events-none drop-shadow-[0_0_8px_rgba(0,240,255,0.9)]" />
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-brand-gold z-30 pointer-events-none drop-shadow-[0_0_8px_rgba(240,192,48,0.9)]" />

              <div className="relative rounded-2xl sm:rounded-3xl p-[2px] bg-gradient-to-br from-brand-gold/60 via-brand-purple/30 to-brand-cyan/60 shadow-[0_0_35px_rgba(240,192,48,0.18)] hover:shadow-[0_0_50px_rgba(240,192,48,0.28)] transition-all duration-500 overflow-hidden group">
                <div className="relative aspect-[16/9] w-full rounded-[20px] sm:rounded-[26px] overflow-hidden bg-[#120E24]/60 backdrop-blur-xl border border-brand-gold/25">
                  
                  {/* Top Live Status HUD Tag */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-brand-gold/40 text-[10px] font-display font-black text-brand-gold uppercase tracking-wider shadow-lg pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Official Deals</span>
                    <div className="flex items-end gap-0.5 h-2.5 ml-1">
                      <span className="w-0.5 bg-brand-gold animate-esports-eq1" />
                      <span className="w-0.5 bg-brand-gold animate-esports-eq2" />
                      <span className="w-0.5 bg-brand-gold animate-esports-eq3" />
                      <span className="w-0.5 bg-brand-gold animate-esports-eq4" />
                    </div>
                  </div>

                  {OFFICIAL_SLIDERS.map((slider, idx) => (
                    <div
                      key={slider.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
                        idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                      onClick={() => navigate(slider.url)}
                    >
                      <img
                        src={slider.picture}
                        alt={slider.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0914]/90 via-transparent to-black/30" />
                      
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
                        <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-brand-gold/40 text-brand-gold font-display font-bold text-xs uppercase tracking-wider shadow-md">
                          {slider.name}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center gap-1 hover:scale-105 transition-transform">
                          View Deal <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Slider Prev / Next Controls */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(prev => (prev === 0 ? OFFICIAL_SLIDERS.length - 1 : prev - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-white border border-white/20 flex items-center justify-center transition-all opacity-75 hover:opacity-100 shadow-md backdrop-blur-sm"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(prev => (prev + 1) % OFFICIAL_SLIDERS.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-white border border-white/20 flex items-center justify-center transition-all opacity-75 hover:opacity-100 shadow-md backdrop-blur-sm"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                    {OFFICIAL_SLIDERS.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide(dotIdx);
                        }}
                        className={`h-1.5 rounded-full transition-all ${
                          dotIdx === currentSlide 
                            ? 'w-6 bg-brand-gold shadow-[0_0_8px_rgba(240,192,48,0.9)]' 
                            : 'w-1.5 bg-white/40 hover:bg-white/80'
                        }`}
                        aria-label={`Slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. EXCLUSIVE OFFERS (PROMO BANNER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-brand-cardBorder pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-brand-gold text-xs font-bold uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5 text-brand-gold animate-bounce" /> Limited-Time Promo
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                Exclusive Offers
              </h2>
              <p className="text-xs text-gray-400">
                Don't miss our limited-time offers! Discover current deals today!
              </p>
            </div>
            <button
              onClick={() => navigate('/vouchers')}
              className="text-xs font-bold text-brand-gold hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              View All Vouchers <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Official Free Code Banner Card */}
          <div 
            onClick={() => navigate('/vouchers')}
            className="relative rounded-2xl overflow-hidden border border-brand-gold/30 hover:border-brand-gold/60 cursor-pointer transition-all shadow-xl group"
          >
            <img 
              src={assetUrl("/slider/free_code.png")} 
              alt="Get Your Free Code"
              className="w-full h-auto max-h-[220px] sm:max-h-[300px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
              <span className="px-4 py-2 rounded-xl bg-brand-gold text-brand-dark font-display font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                Claim Free Code <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR GAME TOP-UPS & VOUCHERS (COLLAPSIBLE CATALOG) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-cardBorder pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-cyan text-xs font-bold uppercase tracking-wider mb-1">
              <Gamepad2 className="w-3.5 h-3.5 text-brand-cyan" /> Direct Top-Up Catalog
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              Popular Game Top-Ups & Vouchers
            </h2>
            <p className="text-xs text-gray-400">
              Browse our collection of discounted game top-ups and official digital vouchers.
            </p>
          </div>

          {/* Right Toolbar: Live Search & Expand/Collapse All */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search catalog games..."
                value={gameSearchQuery}
                onChange={e => setGameSearchQuery(e.target.value)}
                className="w-full bg-[#130E26] border border-brand-cardBorder rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-gold/50 transition-colors"
              />
            </div>
            {selectedCategoryKey === 'all' && !gameSearchQuery && (
              <button
                onClick={() => {
                  const shouldOpen = !isGamesOpen || !isVouchersOpen;
                  setIsGamesOpen(shouldOpen);
                  setIsVouchersOpen(shouldOpen);
                }}
                className="shrink-0 px-3 py-2 rounded-xl bg-brand-card hover:bg-brand-cardLight border border-brand-cardBorder text-gray-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Toggle all sections"
              >
                {(!isGamesOpen || !isVouchersOpen) ? (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-brand-gold" /> Expand All
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-brand-cyan" /> Collapse All
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Category Pills (from OFFICIAL_CATEGORIES) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryKey('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategoryKey === 'all'
                ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                : 'bg-brand-card border border-brand-cardBorder text-gray-300 hover:text-white hover:border-brand-gold/40'
            }`}
          >
            All Items
          </button>
          {OFFICIAL_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategoryKey(cat.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryKey === cat.key
                  ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                  : 'bg-brand-card border border-brand-cardBorder text-gray-300 hover:text-white hover:border-brand-gold/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* CONTENT VIEW: Split into Collapsible Sections when browsing "All" */}
        {selectedCategoryKey === 'all' && !gameSearchQuery ? (
          <div className="space-y-6">
            
            {/* 1. COLLAPSIBLE POPULAR GAMES SECTION */}
            <div className="rounded-3xl bg-brand-card/40 border border-brand-cardBorder overflow-hidden transition-all">
              {/* Accordion Header */}
              <div 
                onClick={() => setIsGamesOpen(prev => !prev)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors border-b border-brand-cardBorder/50 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center border border-brand-cyan/30">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-base sm:text-lg text-white">
                        Popular Game Top-Ups
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan text-[10px] font-bold border border-brand-cyan/30">
                        {popularGames.length} Titles
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 hidden sm:block">
                      Instant direct reload for Mobile Legends, Valorant, Honor of Kings, Genshin & more
                    </p>
                  </div>
                </div>

                <button 
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-xl bg-brand-card border border-brand-cardBorder"
                  aria-label={isGamesOpen ? 'Collapse Popular Games' : 'Expand Popular Games'}
                >
                  <span>{isGamesOpen ? 'Collapse' : 'Expand'}</span>
                  {isGamesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Accordion Body */}
              {isGamesOpen && (
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {(isGamesExpanded ? popularGames : popularGames.slice(0, 12)).map(renderProductCard)}
                  </div>

                  {/* Collapsible Expand/Collapse Items Toggle Button */}
                  {popularGames.length > 12 && (
                    <div className="pt-2 flex flex-col items-center">
                      <button
                        onClick={() => setIsGamesExpanded(prev => !prev)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-card to-brand-cardLight hover:border-brand-gold/50 border border-brand-cardBorder text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
                      >
                        {isGamesExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5 text-brand-gold" />
                            <span>Collapse to Top 12 Games</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5 text-brand-cyan" />
                            <span>Show All {popularGames.length} Games ({popularGames.length - 12} more)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. COLLAPSIBLE TOP-UP VOUCHERS SECTION */}
            <div className="rounded-3xl bg-brand-card/40 border border-brand-cardBorder overflow-hidden transition-all">
              {/* Accordion Header */}
              <div 
                onClick={() => setIsVouchersOpen(prev => !prev)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors border-b border-brand-cardBorder/50 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-base sm:text-lg text-white">
                        Top-Up Vouchers & Gift Cards
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold border border-brand-gold/30">
                        {voucherProducts.length} Vouchers
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 hidden sm:block">
                      Digital codes for Steam Wallet, Razer Gold, Google Play, Apple Gift Cards & more
                    </p>
                  </div>
                </div>

                <button 
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-xl bg-brand-card border border-brand-cardBorder"
                  aria-label={isVouchersOpen ? 'Collapse Vouchers' : 'Expand Vouchers'}
                >
                  <span>{isVouchersOpen ? 'Collapse' : 'Expand'}</span>
                  {isVouchersOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Accordion Body */}
              {isVouchersOpen && (
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {(isVouchersExpanded ? voucherProducts : voucherProducts.slice(0, 6)).map(renderProductCard)}
                  </div>

                  {/* Collapsible Expand/Collapse Items Toggle Button */}
                  {voucherProducts.length > 6 && (
                    <div className="pt-2 flex flex-col items-center">
                      <button
                        onClick={() => setIsVouchersExpanded(prev => !prev)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-card to-brand-cardLight hover:border-brand-gold/50 border border-brand-cardBorder text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
                      >
                        {isVouchersExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5 text-brand-gold" />
                            <span>Collapse to Top 6 Vouchers</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5 text-brand-gold" />
                            <span>Show All {voucherProducts.length} Vouchers ({voucherProducts.length - 6} more)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        ) : (
          /* FILTERED / SEARCH VIEW WITH COLLAPSIBLE LIMIT */
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {(isFilteredExpanded ? filteredProducts : filteredProducts.slice(0, 12)).map(renderProductCard)}
            </div>

            {filteredProducts.length > 12 && (
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setIsFilteredExpanded(prev => !prev)}
                  className="px-6 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardLight border border-brand-cardBorder hover:border-brand-gold/40 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  {isFilteredExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Collapse Items</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Show All {filteredProducts.length} Items ({filteredProducts.length - 12} more)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 rounded-2xl bg-brand-card border border-brand-cardBorder space-y-2">
                <Gamepad2 className="w-10 h-10 text-gray-500 mx-auto" />
                <p className="text-sm text-gray-400 font-bold">No games found matching your search.</p>
                <button
                  onClick={() => {
                    setSelectedCategoryKey('all');
                    setGameSearchQuery('');
                  }}
                  className="text-xs text-brand-gold underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. MOBILE APP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#1E133A] via-[#2A1D4E] to-[#17102D] border border-brand-cardBorder flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold font-bold text-xs uppercase tracking-wider border border-brand-gold/30 inline-block">
              Mobile App
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
              Get The GPDS Mobile App
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Faster checkout, real-time top-up delivery push notifications, and exclusive in-app voucher discounts right on your smartphone.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              onClick={() => alert('GPDS Web App (PWA) is ready! Click "Install" on your browser URL bar for 1-tap mobile access.')}
              className="px-6 py-3 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center gap-2 transition-all"
            >
              <Smartphone className="w-4 h-4" /> Install App
            </button>
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 rounded-xl bg-brand-card hover:bg-brand-cardLight border border-brand-cardBorder text-white font-display font-bold text-xs uppercase tracking-wider transition-all"
            >
              Browse Web Store
            </button>
          </div>
        </div>
      </section>

      {/* 5. STREAMER CODES (PROMO CODES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-cardBorder pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              Streamer Codes
            </h2>
            <p className="text-xs text-gray-400">
              Support your favorite streamers and claim exclusive top-up discounts.
            </p>
          </div>
          <button
            onClick={() => navigate('/partnership?tab=streamer')}
            className="text-xs font-bold text-brand-gold hover:underline flex items-center gap-1"
          >
            Grow With Us →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {streamerCodes.map(item => (
            <div
              key={item.code}
              className="p-4 rounded-2xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/40 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded-full">
                  {item.role}
                </span>
                <span className="text-xs font-extrabold text-emerald-400 font-mono">
                  {item.discount}
                </span>
              </div>

              <div>
                <div className="font-display font-bold text-sm text-white">{item.streamer}</div>
                <div className="text-xs font-mono font-bold text-brand-cyan tracking-wider mt-1 bg-black/40 px-2 py-1 rounded-lg border border-brand-cardBorder inline-block">
                  {item.code}
                </div>
              </div>

              <button
                onClick={() => handleCopyCode(item.code)}
                className={`w-full py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                  copiedCode === item.code
                    ? 'bg-emerald-500 text-white'
                    : 'bg-brand-cardLight hover:bg-brand-gold hover:text-brand-dark text-gray-300'
                }`}
              >
                {copiedCode === item.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PARTNERSHIP PROGRAMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 inline-block">
            Earn With GPDS
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
            Partnership Programs
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Join thousands of partners already earning with GPDS. Pick the program that fits your goals and start growing today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Program 1 */}
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-brand-gold bg-brand-gold/15 px-2.5 py-0.5 rounded-full border border-brand-gold/20 inline-block">
                2% Commission
              </span>
              <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-gold transition-colors">
                Affiliate Program
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Share your unique link and earn on every successful transaction. No upfront cost, no complicated setup required.
              </p>
            </div>
            <button
              onClick={() => navigate('/partnership?tab=affiliate')}
              className="w-full py-2.5 rounded-xl bg-brand-cardLight hover:bg-brand-gold hover:text-brand-dark text-white text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Program 2 */}
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-brand-cyan bg-brand-cyan/15 px-2.5 py-0.5 rounded-full border border-brand-cyan/20 inline-block">
                2% + 1% Viewer Discount
              </span>
              <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-cyan transition-colors">
                Streamer Program
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Are you a content creator or streamer? Earn commission while your viewers enjoy an exclusive discount on every order.
              </p>
            </div>
            <button
              onClick={() => navigate('/partnership?tab=streamer')}
              className="w-full py-2.5 rounded-xl bg-brand-cardLight hover:bg-brand-cyan hover:text-brand-dark text-white text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Program 3 */}
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-brand-purple bg-brand-purple/15 px-2.5 py-0.5 rounded-full border border-brand-purple/20 inline-block">
                Silver / Gold / Platinum
              </span>
              <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-purple transition-colors">
                Become a Reseller
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Get access to exclusive reseller pricing with tiered rates. The more you top up, the better your pricing gets.
              </p>
            </div>
            <button
              onClick={() => navigate('/partnership?tab=reseller')}
              className="w-full py-2.5 rounded-xl bg-brand-cardLight hover:bg-brand-purple hover:text-white text-white text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Program 4 */}
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20 inline-block">
                VIP Reseller Pricing
              </span>
              <h3 className="font-display font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                Create Your Website
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Get your own gaming top-up shop starting at ₱50,000. Includes VIP reseller pricing, your own branding, admin panel, and direct API access.
              </p>
            </div>
            <button
              onClick={() => navigate('/partnership?tab=website')}
              className="w-full py-2.5 rounded-xl bg-brand-cardLight hover:bg-emerald-400 hover:text-brand-dark text-white text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 inline-block">
            Support Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Find answers about top-ups, payments, and order security.
          </p>
        </div>

        <div className="space-y-3">
          {OFFICIAL_FAQS.map(faq => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-brand-card border border-brand-cardBorder overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors"
                >
                  <h3 className="font-display font-bold text-sm sm:text-base text-white">
                    {faq.question}
                  </h3>
                  <ChevronDown className={`w-4 h-4 text-brand-gold transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-brand-cardBorder/50 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. NEWS & UPDATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-brand-cardBorder pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              News & Update
            </h2>
            <p className="text-xs text-gray-400">
              Latest tournament coverage, MLBB esports news, and game patch highlights.
            </p>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="text-xs font-bold text-brand-gold hover:underline flex items-center gap-1"
          >
            View All News <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OFFICIAL_BLOGS.slice(0, 4).map(blog => (
            <div
              key={blog.id}
              onClick={() => navigate(`/blog/${blog.slug}`)}
              className="rounded-2xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 p-3 flex flex-col justify-between space-y-3 cursor-pointer group hover:-translate-y-1 transition-all"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/40">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-brand-gold font-display font-bold text-[10px] uppercase">
                  {blog.category}
                </span>
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">{blog.publishedAt}</span>
                  <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-brand-gold transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h3>
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. PAYMENT SECURITY / TRUST METHODS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#120D24] via-[#1A1435] to-[#120D24] border border-brand-cardBorder space-y-4 text-center">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Official Supported Payment Channels
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {['GCash', 'Maya', 'QRPH InstaPay', 'GrabPay', 'Visa', 'Mastercard', 'PayPal', 'USDT'].map(pm => (
              <div
                key={pm}
                className="px-4 py-2 rounded-xl bg-brand-card/80 border border-brand-cardBorder text-xs font-bold text-gray-300 shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                <span>{pm}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 max-w-xl mx-auto">
            100% PCI-DSS compliant and encrypted transactions. We never store debit/credit card credentials or e-wallet PINs.
          </p>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
