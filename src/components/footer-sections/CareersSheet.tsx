import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Briefcase, Users, TrendingUp, Mail } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface CareersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CareersSheet({ open, onOpenChange }: CareersSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            Careers at AURAZ
          </SheetTitle>
          <SheetDescription>Join our team and shape the future of e-commerce</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-6">
          {/* Intro */}
          <Card className="p-6 bg-gradient-to-br from-[#591220] to-[#6d1628] text-white">
            <h3 className="mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Join the AURAZ Team
            </h3>
            <p className="leading-relaxed">
              We're building a next-generation e-commerce platform and we're always looking for talented, creative, and motivated individuals.
            </p>
          </Card>

          {/* Current Openings */}
          <div>
            <h3 className="text-[#591220] mb-4">Current Openings</h3>
            <div className="grid gap-3">
              <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-900">UI/UX Designers</h4>
                  <Badge variant="secondary">Design</Badge>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-900">Frontend / Backend Developers</h4>
                  <Badge variant="secondary">Engineering</Badge>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-900">Digital Marketing Specialists</h4>
                  <Badge variant="secondary">Marketing</Badge>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-900">Customer Support Executives</h4>
                  <Badge variant="secondary">Support</Badge>
                </div>
              </Card>
            </div>
          </div>

          {/* Why Work With Us */}
          <Card className="p-6 bg-gradient-to-br from-white to-green-50">
            <h3 className="text-[#591220] mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Why Work With Us
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Collaborative and innovative work environment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Opportunities for career growth and skill development</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Contribute to shaping the future of online shopping</span>
              </li>
            </ul>
          </Card>

          {/* Apply Today */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
            <h3 className="text-[#591220] mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Apply Today
            </h3>
            <p className="text-gray-700 mb-3">
              Send your CV and portfolio to:
            </p>
            <a 
              href="mailto:careers@auraz.com" 
              className="inline-block px-6 py-3 bg-[#591220] text-white rounded-lg hover:bg-[#6d1628] transition-colors"
            >
              careers@auraz.com
            </a>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
