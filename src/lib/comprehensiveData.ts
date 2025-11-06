/**
 * COMPREHENSIVE DATA FOR AURAZ E-COMMERCE PLATFORM
 * This file contains all vouchers, promo cards, sample reviews, and additional data
 * to make the platform fully functional
 */

import { Voucher, PromoCard } from './AppContext';

// ========================================
// VOUCHERS & COUPONS
// ========================================

export const vouchers: Voucher[] = [
  // Active Vouchers
  {
    id: 'v1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: 'Welcome bonus: 10% off on your first order',
    minOrderAmount: 500,
    maxDiscount: 500,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 1000,
    usedCount: 234,
    isActive: true,
    applicableCategories: [], // All categories
  },
  {
    id: 'v2',
    code: 'FASHION20',
    type: 'percentage',
    value: 20,
    description: 'Exclusive: 20% off on all fashion items',
    minOrderAmount: 1000,
    maxDiscount: 1000,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 500,
    usedCount: 187,
    isActive: true,
    applicableCategories: ['Fashion'],
  },
  {
    id: 'v3',
    code: 'ELECTRONICS15',
    type: 'percentage',
    value: 15,
    description: 'Tech deals: 15% off on electronics',
    minOrderAmount: 2000,
    maxDiscount: 2000,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 300,
    usedCount: 145,
    isActive: true,
    applicableCategories: ['Electronics'],
  },
  {
    id: 'v4',
    code: 'FLAT500',
    type: 'fixed',
    value: 500,
    description: 'Get ৳500 off on orders above ৳3000',
    minOrderAmount: 3000,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 200,
    usedCount: 89,
    isActive: true,
    applicableCategories: [],
  },
  {
    id: 'v5',
    code: 'BEAUTY25',
    type: 'percentage',
    value: 25,
    description: 'Beauty special: 25% off on all beauty products',
    minOrderAmount: 800,
    maxDiscount: 800,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 400,
    usedCount: 276,
    isActive: true,
    applicableCategories: ['Beauty'],
  },
  {
    id: 'v6',
    code: 'MEGASALE30',
    type: 'percentage',
    value: 30,
    description: 'Mega sale: 30% off on minimum ৳5000',
    minOrderAmount: 5000,
    maxDiscount: 2500,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 150,
    usedCount: 67,
    isActive: true,
    applicableCategories: [],
  },
  {
    id: 'v7',
    code: 'FLAT1000',
    type: 'fixed',
    value: 1000,
    description: 'Premium offer: ৳1000 off on orders above ৳10000',
    minOrderAmount: 10000,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 100,
    usedCount: 23,
    isActive: true,
    applicableCategories: [],
  },
  {
    id: 'v8',
    code: 'GROCERY10',
    type: 'percentage',
    value: 10,
    description: 'Fresh deals: 10% off on groceries',
    minOrderAmount: 500,
    maxDiscount: 300,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 600,
    usedCount: 412,
    isActive: true,
    applicableCategories: ['Grocery'],
  },
  {
    id: 'v9',
    code: 'HOME15',
    type: 'percentage',
    value: 15,
    description: 'Home makeover: 15% off on home products',
    minOrderAmount: 1500,
    maxDiscount: 1200,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 250,
    usedCount: 134,
    isActive: true,
    applicableCategories: ['Home'],
  },
  {
    id: 'v10',
    code: 'SPORTS20',
    type: 'percentage',
    value: 20,
    description: 'Fitness first: 20% off on sports equipment',
    minOrderAmount: 1000,
    maxDiscount: 800,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 180,
    usedCount: 98,
    isActive: true,
    applicableCategories: ['Sports'],
  },
  {
    id: 'v11',
    code: 'WEEKEND50',
    type: 'fixed',
    value: 50,
    description: 'Weekend bonus: ৳50 off on all orders',
    minOrderAmount: 500,
    validFrom: '2025-11-01T00:00:00Z',
    validUntil: '2025-11-03T23:59:59Z',
    usageLimit: 1000,
    usedCount: 567,
    isActive: true,
    applicableCategories: [],
  },
  {
    id: 'v12',
    code: 'ACCESSORIES15',
    type: 'percentage',
    value: 15,
    description: 'Style up: 15% off on all accessories',
    minOrderAmount: 600,
    maxDiscount: 400,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 300,
    usedCount: 178,
    isActive: true,
    applicableCategories: ['Accessories'],
  },
  
  // Inactive/Expired Vouchers (for testing admin panel)
  {
    id: 'v13',
    code: 'EXPIRED100',
    type: 'fixed',
    value: 100,
    description: 'Expired voucher - for testing',
    minOrderAmount: 1000,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    usageLimit: 500,
    usedCount: 500,
    isActive: false,
    applicableCategories: [],
  },
  {
    id: 'v14',
    code: 'INACTIVE20',
    type: 'percentage',
    value: 20,
    description: 'Inactive voucher - disabled by admin',
    minOrderAmount: 800,
    maxDiscount: 500,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 200,
    usedCount: 45,
    isActive: false,
    applicableCategories: [],
  },
  {
    id: 'v15',
    code: 'NEWYEAR2025',
    type: 'percentage',
    value: 35,
    description: 'New Year special: 35% off on everything!',
    minOrderAmount: 2000,
    maxDiscount: 3000,
    validFrom: '2024-12-25T00:00:00Z',
    validUntil: '2025-01-05T23:59:59Z',
    usageLimit: 1000,
    usedCount: 876,
    isActive: false, // Ended
    applicableCategories: [],
  },
];

