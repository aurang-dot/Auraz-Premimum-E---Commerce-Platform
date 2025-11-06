import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product } from '../lib/mockData';
import { useApp } from '../lib/AppContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  
  // Safety check for undefined product or price
  if (!product || product.price === undefined) {
    return null;
  }
  
  const discountPercent = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image || ''}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercent > 0 && (
            <Badge className="bg-[#591220] hover:bg-[#591220]">
              -{discountPercent}%
            </Badge>
          )}
          {(product.stock || 0) < 10 && (product.stock || 0) > 0 && (
            <Badge variant="destructive">Low Stock</Badge>
          )}
          {(product.stock || 0) === 0 && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (isInWishlist(product.id)) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist(product);
            }
          }}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart 
            className={`h-4 w-4 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
          />
        </button>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 mb-2 hover:text-[#591220] transition-colors">
            {product.name || 'Unnamed Product'}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#591220]">৳{(product.price || 0).toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ৳{(product.originalPrice || 0).toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product, 1);
          }}
          disabled={(product.stock || 0) === 0}
          className="w-full bg-[#591220] hover:bg-[#6d1728]"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
