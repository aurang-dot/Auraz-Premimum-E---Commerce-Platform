import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { useApp } from '../../lib/AppContext';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, currentUser, isAdmin } = useApp();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (currentUser && isAdmin) {
      navigate('/admin');
    }
  }, [currentUser, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(loginData.email, loginData.password);
    
    setIsLoading(false);
    
    if (success && loginData.email === 'auraz@admin.com') {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#591220] to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl mb-4 border border-white/20">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-white text-3xl mb-2">Admin Portal</h1>
          <p className="text-gray-300 text-sm">Secure Administrative Access</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-0.5 w-10 bg-white/30 rounded-full"></div>
            <Shield className="h-3 w-3 text-white/50" />
            <div className="h-0.5 w-10 bg-white/30 rounded-full"></div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-[#591220] to-[#7d1829] p-4">
            <h2 className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Administrator Login
            </h2>
            <p className="text-white/80 text-sm mt-1">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-gray-700 flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                Administrator Email
              </Label>
              <div className="relative">
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter admin email"
                  className="h-10 bg-gray-50 border-gray-300 focus:border-[#591220] focus:ring-[#591220] pl-4 pr-4 text-sm"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-gray-700 flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your admin password"
                  className="h-10 bg-gray-50 border-gray-300 focus:border-[#591220] focus:ring-[#591220] pl-4 pr-10 text-sm"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-amber-900 mb-1">Security Notice</p>
                  <p className="text-xs text-amber-800">All login attempts are monitored and logged for security purposes.</p>
                </div>
              </div>
            </div>



            {/* Login Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-10 bg-gradient-to-r from-[#591220] to-[#7d1829] hover:from-[#6d1728] hover:to-[#8d1e33] text-white shadow-lg text-sm"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Access Admin Panel
                </div>
              )}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 space-y-3">
          <Link to="/">
            <Button 
              variant="ghost" 
              className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Website
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-white/60 text-xs">Authorized Personnel Only</p>
            <p className="text-white/40 text-xs">© 2025 AURAZ. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
