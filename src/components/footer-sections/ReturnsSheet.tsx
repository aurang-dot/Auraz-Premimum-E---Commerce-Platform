import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { RotateCcw, ShieldCheck } from 'lucide-react';

interface ReturnsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReturnsSheet({ open, onOpenChange }: ReturnsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Returns & Refunds
          </SheetTitle>
          <SheetDescription>Shop confidently with AURAZ</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 text-gray-700">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-green-700 mt-0.5" />
            <div>
              <h4 className="text-green-900 mb-1">Hassle-Free Returns</h4>
              <p className="text-sm text-green-800">
                Returns accepted within 7 days of delivery (check product-specific return policy)
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-[#591220]">Return Policy</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Returns accepted within 7 days of delivery</li>
              <li>Product must be unused and in original packaging</li>
              <li>Check product-specific return policy before purchasing</li>
              <li>Refunds processed within 3–5 business days after receiving the returned product</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[#591220]">Steps to Return an Item</h3>
            <ol className="list-decimal pl-5 space-y-3 text-sm">
              <li>Go to "My Orders" in your account</li>
              <li>Select the order you want to return</li>
              <li>Click "Request Return/Refund"</li>
              <li>Choose the reason for return</li>
              <li>Follow instructions to ship back the product</li>
              <li>Refunds will be applied to the original payment method</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-yellow-900 mb-2">Important Note</h4>
            <p className="text-sm text-yellow-800">
              Certain products like intimate wear, cosmetics, and personalized items may not be eligible for returns due to hygiene reasons. Please check the product page before ordering.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
