import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Package, CreditCard, Tag, AlertCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useApp } from '../lib/AppContext';

export function NotificationsPage() {
  const navigate = useNavigate();
  const { currentUser, getUserNotifications, markNotificationRead } = useApp();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const notifications = getUserNotifications(currentUser.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5" />;
      case 'payment':
        return <CreditCard className="h-5 w-5" />;
      case 'promotion':
        return <Tag className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-blue-600 bg-blue-50';
      case 'payment':
        return 'text-green-600 bg-green-50';
      case 'promotion':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: any) => {
    markNotificationRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl flex items-center gap-3">
              <Bell className="h-8 w-8 text-[#591220]" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-[#591220]">{unreadCount} New</Badge>
            )}
          </div>
          <p className="text-gray-600">Stay updated with your orders and offers</p>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2">No Notifications</h3>
              <p className="text-gray-600 mb-6">You're all caught up! Check back later for updates.</p>
              <Link to="/">
                <Button className="bg-[#591220] hover:bg-[#6d1728]">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-[#591220] bg-white' : 'bg-gray-50'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`${!notification.isRead ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-[#591220] rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {formatTime(notification.createdAt)}
                        </span>
                        {notification.link && (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
