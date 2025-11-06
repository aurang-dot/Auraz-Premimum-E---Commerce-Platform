/**
 * DATA INITIALIZATION SCRIPT
 * This script initializes all data for the AURAZ e-commerce platform
 * It can restore from Supabase or create fresh mock data
 */

import { products, categories, heroSlides } from './mockData';
import {
  vouchers,
  promoCards,
  sampleReviews,
  sampleNotifications,
  sampleChatMessages,
  sampleRefundRequests,
  deliveryCharges,
  adminUsers,
} from './comprehensiveData';

// Sample users with different statuses
export const sampleUsers = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+880 1712-345678',
    password: 'user123',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    dateOfBirth: '1990-05-15',
    gender: 'male' as const,
    status: 'approved' as const,
    createdAt: '2025-01-15T10:00:00Z',
    addresses: [
      {
        id: 'addr1',
        name: 'John Doe',
        phone: '+880 1712-345678',
        street: '123 Main Street, Apartment 4B',
        city: 'Dhaka',
        postalCode: '1205',
        landmark: 'Near City Hospital',
        isDefault: true,
      },
      {
        id: 'addr2',
        name: 'John Doe',
        phone: '+880 1712-345678',
        street: '456 Park Avenue',
        city: 'Chittagong',
        postalCode: '4100',
        landmark: 'Opposite Shopping Mall',
        isDefault: false,
      },
    ],
    paymentMethods: [
      {
        id: 'pm1',
        type: 'card' as const,
        name: 'Visa ending in 4242',
        details: '**** **** **** 4242',
        isDefault: true,
      },
      {
        id: 'pm2',
        type: 'bkash' as const,
        name: 'bKash',
        details: '+880 1712-345678',
        isDefault: false,
      },
    ],
    usedVouchers: ['v1', 'v4'],
  },
  {
    id: 'u2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+880 1823-456789',
    password: 'user123',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    dateOfBirth: '1992-08-22',
    gender: 'female' as const,
    status: 'approved' as const,
    createdAt: '2025-02-10T14:30:00Z',
    addresses: [
      {
        id: 'addr3',
        name: 'Sarah Johnson',
        phone: '+880 1823-456789',
        street: '789 Lake Road',
        city: 'Dhaka',
        postalCode: '1212',
        isDefault: true,
      },
    ],
    paymentMethods: [
      {
        id: 'pm3',
        type: 'nagad' as const,
        name: 'Nagad',
        details: '+880 1823-456789',
        isDefault: true,
      },
    ],
    usedVouchers: ['v2'],
  },
  {
    id: 'u3',
    name: 'Mike Chen',
    email: 'mike.chen@example.com',
    phone: '+880 1934-567890',
    password: 'user123',
    dateOfBirth: '1988-03-10',
    gender: 'male' as const,
    status: 'approved' as const,
    createdAt: '2025-03-05T09:15:00Z',
    addresses: [],
    paymentMethods: [],
    usedVouchers: [],
  },
  {
    id: 'u4',
    name: 'Alex Kumar',
    email: 'alex.kumar@example.com',
    phone: '+880 1745-678901',
    password: 'user123',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    status: 'pending' as const,
    createdAt: '2025-10-30T11:00:00Z',
    addresses: [],
    paymentMethods: [],
    usedVouchers: [],
  },
  {
    id: 'u5',
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    phone: '+880 1856-789012',
    password: 'user123',
    gender: 'female' as const,
    status: 'rejected' as const,
    createdAt: '2025-10-25T15:30:00Z',
    addresses: [],
    paymentMethods: [],
    usedVouchers: [],
  },
];

