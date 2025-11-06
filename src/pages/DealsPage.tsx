import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { useApp } from '../lib/AppContext';

export function DealsPage() {
  const { products } = useApp();
  const deals = (products || []).filter((p) => p?.isDeal);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#591220] to-[#7d1a2e] rounded-lg p-8 mb-8">
        <div className="text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className="h-8 w-8" />
            <h1 className="text-white">Today's Deals</h1>
          </div>
          <p className="text-white/90 text-xl mb-4">
            Limited time offers - Save up to 50% on selected items
          </p>
          <p className="text-white/80">Hurry! Deals refresh daily</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-[#591220] mb-1">{deals.length}</p>
          <p className="text-gray-600 text-sm">Active Deals</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-[#591220] mb-1">50%</p>
          <p className="text-gray-600 text-sm">Max Discount</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-[#591220] mb-1">24h</p>
          <p className="text-gray-600 text-sm">Time Left</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl text-[#591220] mb-1">Free</p>
          <p className="text-gray-600 text-sm">Shipping</p>
        </div>
      </div>

      {/* Products */}
      {deals.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">No deals available right now</p>
          <p className="text-gray-400 mb-6">Check back tomorrow for new deals</p>
          <Button asChild>
            <Link to="/">Browse All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
