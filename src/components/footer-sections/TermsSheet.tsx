import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { FileText } from 'lucide-react';
import { Card } from '../ui/card';

interface TermsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsSheet({ open, onOpenChange }: TermsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Terms & Conditions
          </SheetTitle>
          <SheetDescription>Please read our terms carefully</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-6">
          <Card className="p-5 bg-gradient-to-br from-[#591220] to-[#6d1628] text-white">
            <p className="leading-relaxed">
              Welcome to AURAZ! By accessing or using the AURAZ platform, you agree to comply with and be bound by these Terms & Conditions.
            </p>
          </Card>

          <Card className="p-5 border-l-4 border-l-blue-500">
            <h3 className="mb-3 text-[#591220]">1. Use of Platform</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Users must be 18+ or have legal guardian consent.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Accounts must be registered with accurate information.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>You are responsible for maintaining the confidentiality of your login credentials.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-green-500">
            <h3 className="mb-3 text-[#591220]">2. Buying Products</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>All product descriptions, prices, and availability are provided by sellers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>AURAZ is not responsible for minor discrepancies in product images or descriptions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Orders are subject to confirmation and stock availability.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-purple-500">
            <h3 className="mb-3 text-[#591220]">3. Seller Responsibilities</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Sellers must provide accurate product information, pricing, and stock levels.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Sellers are responsible for fulfilling orders, shipping, and handling returns per policies.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-orange-500">
            <h3 className="mb-3 text-[#591220]">4. Payments</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Payments are securely processed via supported methods (bKash, Card, COD).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Refunds or cancellations are handled as per AURAZ policies.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-red-500">
            <h3 className="mb-3 text-[#591220]">5. Prohibited Activities</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Users or sellers may not post fraudulent, illegal, or harmful content.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Violation may lead to account suspension or termination.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-yellow-500">
            <h3 className="mb-3 text-[#591220]">6. Limitation of Liability</h3>
            <p className="text-sm text-gray-700">
              AURAZ is not liable for losses or damages caused by third-party sellers or payment providers.
            </p>
          </Card>

          <Card className="p-5 border-l-4 border-l-indigo-500">
            <h3 className="mb-3 text-[#591220]">7. Changes</h3>
            <p className="text-sm text-gray-700">
              AURAZ reserves the right to update these terms at any time. Changes take effect upon posting on the website.
            </p>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
