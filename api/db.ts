// Database utility for Vercel Postgres
import { sql } from '@vercel/postgres';

export interface Database {
  users: User[];
  products: Product[];
  orders: Order[];
  carouselSlides: CarouselSlide[];
  vouchers: Voucher[];
  promoCards: PromoCard[];
  paymentVerifications: PaymentVerification[];
  refunds: RefundRequest[];
  notifications: Notification[];
  reviews: Review[];
  conversations: Conversation[];
  deliverySettings: DeliverySettings;
}

// Initialize database tables
export async function initDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        profile_photo TEXT,
        date_of_birth DATE,
        gender VARCHAR(20),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        used_vouchers JSONB DEFAULT '[]'::jsonb,
        addresses JSONB DEFAULT '[]'::jsonb,
        payment_methods JSONB DEFAULT '[]'::jsonb
      )
    `;

    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        image TEXT NOT NULL,
        images JSONB DEFAULT '[]'::jsonb,
        category VARCHAR(100),
        brand VARCHAR(100),
        stock INTEGER DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        trending BOOLEAN DEFAULT false,
        new_arrival BOOLEAN DEFAULT false,
        is_deal BOOLEAN DEFAULT false,
        is_festive BOOLEAN DEFAULT false,
        is_electronics BOOLEAN DEFAULT false,
        variants JSONB DEFAULT '[]'::jsonb,
        specifications JSONB DEFAULT '{}'::jsonb,
        seller JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id),
        items JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        shipping_address JSONB NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        delivery_charge DECIMAL(10, 2) DEFAULT 0,
        voucher_discount DECIMAL(10, 2),
        voucher_code VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create carousel_slides table
    await sql`
      CREATE TABLE IF NOT EXISTS carousel_slides (
        id VARCHAR(255) PRIMARY KEY,
        image TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        button_text VARCHAR(100),
        button_link VARCHAR(255)
      )
    `;

    // Create vouchers table
    await sql`
      CREATE TABLE IF NOT EXISTS vouchers (
        id VARCHAR(255) PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(20) NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        description TEXT,
        min_order_amount DECIMAL(10, 2) DEFAULT 0,
        max_discount DECIMAL(10, 2),
        valid_from DATE NOT NULL,
        valid_until DATE NOT NULL,
        usage_limit INTEGER DEFAULT 100,
        used_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        applicable_categories JSONB DEFAULT '[]'::jsonb
      )
    `;

    // Create promo_cards table
    await sql`
      CREATE TABLE IF NOT EXISTS promo_cards (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image TEXT,
        button_text VARCHAR(100),
        link VARCHAR(255),
        gradient VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        "order" INTEGER DEFAULT 0
      )
    `;

    // Create payment_verifications table
    await sql`
      CREATE TABLE IF NOT EXISTS payment_verifications (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id),
        order_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        user_phone VARCHAR(50),
        transaction_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        order_data JSONB NOT NULL
      )
    `;

    // Create refunds table
    await sql`
      CREATE TABLE IF NOT EXISTS refunds (
        id VARCHAR(255) PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id),
        reason TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP,
        admin_notes TEXT
      )
    `;

    // Create notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        target VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        is_read BOOLEAN DEFAULT false,
        link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(255) PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id),
        user_name VARCHAR(255) NOT NULL,
        order_id VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        is_verified_purchase BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create conversations table
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        visitor_name VARCHAR(255),
        visitor_email VARCHAR(255),
        messages JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(20) DEFAULT 'active',
        transferred_to_admin BOOLEAN DEFAULT false,
        admin_replied BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create delivery_settings table (single row)
    await sql`
      CREATE TABLE IF NOT EXISTS delivery_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        dhaka_charge DECIMAL(10, 2) DEFAULT 60,
        outside_dhaka_charge DECIMAL(10, 2) DEFAULT 110,
        free_shipping_threshold DECIMAL(10, 2) DEFAULT 5000,
        UNIQUE(id)
      )
    `;

    // Insert default delivery settings if not exists
    await sql`
      INSERT INTO delivery_settings (id, dhaka_charge, outside_dhaka_charge, free_shipping_threshold)
      VALUES (1, 60, 110, 5000)
      ON CONFLICT (id) DO NOTHING
    `;

    return { success: true, message: 'Database initialized successfully' };
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return { success: false, error: error.message };
  }
}

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  gender?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  usedVouchers: string[];
  addresses: any[];
  paymentMethods: any[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  trending: boolean;
  newArrival: boolean;
  isDeal?: boolean;
  isFestive?: boolean;
  isElectronics?: boolean;
  variants?: any[];
  specifications?: any;
  seller?: any;
}

export interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: any;
  paymentMethod: string;
  createdAt: string;
  deliveryCharge: number;
  voucherDiscount?: number;
  voucherCode?: string;
}

export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface Voucher {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  minOrderAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories?: string[];
}

export interface PromoCard {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  link: string;
  gradient: string;
  isActive: boolean;
  order: number;
}

export interface PaymentVerification {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  userPhone: string;
  transactionId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  createdAt: string;
  expiresAt: string;
  orderData: any;
}

export interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  reason: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export interface Notification {
  id: string;
  userId?: string;
  target: 'user' | 'admin' | 'all';
  title: string;
  message: string;
  type: 'order' | 'payment' | 'promotion' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  orderId: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId?: string;
  visitorName?: string;
  visitorEmail?: string;
  messages: any[];
  status: 'active' | 'transferred' | 'closed';
  transferredToAdmin: boolean;
  adminReplied: boolean;
  createdAt: string;
  lastMessageAt: string;
}

export interface DeliverySettings {
  dhakaCharge: number;
  outsideDhakaCharge: number;
  freeShippingThreshold: number;
}

