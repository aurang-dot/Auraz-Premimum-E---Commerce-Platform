import { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
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
import { Switch } from '../../components/ui/switch';
import { useApp, Voucher } from '../../lib/AppContext';

export function AdminVouchers() {
  const { vouchers, addVoucher, updateVoucher, deleteVoucher } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    description: '',
    minOrderAmount: 0,
    maxDiscount: 0,
    validFrom: '',
    validUntil: '',
    usageLimit: 100,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      description: '',
      minOrderAmount: 0,
      maxDiscount: 0,
      validFrom: '',
      validUntil: '',
      usageLimit: 100,
      isActive: true,
    });
    setEditingVoucher(null);
  };

  const handleOpenDialog = (voucher?: Voucher) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData({
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
        description: voucher.description,
        minOrderAmount: voucher.minOrderAmount,
        maxDiscount: voucher.maxDiscount || 0,
        validFrom: voucher.validFrom,
        validUntil: voucher.validUntil,
        usageLimit: voucher.usageLimit,
        isActive: voucher.isActive,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVoucher) {
      updateVoucher(editingVoucher.id, formData);
    } else {
      addVoucher(formData);
    }
    
    handleCloseDialog();
  };

  const handleDelete = (voucherId: string) => {
    if (confirm('Are you sure you want to delete this voucher?')) {
      deleteVoucher(voucherId);
    }
  };

  const filteredVouchers = (vouchers || []).filter(v =>
    v && (
      (v.code || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (v.description || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Voucher Management</h1>
          <p className="text-gray-600">Create and manage discount vouchers</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#591220] hover:bg-[#6d1728]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Voucher
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search vouchers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min. Order</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Tag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No vouchers found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredVouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-[#591220]" />
                      <span className="font-mono">{voucher.code || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {voucher.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {voucher.type === 'percentage' 
                      ? `${voucher.value || 0}%`
                      : `৳${voucher.value || 0}`}
                    {voucher.maxDiscount && voucher.type === 'percentage' && (
                      <span className="text-xs text-gray-500 ml-1">(max: ৳{voucher.maxDiscount})</span>
                    )}
                  </TableCell>
                  <TableCell>৳{voucher.minOrderAmount || 0}</TableCell>
                  <TableCell>
                    {voucher.usedCount || 0} / {voucher.usageLimit || 0}
                  </TableCell>
                  <TableCell>
                    {voucher.validUntil ? new Date(voucher.validUntil).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={voucher.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {voucher.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(voucher)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(voucher.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingVoucher ? 'Edit Voucher' : 'Create New Voucher'}
            </DialogTitle>
            <DialogDescription>
              {editingVoucher ? 'Update voucher details' : 'Create a new discount voucher for customers'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Voucher Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., WELCOME20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Discount Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">
                  {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (৳)'} *
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value || ''}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value ? parseFloat(e.target.value) : 0 })}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {formData.type === 'percentage' && (
                <div>
                  <Label htmlFor="maxDiscount">Max Discount (৳)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={formData.maxDiscount || ''}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? parseFloat(e.target.value) : 0 })}
                    min="0"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Get 20% off on your first order"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minOrderAmount">Min. Order Amount (৳) *</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  value={formData.minOrderAmount || ''}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value ? parseFloat(e.target.value) : 0 })}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="usageLimit">Usage Limit *</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit || ''}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : 1 })}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#591220] hover:bg-[#6d1728]">
                {editingVoucher ? 'Update Voucher' : 'Create Voucher'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
