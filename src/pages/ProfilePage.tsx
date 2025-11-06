import { useState, useEffect } from 'react';
import { MapPin, CreditCard, Plus, Trash2, Check, Smartphone, Banknote, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useApp } from '../lib/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ProfileSidebar } from '../components/ProfileSidebar';

export function ProfilePage() {
  const navigate = useNavigate();
  
  const {
    currentUser,
    updateUserProfile,
    addAddress,
    deleteAddress,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    orders,
    refundRequests,
    createRefundRequest,
  } = useApp();

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
    gender: currentUser?.gender || '',
  });

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    landmark: '',
  });

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: 'bkash' as const,
    name: '',
    details: '',
    isDefault: false,
  });

  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<string>('');
  const [refundReason, setRefundReason] = useState('');

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

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, profileData);
  };

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.phone && newAddress.street && newAddress.city && newAddress.postalCode) {
      addAddress(currentUser.id, newAddress);
      setNewAddress({ name: '', phone: '', street: '', city: '', postalCode: '', landmark: '' });
      setIsAddAddressOpen(false);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      deleteAddress(currentUser.id, addressId);
    }
  };

  const handleAddPayment = () => {
    if (newPayment.name && newPayment.details) {
      addPaymentMethod(currentUser.id, newPayment);
      setNewPayment({ type: 'bkash', name: '', details: '', isDefault: false });
      setIsAddPaymentOpen(false);
    }
  };

  const handleDeletePayment = (methodId: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      deletePaymentMethod(currentUser.id, methodId);
    }
  };

  const handleSetDefaultPayment = (methodId: string) => {
    // First, set all to non-default
    currentUser.paymentMethods.forEach((method) => {
      if (method.id !== methodId && method.isDefault) {
        updatePaymentMethod(currentUser.id, method.id, { isDefault: false });
      }
    });
    // Then set the selected one as default
    updatePaymentMethod(currentUser.id, methodId, { isDefault: true });
  };

  const handleRequestRefund = () => {
    if (selectedOrderForRefund && refundReason.trim()) {
      createRefundRequest(selectedOrderForRefund, refundReason);
      setIsRefundDialogOpen(false);
      setSelectedOrderForRefund('');
      setRefundReason('');
    }
  };

  // Get user's eligible orders for refund (delivered orders only)
  const eligibleRefundOrders = orders.filter(
    order => order.userId === currentUser.id && order.status === 'delivered'
  );

  // Get user's refund requests
  const userRefundRequests = refundRequests.filter(req => req.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl mb-2">My Account</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your profile, addresses, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar currentUser={currentUser} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <TabsList className="w-full inline-flex md:grid md:grid-cols-5 h-auto p-0 bg-transparent border-b border-gray-200 rounded-none min-w-max md:min-w-full">
                  <TabsTrigger 
                    value="profile" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#591220] data-[state=active]:text-[#591220] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 whitespace-nowrap text-sm"
                  >
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="addresses" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#591220] data-[state=active]:text-[#591220] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 whitespace-nowrap text-sm"
                  >
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payment" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#591220] data-[state=active]:text-[#591220] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 whitespace-nowrap text-sm"
                  >
                    Payment
                  </TabsTrigger>
                  <TabsTrigger 
                    value="refunds" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#591220] data-[state=active]:text-[#591220] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 whitespace-nowrap text-sm"
                  >
                    Refunds
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#591220] data-[state=active]:text-[#591220] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 whitespace-nowrap text-sm"
                  >
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm">Full Name *</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            placeholder="Enter your full name"
                            className="h-11 w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            placeholder="your.email@example.com"
                            className="h-11 w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            placeholder="+880 1234 567 890"
                            className="h-11 w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dob" className="text-sm">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                            className="h-11 w-full"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="gender" className="text-sm">Gender</Label>
                          <Select
                            value={profileData.gender}
                            onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                          >
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t">
                        <Button type="submit" className="bg-[#591220] hover:bg-[#6d1728] px-6 md:px-8 w-full md:w-auto">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Saved Addresses</CardTitle>
                        <CardDescription>Manage your delivery addresses</CardDescription>
                      </div>
                      <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#591220] hover:bg-[#6d1728]">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Address
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                            <DialogDescription>
                              Enter the details for your new delivery address
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="addr-name" className="text-sm">Full Name *</Label>
                                <Input
                                  id="addr-name"
                                  value={newAddress.name}
                                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                  placeholder="John Doe"
                                  className="w-full"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="addr-phone" className="text-sm">Phone Number *</Label>
                                <Input
                                  id="addr-phone"
                                  value={newAddress.phone}
                                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                  placeholder="+880 1234 567 890"
                                  className="w-full"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="addr-street" className="text-sm">Street Address *</Label>
                                <Input
                                  id="addr-street"
                                  value={newAddress.street}
                                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                  placeholder="123 Main Street, Apartment 4B"
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="addr-city" className="text-sm">City *</Label>
                                <Input
                                  id="addr-city"
                                  value={newAddress.city}
                                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                  placeholder="Dhaka"
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="addr-postal" className="text-sm">Postal Code *</Label>
                                <Input
                                  id="addr-postal"
                                  value={newAddress.postalCode}
                                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                  placeholder="1000"
                                  className="w-full"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="addr-landmark" className="text-sm">Landmark (Optional)</Label>
                                <Input
                                  id="addr-landmark"
                                  value={newAddress.landmark}
                                  onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                  placeholder="Near City Hospital"
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button variant="outline" onClick={() => setIsAddAddressOpen(false)} className="w-full sm:w-auto">
                              Cancel
                            </Button>
                            <Button onClick={handleAddAddress} className="bg-[#591220] hover:bg-[#6d1728] w-full sm:w-auto">
                              Add Address
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {currentUser.addresses.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <MapPin className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mb-2">No addresses saved yet</h3>
                        <p className="text-gray-600 mb-6">Add your first delivery address to get started</p>
                        <Button
                          onClick={() => setIsAddAddressOpen(true)}
                          className="bg-[#591220] hover:bg-[#6d1728]"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Address
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {currentUser.addresses.map((address) => (
                          <div
                            key={address.id}
                            className="border border-gray-200 rounded-lg p-4 md:p-5 hover:border-[#591220] hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between mb-3 gap-2">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-full bg-[#591220]/10 flex items-center justify-center flex-shrink-0">
                                  <MapPin className="h-5 w-5 text-[#591220]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-sm truncate">{address.name}</h4>
                                  <p className="text-xs text-gray-500 break-all">{address.phone}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-700 break-words">{address.street}</p>
                              <p className="text-gray-600 break-words">
                                {address.city} - {address.postalCode}
                              </p>
                              {address.landmark && (
                                <p className="text-gray-500 text-xs break-words">
                                  Landmark: {address.landmark}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payment Methods Tab */}
              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Manage your payment options for quick checkout</CardDescription>
                      </div>
                      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#591220] hover:bg-[#6d1728]">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Payment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Add Payment Method</DialogTitle>
                            <DialogDescription>
                              Add a new payment method for quick checkout
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-3">
                              <Label className="text-sm">Payment Type</Label>
                              <RadioGroup
                                value={newPayment.type}
                                onValueChange={(value: 'bkash' | 'card' | 'nagad') =>
                                  setNewPayment({ ...newPayment, type: value })
                                }
                                className="grid grid-cols-3 gap-2 md:gap-3"
                              >
                                <div>
                                  <RadioGroupItem value="bkash" id="bkash-new" className="peer sr-only" />
                                  <Label
                                    htmlFor="bkash-new"
                                    className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-3 md:p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#591220] peer-data-[state=checked]:bg-[#591220]/5 cursor-pointer"
                                  >
                                    <Smartphone className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2" />
                                    <span className="text-xs md:text-sm">bKash</span>
                                  </Label>
                                </div>
                                <div>
                                  <RadioGroupItem value="nagad" id="nagad-new" className="peer sr-only" />
                                  <Label
                                    htmlFor="nagad-new"
                                    className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-3 md:p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#591220] peer-data-[state=checked]:bg-[#591220]/5 cursor-pointer"
                                  >
                                    <Banknote className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2" />
                                    <span className="text-xs md:text-sm">Nagad</span>
                                  </Label>
                                </div>
                                <div>
                                  <RadioGroupItem value="card" id="card-new" className="peer sr-only" />
                                  <Label
                                    htmlFor="card-new"
                                    className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-3 md:p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#591220] peer-data-[state=checked]:bg-[#591220]/5 cursor-pointer"
                                  >
                                    <CreditCard className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2" />
                                    <span className="text-xs md:text-sm">Card</span>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="pay-name" className="text-sm">Name</Label>
                              <Input
                                id="pay-name"
                                value={newPayment.name}
                                onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                                placeholder={
                                  newPayment.type === 'card'
                                    ? 'My Visa Card'
                                    : newPayment.type === 'bkash'
                                    ? 'My bKash Account'
                                    : 'My Nagad Account'
                                }
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="pay-details" className="text-sm">
                                {newPayment.type === 'card'
                                  ? 'Card Number (Last 4 digits)'
                                  : 'Mobile Number'}
                              </Label>
                              <Input
                                id="pay-details"
                                value={newPayment.details}
                                onChange={(e) => setNewPayment({ ...newPayment, details: e.target.value })}
                                placeholder={
                                  newPayment.type === 'card' ? '1234' : '01712345678'
                                }
                                className="w-full"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="default-payment"
                                checked={newPayment.isDefault}
                                onChange={(e) =>
                                  setNewPayment({ ...newPayment, isDefault: e.target.checked })
                                }
                                className="rounded border-gray-300 text-[#591220] focus:ring-[#591220]"
                              />
                              <Label htmlFor="default-payment" className="text-sm">
                                Set as default payment method
                              </Label>
                            </div>
                          </div>
                          <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button variant="outline" onClick={() => setIsAddPaymentOpen(false)} className="w-full sm:w-auto">
                              Cancel
                            </Button>
                            <Button onClick={handleAddPayment} className="bg-[#591220] hover:bg-[#6d1728] w-full sm:w-auto">
                              Add Payment Method
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {currentUser.paymentMethods.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <CreditCard className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mb-2">No payment methods saved yet</h3>
                        <p className="text-gray-600 mb-6">Add a payment method for quick checkout</p>
                        <Button
                          onClick={() => setIsAddPaymentOpen(true)}
                          className="bg-[#591220] hover:bg-[#6d1728]"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Payment Method
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {currentUser.paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className="border border-gray-200 rounded-lg p-4 md:p-5 hover:border-[#591220] hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between mb-3 gap-2">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-full bg-[#591220]/10 flex items-center justify-center flex-shrink-0">
                                  {method.type === 'card' ? (
                                    <CreditCard className="h-5 w-5 text-[#591220]" />
                                  ) : (
                                    <Smartphone className="h-5 w-5 text-[#591220]" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h4 className="text-sm truncate">{method.name}</h4>
                                    {method.isDefault && (
                                      <span className="text-xs bg-[#591220] text-white px-2 py-0.5 rounded whitespace-nowrap">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 capitalize">{method.type}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePayment(method.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-700 mb-3 break-all">
                              {method.type === 'card' ? `•••• ${method.details}` : method.details}
                            </p>
                            {!method.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefaultPayment(method.id)}
                                className="w-full text-[#591220] border-[#591220] hover:bg-[#591220] hover:text-white text-xs md:text-sm"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Set as Default
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Refunds Tab */}
              <TabsContent value="refunds">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Refund Requests</CardTitle>
                        <CardDescription>Request refunds for delivered orders</CardDescription>
                      </div>
                      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#591220] hover:bg-[#6d1728]">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Request Refund
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Request Refund</DialogTitle>
                            <DialogDescription>
                              Select a delivered order and provide a reason for refund
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Select Order</Label>
                              <Select
                                value={selectedOrderForRefund}
                                onValueChange={setSelectedOrderForRefund}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose an order" />
                                </SelectTrigger>
                                <SelectContent>
                                  {eligibleRefundOrders.map((order) => (
                                    <SelectItem key={order.id} value={order.id}>
                                      Order #{order.id} - ৳{order.total.toFixed(2)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Reason for Refund</Label>
                              <Textarea
                                placeholder="Please explain why you're requesting a refund..."
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsRefundDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-[#591220] hover:bg-[#6d1728]"
                              onClick={handleRequestRefund}
                              disabled={!selectedOrderForRefund || !refundReason.trim()}
                            >
                              Submit Request
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {userRefundRequests.length === 0 ? (
                      <div className="text-center py-12">
                        <RefreshCw className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No refund requests yet</p>
                        <p className="text-sm text-gray-400 mt-2">
                          You can request refunds for delivered orders
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userRefundRequests.map((refund) => {
                          const order = orders.find(o => o.id === refund.orderId);
                          return (
                            <div
                              key={refund.id}
                              className="border rounded-lg p-4 space-y-3"
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">Order #{refund.orderId}</p>
                                    <Badge
                                      variant={
                                        refund.status === 'approved'
                                          ? 'default'
                                          : refund.status === 'rejected'
                                          ? 'destructive'
                                          : 'secondary'
                                      }
                                      className={
                                        refund.status === 'approved'
                                          ? 'bg-green-500'
                                          : refund.status === 'pending'
                                          ? 'bg-yellow-500'
                                          : ''
                                      }
                                    >
                                      {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Amount: ৳{refund.amount.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Requested: {new Date(refund.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm">
                                  <span className="font-medium">Reason:</span> {refund.reason}
                                </p>
                                {refund.adminNotes && (
                                  <div className="bg-gray-50 p-3 rounded border">
                                    <p className="text-sm">
                                      <span className="font-medium">Admin Notes:</span>{' '}
                                      {refund.adminNotes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and account security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" placeholder="Enter current password" className="h-11" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="Enter new password" className="h-11" />
                        <p className="text-xs text-gray-500">Must be at least 8 characters with letters and numbers</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm new password" className="h-11" />
                      </div>

                      <div className="flex justify-end pt-4 border-t">
                        <Button type="submit" className="bg-[#591220] hover:bg-[#6d1728] px-8">
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