// ========================================
// PROMOTIONAL CARDS (Homepage)
// ========================================

export const promoCards: PromoCard[] = [
  {
    id: 'pc1',
    title: 'Festive Season Sale',
    description: 'Celebrate with up to 60% off on select items',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800',
    buttonText: 'Shop Festive Deals',
    link: '/festive-sale',
    isActive: true,
    priority: 1,
  },
  {
    id: 'pc2',
    title: 'Electronics Mega Sale',
    description: 'Latest tech at unbeatable prices - Limited time only',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    buttonText: 'Browse Electronics',
    link: '/electronics-sale',
    isActive: true,
    priority: 2,
  },
  {
    id: 'pc3',
    title: 'Fashion Trends 2025',
    description: 'Discover the latest fashion collection',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    buttonText: 'Explore Fashion',
    link: '/category/Fashion',
    isActive: true,
    priority: 3,
  },
  {
    id: 'pc4',
    title: 'Home Makeover',
    description: 'Transform your space with stylish home decor',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
    buttonText: 'Shop Home',
    link: '/category/Home',
    isActive: true,
    priority: 4,
  },
];

// ========================================
// SAMPLE REVIEWS (for products)
// ========================================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  createdAt: string;
  orderId: string;
  isVerifiedPurchase: boolean;
  helpful: number; // Count of users who found it helpful
  status: 'pending' | 'approved' | 'rejected';
}

