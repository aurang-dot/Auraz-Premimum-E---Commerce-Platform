import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Package, CheckCircle, Truck, MapPin } from 'lucide-react';

interface TrackOrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrackOrderSheet({ open, onOpenChange }: TrackOrderSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <Package className="h-5 w-5" />
            Track Order
          </SheetTitle>
          <SheetDescription>Know the status of your order anytime</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 text-gray-700">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Track your order in real-time and stay updated on its delivery status.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-[#591220]">How to Track Your Order</h3>
            <ol className="list-decimal pl-5 space-y-3 text-sm">
              <li>Log in to your account</li>
              <li>Go to "My Orders" → select the order you want to track</li>
              <li>View the order status in real-time</li>
            </ol>
          </div>

          <div>
            <h3 className="mb-3 text-[#591220]">Order Status Flow</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Package className="h-5 w-5 text-yellow-700" />
                </div>
                <div>
                  <h4 className="text-gray-900">Pending</h4>
                  <p className="text-sm text-gray-600">Order placed and awaiting confirmation</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="text-gray-900">Confirmed</h4>
                  <p className="text-sm text-gray-600">Order confirmed and being prepared</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <h4 className="text-gray-900">Shipped</h4>
                  <p className="text-sm text-gray-600">Order is on the way to your location</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h4 className="text-gray-900">Delivered</h4>
                  <p className="text-sm text-gray-600">Order successfully delivered</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              Real-time tracking updates are supported when available by the seller/courier service.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
