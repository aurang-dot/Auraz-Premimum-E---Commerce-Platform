import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { useApp } from '../lib/AppContext';

export function TrendingPage() {
  const { products } = useApp();
  const trending = (products || []).filter((p) => p?.isTrending);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 mb-8">
        <div className="text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp className="h-8 w-8" />
            <h1 className="text-white">Trending Now</h1>
          </div>
          <p className="text-white/90 text-xl mb-4">
            Most popular products this week
          </p>
          <p className="text-white/80">See what everyone is buying</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-orange-500 mb-1">{trending.length}</p>
          <p className="text-gray-600 text-sm">Trending Items</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-orange-500 mb-1">Hot</p>
          <p className="text-gray-600 text-sm">This Week</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-orange-500 mb-1">4.5+</p>
          <p className="text-gray-600 text-sm">Avg Rating</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-orange-500 mb-1">1000+</p>
          <p className="text-gray-600 text-sm">Happy Customers</p>
        </div>
      </div>

      {/* Products */}
      {trending.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">No trending products right now</p>
          <p className="text-gray-400 mb-6">Check back soon</p>
          <Button asChild>
            <Link to="/">Browse All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
