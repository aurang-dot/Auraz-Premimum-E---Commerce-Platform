import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, CreditCard, Smartphone, Banknote, CheckCircle2, Plus, Clock, Copy, AlertCircle, Tag, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useApp } from '../lib/AppContext';
import type { Address } from '../lib/AppContext';
import qrCodeImage from 'figma:asset/2e2d5a2c1148a6b9f95f31dbeaea93375e3f38ed.png';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    currentUser, 
    placeOrder, 
    requestPaymentVerification, 
    getPaymentVerification, 
    clearCart, 
    paymentVerifications,
    calculateDeliveryCharge,
    validateVoucher,
    applyVoucher,
  } = useApp();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    currentUser?.addresses && currentUser.addresses.length > 0 ? currentUser.addresses[0] : null
  );
  const [paymentType, setPaymentType] = useState<'cod' | 'online'>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [verificationId, setVerificationId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  
  // Transaction ID state
  const [transactionId, setTransactionId] = useState('');
  
  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Calculate delivery charge based on selected address
  const deliveryCharge = selectedAddress 
    ? calculateDeliveryCharge(selectedAddress.city, subtotal)
    : 60;
    
  // Calculate voucher discount
  const voucherDiscount = appliedVoucher 
    ? appliedVoucher.type === 'percentage'
      ? Math.min(
          (subtotal * appliedVoucher.value) / 100,
          appliedVoucher.maxDiscount || Infinity
        )
      : appliedVoucher.value
    : 0;
    
  const total = subtotal + deliveryCharge - voucherDiscount;

  const PAYMENT_NUMBER = '01625691878';

  // Check if user has a pending payment verification on mount
  useEffect(() => {
    if (currentUser) {
      const pendingVerification = paymentVerifications.find(
        v => v.userId === currentUser.id && v.status === 'pending'
      );
      if (pendingVerification) {
        const now = new Date().getTime();
        const expiresAt = new Date(pendingVerification.expiresAt).getTime();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        
        if (remaining > 0) {
          setVerificationId(pendingVerification.id);
          setTimeLeft(remaining);
          setIsWaitingForApproval(true);
          setCurrentStep(3);
        }
      }
    }
  }, [currentUser]);

  // Countdown timer
  useEffect(() => {
    if (!isWaitingForApproval || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsWaitingForApproval(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWaitingForApproval, timeLeft]);

  // Check payment verification status
  useEffect(() => {
    if (!verificationId || !isWaitingForApproval) return;

    const checkStatus = setInterval(() => {
      try {
        const storedVerifications = localStorage.getItem('auraz_paymentVerifications');
        if (!storedVerifications) return;
        
        const verifications = JSON.parse(storedVerifications);
        const verification = verifications.find((v: any) => v.id === verificationId);
        
        if (verification?.status === 'approved') {
          clearInterval(checkStatus);
          setIsWaitingForApproval(false);
          clearCart();
          setShowSuccess(true);
          setTimeout(() => {
            navigate('/orders');
          }, 3000);
        } else if (verification?.status === 'rejected') {
          clearInterval(checkStatus);
          setIsWaitingForApproval(false);
          alert('Payment verification failed. Please try again or contact support at aurazsupport@gmail.com');
          setCurrentStep(2);
        } else if (verification?.status === 'expired' || timeLeft <= 0) {
          clearInterval(checkStatus);
          setIsWaitingForApproval(false);
          alert('Payment verification expired. Please try again.');
          setCurrentStep(2);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    }, 2000);

    return () => clearInterval(checkStatus);
  }, [verificationId, isWaitingForApproval, navigate, timeLeft, clearCart]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(PAYMENT_NUMBER);
    alert('Payment number copied to clipboard!');
  };

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      setVoucherError('Please enter a voucher code');
      return;
    }
    
    const validation = validateVoucher(voucherCode, subtotal, currentUser?.id);
    
    if (!validation.valid) {
      setVoucherError(validation.message);
      setAppliedVoucher(null);
      return;
    }
    
    setAppliedVoucher(validation.voucher);
    setVoucherError('');
    toast.success(`Voucher applied! You saved ৳${voucherDiscount}`);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setVoucherError('');
  };

  const handlePlaceOrder = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (!paymentType) {
      alert('Please select a payment method');
      return;
    }

    // For online payment, transaction ID is optional but recommended
    if (paymentType === 'online' && !transactionId.trim()) {
      const confirmed = confirm('Transaction ID not entered. It helps us verify your payment faster. Continue anyway?');
      if (!confirmed) return;
    }

    const orderData = {
      userId: currentUser.id,
      user: currentUser,
      items: cart,
      total: total,
      status: 'pending' as const,
      shippingAddress: selectedAddress,
      paymentMethod: paymentType === 'cod' ? 'Cash on Delivery' : 'bKash Payment',
      deliveryCharge,
      voucherDiscount: appliedVoucher ? voucherDiscount : undefined,
      voucherCode: appliedVoucher ? appliedVoucher.code : undefined,
    };

    if (paymentType === 'cod') {
      // Direct order placement for COD
      placeOrder(orderData);
      
      // Apply voucher if used
      if (appliedVoucher) {
        applyVoucher(appliedVoucher.code, currentUser.id);
      }
      
      // Clear the cart after COD order
      clearCart();
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } else {
      // Request payment verification for online payment
      const vId = requestPaymentVerification(orderData, total, transactionId.trim());
      setVerificationId(vId);
      
      // Clear the cart immediately after submitting for verification
      clearCart();
      
      setIsWaitingForApproval(true);
      setTimeLeft(180);
      setCurrentStep(3);
      
      // Apply voucher will happen after payment approval
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mb-3">Order placed successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for your order. We'll send you a confirmation email shortly.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/orders')} className="bg-[#591220] hover:bg-[#6d1728]">
              Track Order
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Payment waiting screen
  if (isWaitingForApproval) {
    const progressValue = (timeLeft / 180) * 100;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <h2 className="mb-2">Waiting for Payment Verification</h2>
              <p className="text-gray-600">Please wait while admin verifies your payment</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Time Remaining</span>
                <span className="text-2xl text-[#591220]">{formatTime(timeLeft)}</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-sm mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span>bKash</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Phone</span>
                  <span>{currentUser?.phone}</span>
                </div>
              </div>
            </div>

            <Alert className="border-[#591220] bg-[#591220]/5">
              <AlertCircle className="h-4 w-4 text-[#591220]" />
              <AlertDescription className="text-[#591220]">
                <strong>Important:</strong> Admin is verifying that the payment was made from your registered phone number ({currentUser?.phone}). Please ensure you used this number for payment.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="w-2 h-2 bg-[#591220] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#591220] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#591220] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step <= currentStep
                    ? 'bg-[#591220] border-[#591220] text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                {step < currentStep ? <Check className="h-5 w-5" /> : step}
              </div>
              <span className={`ml-2 ${step <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                {step === 1 ? 'Address' : 'Payment'}
              </span>
              {step < 2 && <div className="w-16 h-0.5 bg-gray-300 ml-4" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Address */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="mb-6">Shipping Address</h2>

              {currentUser?.addresses && currentUser.addresses.length > 0 ? (
                <div className="space-y-4">
                  <RadioGroup
                    value={selectedAddress?.id}
                    onValueChange={(value) => {
                      const address = currentUser.addresses.find((a) => a.id === value);
                      setSelectedAddress(address || null);
                    }}
                  >
                    {currentUser.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="flex items-start gap-3 p-4 border rounded-lg hover:border-[#591220] transition-colors"
                      >
                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                        <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                          <p>{address.name}</p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="text-sm text-gray-600 mt-1">{address.street}</p>
                          <p className="text-sm text-gray-600">
                            {address.city} - {address.postalCode}
                          </p>
                          {address.landmark && (
                            <p className="text-sm text-gray-500 mt-1">Landmark: {address.landmark}</p>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/profile')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No addresses found. Please add a delivery address.</p>
                  <Button onClick={() => navigate('/profile')} className="bg-[#591220] hover:bg-[#6d1728]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              )}

              {currentUser?.addresses && currentUser.addresses.length > 0 && (
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedAddress}
                    className="bg-[#591220] hover:bg-[#6d1728]"
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="mb-6">Payment Method</h2>

              <RadioGroup value={paymentType} onValueChange={(value: 'cod' | 'online') => setPaymentType(value)}>
                {/* Cash on Delivery */}
                <div className="border rounded-lg p-4 hover:border-[#591220] transition-colors mb-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="cod" id="cod" className="mt-1" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <Banknote className="h-5 w-5 text-[#591220]" />
                        <div>
                          <p>Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Pay when you receive your order</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>

                {/* Online Payment */}
                <div className="border rounded-lg p-4 hover:border-[#591220] transition-colors">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="online" id="online" className="mt-1" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <Smartphone className="h-5 w-5 text-[#591220]" />
                        <div>
                          <p>Make Payment (bKash)</p>
                          <p className="text-sm text-gray-500">Pay now via bKash mobile payment</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Payment Details */}
                  {paymentType === 'online' && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <Alert className="border-[#591220] bg-[#591220]/5">
                        <AlertCircle className="h-4 w-4 text-[#591220]" />
                        <AlertDescription className="text-[#591220]">
                          <strong>Important:</strong> You must make the payment from your registered phone number <strong>{currentUser?.phone}</strong> for verification.
                        </AlertDescription>
                      </Alert>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* QR Code */}
                        <div className="space-y-3">
                          <h3 className="text-sm">Scan QR Code</h3>
                          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center">
                            <img
                              src={qrCodeImage}
                              alt="bKash Payment QR Code"
                              className="w-48 h-48 object-contain"
                            />
                          </div>
                          <p className="text-xs text-gray-500 text-center">
                            Open bKash app and scan this QR code
                          </p>
                        </div>

                        {/* Manual Payment Details */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm mb-3">Or Send Money Manually</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <div>
                                <label className="text-xs text-gray-600">bKash Number</label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Input
                                    value={PAYMENT_NUMBER}
                                    readOnly
                                    className="flex-1 bg-white"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyNumber}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <label className="text-xs text-gray-600">Amount to Pay</label>
                                <Input
                                  value={`৳${total.toLocaleString()}`}
                                  readOnly
                                  className="mt-1 bg-white text-[#591220]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Instructions */}
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-sm mb-2">Payment Steps:</h4>
                            <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                              <li>Open your bKash app</li>
                              <li>Select "Send Money"</li>
                              <li>Enter the number above</li>
                              <li>Enter the exact amount</li>
                              <li>Complete the payment</li>
                              <li>Note your Transaction ID</li>
                              <li>Enter Transaction ID below</li>
                              <li>Click "I've Paid" below</li>
                            </ol>
                          </div>
                          
                          {/* Transaction ID Input */}
                          <div>
                            <label className="text-sm mb-2 block">Transaction ID (Optional)</label>
                            <Input
                              placeholder="Enter bKash Transaction ID"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              className="w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Enter the TrxID from your bKash payment confirmation (e.g., BKA1234567890)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </RadioGroup>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={!paymentType}
                  className="bg-[#591220] hover:bg-[#6d1728]"
                >
                  {paymentType === 'cod' ? 'Place Order' : "I've Paid - Verify Now"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h3 className="mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm line-clamp-2">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Voucher Section */}
            <div className="mb-4">
              <Label className="text-sm mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Have a voucher code?
              </Label>
              {!appliedVoucher ? (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter code"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleApplyVoucher}
                    variant="outline"
                    size="sm"
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-800">
                      <strong>{appliedVoucher.code}</strong> applied
                    </p>
                    <p className="text-xs text-green-600">
                      You saved ৳{voucherDiscount.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={handleRemoveVoucher}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {voucherError && (
                <p className="text-xs text-red-600 mt-1">{voucherError}</p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Delivery Charge
                  {deliveryCharge === 0 && (
                    <span className="text-green-600 ml-1">(Free)</span>
                  )}
                </span>
                <span>৳{deliveryCharge}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Voucher Discount</span>
                  <span>-৳{voucherDiscount.toLocaleString()}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-[#591220]">৳{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery Info */}
            {selectedAddress && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Delivering to:</p>
                <p className="text-sm">{selectedAddress.city}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {(selectedAddress.city || '').toLowerCase().includes('dhaka')
                    ? `Inside Dhaka - ৳${deliveryCharge} delivery charge`
                    : `Outside Dhaka - ৳${deliveryCharge} delivery charge`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
