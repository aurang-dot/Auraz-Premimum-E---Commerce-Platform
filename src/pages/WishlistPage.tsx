import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useApp } from '../lib/AppContext';
import { ProfileSidebar } from '../components/ProfileSidebar';

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, addToCart, currentUser } = useApp();
  const wishlistItems = wishlist;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Return early if no user (during redirect)
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length > 0 
              ? `${wishlistItems.length} ${wishlistItems.length === 1 ? 'item' : 'items'} saved`
              : 'Save your favorite products here'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar currentUser={currentUser} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">
                      Save your favorite products to your wishlist and shop them later
                    </p>
                    <Link to="/">
                      <Button className="bg-[#591220] hover:bg-[#6d1728]">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistItems.map((product) => (
                        <div key={product.id} className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <Link to={`/product/${product.id}`} className="block relative">
                            <div className="aspect-square overflow-hidden bg-gray-100">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeFromWishlist(product.id);
                              }}
                              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                              title="Remove from wishlist"
                            >
                              <Heart className="h-4 w-4 text-red-600 fill-red-600" />
                            </button>

                            {/* Stock Badge */}
                            {product.stock === 0 && (
                              <div className="absolute top-2 left-2">
                                <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </Link>

                          <div className="p-4">
                            <Link to={`/product/${product.id}`}>
                              <h3 className="line-clamp-2 mb-2 hover:text-[#591220] transition-colors">
                                {product.name}
                              </h3>
                            </Link>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-[#591220]">৳{(product.price || 0).toLocaleString()}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                  ৳{(product.originalPrice || 0).toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-[#591220] hover:bg-[#6d1728]"
                                disabled={product.stock === 0}
                                onClick={() => addToCart(product, 1)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Add to Cart
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromWishlist(product.id)}
                                title="Remove"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 text-center pt-6 border-t">
                      <Link to="/">
                        <Button variant="outline" size="lg">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
