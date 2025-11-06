import { useState } from 'react';
import { Check, X, Eye, AlertCircle, RefreshCcw, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { useApp, RefundRequest } from '../../lib/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export function AdminRefunds() {
  const { refundRequests, approveRefund, rejectRefund } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [adminNotes, setAdminNotes] = useState('');

  const handleViewRefund = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setIsViewDialogOpen(true);
  };

  const handleOpenActionDialog = (refund: RefundRequest, type: 'approve' | 'reject') => {
    setSelectedRefund(refund);
    setActionType(type);
    setAdminNotes('');
    setIsActionDialogOpen(true);
  };

  const handleSubmitAction = () => {
    if (!selectedRefund) return;

    if (actionType === 'approve') {
      approveRefund(selectedRefund.id, adminNotes);
    } else {
      rejectRefund(selectedRefund.id, adminNotes);
    }

    setIsActionDialogOpen(false);
    setSelectedRefund(null);
    setAdminNotes('');
  };

  const filteredRefunds = (refundRequests || [])
    .filter(r => {
      if (!r) return false;
      const matchesSearch = 
        (r.orderId || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (r.user?.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (r.user?.email || '').toLowerCase().includes((searchQuery || '').toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const stats = {
    total: refundRequests.length,
    pending: refundRequests.filter(r => r.status === 'pending').length,
    approved: refundRequests.filter(r => r.status === 'approved').length,
    rejected: refundRequests.filter(r => r.status === 'rejected').length,
    totalAmount: refundRequests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Refund Management</h1>
          <p className="text-gray-600">Review and process customer refund requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{stats.total}</span>
              <RefreshCcw className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">{stats.approved}</span>
              <Check className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-red-600">{stats.rejected}</span>
              <X className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Refunded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#591220]">৳{stats.totalAmount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRefunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <RefreshCcw className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No refund requests found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRefunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell>
                    <span className="font-mono text-sm">#{refund.orderId.slice(0, 8)}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{refund.user?.name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-500">{refund.user?.email || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">৳{refund.amount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 max-w-xs truncate">{refund.reason}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{new Date(refund.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{new Date(refund.createdAt).toLocaleTimeString()}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        refund.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : refund.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewRefund(refund)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {refund.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleOpenActionDialog(refund, 'approve')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleOpenActionDialog(refund, 'reject')}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Refund Request Details</DialogTitle>
            <DialogDescription>
              Complete information about this refund request
            </DialogDescription>
          </DialogHeader>
          {selectedRefund && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order ID</Label>
                  <p className="text-sm font-mono mt-1">#{selectedRefund.orderId}</p>
                </div>
                <div>
                  <Label>Refund Amount</Label>
                  <p className="text-sm mt-1 font-medium">৳{selectedRefund.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <p className="text-sm mt-1">{selectedRefund.user?.name || 'Unknown User'}</p>
                </div>
                <div>
                  <Label>Customer Email</Label>
                  <p className="text-sm mt-1">{selectedRefund.user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Phone</Label>
                  <p className="text-sm mt-1">{selectedRefund.user?.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge
                      className={
                        selectedRefund.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedRefund.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {selectedRefund.status.charAt(0).toUpperCase() + selectedRefund.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label>Refund Reason</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded border">{selectedRefund.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Requested On</Label>
                  <p className="text-sm mt-1">
                    {new Date(selectedRefund.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedRefund.processedAt && (
                  <div>
                    <Label>Processed On</Label>
                    <p className="text-sm mt-1">
                      {new Date(selectedRefund.processedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {selectedRefund.adminNotes && (
                <div>
                  <Label>Admin Notes</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded border">{selectedRefund.adminNotes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <Label className="mb-2 block">Order Items</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedRefund.order.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">৳{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Refund' : 'Reject Refund'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Confirm approval of this refund request'
                : 'Provide a reason for rejecting this refund request'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRefund && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Order ID: #{selectedRefund.orderId.slice(0, 8)}</p>
                <p className="text-sm text-gray-600">Customer: {selectedRefund.user?.name || 'Unknown User'}</p>
                <p className="font-medium mt-2">Amount: ৳{selectedRefund.amount.toLocaleString()}</p>
              </div>
            )}
            <div>
              <Label htmlFor="adminNotes">
                Admin Notes {actionType === 'reject' && '(Required)'}
              </Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={
                  actionType === 'approve'
                    ? 'Add any internal notes (optional)...'
                    : 'Explain why this refund is being rejected...'
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              className={
                actionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
              disabled={actionType === 'reject' && !adminNotes.trim()}
            >
              {actionType === 'approve' ? 'Approve Refund' : 'Reject Refund'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
