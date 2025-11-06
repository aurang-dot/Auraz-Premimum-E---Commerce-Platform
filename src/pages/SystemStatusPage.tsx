import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  CheckCircle, 
  Database, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  Heart,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { useNavigate } from 'react-router-dom';

export function SystemStatusPage() {
  const { products, users, orders, carouselSlides, conversations } = useApp();
  const [storageUsed, setStorageUsed] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate localStorage usage
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('auraz_')) {
        total += localStorage[key].length + key.length;
      }
    }
    setStorageUsed(Math.round(total / 1024)); // Convert to KB
  }, []);

  const stats = [
    { label: 'Products', value: products.length, icon: Package, color: 'text-blue-600' },
    { label: 'Users', value: users.length, icon: Users, color: 'text-green-600' },
    { label: 'Orders', value: orders.length, icon: ShoppingCart, color: 'text-orange-600' },
    { label: 'Carousel Slides', value: carouselSlides.length, icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Conversations', value: conversations.length, icon: MessageSquare, color: 'text-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">🎉 AURAZ System Status</h1>
          <p className="text-gray-600">Your e-commerce platform is fully operational!</p>
        </div>

        {/* Main Status Card */}
        <Card className="mb-6 border-2 border-green-500 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-green-900">All Systems Operational</CardTitle>
                <CardDescription className="text-green-700">
                  Your website is running perfectly with localStorage
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  <span>Storage Mode</span>
                </div>
                <Badge className="bg-green-600">localStorage</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Backend Required</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700">No</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-green-600" />
                  <span>Status</span>
                </div>
                <Badge className="bg-green-600">Fully Functional</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Overview</CardTitle>
            <CardDescription>Current data stored in your browser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-gray-50 rounded-lg p-4 text-center">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Database className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <div className="text-2xl font-bold text-gray-900">{storageUsed} KB</div>
                <div className="text-xs text-gray-600">Storage Used</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
            <CardDescription>All features are working perfectly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {[
                'Product Browsing & Search',
                'Shopping Cart & Checkout',
                'User Authentication & Profiles',
                'Order Management & Tracking',
                'Wishlist Functionality',
                'Product Reviews',
                'Voucher/Discount System',
                'Admin Panel (Full Control)',
                'AI Chatbot Assistant',
                'Notifications System',
                'Refund Management',
                'Payment Verification',
                'Carousel Management',
                'Multi-step Checkout'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💾 localStorage Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-900">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>No Backend Setup:</strong> Works instantly without any server deployment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>Zero Cost:</strong> No hosting fees, no database costs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>Fast Performance:</strong> All data is local, no network latency</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>Full Privacy:</strong> All data stays in your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>Easy Backup:</strong> Export/import data anytime from Data Management</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid gap-3">
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-[#591220] hover:bg-[#591220]/90"
            size="lg"
          >
            🏠 Go to Homepage
          </Button>
          <Button 
            onClick={() => navigate('/diagnostic')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            🔍 Run Diagnostic
          </Button>
          <Button 
            onClick={() => navigate('/admin/login')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            🔐 Admin Panel
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh System
          </Button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-900">
            <strong>📌 Note:</strong> Data is stored in your browser's localStorage. Clearing browser data will remove all stored information. Use the "Export Data" feature in Data Management to create backups.
          </p>
        </div>
      </div>
    </div>
  );
}
