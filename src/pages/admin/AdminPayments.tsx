import { useState, useEffect, useMemo } from 'react';
import { Clock, CheckCircle, XCircle, User, Phone, Package, AlertCircle, RefreshCw, TrendingUp, DollarSign, Calendar, BarChart3, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useApp } from '../../lib/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts@2.15.2';

export function AdminPayments() {
  const { paymentVerifications, approvePaymentVerification, rejectPaymentVerification, deletePaymentVerification, orders } = useApp();
  const [timeStamps, setTimeStamps] = useState<Record<string, number>>({});
  const [localVerifications, setLocalVerifications] = useState(paymentVerifications || []);

  // Sync from localStorage every 2 seconds for same-tab updates
  useEffect(() => {
    const syncInterval = setInterval(() => {
      try {
        const stored = localStorage.getItem('auraz_paymentVerifications');
        if (stored) {
          const parsed = JSON.parse(stored);
          setLocalVerifications(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error syncing payment verifications:', error);
        setLocalVerifications([]);
      }
    }, 2000);

    return () => clearInterval(syncInterval);
  }, []);

  // Sync when paymentVerifications from context changes
  useEffect(() => {
    if (paymentVerifications) {
      setLocalVerifications(paymentVerifications);
    }
  }, [paymentVerifications]);

  // Filter pending verifications
  const pendingVerifications = (localVerifications || []).filter((v) => v && v.status === 'pending');
  const completedVerifications = (localVerifications || []).filter((v) => v && v.status !== 'pending');

  // Calculate revenue statistics
  const revenueStats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    // Only count completed orders (delivered)
    const completedOrders = (orders || []).filter(order => order && order.status === 'delivered');

    const dailyRevenue = completedOrders
      .filter(order => new Date(order.createdAt) >= today)
      .reduce((sum, order) => sum + order.total, 0);

    const monthlyRevenue = completedOrders
      .filter(order => new Date(order.createdAt) >= thisMonth)
      .reduce((sum, order) => sum + order.total, 0);

    const yearlyRevenue = completedOrders
      .filter(order => new Date(order.createdAt) >= thisYear)
      .reduce((sum, order) => sum + order.total, 0);

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate daily revenue for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const dailyRevenueData = last7Days.map(date => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const dayRevenue = completedOrders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= date && orderDate < nextDay;
        })
        .reduce((sum, order) => sum + order.total, 0);
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue,
      };
    });

    // Calculate monthly revenue for the last 12 months
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return date;
    });

    const monthlyRevenueData = last12Months.map(date => {
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      const monthRevenue = completedOrders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= date && orderDate < nextMonth;
        })
        .reduce((sum, order) => sum + order.total, 0);
      
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthRevenue,
      };
    });

    return {
      dailyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      totalRevenue,
      dailyRevenueData,
      monthlyRevenueData,
      totalOrders: completedOrders.length,
    };
  }, [orders]);

  // Update timestamps every second
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeStamps: Record<string, number> = {};
      pendingVerifications.forEach((verification) => {
        const now = new Date().getTime();
        const expiresAt = new Date(verification.expiresAt).getTime();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        newTimeStamps[verification.id] = remaining;
      });
      setTimeStamps(newTimeStamps);
    }, 1000);

    return () => clearInterval(interval);
  }, [pendingVerifications]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressValue = (seconds: number) => {
    return (seconds / 180) * 100;
  };

  const handleApprove = (verificationId: string) => {
    if (confirm('Confirm that the payment phone number matches the registered phone number?')) {
      approvePaymentVerification(verificationId);
    }
  };

  const handleReject = (verificationId: string) => {
    if (confirm('Reject this payment verification? The customer will need to try again.')) {
      rejectPaymentVerification(verificationId);
    }
  };

  const handleDelete = (verificationId: string) => {
    if (confirm('Delete this payment verification record? This action cannot be undone.')) {
      deletePaymentVerification(verificationId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Payments & Revenue</h1>
          <p className="text-gray-600">
            Manage payment verifications and track revenue
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2 bg-green-50 border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-700">Auto-Sync Active</span>
        </Badge>
      </div>

      {/* Tabs for Verification and Revenue */}
      <Tabs defaultValue="verification" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verification">Payment Verification</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
        </TabsList>

        {/* Payment Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pending Verifications</CardDescription>
                <CardTitle className="text-3xl">{pendingVerifications.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Approved Today</CardDescription>
                <CardTitle className="text-3xl text-green-600">
                  {completedVerifications.filter((v) => v.status === 'approved').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Rejected Today</CardDescription>
                <CardTitle className="text-3xl text-red-600">
                  {completedVerifications.filter((v) => v.status === 'rejected').length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Important Instructions */}
          <Alert className="border-[#591220] bg-[#591220]/5">
            <AlertCircle className="h-5 w-5 text-[#591220]" />
            <AlertDescription className="text-[#591220]">
              <strong>Verification Process:</strong> Check that the bKash payment was made from the customer's registered phone number. Approve if numbers match, reject if they don't match.
            </AlertDescription>
          </Alert>

          {/* Pending Verifications */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Payment Verifications</CardTitle>
              <CardDescription>
                {pendingVerifications.length > 0
                  ? 'Review and verify these payments'
                  : 'No pending verifications'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingVerifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">All payments have been verified</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVerifications.filter(v => v && v.id).map((verification) => {
                    const timeLeft = timeStamps[verification.id] || 0;
                    const isExpiring = timeLeft <= 30;

                    return (
                      <div
                        key={verification.id}
                        className={`border rounded-lg p-6 ${
                          isExpiring ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#591220]/10 flex items-center justify-center">
                              <Clock className={`h-6 w-6 ${isExpiring ? 'text-red-600 animate-pulse' : 'text-[#591220]'}`} />
                            </div>
                            <div>
                              <h3 className="mb-1">Payment Verification Request</h3>
                              <p className="text-sm text-gray-600">ID: {verification.id}</p>
                            </div>
                          </div>
                          <Badge variant={isExpiring ? 'destructive' : 'default'}>
                            {formatTime(timeLeft)}
                          </Badge>
                        </div>

                        {/* Timer Progress */}
                        <div className="mb-4">
                          <Progress
                            value={getProgressValue(timeLeft)}
                            className={`h-2 ${isExpiring ? 'bg-red-200' : ''}`}
                          />
                        </div>

                        {/* Customer & Order Details */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          {/* Customer Info */}
                          <div className="space-y-3">
                            <h4 className="text-sm text-gray-600 mb-3">Customer Information</h4>
                            <div className="bg-white rounded-lg p-4 space-y-3 border">
                              <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-600">Name</p>
                                  <p className="break-words">{verification.user?.name || 'Unknown User'}</p>
                                </div>
                              </div>
                              <Separator />
                              <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-[#591220] mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-600">Registered Phone</p>
                                  <p className="text-[#591220] break-words">{verification.userPhone}</p>
                                </div>
                              </div>
                              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
                                <p className="text-xs text-yellow-800">
                                  <strong>⚠️ Verify:</strong> Payment must be from this number
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div className="space-y-3">
                            <h4 className="text-sm text-gray-600 mb-3">Payment Details</h4>
                            <div className="bg-white rounded-lg p-4 space-y-3 border">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Amount</span>
                                <span className="text-[#591220]">
                                  ৳{verification.amount.toLocaleString()}
                                </span>
                              </div>
                              <Separator />
                              <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method</span>
                                <span>bKash</span>
                              </div>
                              <Separator />
                              <div className="flex flex-col gap-1">
                                <span className="text-gray-600">Transaction ID</span>
                                {verification.transactionId ? (
                                  <div className="bg-green-50 border border-green-200 rounded p-2">
                                    <span className="font-mono text-sm text-green-700 font-semibold break-all">
                                      {verification.transactionId}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                    <span className="text-xs text-yellow-700">
                                      Not provided by customer
                                    </span>
                                  </div>
                                )}
                              </div>
                              <Separator />
                              <div className="flex justify-between">
                                <span className="text-gray-600">Items</span>
                                <span>{verification.orderData.items.length} items</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Requested</span>
                                <span>
                                  {new Date(verification.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                          <h4 className="text-sm text-gray-600 mb-3">Order Items</h4>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {(verification.orderData?.items || []).filter(item => item).map((item, index) => (
                              <div key={index} className="flex items-center gap-3 text-sm">
                                <img
                                  src={item.product?.image || 'https://via.placeholder.com/48'}
                                  alt={item.product?.name || 'Product'}
                                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="line-clamp-1 break-words">{item.product?.name || 'Unknown Product'}</p>
                                  <p className="text-gray-600">Qty: {item.quantity || 0}</p>
                                </div>
                                <p className="flex-shrink-0">৳{((item.product?.price || 0) * (item.quantity || 0)).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApprove(verification.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={timeLeft <= 0}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Payment
                          </Button>
                          <Button
                            onClick={() => handleReject(verification.id)}
                            variant="outline"
                            className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                            disabled={timeLeft <= 0}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Payment
                          </Button>
                        </div>

                        {timeLeft <= 0 && (
                          <Alert className="mt-4 border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-600">
                              This verification request has expired
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {completedVerifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Recently processed payment verifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedVerifications.slice(0, 10).filter(v => v && v.id).map((verification) => (
                    <div
                      key={verification.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {verification.status === 'approved' ? (
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="break-words">{verification.user?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-600 break-words">{verification.userPhone || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                        <div className="text-right">
                          <p>৳{(verification.amount || 0).toLocaleString()}</p>
                          <Badge
                            variant={verification.status === 'approved' ? 'default' : 'destructive'}
                            className="mt-1"
                          >
                            {verification.status}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(verification.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Revenue Analytics Tab */}
        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Today's Revenue
                </CardDescription>
                <CardTitle className="text-3xl text-[#591220]">
                  ৳{revenueStats.dailyRevenue.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  This Month
                </CardDescription>
                <CardTitle className="text-3xl text-blue-600">
                  ৳{revenueStats.monthlyRevenue.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  This Year
                </CardDescription>
                <CardTitle className="text-3xl text-green-600">
                  ৳{revenueStats.yearlyRevenue.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Revenue
                </CardDescription>
                <CardTitle className="text-3xl text-purple-600">
                  ৳{revenueStats.totalRevenue.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Statistics</CardTitle>
                <CardDescription>Completed order details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Completed Orders</span>
                    <span className="text-2xl">{revenueStats.totalOrders}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Order Value</span>
                    <span className="text-2xl">
                      ৳{revenueStats.totalOrders > 0 
                        ? Math.round(revenueStats.totalRevenue / revenueStats.totalOrders).toLocaleString() 
                        : '0'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Insights</CardTitle>
                <CardDescription>Key performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Monthly Average</span>
                    <span className="text-2xl">
                      ৳{Math.round(revenueStats.yearlyRevenue / 12).toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Daily Average (This Month)</span>
                    <span className="text-2xl">
                      ৳{Math.round(revenueStats.monthlyRevenue / new Date().getDate()).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last 7 Days Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue Trend (Last 7 Days)</CardTitle>
              <CardDescription>Revenue breakdown for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueStats.dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `৳${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#591220" name="Revenue (৳)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Last 12 Months Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend (Last 12 Months)</CardTitle>
              <CardDescription>Revenue performance over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueStats.monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `৳${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#591220" 
                    strokeWidth={2}
                    name="Revenue (৳)"
                    dot={{ fill: '#591220', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
