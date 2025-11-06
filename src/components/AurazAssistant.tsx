import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon, Headphones } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { useApp } from '../lib/AppContext';
import { motion, AnimatePresence } from 'motion/react';

// AI Knowledge Base - Website information
const AI_KNOWLEDGE = {
  greetings: [
    "Hello! I'm AURAZ Assistant. How can I help you today?",
    "Hi there! Welcome to AURAZ. What can I assist you with?",
  ],
  faqs: [
    {
      keywords: ['shipping', 'delivery', 'deliver', 'ship'],
      answer: 'We offer delivery across Bangladesh. Dhaka delivery is ৳60, outside Dhaka is ৳110. Orders above ৳5000 get FREE shipping! Delivery typically takes 3-5 business days.',
    },
    {
      keywords: ['return', 'refund', 'exchange'],
      answer: 'You can request a refund for delivered orders. Visit your Orders page, select the order, and request a refund. Our team will review and process it within 2-3 business days.',
    },
    {
      keywords: ['payment', 'pay', 'bkash', 'cash', 'cod'],
      answer: 'We accept bKash, Nagad, and Cash on Delivery (COD). For bKash/Nagad, upload your payment screenshot for verification. COD orders are processed immediately.',
    },
    {
      keywords: ['order', 'track', 'status'],
      answer: 'You can track your order by going to "My Orders" in your account. You\'ll see real-time updates: Pending → Processing → Shipped → Delivered.',
    },
    {
      keywords: ['voucher', 'coupon', 'discount', 'promo'],
      answer: 'Check our active vouchers on the checkout page! We have vouchers like WELCOME20 (20% off) and FLAT500 (৳500 off on orders above ৳3000). Each voucher has specific terms.',
    },
    {
      keywords: ['product', 'category', 'electronics', 'fashion', 'laptop'],
      answer: 'We sell a wide range of products including Electronics, Fashion, Home & Living, Beauty, and more. Browse our categories or use the search bar to find what you need.',
    },
    {
      keywords: ['account', 'register', 'signup', 'login'],
      answer: 'Create an account to enjoy benefits like order tracking, wishlist, saved addresses, and exclusive deals! Admin approval is required for new accounts for security.',
    },
    {
      keywords: ['price', 'cost', 'expensive', 'cheap'],
      answer: 'We offer competitive prices with regular deals and discounts! Check our "Deals" and "Trending" sections for the best offers. Use vouchers to save even more.',
    },
    {
      keywords: ['contact', 'support', 'help', 'customer service'],
      answer: 'Our customer support team is here to help! You can reach us through this chat, or check our Help Center for more information.',
    },
    {
      keywords: ['review', 'rating', 'feedback'],
      answer: 'After receiving your order, you can leave a review on the product page. Your feedback helps other customers and improves our service!',
    },
  ],
};

