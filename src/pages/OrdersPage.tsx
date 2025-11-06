import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { useApp } from '../lib/AppContext';
import { ProfileSidebar } from '../components/ProfileSidebar';

export function OrdersPage() {
  const navigate = useNavigate();
  const { orders, currentUser, cancelOrder } = useApp();

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
  
  // Filter orders for current user
  const userOrders = orders.filter(order => order.userId === currentUser.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
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
    });
  };

  const allOrders = userOrders;
  const activeOrders = userOrders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status));
  const completedOrders = userOrders.filter((o) => o.status === 'delivered');
  const cancelledOrders = userOrders.filter((o) => o.status === 'cancelled');

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId);
    }
  };

  const canCancelOrder = (order: typeof userOrders[0]) => {
    // Can only cancel bKash payments
    if (order.paymentMethod === 'Cash on Delivery') {
      return false;
    }
    // Can only cancel if pending or processing
    return ['pending', 'processing'].includes(order.status);
  };

  const OrderCard = ({ order }: { order: typeof userOrders[0] }) => (
    <div className="bg-white border rounded-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
            <h3 className="text-base md:text-lg break-words">Order #{order.id}</h3>
            <Badge className={`${getStatusColor(order.status)} whitespace-nowrap text-xs`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm md:text-base text-gray-600 break-words">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-base md:text-lg text-[#591220] break-words">৳{(order.total || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-4">
        {order.items.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-14 h-14 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.productId}`}>
                <p className="text-sm md:text-base line-clamp-2 hover:text-[#591220] break-words">
                  {item.product.name}
                </p>
              </Link>
              <p className="text-xs md:text-sm text-gray-600">Quantity: {item.quantity}</p>
              {item.variant && (
                <p className="text-xs md:text-sm text-gray-500 break-words">
                  {Object.entries(item.variant)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')}
                </p>
              )}
            </div>
            <p className="text-sm md:text-base text-[#591220] whitespace-nowrap flex-shrink-0">
              ৳{((item.product?.price || 0) * (item.quantity || 0)).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <div className="border-t pt-4 mb-4">
        <p className="text-xs md:text-sm text-gray-600 mb-1">Shipping Address</p>
        <p className="text-xs md:text-sm break-words">
          {order.shippingAddress.street}, {order.shippingAddress.city} -{' '}
          {order.shippingAddress.postalCode}
        </p>
      </div>

      {/* Order Timeline */}
      <div className="border-t pt-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          {getStatusIcon(order.status)}
          <span className="text-sm md:text-base capitalize">{order.status}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {['confirmed', 'shipped', 'delivered'].map((step, index) => (
            <div key={step} className="flex-1 flex items-center">
              <div
                className={`h-2 flex-1 rounded ${
                  order.status === 'delivered' ||
                  (order.status === 'shipped' && index < 2) ||
                  (order.status === 'confirmed' && index < 1)
                    ? 'bg-[#591220]'
                    : 'bg-gray-200'
                }`}
              />
              {index < 2 && <div className="w-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <Link to={`/order/${order.id}`} className="flex-shrink-0">
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              Track Order
            </Button>
          </Link>
        )}
        {order.status === 'delivered' && (
          <>
            <Link to={`/product/${order.items[0].productId}`} className="flex-shrink-0">
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                Buy Again
              </Button>
            </Link>
            <Link to={`/order/${order.id}`} className="flex-shrink-0">
              <Button variant="outline" size="sm" className="text-[#591220] border-[#591220] hover:bg-[#591220] hover:text-white text-xs md:text-sm">
                Write Review
              </Button>
            </Link>
          </>
        )}
        <Link to={`/order/${order.id}`} className="flex-shrink-0">
          <Button variant="outline" size="sm" className="text-xs md:text-sm">
            View Details
          </Button>
        </Link>
        {canCancelOrder(order) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs md:text-sm"
            onClick={() => handleCancelOrder(order.id)}
          >
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl mb-2">My Orders</h1>
          <p className="text-sm md:text-base text-gray-600">Track and manage your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar currentUser={currentUser} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="all" className="space-y-6">
                  <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                    <TabsList className="w-full inline-flex md:grid md:grid-cols-4 h-auto p-0 bg-transparent border-b border-gray-200 rounded-none min-w-max md:min-w-full">
                      <TabsTrigger 
                        value="all"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#591220] data-[state=active]:text-[#591220] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 whitespace-nowrap text-sm"
                      >
                        All ({allOrders.length})
                      </TabsTrigger>
                      <TabsTrigger 
                        value="active"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#591220] data-[state=active]:text-[#591220] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 whitespace-nowrap text-sm"
                      >
                        Active ({activeOrders.length})
                      </TabsTrigger>
                      <TabsTrigger 
                        value="completed"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#591220] data-[state=active]:text-[#591220] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 whitespace-nowrap text-sm"
                      >
                        Completed ({completedOrders.length})
                      </TabsTrigger>
                      <TabsTrigger 
                        value="cancelled"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#591220] data-[state=active]:text-[#591220] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 whitespace-nowrap text-sm"
                      >
                        Cancelled ({cancelledOrders.length})
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="all" className="space-y-4 mt-6">
                    {allOrders.length > 0 ? (
                      allOrders.map((order) => <OrderCard key={order.id} order={order} />)
                    ) : (
                      <div className="text-center py-16">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-500 mb-2">No orders yet</p>
                        <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
                        <Link to="/">
                          <Button className="bg-[#591220] hover:bg-[#6d1728]">
                            Start Shopping
                          </Button>
                        </Link>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="active" className="space-y-4 mt-6">
                    {activeOrders.length > 0 ? (
                      activeOrders.map((order) => <OrderCard key={order.id} order={order} />)
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-gray-500">No active orders</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-6">
                    {completedOrders.length > 0 ? (
                      completedOrders.map((order) => <OrderCard key={order.id} order={order} />)
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-gray-500">No completed orders</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="cancelled" className="space-y-4 mt-6">
                    {cancelledOrders.length > 0 ? (
                      cancelledOrders.map((order) => <OrderCard key={order.id} order={order} />)
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-gray-500">No cancelled orders</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
