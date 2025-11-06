import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Truck } from 'lucide-react';
import { Card } from '../ui/card';

interface ShippingPolicySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShippingPolicySheet({ open, onOpenChange }: ShippingPolicySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <Truck className="h-6 w-6" />
            Shipping Policy
          </SheetTitle>
          <SheetDescription>Delivery information and timelines</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-6">
          <Card className="p-5 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <p className="leading-relaxed flex items-start gap-2">
              <Truck className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>AURAZ ensures timely and reliable delivery of your orders.</span>
            </p>
          </Card>

          <Card className="p-5 border-l-4 border-l-blue-500">
            <h3 className="mb-3 text-[#591220]">1. Order Processing</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Orders are processed within 24–48 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Sellers are responsible for packaging and dispatching products.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-green-500">
            <h3 className="mb-3 text-[#591220]">2. Delivery Time</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Standard delivery: 3–7 business days (depending on location).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Express delivery (if available) may take 1–3 business days.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-purple-500">
            <h3 className="mb-3 text-[#591220]">3. Shipping Charges</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Shipping fees are calculated at checkout and vary by product and location.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Free shipping may apply on selected products or promotions.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-orange-500">
            <h3 className="mb-3 text-[#591220]">4. Tracking Orders</h3>
            <p className="text-sm text-gray-700">
              Users can track orders in real-time via their account.
            </p>
          </Card>

          <Card className="p-5 border-l-4 border-l-red-500 bg-red-50">
            <h3 className="mb-3 text-[#591220]">5. Delivery Issues</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>AURAZ works with sellers to resolve delays or damaged shipments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Customers should report any issue within 7 days of delivery.</span>
              </li>
            </ul>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
