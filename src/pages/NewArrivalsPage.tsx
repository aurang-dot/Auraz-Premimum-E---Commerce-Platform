import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { useApp } from '../lib/AppContext';

export function NewArrivalsPage() {
  const { products } = useApp();
  const newArrivals = (products || []).filter((p) => p?.isNewArrival);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-8">
        <div className="text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-8 w-8" />
            <h1 className="text-white">New Arrivals</h1>
          </div>
          <p className="text-white/90 text-xl mb-4">
            Fresh products just added to our collection
          </p>
          <p className="text-white/80">Be the first to explore our latest additions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-blue-600 mb-1">{newArrivals.length}</p>
          <p className="text-gray-600 text-sm">New Products</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-blue-600 mb-1">This Week</p>
          <p className="text-gray-600 text-sm">Latest Additions</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-blue-600 mb-1">9+</p>
          <p className="text-gray-600 text-sm">Categories</p>
        </div>
      </div>

      {/* Products */}
      {newArrivals.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">No new arrivals at the moment</p>
          <p className="text-gray-400 mb-6">Check back soon for fresh products</p>
          <Button asChild>
            <Link to="/">Browse All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
