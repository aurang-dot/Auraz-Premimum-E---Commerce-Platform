import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  Product,
  CartItem,
  products as mockProducts,
  heroSlides,
} from "./mockData";
import { toast } from "sonner";
import { authApi, usersApi, productsApi, ordersApi, syncApi } from "./apiClient";

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  landmark?: string;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "bkash" | "nagad";
  name: string;
  details: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  usedVouchers: string[]; // Track which vouchers user has already used
}

export interface Order {
  id: string;
  userId: string;
  user: User;
  items: CartItem[];
  total: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  shippingAddress: Address;
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

export interface PaymentVerification {
  id: string;
  userId: string;
  user: User;
  orderId: string;
  amount: number;
  userPhone: string;
  transactionId?: string; // bKash transaction ID
  status: "pending" | "approved" | "rejected" | "expired";
  createdAt: string;
  expiresAt: string;
  orderData: Omit<Order, "id" | "createdAt">;
}

// Voucher System
export interface Voucher {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number; // Percentage (0-100) or fixed amount
  description: string;
  minOrderAmount: number;
  maxDiscount?: number; // For percentage vouchers
  validFrom: string;
  validUntil: string;
  usageLimit: number; // Total times voucher can be used
  usedCount: number; // Times voucher has been used
  isActive: boolean;
  applicableCategories?: string[]; // Empty = all categories
}

// Homepage Promotional Cards
export interface PromoCard {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  link: string; // Can be /festive-sale or /electronics-sale
  gradient: string;
  isActive: boolean;
  order: number;
}

// Refund Requests
export interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  user: User;
  order: Order;
  reason: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  processedAt?: string;
  adminNotes?: string;
}

// Notifications
export interface Notification {
  id: string;
  userId?: string; // If null, sent to all users/admins based on target
  target: "user" | "admin" | "all"; // Who should see this notification
  title: string;
  message: string;
  type: "order" | "payment" | "promotion" | "system";
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// Delivery Settings
export interface DeliverySettings {
  dhakaCharge: number;
  outsideDhakaCharge: number;
  freeShippingThreshold: number;
}

// Product Reviews
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  orderId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
}

// AI Assistant Messages
export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "user" | "ai" | "admin";
  message: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId?: string; // If visitor, this is null
  visitorName?: string;
  visitorEmail?: string;
  messages: ChatMessage[];
  status: "active" | "transferred" | "closed";
  transferredToAdmin: boolean;
  createdAt: string;
  lastMessageAt: string;
  adminReplied: boolean;
}

interface AppContextType {
  // User State
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    user: Omit<
      User,
      | "id"
      | "status"
      | "createdAt"
      | "addresses"
      | "paymentMethods"
      | "usedVouchers"
    >,
  ) => void;
  updateUserProfile: (
    userId: string,
    updates: Partial<User>,
  ) => void;

  // User Addresses
  addAddress: (
    userId: string,
    address: Omit<Address, "id">,
  ) => void;
  updateAddress: (
    userId: string,
    addressId: string,
    updates: Partial<Address>,
  ) => void;
  deleteAddress: (userId: string, addressId: string) => void;

  // User Payment Methods
  addPaymentMethod: (
    userId: string,
    method: Omit<PaymentMethod, "id">,
  ) => void;
  updatePaymentMethod: (
    userId: string,
    methodId: string,
    updates: Partial<PaymentMethod>,
  ) => void;
  deletePaymentMethod: (
    userId: string,
    methodId: string,
  ) => void;

  // Cart & Wishlist
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (
    product: Product,
    quantity: number,
    variant?: Record<string, string>,
  ) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Admin - Users
  users: User[];
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  // Admin - Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (
    productId: string,
    updates: Partial<Product>,
  ) => void;
  deleteProduct: (productId: string) => void;

  // Admin - Orders
  orders: Order[];
  updateOrderStatus: (
    orderId: string,
    status: Order["status"],
  ) => Promise<void>;
  placeOrder: (order: Omit<Order, "id" | "createdAt">) => Promise<void>;
  cancelOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;

  // Admin - Carousel
  carouselSlides: CarouselSlide[];
  addCarouselSlide: (slide: Omit<CarouselSlide, "id">) => void;
  updateCarouselSlide: (
    slideId: string,
    updates: Partial<CarouselSlide>,
  ) => void;
  deleteCarouselSlide: (slideId: string) => void;

  // Payment Verification
  paymentVerifications: PaymentVerification[];
  requestPaymentVerification: (
    orderData: Omit<Order, "id" | "createdAt">,
    amount: number,
    transactionId?: string,
  ) => string;
  approvePaymentVerification: (verificationId: string) => void;
  rejectPaymentVerification: (verificationId: string) => void;
  getPaymentVerification: (
    verificationId: string,
  ) => PaymentVerification | undefined;
  deletePaymentVerification: (verificationId: string) => void;

  // Vouchers
  vouchers: Voucher[];
  addVoucher: (
    voucher: Omit<Voucher, "id" | "usedCount">,
  ) => void;
  updateVoucher: (
    voucherId: string,
    updates: Partial<Voucher>,
  ) => void;
  deleteVoucher: (voucherId: string) => void;
  validateVoucher: (
    code: string,
    orderTotal: number,
    userId?: string,
  ) => { valid: boolean; message: string; voucher?: Voucher };
  applyVoucher: (code: string, userId: string) => void;

  // Promo Cards
  promoCards: PromoCard[];
  addPromoCard: (card: Omit<PromoCard, "id">) => void;
  updatePromoCard: (
    cardId: string,
    updates: Partial<PromoCard>,
  ) => void;
  deletePromoCard: (cardId: string) => void;

  // Refunds
  refundRequests: RefundRequest[];
  createRefundRequest: (
    orderId: string,
    reason: string,
  ) => void;
  approveRefund: (refundId: string, notes?: string) => void;
  rejectRefund: (refundId: string, notes?: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (
    notification: Omit<
      Notification,
      "id" | "createdAt" | "isRead"
    >,
  ) => void;
  markNotificationRead: (notificationId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
  getAdminNotifications: () => Notification[];

  // Delivery Settings
  deliverySettings: DeliverySettings;
  updateDeliverySettings: (
    settings: Partial<DeliverySettings>,
  ) => void;
  calculateDeliveryCharge: (
    city: string,
    orderTotal: number,
  ) => number;

  // Product Reviews
  reviews: ProductReview[];
  addReview: (
    review: Omit<ProductReview, "id" | "createdAt">,
  ) => void;
  deleteReview: (reviewId: string) => void;
  getProductReviews: (productId: string) => ProductReview[];
  canUserReview: (userId: string, productId: string) => boolean;

  // AI Assistant & Messaging
  conversations: Conversation[];
  createConversation: (
    visitorName?: string,
    visitorEmail?: string,
  ) => string;
  addMessageToConversation: (
    conversationId: string,
    sender: "user" | "ai" | "admin",
    message: string,
  ) => void;
  transferConversationToAdmin: (conversationId: string) => void;
  closeConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  getConversation: (
    conversationId: string,
  ) => Conversation | undefined;
  getActiveConversations: () => Conversation[];
  getAdminNotificationCount: () => number;
  getUserUnreadNotificationCount: (userId: string) => number;

  // Data Management
  resetAllData: () => void;
  clearLocalStorage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined,
);

// Admin credentials
const ADMIN_EMAIL = "auraz@admin.com";
const ADMIN_PASSWORD = "auraz878";

// Helper functions for localStorage
const getFromLocalStorage = <T,>(
  key: string,
  defaultValue: T,
): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(
      `Error reading from localStorage key "${key}":`,
      error,
    );
    return defaultValue;
  }
};