// Sample orders with different statuses
export const sampleOrders = [
  {
    id: 'ORD-789',
    userId: 'u1',
    items: [
      {
        productId: 'f1',
        product: products.find((p) => p.id === 'f1')!,
        quantity: 2,
        variant: { Size: 'M', Color: 'White' },
      },
      {
        productId: 'f2',
        product: products.find((p) => p.id === 'f2')!,
        quantity: 1,
        variant: { Size: '32', Color: 'Blue' },
      },
    ],
    total: 4097,
    status: 'shipped' as const,
    shippingAddress: sampleUsers[0].addresses[0],
    paymentMethod: 'bKash',
    createdAt: '2025-10-28T09:15:00Z',
    deliveryCharge: 60,
    voucherDiscount: 350,
    voucherCode: 'WELCOME10',
  },
  {
    id: 'ORD-756',
    userId: 'u1',
    items: [
      {
        productId: 'e1',
        product: products.find((p) => p.id === 'e1')!,
        quantity: 1,
      },
    ],
    total: 25059,
    status: 'delivered' as const,
    shippingAddress: sampleUsers[0].addresses[0],
    paymentMethod: 'Card',
    createdAt: '2025-10-20T14:30:00Z',
    deliveryCharge: 60,
  },
  {
    id: 'ORD-734',
    userId: 'u2',
    items: [
      {
        productId: 'b1',
        product: products.find((p) => p.id === 'b1')!,
        quantity: 2,
      },
      {
        productId: 'b2',
        product: products.find((p) => p.id === 'b2')!,
        quantity: 1,
      },
    ],
    total: 6558,
    status: 'delivered' as const,
    shippingAddress: sampleUsers[1].addresses[0],
    paymentMethod: 'Nagad',
    createdAt: '2025-10-15T11:00:00Z',
    deliveryCharge: 60,
    voucherDiscount: 1000,
    voucherCode: 'BEAUTY25',
  },
  {
    id: 'ORD-712',
    userId: 'u1',
    items: [
      {
        productId: 'e2',
        product: products.find((p) => p.id === 'e2')!,
        quantity: 1,
      },
    ],
    total: 54999,
    status: 'processing' as const,
    shippingAddress: sampleUsers[0].addresses[1],
    paymentMethod: 'Card',
    createdAt: '2025-11-01T10:00:00Z',
    deliveryCharge: 100,
  },
  {
    id: 'ORD-698',
    userId: 'u2',
    items: [
      {
        productId: 'f4',
        product: products.find((p) => p.id === 'f4')!,
        quantity: 1,
        variant: { Size: 'M', Color: 'Red' },
      },
    ],
    total: 2259,
    status: 'cancelled' as const,
    shippingAddress: sampleUsers[1].addresses[0],
    paymentMethod: 'bKash',
    createdAt: '2025-10-10T16:20:00Z',
    deliveryCharge: 60,
  },
  {
    id: 'ORD-445',
    userId: 'u10',
    items: [
      {
        productId: 'e1',
        product: products.find((p) => p.id === 'e1')!,
        quantity: 1,
      },
    ],
    total: 25059,
    status: 'delivered' as const,
    shippingAddress: {
      id: 'addr10',
      name: 'Rachel Green',
      phone: '+880 1712-555001',
      street: '90 Bedford Street, Apt 19',
      city: 'Dhaka',
      postalCode: '1207',
      isDefault: true,
    },
    paymentMethod: 'Card',
    createdAt: '2025-10-25T10:00:00Z',
    deliveryCharge: 60,
  },
  {
    id: 'ORD-398',
    userId: 'u12',
    items: [
      {
        productId: 'f4',
        product: products.find((p) => p.id === 'f4')!,
        quantity: 1,
        variant: { Size: 'M', Color: 'Blue' },
      },
    ],
    total: 2259,
    status: 'delivered' as const,
    shippingAddress: {
      id: 'addr12',
      name: 'Monica Bing',
      phone: '+880 1712-555003',
      street: '90 Bedford Street, Apt 20',
      city: 'Dhaka',
      postalCode: '1207',
      isDefault: true,
    },
    paymentMethod: 'bKash',
    createdAt: '2025-10-20T09:00:00Z',
    deliveryCharge: 60,
  },
];

// Initialize all data
export function initializeAllData() {
  const initialData = {
    // Core data
    products,
    categories,
    heroSlides,
    
    // Users and authentication
    users: sampleUsers,
    adminUsers,
    
    // Commerce data
    orders: sampleOrders,
    vouchers,
    promoCards,
    deliveryCharges,
    
    // User engagement
    reviews: sampleReviews,
    notifications: sampleNotifications,
    chatMessages: sampleChatMessages,
    refundRequests: sampleRefundRequests,
    
    // Settings
    deliverySettings: {
      dhakaCharge: 60,
      outsideDhakaCharge: 100,
      freeShippingThreshold: 5000,
    },
  };

  return initialData;
}

// Helper function to save data to localStorage
export function saveDataToLocalStorage(data: ReturnType<typeof initializeAllData>) {
  try {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(`auraz_${key}`, JSON.stringify(value));
    });
    console.log('✅ All data saved to localStorage successfully');
    return true;
  } catch (error) {
    console.error('❌ Error saving data to localStorage:', error);
    return false;
  }
}

// Helper function to load data from localStorage
export function loadDataFromLocalStorage() {
  try {
    const keys = [
      'products',
      'categories',
      'heroSlides',
      'users',
      'adminUsers',
      'orders',
      'vouchers',
      'promoCards',
      'deliveryCharges',
      'reviews',
      'notifications',
      'chatMessages',
      'refundRequests',
      'deliverySettings',
    ];

    const data: any = {};
    keys.forEach((key) => {
      const stored = localStorage.getItem(`auraz_${key}`);
      if (stored) {
        data[key] = JSON.parse(stored);
      }
    });

    return Object.keys(data).length > 0 ? data : null;
  } catch (error) {
    console.error('❌ Error loading data from localStorage:', error);
    return null;
  }
}

// Helper function to check if data exists
export function hasExistingData(): boolean {
  return localStorage.getItem('auraz_products') !== null;
}

// Auto-initialize data if not present
export function autoInitializeData() {
  if (!hasExistingData()) {
    console.log('🚀 Initializing fresh data...');
    const data = initializeAllData();
    saveDataToLocalStorage(data);
    return data;
  } else {
    console.log('✅ Loading existing data from localStorage...');
    return loadDataFromLocalStorage() || initializeAllData();
  }
}

export default {
  initializeAllData,
  saveDataToLocalStorage,
  loadDataFromLocalStorage,
  hasExistingData,
  autoInitializeData,
  sampleUsers,
  sampleOrders,
};
