import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Leaf, Package, Truck, FileText, Heart } from 'lucide-react';
import { Card } from '../ui/card';

interface SustainabilitySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SustainabilitySheet({ open, onOpenChange }: SustainabilitySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <Leaf className="h-6 w-6" />
            Sustainability
          </SheetTitle>
          <SheetDescription>Our commitment to a better future</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-6">
          {/* Intro */}
          <Card className="p-6 bg-gradient-to-br from-green-600 to-green-700 text-white">
            <h3 className="mb-3 flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Our Commitment to a Better Future
            </h3>
            <p className="leading-relaxed opacity-90">
              AURAZ is committed to sustainable business practices and minimizing our environmental impact.
            </p>
          </Card>

          {/* Key Initiatives */}
          <div>
            <h3 className="text-[#591220] mb-4">Key Initiatives</h3>
            <div className="space-y-4">
              <Card className="p-5 border-l-4 border-l-green-500 bg-gradient-to-br from-white to-green-50 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-2">Eco-Friendly Packaging</h4>
                    <p className="text-sm text-gray-600">
                      We offer eco-friendly packaging options for sellers to reduce plastic waste and promote recyclable materials.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Truck className="h-6 w-6 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-2">Carbon Footprint Reduction</h4>
                    <p className="text-sm text-gray-600">
                      Reducing carbon footprint through efficient delivery logistics and route optimization.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-2">Responsible Consumption</h4>
                    <p className="text-sm text-gray-600">
                      Promoting responsible consumption with digital invoices and minimal waste initiatives.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Join Our Efforts */}
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200">
            <h3 className="text-[#591220] mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Join Our Efforts
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We encourage our users and sellers to participate in sustainability initiatives and help create a greener, cleaner future. Together, we can make a difference.
            </p>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
