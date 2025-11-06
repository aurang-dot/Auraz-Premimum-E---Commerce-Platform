import { Zap, Laptop } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../lib/AppContext';

export function ElectronicsSalePage() {
  const { products } = useApp();
  // Filter electronics products
  const electronicsProducts = (products || []).filter(p => 
    p && !p.isHidden && (
      p.isElectronics || 
      p.category === 'Electronics'
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-8 w-8" />
            <h1 className="text-white">Electronics Mega Sale</h1>
            <Laptop className="h-8 w-8" />
          </div>
          <p className="text-xl text-white/90 mb-6">
            Latest gadgets and tech accessories at unbeatable prices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-sm text-white/80">Discounts up to</p>
              <p className="text-3xl text-white">60% OFF</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-sm text-white/80">Warranty</p>
              <p className="text-3xl text-white">1-2 Years</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-sm text-white/80">Cash on Delivery</p>
              <p className="text-3xl text-white">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>Electronics Collection</h2>
            <p className="text-gray-600">
              {electronicsProducts.length} products available
            </p>
          </div>
        </div>

        {electronicsProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {electronicsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Laptop className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Coming Soon!</p>
            <p className="text-gray-400">New electronics products will be added shortly</p>
          </div>
        )}
      </div>
    </div>
  );
}
