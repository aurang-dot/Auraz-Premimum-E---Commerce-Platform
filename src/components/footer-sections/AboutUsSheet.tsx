import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Building2, ShoppingBag, Target } from 'lucide-react';
import { Card } from '../ui/card';

interface AboutUsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutUsSheet({ open, onOpenChange }: AboutUsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            About AURAZ
          </SheetTitle>
          <SheetDescription>Learn more about our platform and mission</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-6">
          {/* Who We Are */}
          <Card className="p-6 border-l-4 border-l-[#591220] bg-gradient-to-br from-white to-gray-50">
            <h3 className="text-[#591220] mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Who We Are
            </h3>
            <p className="text-gray-700 leading-relaxed">
              AURAZ is a modern, web-based e-commerce platform that connects buyers and sellers in a seamless, secure, and efficient online marketplace. Our mission is to make shopping easy, reliable, and enjoyable for everyone.
            </p>
          </Card>

          {/* What We Do */}
          <Card className="p-6 border-l-4 border-l-[#591220] bg-gradient-to-br from-white to-blue-50">
            <h3 className="text-[#591220] mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              What We Do
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#591220] rounded-full mt-2 flex-shrink-0"></span>
                <span>Offer a wide range of products across multiple categories like Fashion, Electronics, Beauty, Grocery, and Home.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#591220] rounded-full mt-2 flex-shrink-0"></span>
                <span>Provide sellers with a powerful dashboard to manage products, inventory, and orders.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#591220] rounded-full mt-2 flex-shrink-0"></span>
                <span>Ensure safe, convenient, and fast shopping experiences with vouchers, discounts, and multiple payment options.</span>
              </li>
            </ul>
          </Card>

          {/* Our Vision */}
          <Card className="p-6 border-l-4 border-l-[#591220] bg-gradient-to-br from-white to-purple-50">
            <h3 className="text-[#591220] mb-3 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To become a trusted, premium e-commerce platform where users can shop confidently and sellers can grow their business efficiently.
            </p>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
