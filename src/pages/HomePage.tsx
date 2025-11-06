import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, Shield, Headphones, Play, Pause } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { categories } from '../lib/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../lib/AppContext';
import { toast } from 'sonner@2.0.3';

export function HomePage() {
  const { carouselSlides, promoCards, vouchers, products } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentSlide]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const copyVoucherCode = (code: string) => {
    // Fallback method using textarea for better compatibility
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      toast.success('Voucher code copied!', {
        description: `${code} has been copied to clipboard`,
      });
    } catch (err) {
      toast.error('Failed to copy', {
        description: 'Please copy the code manually',
      });
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const featuredProducts = (products || []).slice(0, 12);
  const newArrivals = (products || []).filter((p) => p?.isNewArrival);
  const deals = (products || []).filter((p) => p?.isDeal);
  const trending = (products || []).filter((p) => p?.isTrending);

  return (
    <div className="space-y-12">
      {/* Hero Carousel */}
      <section className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gray-900 -mt-4 group">
        {/* Slides */}
        <div className="relative h-full">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 z-0'
              }`}
            >
              <ImageWithFallback
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                  <div className="max-w-2xl text-white">
                    <div
                      className={`transform transition-all duration-700 delay-100 ${
                        index === currentSlide
                          ? 'translate-x-0 opacity-100'
                          : '-translate-x-10 opacity-0'
                      }`}
                    >
                      <h1 className="text-white mb-4 text-4xl md:text-5xl lg:text-6xl drop-shadow-lg">
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/95 drop-shadow-md">
                        {slide.description}
                      </p>
                      <Link to={slide.buttonLink}>
                        <Button 
                          size="lg" 
                          className="bg-[#591220] hover:bg-[#6d1728] text-lg px-8 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                        >
                          {slide.buttonText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 md:p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 hover:scale-110 z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-[#591220]" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 md:p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 hover:scale-110 z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-[#591220]" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={toggleAutoPlay}
          className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
          aria-label={isAutoPlaying ? 'Pause autoplay' : 'Start autoplay'}
        >
          {isAutoPlaying ? (
            <Pause className="h-4 w-4 md:h-5 md:w-5 text-[#591220]" />
          ) : (
            <Play className="h-4 w-4 md:h-5 md:w-5 text-[#591220]" />
          )}
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
          {carouselSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'bg-white w-10 md:w-12 h-2.5 md:h-3'
                  : 'bg-white/50 hover:bg-white/75 w-2.5 md:w-3 h-2.5 md:h-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-6 md:bottom-8 right-4 md:right-8 bg-black/50 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm backdrop-blur-sm z-20">
          {currentSlide + 1} / {carouselSlides.length}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-[#591220] p-3 rounded-full">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4>Free Shipping</h4>
              <p className="text-gray-600">On orders over ৳1000</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-[#591220] p-3 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4>Secure Payment</h4>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-[#591220] p-3 rounded-full">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4>24/7 Support</h4>
              <p className="text-gray-600">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2>Shop by Category</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2>Top Picks for You</h2>
          <Link to="/category/all">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Active Vouchers Section - Compact Design */}
      {vouchers.filter(v => v.isActive && new Date(v.validUntil) > new Date()).length > 0 && (
        <section className="container mx-auto px-4">
          <div className="mb-4">
            <h2 className="mb-1">Special Offers & Vouchers</h2>
            <p className="text-gray-600 text-sm">Save more with our exclusive discount codes</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {vouchers
              .filter(v => v.isActive && new Date(v.validUntil) > new Date())
              .slice(0, 12)
              .map(voucher => {
                const daysLeft = Math.ceil((new Date(voucher.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const usagePercent = (voucher.usedCount / voucher.usageLimit) * 100;
                
                return (
                  <div 
                    key={voucher.id} 
                    className="relative bg-white border border-[#591220]/20 rounded-lg p-3 hover:border-[#591220] hover:shadow-md transition-all group cursor-pointer"
                  >
                    {/* Discount Badge */}
                    <div className="bg-gradient-to-r from-[#591220] to-[#7d1a2e] text-white px-2 py-0.5 rounded text-xs font-bold mb-2 text-center">
                      {voucher.type === 'percentage' ? `${voucher.value}%` : `৳${voucher.value}`} OFF
                    </div>

                    {/* Voucher Code */}
                    <div className="bg-[#591220]/5 border border-dashed border-[#591220]/30 rounded px-2 py-1.5 mb-2 text-center">
                      <span className="font-mono font-bold text-[#591220] text-xs">{voucher.code}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-xs mb-2 line-clamp-2 min-h-[2rem]">
                      {voucher.description}
                    </p>

                    {/* Details */}
                    <div className="text-xs space-y-0.5 mb-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Min:</span>
                        <span className="font-medium">৳{voucher.minOrderAmount}</span>
                      </div>
                    </div>

                    {/* Usage Bar */}
                    <div className="mb-2">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#591220]"
                          style={{ width: `${usagePercent}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{voucher.usageLimit - voucher.usedCount} left</div>
                    </div>

                    {/* Copy Button */}
                    <button 
                      onClick={() => copyVoucherCode(voucher.code)}
                      className="w-full bg-[#591220] text-white text-xs py-1.5 rounded hover:bg-[#7d1a2e] transition-colors"
                    >
                      Copy Code
                    </button>

                    {/* Expiry */}
                    <div className="text-xs text-center mt-1.5 text-gray-500">
                      {daysLeft <= 0 ? 'Expires today' : `${daysLeft}d left`}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Today's Deals Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-[#591220] to-[#7d1a2e] rounded-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white text-center md:text-left">
              <h2 className="text-white mb-2">Today's Deals</h2>
              <p className="text-white/90">Save up to 50% on selected items - Limited time only!</p>
            </div>
            <Link to="/deals">
              <Button size="lg" variant="outline" className="bg-white text-[#591220] hover:bg-gray-100">
                View All Deals
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {deals.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>New Arrivals</h2>
            <p className="text-gray-600">Fresh products just added</p>
          </div>
          <Link to="/new-arrivals">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {newArrivals.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>Trending Now</h2>
            <p className="text-gray-600">Most popular products this week</p>
          </div>
          <Link to="/trending">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {trending.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promotional Banner - Dynamic from Admin */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promoCards
            .filter(card => card.isActive)
            .sort((a, b) => a.order - b.order)
            .map(card => (
              <Link key={card.id} to={card.link}>
                <div className={`bg-gradient-to-br ${card.gradient} rounded-lg p-8 text-white hover:scale-105 transition-transform cursor-pointer`}>
                  <h3 className="text-white mb-2">{card.title}</h3>
                  <p className="text-white/90 mb-4">{card.description}</p>
                  <Button variant="outline" className="bg-white text-gray-800 hover:bg-gray-100">
                    {card.buttonText}
                  </Button>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