export function AurazAssistant() {
  const { createConversation, addMessageToConversation, transferConversationToAdmin, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai' | 'admin'; message: string; time: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [showTransferOptions, setShowTransferOptions] = useState(false);
  const [isTransferred, setIsTransferred] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({ name: '', email: '' });
  const [needsVisitorInfo, setNeedsVisitorInfo] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !conversationId) {
      const convId = createConversation(currentUser?.name, currentUser?.email);
      setConversationId(convId);
      
      // Send initial greeting
      const greeting = AI_KNOWLEDGE.greetings[Math.floor(Math.random() * AI_KNOWLEDGE.greetings.length)];
      addAIMessage(greeting);
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
      }
    }
  }, [messages]);

  const addAIMessage = (message: string) => {
    setMessages(prev => [...prev, { sender: 'ai', message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const addUserMessage = (message: string) => {
    setMessages(prev => [...prev, { sender: 'user', message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return "Hello! I'm here to help you with any questions about AURAZ. Feel free to ask me about products, shipping, returns, or anything else!";
    }

    // Check FAQ knowledge base
    for (const faq of AI_KNOWLEDGE.faqs) {
      if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return faq.answer;
      }
    }

    // Default response
    return "I can help you with questions about shipping, returns, payments, orders, products, and more. What would you like to know?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !conversationId) return;

    if (isTransferred) {
      // If transferred to admin, just save the message
      addUserMessage(inputMessage);
      addMessageToConversation(conversationId, 'user', inputMessage);
      setInputMessage('');
      
      // Show waiting message
      setTimeout(() => {
        addAIMessage("Your message has been sent to our support team. They'll respond as soon as possible!");
      }, 500);
      return;
    }

    // Add user message
    addUserMessage(inputMessage);
    addMessageToConversation(conversationId, 'user', inputMessage);
    const currentInput = inputMessage;
    setInputMessage('');
    setQuestionCount(prev => prev + 1);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse = getAIResponse(currentInput);
      addAIMessage(aiResponse);
      addMessageToConversation(conversationId, 'ai', aiResponse);

      // After 3-4 questions, offer to connect with support
      if (questionCount + 1 >= 3 && !showTransferOptions) {
        setTimeout(() => {
          setShowTransferOptions(true);
          addAIMessage("Would you like to speak directly with our customer support team for more personalized assistance?");
        }, 1000);
      }
    }, 800);
  };

  const handleTransferToSupport = (choice: boolean) => {
    if (choice) {
      // Check if user is logged in
      if (!currentUser) {
        setNeedsVisitorInfo(true);
        addAIMessage("Please provide your name and email so our support team can assist you:");
        return;
      }

      completeTransfer();
    } else {
      setShowTransferOptions(false);
      addAIMessage("No problem! I'm still here to help. Feel free to ask me anything else!");
    }
  };

  const completeTransfer = () => {
    if (conversationId) {
      transferConversationToAdmin(conversationId);
      setIsTransferred(true);
      setShowTransferOptions(false);
      setNeedsVisitorInfo(false);
      addAIMessage("Great! I've connected you with our support team. They'll respond to your messages shortly. Feel free to continue typing your questions.");
    }
  };

  const handleVisitorInfoSubmit = () => {
    if (visitorInfo.name.trim() && visitorInfo.email.trim() && conversationId) {
      // Update the conversation with visitor info before transferring
      // We need to recreate the conversation with visitor info
      const newConvId = createConversation(visitorInfo.name, visitorInfo.email);
      setConversationId(newConvId);
      
      // Transfer all previous messages to the new conversation
      messages.forEach(msg => {
        addMessageToConversation(newConvId, msg.sender, msg.message);
      });
      
      // Now transfer to admin
      transferConversationToAdmin(newConvId);
      setIsTransferred(true);
      setShowTransferOptions(false);
      setNeedsVisitorInfo(false);
      addAIMessage("Great! I've connected you with our support team. They'll respond to your messages shortly. Feel free to continue typing your questions.");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-[#591220] hover:bg-[#6d1728] shadow-lg"
              size="icon"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-full max-w-[calc(100vw-2rem)] md:max-w-md lg:w-96"
          >
            <Card className="flex flex-col h-[500px] md:h-[600px] max-h-[80vh] shadow-2xl border-2 border-[#591220]/20">
              {/* Header */}
              <div className="bg-[#591220] text-white p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AURAZ Assistant</h3>
                    <p className="text-xs text-white/80">
                      {isTransferred ? 'Connected to Support' : 'AI-Powered Help'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <div ref={scrollAreaRef} className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender !== 'user' && (
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'ai' ? 'bg-[#591220]' : 'bg-blue-600'}`}>
                          {msg.sender === 'ai' ? (
                            <Bot className="h-4 w-4 text-white" />
                          ) : (
                            <Headphones className="h-4 w-4 text-white" />
                          )}
                        </div>
                      )}
                      <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[75%] min-w-0`}>
                        <div
                          className={`rounded-lg p-3 overflow-hidden ${
                            msg.sender === 'user'
                              ? 'bg-[#591220] text-white'
                              : msg.sender === 'ai'
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-blue-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm break-words whitespace-pre-wrap" style={{ overflowWrap: 'anywhere' }}>{msg.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                      </div>
                      {msg.sender === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Transfer to Support Options */}
                  {showTransferOptions && !isTransferred && !needsVisitorInfo && (
                    <div className="flex gap-2 justify-center mt-4">
                      <Button
                        onClick={() => handleTransferToSupport(true)}
                        className="bg-[#591220] hover:bg-[#6d1728]"
                        size="sm"
                      >
                        Yes, Connect Me
                      </Button>
                      <Button
                        onClick={() => handleTransferToSupport(false)}
                        variant="outline"
                        size="sm"
                      >
                        No, Thanks
                      </Button>
                    </div>
                  )}

                  {/* Visitor Info Form */}
                  {needsVisitorInfo && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <Input
                        placeholder="Your Name"
                        value={visitorInfo.name}
                        onChange={(e) => setVisitorInfo(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={visitorInfo.email}
                        onChange={(e) => setVisitorInfo(prev => ({ ...prev, email: e.target.value }))}
                      />
                      <Button
                        onClick={handleVisitorInfoSubmit}
                        className="w-full bg-[#591220] hover:bg-[#6d1728]"
                        size="sm"
                      >
                        Submit & Connect
                      </Button>
                    </div>
                  )}
                  </div>
                </ScrollArea>
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder={isTransferred ? "Type your message..." : "Ask me anything..."}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-[#591220] hover:bg-[#6d1728]"
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {!isTransferred && (
                  <p className="text-xs text-gray-500 mt-2">
                    Powered by AURAZ AI • Questions answered: {questionCount}
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
