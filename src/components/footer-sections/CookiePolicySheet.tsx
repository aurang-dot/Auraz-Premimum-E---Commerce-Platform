import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Cookie } from 'lucide-react';
import { Card } from '../ui/card';

interface CookiePolicySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CookiePolicySheet({ open, onOpenChange }: CookiePolicySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <Cookie className="h-6 w-6" />
            Cookie Policy
          </SheetTitle>
          <SheetDescription>Understanding how we use cookies</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-6">
          <Card className="p-5 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
            <p className="leading-relaxed flex items-start gap-2">
              <Cookie className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>AURAZ uses cookies to enhance your browsing experience.</span>
            </p>
          </Card>

          <Card className="p-5 border-l-4 border-l-blue-500">
            <h3 className="mb-3 text-[#591220]">1. What Are Cookies?</h3>
            <p className="text-sm text-gray-700">
              Small text files stored on your device to improve functionality and personalization.
            </p>
          </Card>

          <Card className="p-5 border-l-4 border-l-green-500">
            <h3 className="mb-3 text-[#591220]">2. Types of Cookies Used</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm"><strong className="text-blue-700">Essential Cookies:</strong> Required for basic website operations.</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm"><strong className="text-green-700">Performance Cookies:</strong> Track usage to optimize performance.</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm"><strong className="text-purple-700">Functional Cookies:</strong> Remember preferences like language and login.</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm"><strong className="text-orange-700">Marketing Cookies:</strong> Deliver personalized ads and offers.</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-yellow-500 bg-yellow-50">
            <h3 className="mb-3 text-[#591220]">3. Managing Cookies</h3>
            <p className="text-sm text-gray-700">
              You can disable cookies via your browser settings, but some features may not work properly.
            </p>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
