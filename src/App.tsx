import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider, useApp } from './lib/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AurazAssistant } from './components/AurazAssistant';
import { SystemStatusPage } from './pages/SystemStatusPage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { DealsPage } from './pages/DealsPage';
import { NewArrivalsPage } from './pages/NewArrivalsPage';
import { TrendingPage } from './pages/TrendingPage';
import { SearchPage } from './pages/SearchPage';
import { FestiveSalePage } from './pages/FestiveSalePage';
import { ElectronicsSalePage } from './pages/ElectronicsSalePage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminCarousel } from './pages/admin/AdminCarousel';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminVouchers } from './pages/admin/AdminVouchers';
import { AdminPromoCards } from './pages/admin/AdminPromoCards';
import { AdminRefunds } from './pages/admin/AdminRefunds';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminMessages } from './pages/admin/AdminMessages';

function AppContent() {
  const { cart, isAdmin } = useApp();
  
  return (
    <Router>
      <Toaster position="top-right" richColors closeButton duration={5000} />
      <Routes>
        {/* System Status Route */}
        <Route path="/status" element={<SystemStatusPage />} />
        
        {/* Diagnostic Route */}
        <Route path="/diagnostic" element={<DiagnosticPage />} />
        
        {/* Admin Login Route - Separate from main admin */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="vouchers" element={<AdminVouchers />} />
          <Route path="promo-cards" element={<AdminPromoCards />} />
          <Route path="refunds" element={<AdminRefunds />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="carousel" element={<AdminCarousel />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <Header cartItemCount={cart.length} />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/product/:productId" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/order/:orderId" element={<OrderDetailPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  
                  {/* Feature routes */}
                  <Route path="/deals" element={<DealsPage />} />
                  <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/festive-sale" element={<FestiveSalePage />} />
                  <Route path="/electronics-sale" element={<ElectronicsSalePage />} />
                  
                  {/* Placeholder routes */}
                  <Route path="/help" element={<PlaceholderPage title="Help Center" />} />
                  <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
                  <Route path="/about" element={<PlaceholderPage title="About Us" />} />
                  <Route path="/terms" element={<PlaceholderPage title="Terms & Conditions" />} />
                  <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
                </Routes>
              </main>
              <Footer />
              {/* AI Assistant - Only show for non-admin users */}
              {!isAdmin && <AurazAssistant />}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-4">{title}</h1>
      <p className="text-gray-600">This page is under construction.</p>
    </div>
  );
}

export default App;
