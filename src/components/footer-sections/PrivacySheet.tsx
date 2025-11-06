import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Shield } from 'lucide-react';
import { Card } from '../ui/card';

interface PrivacySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacySheet({ open, onOpenChange }: PrivacySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Privacy Policy
          </SheetTitle>
          <SheetDescription>How we protect your data</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-6">
          <Card className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <p className="leading-relaxed flex items-start gap-2">
              <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>AURAZ respects your privacy and is committed to protecting your personal data.</span>
            </p>
          </Card>

          <Card className="p-5 border-l-4 border-l-blue-500">
            <h3 className="mb-3 text-[#591220]">1. Data Collection</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>We collect information you provide: name, email, phone, address, and payment info.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>We also collect data automatically: browsing behavior, device information, and cookies.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-green-500">
            <h3 className="mb-3 text-[#591220]">2. Data Usage</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>To provide services, process orders, and manage accounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>To send promotional offers, updates, and notifications (only if opted-in).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>To improve website performance and user experience.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-purple-500">
            <h3 className="mb-3 text-[#591220]">3. Data Sharing</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Personal data is shared only with sellers for order fulfillment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>We do not sell your personal information to third parties.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-orange-500">
            <h3 className="mb-3 text-[#591220]">4. Data Security</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>We use encryption and secure servers to protect your data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Access is restricted to authorized personnel only.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-l-indigo-500">
            <h3 className="mb-3 text-[#591220]">5. User Rights</h3>
            <p className="text-sm text-gray-700">
              You can update, delete, or request access to your data anytime via your account.
            </p>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
