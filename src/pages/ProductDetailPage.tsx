import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../lib/AppContext';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, addToWishlist, removeFromWishlist, isInWishlist, getProductReviews, canUserReview, addReview, currentUser } = useApp();
  const product = products.find((p) => p.id === productId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // Get real reviews from context
  const reviews = productId ? getProductReviews(productId) : [];
  const canWriteReview = currentUser && productId ? canUserReview(currentUser.id, productId) : false;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2>Product not found</h2>
        <Link to="/">
          <Button className="mt-4">Go to Home</Button>
        </Link>
      </div>
    );
  }

  const images = product.images || [product.image];
  const relatedProducts = (products || []).filter((p) => p && p.category === product.category && p.id !== product.id).slice(0, 4);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [type]: value }));
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    // Check if all required variants are selected
    if (product.variants) {
      const missingVariants = product.variants.filter(
        (variant) => !selectedVariants[variant.type]
      );
      if (missingVariants.length > 0) {
        toast.error(`Please select ${missingVariants[0].type}`);
        return;
      }
    }
    addToCart(product, quantity, selectedVariants);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) {
      toast.error('Please write a review');
      return;
    }
    
    const review = {
      id: Date.now().toString(),
      userName: 'You',
      rating: newReview.rating,
      comment: newReview.comment,
      date: 'Just now',
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    toast.success('Review submitted successfully');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-[#591220]">Home</Link>
        <span>/</span>
        <Link to={`/category/${product.category}`} className="hover:text-[#591220]">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {discountPercent > 0 && (
              <Badge className="absolute top-4 left-4 bg-[#591220]">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-[#591220]' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div>
          <h1 className="mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span>{product.rating}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{product.reviewCount} reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#591220]">৳{(product.price || 0).toLocaleString()}</span>
            {product.originalPrice && product.price && (
              <>
                <span className="text-gray-400 line-through">
                  ৳{(product.originalPrice || 0).toLocaleString()}
                </span>
                <Badge variant="destructive">Save ৳{((product.originalPrice || 0) - (product.price || 0)).toLocaleString()}</Badge>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 10 ? (
              <Badge variant="outline" className="border-green-500 text-green-600">
                In Stock ({product.stock} available)
              </Badge>
            ) : product.stock > 0 ? (
              <Badge variant="destructive">
                Low Stock (Only {product.stock} left)
              </Badge>
            ) : (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.map((variant) => (
            <div key={variant.type} className="mb-6">
              <h4 className="mb-3">{variant.type}</h4>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <Button
                    key={option}
                    variant={selectedVariants[variant.type] === option ? 'default' : 'outline'}
                    onClick={() => handleVariantChange(variant.type, option)}
                    className={selectedVariants[variant.type] === option ? 'bg-[#591220] hover:bg-[#6d1728]' : ''}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-6">
            <h4 className="mb-3">Quantity</h4>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              size="lg"
              className="flex-1 bg-[#591220] hover:bg-[#6d1728]"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleToggleWishlist}
              className={isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
            </Button>
          </div>

          <Button 
            size="lg" 
            variant="outline" 
            className="w-full mb-6" 
            disabled={product.stock === 0}
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>

          {/* Info Cards */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-gray-600" />
              <div>
                <p>Free delivery on orders over ৳1000</p>
                <p className="text-gray-500">Estimated delivery: 3-5 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-gray-600" />
              <div>
                <p>7 days return policy</p>
                <p className="text-gray-500">Return within 7 days of delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Store className="h-5 w-5 text-gray-600" />
              <div>
                <p>Sold by: <Link to={`/seller/${product.seller.id}`} className="text-[#591220] hover:underline">{product.seller.name}</Link></p>
                <p className="text-gray-500">Visit store for more products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          {product.specifications ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex border-b pb-2">
                  <span className="w-1/2 text-gray-600">{key}</span>
                  <span className="w-1/2">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No specifications available</p>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="border-b pb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-1">{product.rating}</div>
                  <div className="flex items-center justify-center mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{reviews.length} reviews</p>
                </div>
              </div>
            </div>

            {/* Write Review */}
            <div className="border rounded-lg p-4">
              <h3 className="mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Rating</label>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            i < newReview.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">Your Review</label>
                  <Textarea
                    placeholder="Share your experience with this product..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmitReview} className="bg-[#591220] hover:bg-[#6d1728]">
                  Submit Review
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span>{review.userName.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span>{review.userName}</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
