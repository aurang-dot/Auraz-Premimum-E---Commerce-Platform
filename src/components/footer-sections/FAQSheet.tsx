import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface FAQSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FAQSheet({ open, onOpenChange }: FAQSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#591220]">Frequently Asked Questions</SheetTitle>
          <SheetDescription>Common questions about AURAZ</SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create an account?</AccordionTrigger>
              <AccordionContent>
                Click "Sign Up" → enter your email/phone → verify OTP → set password → start shopping.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How can I track my order?</AccordionTrigger>
              <AccordionContent>
                Log in → My Orders → select order → track status in real-time. You'll see updates as your order moves from Pending → Confirmed → Shipped → Delivered.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What payment methods are supported?</AccordionTrigger>
              <AccordionContent>
                AURAZ supports bKash, credit/debit cards, and Cash on Delivery (COD) for your convenience.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How do I apply vouchers or discount codes?</AccordionTrigger>
              <AccordionContent>
                Add products to your cart → proceed to checkout → enter your voucher code in the designated field → click "Apply" to redeem your discount.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Can I return or exchange a product?</AccordionTrigger>
              <AccordionContent>
                Yes, returns are accepted within 7 days of delivery. Go to "My Orders" → select the order → click "Request Return/Refund" → follow the instructions to complete the process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
              <AccordionContent>
                You can reach us via Email (aurazsupport@gmail.com), Phone (+880-160-4710170), Live Chat (9 AM – 9 PM Bangladesh Time), or through the Contact Form on our website.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>How long does delivery take?</AccordionTrigger>
              <AccordionContent>
                Standard delivery takes 3–7 business days depending on your location. Express delivery (where available) takes 1–3 business days.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
              <AccordionContent>
                Yes, AURAZ uses encryption and secure servers to protect your payment information. We do not store your complete card details on our servers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