export const sampleReviews: Review[] = [
  {
    id: 'r1',
    productId: 'f1',
    userId: 'u2',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5,
    title: 'Excellent quality!',
    comment: 'The cotton t-shirt is super comfortable and the fabric quality is amazing. Totally worth the price!',
    createdAt: '2025-10-15T10:30:00Z',
    orderId: 'ord-123',
    isVerifiedPurchase: true,
    helpful: 23,
    status: 'approved',
  },
  {
    id: 'r2',
    productId: 'f1',
    userId: 'u3',
    userName: 'Mike Chen',
    rating: 4,
    title: 'Good value for money',
    comment: 'Nice t-shirt, fits well. Color is exactly as shown in pictures.',
    createdAt: '2025-10-20T14:20:00Z',
    orderId: 'ord-145',
    isVerifiedPurchase: true,
    helpful: 15,
    status: 'approved',
  },
  {
    id: 'r3',
    productId: 'e1',
    userId: 'u4',
    userName: 'Alex Kumar',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    rating: 5,
    title: 'Best smartphone in this range!',
    comment: 'Amazing camera quality, smooth performance, and battery lasts all day. Highly recommended!',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    ],
    createdAt: '2025-10-25T09:15:00Z',
    orderId: 'ord-167',
    isVerifiedPurchase: true,
    helpful: 45,
    status: 'approved',
  },
  {
    id: 'r4',
    productId: 'e2',
    userId: 'u5',
    userName: 'Emma Davis',
    rating: 5,
    title: 'Perfect laptop for work',
    comment: 'Super fast, lightweight, and the battery life is incredible. Best purchase this year!',
    createdAt: '2025-10-18T16:45:00Z',
    orderId: 'ord-189',
    isVerifiedPurchase: true,
    helpful: 34,
    status: 'approved',
  },
  {
    id: 'r5',
    productId: 'b1',
    userId: 'u6',
    userName: 'Lisa Brown',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    rating: 4,
    title: 'Great foundation',
    comment: 'Good coverage and stays on all day. The shade matches my skin tone perfectly.',
    createdAt: '2025-10-22T11:30:00Z',
    orderId: 'ord-201',
    isVerifiedPurchase: true,
    helpful: 18,
    status: 'approved',
  },
  {
    id: 'r6',
    productId: 'b1',
    userId: 'u7',
    userName: 'Priya Sharma',
    rating: 3,
    title: 'Decent but not perfect',
    comment: 'Formula is good but I wish there were more shade options. Overall okay for the price.',
    createdAt: '2025-10-28T13:20:00Z',
    orderId: 'ord-223',
    isVerifiedPurchase: true,
    helpful: 7,
    status: 'approved',
  },
  // Pending review (for admin moderation)
  {
    id: 'r7',
    productId: 'e3',
    userId: 'u8',
    userName: 'John Smith',
    rating: 2,
    title: 'Not satisfied',
    comment: 'The sound quality is okay but not worth the high price. Expected better.',
    createdAt: '2025-11-01T15:00:00Z',
    orderId: 'ord-245',
    isVerifiedPurchase: true,
    helpful: 3,
    status: 'pending',
  },
  // Rejected review (for admin testing)
  {
    id: 'r8',
    productId: 'f2',
    userId: 'u9',
    userName: 'Spam User',
    rating: 1,
    title: 'This is spam',
    comment: 'Visit my website for cheap deals! www.spam.com',
    createdAt: '2025-11-01T16:30:00Z',
    orderId: 'ord-256',
    isVerifiedPurchase: false,
    helpful: 0,
    status: 'rejected',
  },
];

// ========================================
// NOTIFICATIONS
// ========================================

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'payment' | 'account' | 'promotion' | 'review' | 'refund';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  icon?: string;
}

export const sampleNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #ORD-789 has been shipped and will arrive in 2-3 days.',
    isRead: false,
    createdAt: '2025-11-02T08:30:00Z',
    link: '/orders/ORD-789',
    icon: 'Package',
  },
  {
    id: 'n2',
    userId: 'u1',
    type: 'promotion',
    title: 'New Voucher Available!',
    message: 'Use code WELCOME10 to get 10% off on your next purchase.',
    isRead: false,
    createdAt: '2025-11-01T12:00:00Z',
    icon: 'Tag',
  },
  {
    id: 'n3',
    userId: 'u1',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order #ORD-756 has been delivered successfully.',
    isRead: true,
    createdAt: '2025-10-30T14:20:00Z',
    link: '/orders/ORD-756',
    icon: 'CheckCircle',
  },
  {
    id: 'n4',
    userId: 'u1',
    type: 'payment',
    title: 'Payment Confirmed',
    message: 'Your payment of ৳3,450 has been confirmed for order #ORD-789.',
    isRead: true,
    createdAt: '2025-10-28T09:15:00Z',
    link: '/orders/ORD-789',
    icon: 'CreditCard',
  },
  {
    id: 'n5',
    userId: 'u1',
    type: 'account',
    title: 'Account Approved',
    message: 'Congratulations! Your AURAZ account has been approved by admin.',
    isRead: true,
    createdAt: '2025-10-25T10:00:00Z',
    icon: 'UserCheck',
  },
];

