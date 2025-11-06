import { useState } from 'react';
import { Eye, Search, Package, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { useApp, Order } from '../../lib/AppContext';

export function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const filteredOrders = (orders || []).filter((order) => {
    if (!order) return false;
    const matchesSearch =
      (order.id || '').includes(searchQuery) ||
      (order.user?.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (order.user?.email || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Shipped' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };
    return (
      <Badge className={`${config.bg} ${config.text}`}>
        {config.label}
      </Badge>
    );
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete);
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
      if (selectedOrder?.id === orderToDelete) {
        setSelectedOrder(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Order Management</h1>
        <p className="text-gray-600">Track and manage all orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No orders found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p>{order.user?.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{order.user?.email || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={order.paymentMethod === 'Cash on Delivery' ? 'outline' : 'default'}>
                      {order.paymentMethod === 'Cash on Delivery' ? 'COD' : 'bKash'}
                    </Badge>
                  </TableCell>
                  <TableCell>৳{order.total.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
              <div className="space-y-6">
                {/* Status and Payment */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Order Status</p>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                    <Badge variant={selectedOrder.paymentMethod === 'Cash on Delivery' ? 'outline' : 'default'}>
                      {selectedOrder.paymentMethod}
                    </Badge>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="mb-3">Customer Information</h3>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p>{selectedOrder.user?.name || 'Unknown User'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p>{selectedOrder.user?.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p>{selectedOrder.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="mb-3">Shipping Address</h3>
                  <div className="border rounded-lg p-4">
                    <p>{selectedOrder.shippingAddress.name}</p>
                    <p className="text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                    <Separator className="my-2" />
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                    {selectedOrder.shippingAddress.landmark && (
                      <p className="text-sm text-gray-600 mt-1">Landmark: {selectedOrder.shippingAddress.landmark}</p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="mb-3">Order Items</h3>
                  <div className="border rounded-lg divide-y">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="p-4 flex items-start gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="break-words">{item.product.name}</p>
                          {item.variant && (
                            <p className="text-sm text-gray-500 mt-1">
                              {Object.entries(item.variant)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            ৳{(item.product?.price || 0).toLocaleString()} × {item.quantity || 0}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p>৳{((item.product?.price || 0) * (item.quantity || 0)).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="mb-3">Payment Summary</h3>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>৳{(selectedOrder.total - selectedOrder.deliveryCharge + (selectedOrder.voucherDiscount || 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Charge</span>
                      <span>৳{selectedOrder.deliveryCharge.toLocaleString()}</span>
                    </div>
                    {selectedOrder.voucherDiscount && selectedOrder.voucherDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Voucher Discount ({selectedOrder.voucherCode})</span>
                        <span>-৳{selectedOrder.voucherDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span>৳{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDeleteClick(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Order
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
