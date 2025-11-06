import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { useApp } from '../lib/AppContext';

export function CartPage() {
  const { cart, updateCartQuantity, removeFromCart } = useApp();
  const cartItems = cart;
  const [voucherCode, setVoucherCode] = useState('');

  const updateQuantity = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity);
  };

  const removeItem = (productId: string) => {
    removeFromCart(productId);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = subtotal >= 1000 ? 0 : 60;
  const discount = 0; // Would calculate based on voucher
  const total = subtotal + shippingCost - discount;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="mb-3">Your cart is empty!</h2>
          <p className="text-gray-600 mb-6">Start shopping now and add items to your cart.</p>
          <Link to="/">
            <Button size="lg" className="bg-[#591220] hover:bg-[#6d1728]">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      <h1 className="mb-4 md:mb-6 text-2xl md:text-3xl">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          {cartItems.map((item) => (
            <div key={item.productId} className="bg-white border rounded-lg p-3 md:p-4">
              <div className="flex gap-3 md:gap-4">
                {/* Product Image */}
                <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.productId}`}>
                    <h3 className="text-sm md:text-base line-clamp-2 mb-1 hover:text-[#591220] break-words">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  {/* Variants */}
                  {item.variant && (
                    <div className="flex flex-wrap gap-1 md:gap-2 mb-2">
                      {Object.entries(item.variant).map(([key, value]) => (
                        <span key={key} className="text-xs md:text-sm text-gray-600 break-words">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  <p className="text-sm md:text-base text-[#591220] mb-2 md:mb-3 whitespace-nowrap">
                    ৳{(item.product?.price || 0).toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 md:gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 md:w-12 text-center text-sm md:text-base">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs md:text-sm h-7 md:h-8 px-2 md:px-3 flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stock Warning */}
              {item.product.stock < 10 && item.product.stock > 0 && (
                <div className="mt-2 md:mt-3 text-xs md:text-sm text-orange-600 break-words">
                  Only {item.product.stock} left in stock
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-4 md:p-6 lg:sticky lg:top-24">
            <h3 className="mb-3 md:mb-4 text-base md:text-lg">Order Summary</h3>

            <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="break-words">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `৳${shippingCost}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 text-sm md:text-base">
                  <span>Discount</span>
                  <span>-৳{discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <Separator className="my-3 md:my-4" />

            <div className="flex justify-between mb-4 md:mb-6 text-base md:text-lg">
              <span>Total</span>
              <span className="text-[#591220] break-words">৳{total.toLocaleString()}</span>
            </div>

            {/* Voucher */}
            <div className="mb-3 md:mb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Voucher code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="text-sm md:text-base h-9 md:h-10"
                />
                <Button variant="outline" className="text-xs md:text-sm h-9 md:h-10 px-3 md:px-4 whitespace-nowrap">Apply</Button>
              </div>
            </div>

            {/* Shipping Notice */}
            {shippingCost > 0 && (
              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 break-words">
                Add ৳{(1000 - subtotal).toLocaleString()} more for free shipping
              </p>
            )}

            <Link to="/checkout">
              <Button size="lg" className="w-full bg-[#591220] hover:bg-[#6d1728] text-sm md:text-base h-10 md:h-11">
                Proceed to Checkout
              </Button>
            </Link>

            <Link to="/">
              <Button variant="outline" size="lg" className="w-full mt-2 md:mt-3 text-sm md:text-base h-10 md:h-11">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
