import { Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../lib/AppContext';

export function FestiveSalePage() {
  const { products } = useApp();
  // Filter winter/festive products
  const festiveProducts = (products || []).filter(p => 
    p && !p.isHidden && (
      p.isFestive || 
      p.category === 'Fashion' ||
      p.name?.toLowerCase().includes('winter') ||
      p.name?.toLowerCase().includes('coat') ||
      p.name?.toLowerCase().includes('jacket') ||
      p.name?.toLowerCase().includes('hoodie')
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8" />
            <h1 className="text-white">Festive Season Sale</h1>
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="text-xl text-white/90 mb-6">
            Celebrate with amazing discounts on winter fashion and seasonal favorites
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-sm text-white/80">Up to</p>
              <p className="text-3xl text-white">50% OFF</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-sm text-white/80">Free Shipping</p>
              <p className="text-3xl text-white">Above ৳1000</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-sm text-white/80">Extra</p>
              <p className="text-3xl text-white">10% Voucher</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>Festive Collection</h2>
            <p className="text-gray-600">
              {festiveProducts.length} products available
            </p>
          </div>
        </div>

        {festiveProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {festiveProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Coming Soon!</p>
            <p className="text-gray-400">New festive products will be added shortly</p>
          </div>
        )}
      </div>
    </div>
  );
}
