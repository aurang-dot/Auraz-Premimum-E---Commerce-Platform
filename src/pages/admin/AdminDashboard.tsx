import { Users, Package, ShoppingBag, DollarSign, TrendingUp, Clock, Tag, Sparkles, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useApp } from '../../lib/AppContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export function AdminDashboard() {
  const { users, products, orders, vouchers, promoCards, refundRequests } = useApp();

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Revenue',
      value: `৳${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-[#591220]',
      bg: 'bg-red-50',
    },
  ];

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const recentOrders = orders.slice(0, 5);
  const activeVouchers = vouchers.filter((v) => v.isActive);
  const activePromoCards = promoCards.filter((p) => p.isActive);
  const pendingRefunds = refundRequests.filter((r) => r.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock < 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to AURAZ Admin Panel</p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <h2>{stat.value}</h2>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats - Vouchers, Promo Cards, Refunds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Vouchers</p>
                <h2 className="mb-1">{activeVouchers.length}</h2>
                <p className="text-xs text-gray-500">of {vouchers.length} total</p>
              </div>
              <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
                <Tag className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Promo Cards</p>
                <h2 className="mb-1">{activePromoCards.length}</h2>
                <p className="text-xs text-gray-500">of {promoCards.length} total</p>
              </div>
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Refunds</p>
                <h2 className="mb-1">{pendingRefunds.length}</h2>
                <p className="text-xs text-gray-500">of {refundRequests.length} total</p>
              </div>
              <div className="bg-rose-50 text-rose-600 p-3 rounded-lg">
                <RefreshCcw className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Stock Alert</p>
                <h2 className="mb-1">{lowStockProducts.length}</h2>
                <p className="text-xs text-gray-500">products &lt; 10 units</p>
              </div>
              <div className="bg-yellow-50 text-yellow-600 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending User Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending User Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending approvals</p>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p>{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p>Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {order.user?.name || users.find(u => u.id === order.userId)?.name || 'Unknown User'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>৳{order.total.toLocaleString()}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Approved</span>
                <span>{users.filter((u) => u.status === 'approved').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span>{users.filter((u) => u.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rejected</span>
                <span>{users.filter((u) => u.status === 'rejected').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span>{orders.filter((o) => o.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing</span>
                <span>{orders.filter((o) => o.status === 'processing').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivered</span>
                <span>{orders.filter((o) => o.status === 'delivered').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">In Stock</span>
                <span>{products.filter((p) => p.stock > 0).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low Stock</span>
                <span>{products.filter((p) => p.stock > 0 && p.stock < 10).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Out of Stock</span>
                <span>{products.filter((p) => p.stock === 0).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing & Promotions Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-orange-600" />
              Active Vouchers
            </CardTitle>
            <Link to="/admin/vouchers">
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activeVouchers.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">No active vouchers</p>
            ) : (
              <div className="space-y-2">
                {activeVouchers.slice(0, 3).map((voucher) => (
                  <div key={voucher.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium font-mono">{voucher.code}</p>
                      <p className="text-xs text-gray-500">
                        {voucher.type === 'percentage' ? `${voucher.value}%` : `৳${voucher.value}`} off
                      </p>
                    </div>
                    <span className="text-xs text-gray-600">
                      {voucher.usedCount}/{voucher.usageLimit}
                    </span>
                  </div>
                ))}
                {activeVouchers.length > 3 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{activeVouchers.length - 3} more vouchers
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Promo Cards
            </CardTitle>
            <Link to="/admin/promo-cards">
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activePromoCards.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">No active promo cards</p>
            ) : (
              <div className="space-y-2">
                {activePromoCards.slice(0, 3).map((promo) => (
                  <div key={promo.id} className="p-2 bg-gray-50 rounded">
                    <p className="text-sm font-medium truncate">{promo.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500 truncate">{promo.description}</p>
                      <span className="text-xs text-gray-600 ml-2">#{promo.order}</span>
                    </div>
                  </div>
                ))}
                {activePromoCards.length > 3 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{activePromoCards.length - 3} more cards
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-rose-600" />
              Pending Refunds
            </CardTitle>
            <Link to="/admin/refunds">
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingRefunds.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">No pending refunds</p>
            ) : (
              <div className="space-y-2">
                {pendingRefunds.slice(0, 3).map((refund) => (
                  <div key={refund.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">Order #{refund.orderId.slice(0, 8)}</p>
                      <p className="text-xs text-gray-500">{refund.user?.name || users.find(u => u.id === refund.userId)?.name || 'Unknown User'}</p>
                    </div>
                    <span className="text-sm font-medium text-[#591220]">
                      ৳{refund.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {pendingRefunds.length > 3 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{pendingRefunds.length - 3} more requests
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