const saveToLocalStorage = <T,>(
  key: string,
  value: T,
): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(
      `Error writing to localStorage key "${key}":`,
      error,
    );
  }
};

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Initialize state with default values
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentVerifications, setPaymentVerifications] =
    useState<PaymentVerification[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<
    CarouselSlide[]
  >([
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop",
      title: "New Collection 2025",
      description: "Discover the latest trends in fashion",
      buttonText: "Shop Now",
      buttonLink: "/new-arrivals",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=500&fit=crop",
      title: "Special Deals",
      description: "Up to 50% off on selected items",
      buttonText: "View Deals",
      buttonLink: "/deals",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200&h=500&fit=crop",
      title: "Electronics Sale",
      description: "Best prices on laptops, phones & more",
      buttonText: "Explore",
      buttonLink: "/category/electronics",
    },
  ]);

  // New state for vouchers
  const [vouchers, setVouchers] = useState<Voucher[]>([
    {
      id: "v1",
      code: "WELCOME20",
      type: "percentage",
      value: 20,
      description: "Get 20% off on your first order",
      minOrderAmount: 1000,
      maxDiscount: 500,
      validFrom: "2025-01-01",
      validUntil: "2025-12-31",
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
    },
    {
      id: "v2",
      code: "FLAT500",
      type: "fixed",
      value: 500,
      description: "Flat ৳500 off on orders above ৳3000",
      minOrderAmount: 3000,
      validFrom: "2025-01-01",
      validUntil: "2025-12-31",
      usageLimit: 50,
      usedCount: 0,
      isActive: true,
    },
  ]);

  // New state for promo cards
  const [promoCards, setPromoCards] = useState<PromoCard[]>([
    {
      id: "pc1",
      title: "Festive Season Sale",
      description: "Celebrate with amazing discounts",
      image: "",
      buttonText: "Shop Now",
      link: "/festive-sale",
      gradient: "from-purple-500 to-purple-700",
      isActive: true,
      order: 1,
    },
    {
      id: "pc2",
      title: "Electronics Mega Sale",
      description: "Latest gadgets at unbeatable prices",
      image: "",
      buttonText: "Explore",
      link: "/electronics-sale",
      gradient: "from-blue-500 to-blue-700",
      isActive: true,
      order: 2,
    },
  ]);

  // New state for refunds
  const [refundRequests, setRefundRequests] = useState<
    RefundRequest[]
  >([]);

  // New state for notifications
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  // New state for reviews
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  // New state for AI assistant conversations
  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  // Delivery settings
  const [deliverySettings, setDeliverySettings] =
    useState<DeliverySettings>({
      dhakaCharge: 60,
      outsideDhakaCharge: 110,
      freeShippingThreshold: 5000,
    });

  // Track if initial load from database is complete
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const lastSyncRef = useRef<number>(0);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial data from database ONCE on mount
  useEffect(() => {
    // Load user session from localStorage (for client-side persistence)
    const loadedUser = getFromLocalStorage<User | null>(
      "auraz_currentUser",
      null,
    );
    const loadedIsAdmin = getFromLocalStorage<boolean>(
      "auraz_isAdmin",
      false,
    );
    const loadedCart = getFromLocalStorage<CartItem[]>(
      "auraz_cart",
      [],
    );
    const loadedWishlist = getFromLocalStorage<Product[]>(
      "auraz_wishlist",
      [],
    );

    // Load data from database
    const loadDataFromDatabase = async () => {
      try {
        setIsLoading(true);
        
        // Load users, products, orders from API
        const [usersData, productsData, ordersData] = await Promise.all([
          usersApi.getAll().catch(() => []),
          productsApi.getAll().catch(() => mockProducts),
          ordersApi.getAll().catch(() => []),
        ]);

        setUsers(usersData);
        setProducts(productsData.length > 0 ? productsData : mockProducts);
        setOrders(ordersData);

        // Get last sync timestamp
        lastSyncRef.current = await syncApi.getLastSync().catch(() => Date.now());
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data from database:', error);
        // Fallback to localStorage if API fails
        const loadedUsers = getFromLocalStorage<User[]>("auraz_users", []);
        const loadedProducts = getFromLocalStorage<Product[]>("auraz_products", mockProducts);
        const loadedOrders = getFromLocalStorage<Order[]>("auraz_orders", []);
        setUsers(loadedUsers);
        setProducts(loadedProducts);
        setOrders(loadedOrders);
        setIsLoading(false);
      }
    };

    loadDataFromDatabase();

    // Convert heroSlides to CarouselSlides format
    const defaultCarouselSlides: CarouselSlide[] =
      heroSlides.map((slide) => ({
        id: slide.id.toString(),
        image: slide.image,
        title: slide.title,
        description: slide.subtitle,
        buttonText: slide.cta,
        buttonLink: slide.link,
      }));
    const loadedVerifications = getFromLocalStorage<
      PaymentVerification[]
    >("auraz_paymentVerifications", []);
    const loadedSlides = getFromLocalStorage<CarouselSlide[]>(
      "auraz_carouselSlides",
      defaultCarouselSlides,
    );
    const loadedVouchers = getFromLocalStorage<Voucher[]>(
      "auraz_vouchers",
      [
        {
          id: "v1",
          code: "WELCOME20",
          type: "percentage",
          value: 20,
          description: "Get 20% off on your first order",
          minOrderAmount: 1000,
          maxDiscount: 500,
          validFrom: "2025-01-01",
          validUntil: "2025-12-31",
          usageLimit: 100,
          usedCount: 0,
          isActive: true,
        },
        {
          id: "v2",
          code: "FLAT500",
          type: "fixed",
          value: 500,
          description: "Flat ৳500 off on orders above ৳3000",
          minOrderAmount: 3000,
          validFrom: "2025-01-01",
          validUntil: "2025-12-31",
          usageLimit: 50,
          usedCount: 0,
          isActive: true,
        },
      ],
    );
    const loadedPromoCards = getFromLocalStorage<PromoCard[]>(
      "auraz_promoCards",
      [
        {
          id: "pc1",
          title: "Festive Season Sale",
          description: "Celebrate with amazing discounts",
          image:
            "https://images.unsplash.com/photo-1607344645866-009c7b3a1b57?w=800",
          buttonText: "Shop Now",
          link: "/festive-sale",
          gradient: "from-purple-500 to-purple-700",
          isActive: true,
          order: 1,
        },
        {
          id: "pc2",
          title: "Electronics Mega Sale",
          description: "Latest gadgets at unbeatable prices",
          image:
            "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
          buttonText: "Explore",
          link: "/electronics-sale",
          gradient: "from-blue-500 to-blue-700",
          isActive: true,
          order: 2,
        },
      ],
    );
    const loadedRefunds = getFromLocalStorage<RefundRequest[]>(
      "auraz_refunds",
      [],
    );
    const loadedNotifications = getFromLocalStorage<
      Notification[]
    >("auraz_notifications", []);
    const loadedDeliverySettings =
      getFromLocalStorage<DeliverySettings>(
        "auraz_deliverySettings",
        {
          dhakaCharge: 60,
          outsideDhakaCharge: 110,
          freeShippingThreshold: 5000,
        },
      );
    const loadedReviews = getFromLocalStorage<ProductReview[]>(
      "auraz_reviews",
      [],
    );
    const loadedConversations = getFromLocalStorage<
      Conversation[]
    >("auraz_conversations", []);

    // Set client-side state (cart, wishlist, current user)
    if (loadedUser) setCurrentUser(loadedUser);
    if (loadedIsAdmin) setIsAdmin(loadedIsAdmin);
    if (loadedCart.length > 0) setCart(loadedCart);
    if (loadedWishlist.length > 0) setWishlist(loadedWishlist);
    if (loadedVerifications.length > 0)
      setPaymentVerifications(loadedVerifications);
    setCarouselSlides(loadedSlides);
    setVouchers(loadedVouchers);
    setPromoCards(loadedPromoCards);
    if (loadedRefunds.length > 0)
      setRefundRequests(loadedRefunds);
    if (loadedNotifications.length > 0)
      setNotifications(loadedNotifications);
    setDeliverySettings(loadedDeliverySettings);
    if (loadedReviews.length > 0) setReviews(loadedReviews);
    if (loadedConversations.length > 0)
      setConversations(loadedConversations);

    setIsInitialized(true);
  }, []); // Run only once on mount

  // Real-time sync: Poll for updates every 5 seconds
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const syncData = async () => {
      try {
        const updates = await syncApi.checkUpdates(lastSyncRef.current);
        if (updates.hasUpdates) {
          console.log('🔄 Real-time update detected, refreshing data...');
          // Reload data from database
          const [usersData, productsData, ordersData] = await Promise.all([
            usersApi.getAll().catch(() => users),
            productsApi.getAll().catch(() => products),
            ordersApi.getAll().catch(() => orders),
          ]);

          setUsers(usersData);
          setProducts(productsData.length > 0 ? productsData : products);
          setOrders(ordersData);
          lastSyncRef.current = updates.timestamp || Date.now();
        }
      } catch (error) {
        console.error('Sync error:', error);
      }
    };

    // Sync every 5 seconds for real-time updates
    syncIntervalRef.current = setInterval(syncData, 5000);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [isInitialized, isLoading, users, products, orders]);

  // Sync state to localStorage whenever it changes (AFTER initial load)
  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_currentUser", currentUser);
  }, [currentUser, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_isAdmin", isAdmin);
  }, [isAdmin, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_cart", cart);
  }, [cart, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_wishlist", wishlist);
  }, [wishlist, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_users", users);
  }, [users, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_products", products);
  }, [products, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_orders", orders);
  }, [orders, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage(
      "auraz_paymentVerifications",
      paymentVerifications,
    );
  }, [paymentVerifications, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_carouselSlides", carouselSlides);
  }, [carouselSlides, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_vouchers", vouchers);
  }, [vouchers, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_promoCards", promoCards);
  }, [promoCards, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_refunds", refundRequests);
  }, [refundRequests, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_notifications", notifications);
  }, [notifications, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage(
      "auraz_deliverySettings",
      deliverySettings,
    );
  }, [deliverySettings, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_reviews", reviews);
  }, [reviews, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_conversations", conversations);
  }, [conversations, isInitialized]);

  // Listen for storage changes from OTHER tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;

      try {
        if (
          e.key === "auraz_paymentVerifications" &&
          e.newValue
        ) {
          setPaymentVerifications(JSON.parse(e.newValue));
        } else if (e.key === "auraz_orders" && e.newValue) {
          setOrders(JSON.parse(e.newValue));
        } else if (e.key === "auraz_users" && e.newValue) {
          setUsers(JSON.parse(e.newValue));
        } else if (e.key === "auraz_products" && e.newValue) {
          setProducts(JSON.parse(e.newValue));
        } else if (
          e.key === "auraz_carouselSlides" &&
          e.newValue
        ) {
          setCarouselSlides(JSON.parse(e.newValue));
        } else if (e.key === "auraz_vouchers" && e.newValue) {
          setVouchers(JSON.parse(e.newValue));
        } else if (e.key === "auraz_promoCards" && e.newValue) {
          setPromoCards(JSON.parse(e.newValue));
        } else if (e.key === "auraz_refunds" && e.newValue) {
          setRefundRequests(JSON.parse(e.newValue));
        } else if (
          e.key === "auraz_notifications" &&
          e.newValue
        ) {
          setNotifications(JSON.parse(e.newValue));
        } else if (
          e.key === "auraz_conversations" &&
          e.newValue
        ) {
          setConversations(JSON.parse(e.newValue));
        }
      } catch (error) {
        console.error("Error parsing storage event:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () =>
      window.removeEventListener(
        "storage",
        handleStorageChange,
      );
  }, []);

  // Auth Functions - Now using API
  const login = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const result = await authApi.login(email, password);
      
      if (result.success) {
        setCurrentUser(result.user);
        setIsAdmin(result.isAdmin || false);
        saveToLocalStorage("auraz_currentUser", result.user);
        saveToLocalStorage("auraz_isAdmin", result.isAdmin || false);
        toast.success(result.isAdmin ? "Welcome Admin!" : `Welcome back, ${result.user.name}!`);
        return true;
      } else {
        toast.error(result.error || "Login failed");
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    toast.success("Logged out successfully");
  };

  const register = async (
    userData: Omit<
      User,
      | "id"
      | "status"
      | "createdAt"
      | "addresses"
      | "paymentMethods"
      | "usedVouchers"
    >,
  ) => {
    try {
      const result = await authApi.register(userData);

      if (result.success) {
        // Refresh users list to include new user
        const updatedUsers = await usersApi.getAll();
        setUsers(updatedUsers);
        toast.success(result.message || "Registration submitted! Please wait for admin approval.");
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    }
  };

  const updateUserProfile = (
    userId: string,
    updates: Partial<User>,
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, ...updates } : user,
      ),
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, ...updates } : null,
      );
    }
    toast.success("Profile updated successfully");
  };

  // Address Management
  const addAddress = (
    userId: string,
    addressData: Omit<Address, "id">,
  ) => {
    const newAddress: Address = {
      ...addressData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
    };
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              addresses: [...user.addresses, newAddress],
            }
          : user,
      ),
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              addresses: [...prev.addresses, newAddress],
            }
          : null,
      );
    }
    toast.success("Address added successfully");
  };

  const updateAddress = (
    userId: string,
    addressId: string,
    updates: Partial<Address>,
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              addresses: user.addresses.map((addr) =>
                addr.id === addressId
                  ? { ...addr, ...updates }
                  : addr,
              ),
            }
          : user,
      ),
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              addresses: prev.addresses.map((addr) =>
                addr.id === addressId
                  ? { ...addr, ...updates }
                  : addr,
              ),
            }
          : null,
      );
    }
    toast.success("Address updated successfully");
  };

  const deleteAddress = (userId: string, addressId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              addresses: user.addresses.filter(
                (addr) => addr.id !== addressId,
              ),
            }
          : user,
      ),
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              addresses: prev.addresses.filter(
                (addr) => addr.id !== addressId,
              ),
            }
          : null,
      );
    }
    toast.success("Address deleted successfully");
  };

  // Payment Method Management
  const addPaymentMethod = (
    userId: string,
    methodData: Omit<PaymentMethod, "id">,
  ) => {
    const newMethod: PaymentMethod = {
      ...methodData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
    };
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              paymentMethods: [
                ...user.paymentMethods,
                newMethod,
              ],
            }
          : user,
      ),
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              paymentMethods: [
                ...prev.paymentMethods,
                newMethod,
              ],
            }
          : null,
      );
    }
    toast.success("Payment method added successfully");
  };

  const updatePaymentMethod = (
    userId: string,
    methodId: string,
    updates: Partial<PaymentMethod>,
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              paymentMethods: user.paymentMethods.map(
                (method) =>
                  method.id === methodId
                    ? { ...method, ...updates }
                    : method,
              ),
            }
          : user,
      ),
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              paymentMethods: prev.paymentMethods.map(
                (method) =>
                  method.id === methodId
                    ? { ...method, ...updates }
                    : method,
              ),
            }
          : null,
      );
    }
    toast.success("Payment method updated successfully");
  };

  const deletePaymentMethod = (
    userId: string,
    methodId: string,
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              paymentMethods: user.paymentMethods.filter(
                (method) => method.id !== methodId,
              ),
            }
          : user,
      ),
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              paymentMethods: prev.paymentMethods.filter(
                (method) => method.id !== methodId,
              ),
            }
          : null,
      );
    }
    toast.success("Payment method deleted successfully");
  };

  // Cart Functions
  const addToCart = (
    product: Product,
    quantity: number,
    variant?: Record<string, string>,
  ) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.productId === product.id &&
          JSON.stringify(item.variant) ===
            JSON.stringify(variant),
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        toast.success("Cart updated");
        return newCart;
      } else {
        toast.success("Added to cart");
        return [
          ...prevCart,
          {
            productId: product.id,
            product,
            quantity,
            variant,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId),
    );
    toast.success("Removed from cart");
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Functions
  const addToWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.find((p) => p.id === product.id)) {
        toast.info("Already in wishlist");
        return prevWishlist;
      }
      toast.success("Added to wishlist");
      return [...prevWishlist, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((p) => p.id !== productId),
    );
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Admin - User Management - Now using API
  const approveUser = async (userId: string) => {
    try {
      await usersApi.update(userId, { status: 'approved' });
      // Refresh users list
      const updatedUsers = await usersApi.getAll();
      setUsers(updatedUsers);
      toast.success("User approved");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve user");
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      await usersApi.update(userId, { status: 'rejected' });
      // Refresh users list
      const updatedUsers = await usersApi.getAll();
      setUsers(updatedUsers);
      toast.success("User rejected");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject user");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await usersApi.delete(userId);
      // Refresh users list
      const updatedUsers = await usersApi.getAll();
      setUsers(updatedUsers);
      toast.success("User deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  // Admin - Product Management - Now using API
  const addProduct = async (productData: Omit<Product, "id">) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      await productsApi.create(newProduct);
      
      // Refresh products list
      const updatedProducts = await productsApi.getAll();
      setProducts(updatedProducts.length > 0 ? updatedProducts : [newProduct]);
      toast.success("Product added");
    } catch (error: any) {
      toast.error(error.message || "Failed to add product");
    }
  };

  const updateProduct = (
    productId: string,
    updates: Partial<Product>,
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, ...updates }
          : product,
      ),
    );
    toast.success("Product updated");
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) =>
      prev.filter((product) => product.id !== productId),
    );
    toast.success("Product deleted");
  };

  // Admin - Order Management - Now using API
  const placeOrder = async (
    orderData: Omit<Order, "id" | "createdAt">,
  ) => {
    try {
      const newOrder: Order = {
        ...orderData,
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      
      await ordersApi.create(newOrder);
      
      // Refresh orders list
      const updatedOrders = await ordersApi.getAll();
      setOrders(updatedOrders);
      clearCart();

    // Send notification to user
    addNotification({
      userId: orderData.userId,
      target: "user",
      title: "Order Placed Successfully",
      message: `Your order #${newOrder.id} has been placed successfully`,
      type: "order",
      link: `/order/${newOrder.id}`,
    });

    // Send notification to admin
    addNotification({
      target: "admin",
      title: "New Order Received",
      message: `New order #${newOrder.id} from ${orderData.user.name} - ৳${orderData.total}`,
      type: "order",
      link: "/admin/orders",
    });

    toast.success("Order placed successfully!");
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"],
  ) => {
    try {
      await ordersApi.update(orderId, { status });
      // Refresh orders list
      const updatedOrders = await ordersApi.getAll();
      setOrders(updatedOrders);

    // Send notification to user
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      addNotification({
        userId: order.userId,
        target: "user",
        title: "Order Status Updated",
        message: `Your order #${orderId} is now ${status}`,
        type: "order",
        link: `/order/${orderId}`,
      });
    }

    toast.success("Order status updated");
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      toast.error("Order not found");
      return;
    }

    if (order.paymentMethod === "Cash on Delivery") {
      toast.error(
        "Cash on Delivery orders cannot be cancelled. Please contact support at aurazsupport@gmail.com",
      );
      return;
    }

    if (!["pending", "processing"].includes(order.status)) {
      toast.error(
        "This order cannot be cancelled at this stage",
      );
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "cancelled" as const }
          : o,
      ),
    );
    toast.success("Order cancelled successfully");
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    toast.success("Order deleted successfully");
  };

  // Admin - Carousel Management
  const addCarouselSlide = (
    slideData: Omit<CarouselSlide, "id">,
  ) => {
    const newSlide: CarouselSlide = {
      ...slideData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
    };
    setCarouselSlides((prev) => [...prev, newSlide]);
    toast.success("Carousel slide added");
  };

  const updateCarouselSlide = (
    slideId: string,
    updates: Partial<CarouselSlide>,
  ) => {
    setCarouselSlides((prev) =>
      prev.map((slide) =>
        slide.id === slideId ? { ...slide, ...updates } : slide,
      ),
    );
    toast.success("Carousel slide updated");
  };

  const deleteCarouselSlide = (slideId: string) => {
    setCarouselSlides((prev) =>
      prev.filter((slide) => slide.id !== slideId),
    );
    toast.success("Carousel slide deleted");
  };

  // Payment Verification Functions
  const requestPaymentVerification = (
    orderData: Omit<Order, "id" | "createdAt">,
    amount: number,
    transactionId?: string,
  ): string => {
    if (!currentUser) {
      toast.error("Please login to continue");
      return "";
    }

    const verificationId = `pv-${Date.now()}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 180000); // 3 minutes

    const verification: PaymentVerification = {
      id: verificationId,
      userId: currentUser.id,
      user: currentUser,
      orderId: `order-${Date.now()}`,
      amount,
      userPhone: currentUser.phone,
      transactionId,
      status: "pending",
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      orderData,
    };

    setPaymentVerifications((prev) => [...prev, verification]);

    // Send notification to admin
    addNotification({
      target: "admin",
      title: "New Payment Verification",
      message: `${currentUser.name} requested payment verification for ৳${amount}`,
      type: "payment",
      link: "/admin/payments",
    });

    toast.info(
      "Payment verification requested. Please wait for admin approval.",
    );

    // Auto-expire after 3 minutes
    setTimeout(() => {
      setPaymentVerifications((prev) =>
        prev.map((v) =>
          v.id === verificationId && v.status === "pending"
            ? { ...v, status: "expired" as const }
            : v,
        ),
      );
    }, 180000);

    return verificationId;
  };

  const approvePaymentVerification = (
    verificationId: string,
  ) => {
    const verification = paymentVerifications.find(
      (v) => v.id === verificationId,
    );
    if (!verification) return;

    // Update verification status
    setPaymentVerifications((prev) =>
      prev.map((v) =>
        v.id === verificationId
          ? { ...v, status: "approved" as const }
          : v,
      ),
    );

    // Create the order with processing status instead of pending
    const newOrder: Order = {
      ...verification.orderData,
      id: verification.orderId,
      status: "processing", // FIXED: Set to processing instead of pending
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);

    // Send notification to user
    addNotification({
      userId: verification.userId,
      target: "user",
      title: "Payment Approved",
      message:
        "Your payment has been verified and order is being processed",
      type: "payment",
      link: `/order/${newOrder.id}`,
    });

    toast.success("Payment verified and order placed!");
  };

  const rejectPaymentVerification = (
    verificationId: string,
  ) => {
    setPaymentVerifications((prev) =>
      prev.map((v) =>
        v.id === verificationId
          ? { ...v, status: "rejected" as const }
          : v,
      ),
    );

    const verification = paymentVerifications.find(
      (v) => v.id === verificationId,
    );
    if (verification) {
      addNotification({
        userId: verification.userId,
        target: "user",
        title: "Payment Verification Failed",
        message:
          "Your payment verification was rejected. Please try again or contact support.",
        type: "payment",
      });
    }

    toast.error("Payment verification rejected");
  };

  const getPaymentVerification = (verificationId: string) => {
    return paymentVerifications.find(
      (v) => v.id === verificationId,
    );
  };

  const deletePaymentVerification = (verificationId: string) => {
    setPaymentVerifications((prev) =>
      prev.filter((v) => v.id !== verificationId),
    );
    toast.success("Payment verification deleted");
  };

  // Voucher Management
  const addVoucher = (
    voucherData: Omit<Voucher, "id" | "usedCount">,
  ) => {
    const newVoucher: Voucher = {
      ...voucherData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      usedCount: 0,
    };
    setVouchers((prev) => [...prev, newVoucher]);
    toast.success("Voucher created successfully");
  };

  const updateVoucher = (
    voucherId: string,
    updates: Partial<Voucher>,
  ) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === voucherId ? { ...v, ...updates } : v,
      ),
    );
    toast.success("Voucher updated successfully");
  };

  const deleteVoucher = (voucherId: string) => {
    setVouchers((prev) =>
      prev.filter((v) => v.id !== voucherId),
    );
    toast.success("Voucher deleted successfully");
  };

  const validateVoucher = (
    code: string,
    orderTotal: number,
    userId?: string,
  ): { valid: boolean; message: string; voucher?: Voucher } => {
    const voucher = vouchers.find(
      (v) => v.code.toUpperCase() === code.toUpperCase(),
    );

    if (!voucher) {
      return { valid: false, message: "Invalid voucher code" };
    }

    if (!voucher.isActive) {
      return {
        valid: false,
        message: "This voucher is no longer active",
      };
    }

    const now = new Date();
    const validFrom = new Date(voucher.validFrom);
    const validUntil = new Date(voucher.validUntil);

    if (now < validFrom) {
      return {
        valid: false,
        message: "This voucher is not yet valid",
      };
    }

    if (now > validUntil) {
      return {
        valid: false,
        message: "This voucher has expired",
      };
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      return {
        valid: false,
        message: "This voucher has reached its usage limit",
      };
    }

    if (orderTotal < voucher.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount is ৳${voucher.minOrderAmount}`,
      };
    }

    // Check if user already used this voucher
    if (userId) {
      const user = users.find((u) => u.id === userId);
      if (user && user.usedVouchers.includes(voucher.id)) {
        return {
          valid: false,
          message: "You have already used this voucher",
        };
      }
    }

    return {
      valid: true,
      message: "Voucher is valid",
      voucher,
    };
  };

  const applyVoucher = (code: string, userId: string) => {
    const voucher = vouchers.find(
      (v) => v.code.toUpperCase() === code.toUpperCase(),
    );
    if (!voucher) return;

    // Increment used count
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === voucher.id
          ? { ...v, usedCount: v.usedCount + 1 }
          : v,
      ),
    );

    // Add to user's used vouchers
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              usedVouchers: [...u.usedVouchers, voucher.id],
            }
          : u,
      ),
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              usedVouchers: [...prev.usedVouchers, voucher.id],
            }
          : null,
      );
    }
  };

  // Promo Card Management
  const addPromoCard = (cardData: Omit<PromoCard, "id">) => {
    const newCard: PromoCard = {
      ...cardData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
    };
    setPromoCards((prev) => [...prev, newCard]);
    toast.success("Promo card added successfully");
  };

  const updatePromoCard = (
    cardId: string,
    updates: Partial<PromoCard>,
  ) => {
    setPromoCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, ...updates } : c,
      ),
    );
    toast.success("Promo card updated successfully");
  };

  const deletePromoCard = (cardId: string) => {
    setPromoCards((prev) =>
      prev.filter((c) => c.id !== cardId),
    );
    toast.success("Promo card deleted successfully");
  };

  // Refund Management
  const createRefundRequest = (
    orderId: string,
    reason: string,
  ) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !currentUser) return;

    const newRefund: RefundRequest = {
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      orderId,
      userId: currentUser.id,
      user: currentUser,
      order,
      reason,
      amount: order.total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setRefundRequests((prev) => [...prev, newRefund]);

    // Notify admin
    addNotification({
      target: "admin",
      title: "New Refund Request",
      message: `${currentUser.name} requested a refund for order #${orderId}`,
      type: "order",
      link: "/admin/refunds",
    });

    toast.success("Refund request submitted successfully");
  };

  const approveRefund = (refundId: string, notes?: string) => {
    setRefundRequests((prev) =>
      prev.map((r) =>
        r.id === refundId
          ? {
              ...r,
              status: "approved" as const,
              processedAt: new Date().toISOString(),
              adminNotes: notes,
            }
          : r,
      ),
    );

    const refund = refundRequests.find(
      (r) => r.id === refundId,
    );
    if (refund) {
      addNotification({
        userId: refund.userId,
        target: "user",
        title: "Refund Approved",
        message: `Your refund request for order #${refund.orderId} has been approved`,
        type: "order",
      });
    }

    toast.success("Refund approved successfully");
  };

  const rejectRefund = (refundId: string, notes?: string) => {
    setRefundRequests((prev) =>
      prev.map((r) =>
        r.id === refundId
          ? {
              ...r,
              status: "rejected" as const,
              processedAt: new Date().toISOString(),
              adminNotes: notes,
            }
          : r,
      ),
    );

    const refund = refundRequests.find(
      (r) => r.id === refundId,
    );
    if (refund) {
      addNotification({
        userId: refund.userId,
        target: "user",
        title: "Refund Request Rejected",
        message: `Your refund request for order #${refund.orderId} has been rejected. ${notes || ""}`,
        type: "order",
      });
    }

    toast.info("Refund rejected");
  };

  // Notification Management
  const addNotification = (
    notificationData: Omit<
      Notification,
      "id" | "createdAt" | "isRead"
    >,
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n,
      ),
    );
  };

  const getUserNotifications = (userId: string) => {
    // User gets: their specific notifications OR notifications targeted to users/all
    return notifications.filter(
      (n) =>
        n.userId === userId ||
        (!n.userId &&
          (n.target === "user" || n.target === "all")),
    );
  };

  const getAdminNotifications = () => {
    // Admin gets: admin-targeted notifications OR all-targeted notifications
    return notifications.filter(
      (n) => n.target === "admin" || n.target === "all",
    );
  };

  // Delivery Settings
  const updateDeliverySettings = (
    settings: Partial<DeliverySettings>,
  ) => {
    setDeliverySettings((prev) => ({ ...prev, ...settings }));
    toast.success("Delivery settings updated");
  };

  const calculateDeliveryCharge = (
    city: string,
    orderTotal: number,
  ): number => {
    // Always charge delivery fees - no free shipping
    const isDhaka = (city || "")
      .toLowerCase()
      .includes("dhaka");
    return isDhaka
      ? deliverySettings.dhakaCharge
      : deliverySettings.outsideDhakaCharge;
  };

  // Review Management
  const addReview = (
    reviewData: Omit<ProductReview, "id" | "createdAt">,
  ) => {
    const newReview: ProductReview = {
      ...reviewData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    toast.success("Review added successfully!");
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    toast.success("Review deleted successfully");
  };

  const getProductReviews = (
    productId: string,
  ): ProductReview[] => {
    return reviews.filter((r) => r.productId === productId);
  };

  const canUserReview = (
    userId: string,
    productId: string,
  ): boolean => {
    // Check if user has already reviewed this product
    const hasReviewed = reviews.some(
      (r) => r.userId === userId && r.productId === productId,
    );
    if (hasReviewed) return false;

    // Check if user has a delivered order containing this product
    const hasDeliveredOrder = orders.some(
      (order) =>
        order.userId === userId &&
        order.status === "delivered" &&
        order.items.some(
          (item) => item.product.id === productId,
        ),
    );

    return hasDeliveredOrder;
  };

  // AI Assistant & Messaging
  const createConversation = (
    visitorName?: string,
    visitorEmail?: string,
  ): string => {
    const newConversation: Conversation = {
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      userId: currentUser?.id,
      visitorName,
      visitorEmail,
      messages: [],
      status: "active",
      transferredToAdmin: false,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      adminReplied: false,
    };
    setConversations((prev) => [newConversation, ...prev]);
    return newConversation.id;
  };

  const addMessageToConversation = (
    conversationId: string,
    sender: "user" | "ai" | "admin",
    message: string,
  ) => {
    const newMessage: ChatMessage = {
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      conversationId,
      sender,
      message,
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessageAt: new Date().toISOString(),
            adminReplied:
              sender === "admin" ? true : conv.adminReplied,
          };
        }
        return conv;
      }),
    );

    // If user transfers to admin, send notification to admin
    if (
      sender === "user" &&
      conversations.find((c) => c.id === conversationId)
        ?.transferredToAdmin
    ) {
      addNotification({
        target: "admin",
        title: "New Message from Customer",
        message:
          message.substring(0, 50) +
          (message.length > 50 ? "..." : ""),
        type: "system",
        link: "/admin/messages",
      });
    }
  };

  const transferConversationToAdmin = (
    conversationId: string,
  ) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              transferredToAdmin: true,
              status: "transferred" as const,
            }
          : conv,
      ),
    );

    // Send notification to admin
    addNotification({
      target: "admin",
      title: "New Customer Service Request",
      message: "A customer wants to speak with support",
      type: "system",
      link: "/admin/messages",
    });
  };

  const closeConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, status: "closed" as const }
          : conv,
      ),
    );
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== conversationId),
    );
    toast.success("Conversation deleted successfully");
  };

  const getConversation = (
    conversationId: string,
  ): Conversation | undefined => {
    return conversations.find((c) => c.id === conversationId);
  };

  const getActiveConversations = (): Conversation[] => {
    return conversations.filter(
      (c) => c.transferredToAdmin && c.status !== "closed",
    );
  };

  const getAdminNotificationCount = (): number => {
    // Admin counts: unread system notifications + pending conversations
    const unreadNotifications = notifications.filter(
      (n) => !n.isRead && !n.userId,
    ).length;
    const pendingConversations = conversations.filter(
      (c) => c.transferredToAdmin && !c.adminReplied,
    ).length;
    return unreadNotifications + pendingConversations;
  };

  const getUserUnreadNotificationCount = (
    userId: string,
  ): number => {
    // User counts: unread notifications for them specifically OR broadcast to all
    return notifications.filter(
      (n) => !n.isRead && (n.userId === userId || !n.userId),
    ).length;
  };

  // Data Management Functions
  const resetAllData = () => {
    // Convert heroSlides to CarouselSlides format
    const defaultCarouselSlides: CarouselSlide[] =
      heroSlides.map((slide) => ({
        id: slide.id.toString(),
        image: slide.image,
        title: slide.title,
        description: slide.subtitle,
        buttonText: slide.cta,
        buttonLink: slide.link,
      }));

    const defaultVouchers: Voucher[] = [
      {
        id: "v1",
        code: "WELCOME20",
        type: "percentage",
        value: 20,
        description: "Get 20% off on your first order",
        minOrderAmount: 1000,
        maxDiscount: 500,
        validFrom: "2025-01-01",
        validUntil: "2025-12-31",
        usageLimit: 100,
        usedCount: 0,
        isActive: true,
      },
      {
        id: "v2",
        code: "FLAT500",
        type: "fixed",
        value: 500,
        description: "Flat ৳500 off on orders above ৳3000",
        minOrderAmount: 3000,
        validFrom: "2025-01-01",
        validUntil: "2025-12-31",
        usageLimit: 50,
        usedCount: 0,
        isActive: true,
      },
    ];

    const defaultPromoCards: PromoCard[] = [
      {
        id: "pc1",
        title: "Festive Season Sale",
        description: "Celebrate with amazing discounts",
        image:
          "https://images.unsplash.com/photo-1607344645866-009c7b3a1b57?w=800",
        buttonText: "Shop Now",
        link: "/festive-sale",
        gradient: "from-purple-500 to-purple-700",
        isActive: true,
        order: 1,
      },
      {
        id: "pc2",
        title: "Electronics Mega Sale",
        description: "Latest gadgets at unbeatable prices",
        image:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
        buttonText: "Explore",
        link: "/electronics-sale",
        gradient: "from-blue-500 to-blue-700",
        isActive: true,
        order: 2,
      },
    ];

    const defaultDeliverySettings: DeliverySettings = {
      dhakaCharge: 60,
      outsideDhakaCharge: 110,
      freeShippingThreshold: 5000,
    };

    // Reset all state to defaults
    setProducts(mockProducts);
    setCarouselSlides(defaultCarouselSlides);
    setVouchers(defaultVouchers);
    setPromoCards(defaultPromoCards);
    setDeliverySettings(defaultDeliverySettings);
    setUsers([]);
    setOrders([]);
    setPaymentVerifications([]);
    setRefundRequests([]);
    setNotifications([]);
    setReviews([]);
    setConversations([]);
    setCart([]);
    setWishlist([]);

    // Save to localStorage
    saveToLocalStorage("auraz_products", mockProducts);
    saveToLocalStorage(
      "auraz_carouselSlides",
      defaultCarouselSlides,
    );
    saveToLocalStorage("auraz_vouchers", defaultVouchers);
    saveToLocalStorage("auraz_promoCards", defaultPromoCards);
    saveToLocalStorage(
      "auraz_deliverySettings",
      defaultDeliverySettings,
    );
    saveToLocalStorage("auraz_users", []);
    saveToLocalStorage("auraz_orders", []);
    saveToLocalStorage("auraz_paymentVerifications", []);
    saveToLocalStorage("auraz_refunds", []);
    saveToLocalStorage("auraz_notifications", []);
    saveToLocalStorage("auraz_reviews", []);
    saveToLocalStorage("auraz_conversations", []);
    saveToLocalStorage("auraz_cart", []);
    saveToLocalStorage("auraz_wishlist", []);

    toast.success("All data has been reset to defaults!");
  };

  const clearLocalStorage = () => {
    if (typeof window === "undefined") return;

    const keys = [
      "auraz_currentUser",
      "auraz_isAdmin",
      "auraz_cart",
      "auraz_wishlist",
      "auraz_users",
      "auraz_products",
      "auraz_orders",
      "auraz_paymentVerifications",
      "auraz_carouselSlides",
      "auraz_vouchers",
      "auraz_promoCards",
      "auraz_refunds",
      "auraz_notifications",
      "auraz_deliverySettings",
      "auraz_reviews",
      "auraz_conversations",
    ];

    keys.forEach((key) => window.localStorage.removeItem(key));
    toast.success("Local storage cleared!");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAdmin,
        login,
        logout,
        register,
        updateUserProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        users,
        approveUser,
        rejectUser,
        deleteUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        updateOrderStatus,
        placeOrder,
        cancelOrder,
        deleteOrder,
        carouselSlides,
        addCarouselSlide,
        updateCarouselSlide,
        deleteCarouselSlide,
        paymentVerifications,
        requestPaymentVerification,
        approvePaymentVerification,
        rejectPaymentVerification,
        getPaymentVerification,
        deletePaymentVerification,
        vouchers,
        addVoucher,
        updateVoucher,
        deleteVoucher,
        validateVoucher,
        applyVoucher,
        promoCards,
        addPromoCard,
        updatePromoCard,
        deletePromoCard,
        refundRequests,
        createRefundRequest,
        approveRefund,
        rejectRefund,
        notifications,
        addNotification,
        markNotificationRead,
        getUserNotifications,
        getAdminNotifications,
        deliverySettings,
        updateDeliverySettings,
        calculateDeliveryCharge,
        reviews,
        addReview,
        deleteReview,
        getProductReviews,
        canUserReview,
        conversations,
        createConversation,
        addMessageToConversation,
        transferConversationToAdmin,
        closeConversation,
        deleteConversation,
        getConversation,
        getActiveConversations,
        getAdminNotificationCount,
        getUserUnreadNotificationCount,
        resetAllData,
        clearLocalStorage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(
      "useApp must be used within an AppProvider",
    );
  }
  return context;
}