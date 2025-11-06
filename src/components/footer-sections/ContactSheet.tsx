import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Mail, Phone, MessageCircle, Clock, MapPin, Send } from 'lucide-react';
import { Card } from '../ui/card';

interface ContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactSheet({ open, onOpenChange }: ContactSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Contact Us
          </SheetTitle>
          <SheetDescription>Need help or have questions? Reach out!</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-6">
          <Card className="p-5 bg-gradient-to-br from-[#591220] to-[#6d1628] text-white">
            <div className="flex items-start gap-3">
              <Send className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                Our support team is here to help you with any questions or concerns. We're committed to providing excellent customer service.
              </p>
            </div>
          </Card>

          <div>
            <h3 className="text-[#591220] mb-4">Get in Touch</h3>
            <div className="grid gap-4">
              <Card className="p-5 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Email Support</h4>
                    <a href="mailto:aurazsupport@gmail.com" className="text-[#591220] hover:underline">
                      aurazsupport@gmail.com
                    </a>
                    <p className="text-xs text-gray-600 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Phone Support</h4>
                    <a href="tel:+8801604710170" className="text-[#591220] hover:underline">
                      +880-160-4710170
                    </a>
                    <p className="text-xs text-gray-600 mt-1">Available 9 AM - 9 PM (Bangladesh Time)</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <MessageCircle className="h-5 w-5 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Live Chat</h4>
                    <p className="text-sm text-gray-700">Real-time assistance</p>
                    <p className="text-xs text-gray-600 mt-1">Available 9 AM – 9 PM (Bangladesh Time)</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-orange-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Our Location</h4>
                    <p className="text-sm text-gray-700">1 No Road Kalusha Sorok, Barisal</p>
                    <p className="text-xs text-gray-600 mt-1">Bangladesh</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Clock className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-sm text-gray-700">Monday - Saturday: 9 AM - 9 PM</p>
                    <p className="text-xs text-gray-600 mt-1">Sunday: 10 AM - 6 PM (Bangladesh Time)</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card className="p-5 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
            <h4 className="text-[#591220] mb-3">Quick Response Guarantee</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              All emails and contact forms are reviewed by our support team within 24 hours. For urgent matters, please use our phone support during business hours.
            </p>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