// ========================================
// CHATBOT MESSAGES (Escalated to Admin)
// ========================================

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export const sampleChatMessages: ChatMessage[] = [
  {
    id: 'cm1',
    userId: 'u10',
    userName: 'Rachel Green',
    userEmail: 'rachel@example.com',
    messages: [
      {
        role: 'user',
        content: 'Hi, I need help with my recent order',
        timestamp: '2025-11-02T10:00:00Z',
      },
      {
        role: 'assistant',
        content: 'Hello! I\'d be happy to help you with your order. Could you please provide your order number?',
        timestamp: '2025-11-02T10:00:05Z',
      },
      {
        role: 'user',
        content: 'It\'s ORD-445. The product I received is damaged.',
        timestamp: '2025-11-02T10:01:00Z',
      },
      {
        role: 'assistant',
        content: 'I\'m sorry to hear that. Let me escalate this to our support team for immediate assistance.',
        timestamp: '2025-11-02T10:01:10Z',
      },
    ],
    status: 'open',
    priority: 'high',
    createdAt: '2025-11-02T10:00:00Z',
  },
  {
    id: 'cm2',
    userId: 'u11',
    userName: 'Ross Geller',
    userEmail: 'ross@example.com',
    messages: [
      {
        role: 'user',
        content: 'When will my order be delivered?',
        timestamp: '2025-11-01T15:30:00Z',
      },
      {
        role: 'assistant',
        content: 'Let me check that for you. What\'s your order number?',
        timestamp: '2025-11-01T15:30:05Z',
      },
      {
        role: 'user',
        content: 'ORD-432',
        timestamp: '2025-11-01T15:31:00Z',
      },
      {
        role: 'assistant',
        content: 'Your order is currently in transit and should arrive within 1-2 business days.',
        timestamp: '2025-11-01T15:31:10Z',
      },
      {
        role: 'user',
        content: 'Thank you! Can I change the delivery address?',
        timestamp: '2025-11-01T15:32:00Z',
      },
    ],
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2025-11-01T15:30:00Z',
  },
  {
    id: 'cm3',
    userId: 'u12',
    userName: 'Monica Bing',
    userEmail: 'monica@example.com',
    messages: [
      {
        role: 'user',
        content: 'I want to return a product',
        timestamp: '2025-10-30T11:00:00Z',
      },
      {
        role: 'assistant',
        content: 'I can help you with that. Products can be returned within 7 days of delivery. Do you have your order number?',
        timestamp: '2025-10-30T11:00:05Z',
      },
      {
        role: 'user',
        content: 'Yes, it\'s ORD-398. The size doesn\'t fit.',
        timestamp: '2025-10-30T11:01:00Z',
      },
    ],
    status: 'resolved',
    priority: 'low',
    createdAt: '2025-10-30T11:00:00Z',
    resolvedAt: '2025-10-30T14:30:00Z',
    adminNotes: 'Return request processed. Replacement sent.',
  },
];

// ========================================
// REFUND REQUESTS
// ========================================

export interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  reason: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
  refundMethod?: 'original' | 'wallet' | 'bank';
  images?: string[];
}

