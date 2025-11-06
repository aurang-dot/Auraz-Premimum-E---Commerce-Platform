import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle2, XCircle, Clock, MapPin, Phone, CreditCard, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useApp } from '../lib/AppContext';

export function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, currentUser, cancelOrder, addReview, canUserReview } = useApp();

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<string>('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const order = orders.find((o) => o.id === orderId && o.userId === currentUser.id);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/orders">
            <Button className="bg-[#591220] hover:bg-[#6d1728]">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'processing':
        return <Package className="h-6 w-6 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-purple-600" />;
      case 'delivered':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancelOrder = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(order.id);
    }
  };

  const canCancelOrder = () => {
    // Can only cancel bKash payments
    if (order.paymentMethod === 'Cash on Delivery') {
      return false;
    }
    // Can only cancel if pending or processing
    return ['pending', 'processing'].includes(order.status);
  };

  const handleReviewSubmit = () => {
    if (selectedProductForReview && reviewRating > 0 && reviewComment.trim() && currentUser) {
      addReview({
        productId: selectedProductForReview,
        userId: currentUser.id,
        userName: currentUser.name,
        orderId: order.id,
        rating: reviewRating,
        comment: reviewComment,
        isVerifiedPurchase: true,
      });
      setIsReviewDialogOpen(false);
      setSelectedProductForReview('');
      setReviewRating(0);
      setReviewComment('');
    }
  };

  // Order tracking timeline
  const getTrackingSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Clock },
      { key: 'processing', label: 'Processing', icon: Package },
      { key: 'shipped', label: 'Shipped', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    ];

    const statusIndex = {
      pending: 0,
      processing: 1,
      shipped: 2,
      delivered: 3,
      cancelled: -1,
    };

    const currentIndex = statusIndex[order.status] || 0;

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/orders">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="mb-2">Order #{order.id}</h1>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <Badge className={`${getStatusColor(order.status)} text-base px-4 py-2`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Tracking */}
            {order.status !== 'cancelled' && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {getTrackingSteps().map((step, index) => (
                      <div key={step.key} className="flex gap-4">
                        {/* Icon */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              step.completed
                                ? 'bg-[#591220] text-white'
                                : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            <step.icon className="h-6 w-6" />
                          </div>
                          {index < getTrackingSteps().length - 1 && (
                            <div
                              className={`w-0.5 h-12 mt-2 ${
                                step.completed ? 'bg-[#591220]' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <h3 className={step.completed ? 'text-[#591220]' : 'text-gray-400'}>
                            {step.label}
                          </h3>
                          {step.active && (
                            <p className="text-sm text-gray-600 mt-1">
                              Your order is currently at this stage
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cancelled Alert */}
            {order.status === 'cancelled' && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-600">
                  This order has been cancelled. If you have any questions, please contact our support team.
                </AlertDescription>
              </Alert>
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items ({order.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="pb-4 border-b last:border-0">
                      <div className="flex gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <Link to={`/product/${item.productId}`}>
                            <h3 className="mb-1 hover:text-[#591220]">{item.product.name}</h3>
                          </Link>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          {item.variant && (
                            <p className="text-sm text-gray-500 mt-1">
                              {Object.entries(item.variant)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-[#591220]">
                            ৳{((item.product?.price || 0) * (item.quantity || 0)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {order.status === 'delivered' && canUserReview(currentUser.id, item.productId) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 text-[#591220] border-[#591220] hover:bg-[#591220] hover:text-white"
                          onClick={() => {
                            setSelectedProductForReview(item.productId);
                            setIsReviewDialogOpen(true);
                          }}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Write Review
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>{order.shippingAddress.name}</p>
                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                  <p className="text-gray-600">{order.shippingAddress.street}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                  </p>
                  {order.shippingAddress.landmark && (
                    <p className="text-sm text-gray-500">
                      Landmark: {order.shippingAddress.landmark}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{(order.total - 60).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>৳60</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="text-[#591220]">৳{(order.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.paymentMethod}</p>
                {order.paymentMethod === 'Cash on Delivery' && (
                  <p className="text-sm text-gray-600 mt-2">
                    Pay when you receive your order
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.status === 'delivered' && (
                  <Link to={`/product/${order.items[0].productId}`} className="block">
                    <Button className="w-full bg-[#591220] hover:bg-[#6d1728]">
                      Buy Again
                    </Button>
                  </Link>
                )}

                {canCancelOrder() && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancelOrder}
                  >
                    Cancel Order
                  </Button>
                )}

                {!canCancelOrder() && order.paymentMethod === 'Cash on Delivery' && order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <Alert>
                    <AlertDescription className="text-sm">
                      Cash on Delivery orders cannot be cancelled online. Please contact support for assistance.
                    </AlertDescription>
                  </Alert>
                )}

                <Link to="/orders" className="block">
                  <Button variant="outline" className="w-full">
                    Back to All Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  If you have any questions about your order, please contact our customer support.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience with this product
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Your Review</Label>
                <Textarea
                  placeholder="Tell us what you think about this product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsReviewDialogOpen(false);
                  setSelectedProductForReview('');
                  setReviewRating(0);
                  setReviewComment('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#591220] hover:bg-[#6d1728]"
                onClick={handleReviewSubmit}
                disabled={reviewRating === 0 || !reviewComment.trim()}
              >
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
