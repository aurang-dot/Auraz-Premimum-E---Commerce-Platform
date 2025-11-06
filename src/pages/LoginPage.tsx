import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, ShoppingBag, UserCircle2, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { useApp } from '../lib/AppContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register, currentUser, isAdmin } = useApp();
  const [isSignup, setIsSignup] = useState(false);
  
  const [userLoginData, setUserLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [currentUser, isAdmin, navigate]);

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(userLoginData.email, userLoginData.password);
    if (success) {
      navigate('/');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (signupData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    register({
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone,
      password: signupData.password,
    });
    setSignupData({ name: '', email: '', phone: '', password: '' });
    setIsSignup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* User Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="bg-[#591220] text-white px-8 py-4 rounded-xl shadow-xl mb-4 inline-flex items-center gap-3 hover:bg-[#6d1728] transition-colors">
              <ShoppingBag className="h-8 w-8" />
              <span className="text-3xl">AURAZ</span>
            </div>
          </Link>
          <h2 className="text-gray-800 text-2xl mb-2">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600">
            {isSignup ? 'Join AURAZ and start shopping' : 'Login to continue your shopping'}
          </p>
        </div>

        {/* User Login/Signup Card */}
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <Tabs value={isSignup ? 'signup' : 'login'} onValueChange={(v) => setIsSignup(v === 'signup')}>
            <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100 p-1">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#591220] data-[state=active]:shadow-sm"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:text-[#591220] data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="p-6">
              <form onSubmit={handleUserLogin} className="space-y-5">
                <div>
                  <Label htmlFor="user-email" className="text-gray-700">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-11 h-12 bg-gray-50 border-gray-300 focus:border-[#591220] focus:ring-[#591220]"
                      value={userLoginData.email}
                      onChange={(e) => setUserLoginData({ ...userLoginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="user-password" className="text-gray-700">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="user-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-11 h-12 bg-gray-50 border-gray-300 focus:border-[#591220] focus:ring-[#591220]"
                      value={userLoginData.password}
                      onChange={(e) => setUserLoginData({ ...userLoginData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#591220] hover:bg-[#6d1728] text-white shadow-md"
                >
                  <UserCircle2 className="h-5 w-5 mr-2" />
                  Login to Your Account
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="p-6">
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <Label htmlFor="signup-name" className="text-gray-700">Full Name</Label>
                  <div className="relative mt-2">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-11 h-12 bg-gray-50 border-gray-300 focus:border-[#591220] focus:ring-[#591220]"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-gray-700">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-11 h-12 bg-gray-50 border-gray-300 focus:border-[#591220] focus:ring-[#591220]"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-phone" className="text-gray-700">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+880 1234 567 890"
                      className="pl-11 h-12 bg-gray-50 border-gray-300 focus:border-[#591220] focus:ring-[#591220]"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-password" className="text-gray-700">Password</Label>
                  <div className="relative mt-2">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password (min. 6 characters)"
                      className="pl-11 h-12 bg-gray-50 border-gray-300 focus:border-[#591220] focus:ring-[#591220]"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-900">
                      Your account will be pending until approved by an administrator. You'll be notified once approved.
                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#591220] hover:bg-[#6d1728] text-white shadow-md"
                >
                  <UserCircle2 className="h-5 w-5 mr-2" />
                  Create Account
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-[#591220] hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[#591220] hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Additional Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-[#591220] hover:underline"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
