import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Search, BookOpen, UserPlus, ShoppingCart, Tag, Heart, CreditCard, Store } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

interface HelpCenterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpCenterSheet({ open, onOpenChange }: HelpCenterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220] flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Help Center
          </SheetTitle>
          <SheetDescription>Your one-stop guide to using AURAZ</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-6">
          {/* Search */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search help articles..." 
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              All articles are searchable and updated regularly
            </p>
          </Card>

          {/* Popular Topics */}
          <div>
            <h3 className="text-[#591220] mb-4">Popular Topics</h3>
            <div className="grid gap-3">
              <Card className="p-4 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <UserPlus className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">How to create an account</h4>
                    <p className="text-sm text-gray-600">
                      Click "Sign Up" on the homepage, fill in your details, and verify your email to get started.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Placing an order</h4>
                    <p className="text-sm text-gray-600">
                      Browse products, add to cart, proceed to checkout, and confirm your payment method.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Tag className="h-5 w-5 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Applying vouchers & discounts</h4>
                    <p className="text-sm text-gray-600">
                      Enter your voucher code at checkout in the designated field and click "Apply" to redeem.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-pink-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <Heart className="h-5 w-5 text-pink-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Managing your wishlist</h4>
                    <p className="text-sm text-gray-600">
                      Click the heart icon on any product to save it to your wishlist for later.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <CreditCard className="h-5 w-5 text-orange-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Payment and checkout guides</h4>
                    <p className="text-sm text-gray-600">
                      We support bKash, credit/debit cards, and cash on delivery for your convenience.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Store className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Seller onboarding guides</h4>
                    <p className="text-sm text-gray-600">
                      Contact our admin team to learn about becoming a verified seller on AURAZ.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