export const sampleRefundRequests: RefundRequest[] = [
  {
    id: 'rf1',
    orderId: 'ORD-445',
    userId: 'u10',
    userName: 'Rachel Green',
    productId: 'e1',
    productName: 'Smartphone X Pro',
    reason: 'defective',
    description: 'The screen has dead pixels and the camera is not working properly.',
    amount: 24999,
    status: 'pending',
    requestedAt: '2025-11-02T10:05:00Z',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    ],
  },
  {
    id: 'rf2',
    orderId: 'ORD-398',
    userId: 'u12',
    userName: 'Monica Bing',
    productId: 'f4',
    productName: 'Summer Floral Dress',
    reason: 'wrong_size',
    description: 'Ordered size M but it fits like S. Would like to exchange for L.',
    amount: 2199,
    status: 'approved',
    requestedAt: '2025-10-30T11:02:00Z',
    processedAt: '2025-10-30T14:30:00Z',
    adminNotes: 'Exchange approved. Replacement in size L sent.',
    refundMethod: 'original',
  },
  {
    id: 'rf3',
    orderId: 'ORD-376',
    userId: 'u13',
    userName: 'Chandler Bing',
    productId: 'e3',
    productName: 'Wireless Earbuds',
    reason: 'not_as_described',
    description: 'Battery life is much shorter than advertised. Only lasts 2 hours instead of 6.',
    amount: 3999,
    status: 'rejected',
    requestedAt: '2025-10-28T09:30:00Z',
    processedAt: '2025-10-29T10:00:00Z',
    adminNotes: 'Product working as intended. Battery life varies based on volume level and usage. Rejected as per return policy.',
  },
  {
    id: 'rf4',
    orderId: 'ORD-352',
    userId: 'u14',
    userName: 'Phoebe Buffay',
    productId: 'b2',
    productName: 'Anti-Aging Serum',
    reason: 'allergic_reaction',
    description: 'Developed rash after using the product. Attaching photos.',
    amount: 2499,
    status: 'processed',
    requestedAt: '2025-10-25T14:00:00Z',
    processedAt: '2025-10-26T11:00:00Z',
    adminNotes: 'Full refund processed to original payment method.',
    refundMethod: 'original',
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    ],
  },
];

// ========================================
// DELIVERY CHARGES (by city)
// ========================================

export interface DeliveryCharge {
  city: string;
  charge: number;
  estimatedDays: string;
}

export const deliveryCharges: DeliveryCharge[] = [
  { city: 'Dhaka', charge: 60, estimatedDays: '1-2' },
  { city: 'Chittagong', charge: 100, estimatedDays: '2-3' },
  { city: 'Sylhet', charge: 120, estimatedDays: '3-4' },
  { city: 'Khulna', charge: 110, estimatedDays: '2-3' },
  { city: 'Rajshahi', charge: 100, estimatedDays: '2-3' },
  { city: 'Barisal', charge: 120, estimatedDays: '3-4' },
  { city: 'Rangpur', charge: 130, estimatedDays: '3-4' },
  { city: 'Mymensingh', charge: 90, estimatedDays: '2-3' },
  { city: 'Comilla', charge: 80, estimatedDays: '2-3' },
  { city: 'Gazipur', charge: 70, estimatedDays: '1-2' },
  { city: 'Narayanganj', charge: 70, estimatedDays: '1-2' },
  { city: 'Other', charge: 150, estimatedDays: '4-5' },
];

// ========================================
// ADMIN USERS
// ========================================

export interface AdminUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'super-admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin?: string;
  isActive: boolean;
}

export const adminUsers: AdminUser[] = [
  {
    id: 'admin1',
    email: 'admin@auraz.com',
    password: 'admin123', // In production, this should be hashed
    name: 'Super Admin',
    role: 'super-admin',
    permissions: ['all'],
    lastLogin: '2025-11-02T09:00:00Z',
    isActive: true,
  },
  {
    id: 'admin2',
    email: 'moderator@auraz.com',
    password: 'mod123',
    name: 'Content Moderator',
    role: 'moderator',
    permissions: ['reviews', 'products', 'messages'],
    lastLogin: '2025-11-01T15:30:00Z',
    isActive: true,
  },
];

// ========================================
// EXPORT ALL DATA
// ========================================

export default {
  vouchers,
  promoCards,
  sampleReviews,
  sampleNotifications,
  sampleChatMessages,
  sampleRefundRequests,
  deliveryCharges,
  adminUsers,
};
