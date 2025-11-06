import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  Image, 
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  Tag,
  Sparkles,
  RefreshCcw,
  Star,
  MessageCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useApp } from '../../lib/AppContext';
import { useState, useEffect } from 'react';

export function AdminLayout() {
  const { isAdmin, logout, paymentVerifications, getActiveConversations, getAdminNotificationCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const pendingPaymentsCount = paymentVerifications.filter(v => v.status === 'pending').length;
  const activeConversationsCount = getActiveConversations().filter(c => !c.adminReplied).length;
  const adminNotificationCount = getAdminNotificationCount();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments', badge: pendingPaymentsCount },
    { icon: MessageCircle, label: 'Messages', path: '/admin/messages', badge: activeConversationsCount },
    { icon: Tag, label: 'Vouchers', path: '/admin/vouchers' },
    { icon: Sparkles, label: 'Promo Cards', path: '/admin/promo-cards' },
    { icon: RefreshCcw, label: 'Refunds', path: '/admin/refunds' },
    { icon: Star, label: 'Reviews', path: '/admin/reviews' },
    { icon: Image, label: 'Carousel', path: '/admin/carousel' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-[#591220] text-white">
        <div className="p-6 flex-shrink-0">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="bg-white text-[#591220] px-3 py-2 rounded">
              <span className="font-bold text-xl">AURAZ</span>
            </div>
            <span className="text-sm">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                location.pathname === item.path
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge className="ml-auto bg-red-500 text-white animate-pulse">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#591220] text-white flex flex-col">
            <div className="p-6 flex items-center justify-between flex-shrink-0">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="bg-white text-[#591220] px-3 py-2 rounded">
                  <span className="font-bold text-xl">AURAZ</span>
                </div>
                <span className="text-sm">Admin</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-white/20 flex-shrink-0">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2>Admin Panel</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                View Website
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
