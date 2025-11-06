import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Newspaper, Mail, Phone, Download } from 'lucide-react';
import { Card } from '../ui/card';

interface PressSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PressSheet({ open, onOpenChange }: PressSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <Newspaper className="h-6 w-6" />
            Press & Media
          </SheetTitle>
          <SheetDescription>Stay updated with AURAZ news and announcements</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-6">
          {/* Intro */}
          <Card className="p-6 bg-gradient-to-br from-[#591220] to-[#6d1628] text-white">
            <h3 className="mb-3">
              Stay Updated with AURAZ News
            </h3>
            <p className="leading-relaxed text-sm opacity-90">
              Official press releases, media coverage, and industry updates
            </p>
          </Card>

          {/* What We Cover */}
          <Card className="p-6 border-l-4 border-l-[#591220]">
            <h3 className="text-[#591220] mb-4">What We Cover</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#591220] rounded-full mt-2 flex-shrink-0"></span>
                <span>Official press releases and media coverage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#591220] rounded-full mt-2 flex-shrink-0"></span>
                <span>Product launches, promotions, and partnerships</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#591220] rounded-full mt-2 flex-shrink-0"></span>
                <span>Industry updates and announcements</span>
              </li>
            </ul>
          </Card>

          {/* Media Contact */}
          <Card className="p-6 bg-gradient-to-br from-white to-blue-50">
            <h3 className="text-[#591220] mb-4">Media Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <Mail className="h-5 w-5 text-[#591220]" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href="mailto:press@auraz.com" className="text-[#591220] hover:underline">
                    press@auraz.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <Phone className="h-5 w-5 text-[#591220]" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a href="tel:+880XXXXXXXXX" className="text-[#591220] hover:underline">
                    +880-XXX-XXXXXXX
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {/* Press Kit */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
            <h3 className="text-[#591220] mb-3 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Press Kit
            </h3>
            <p className="text-gray-700 mb-4 text-sm">
              Download official logos, images, and branding materials for media use.
            </p>
            <button className="px-6 py-3 bg-[#591220] text-white rounded-lg hover:bg-[#6d1628] transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Press Kit
            </button>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
