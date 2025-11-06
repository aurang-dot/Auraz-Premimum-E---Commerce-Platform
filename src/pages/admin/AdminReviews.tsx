import { useState } from 'react';
import { Star, Trash2, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { useApp } from '../../lib/AppContext';
import { Link } from 'react-router-dom';

export function AdminReviews() {
  const { reviews, deleteReview, products } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = (reviews || []).filter((review) => {
    if (!review) return false;
    const product = products.find(p => p && p.id === review.productId);
    const productName = product?.name || '';
    const query = (searchQuery || '').toLowerCase();
    
    return (
      (review.userName || '').toLowerCase().includes(query) ||
      productName.toLowerCase().includes(query) ||
      (review.comment || '').toLowerCase().includes(query)
    );
  });

  const handleDeleteReview = (reviewId: string) => {
    deleteReview(reviewId);
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Reviews Management</h1>
        <p className="text-gray-600">Monitor and manage customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{reviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl">{averageRating}</div>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Verified Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {reviews.filter(r => r.isVerifiedPurchase).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">5-Star Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {reviews.filter(r => r.rating === 5).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>View and manage customer reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search by customer, product, or review content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No reviews found</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review.id} className="border-l-4 border-l-[#591220]">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
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
                            <span className="text-sm text-gray-500">
                              {review.rating}.0
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.userName}</span>
                            {review.isVerifiedPurchase && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Review</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this review? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReview(review.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      {/* Product Info */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Product</p>
                            <Link
                              to={`/product/${review.productId}`}
                              className="font-medium hover:text-[#591220]"
                            >
                              {getProductName(review.productId)}
                            </Link>
                          </div>
                          {review.orderId && (
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Order ID</p>
                              <p className="text-sm font-medium">#{review.orderId}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review Comment */}
                      <div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
