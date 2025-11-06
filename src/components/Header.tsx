import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Shield, Heart, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { categories } from '../lib/mockData';
import { useApp } from '../lib/AppContext';

interface HeaderProps {
  cartItemCount?: number;
}

export function Header({ cartItemCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout, wishlist, getUserUnreadNotificationCount } = useApp();
  
  const unreadNotifications = currentUser ? getUserUnreadNotificationCount(currentUser.id) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#591220] text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm">Welcome to AURAZ - Your One-Stop Shop</p>
          {isAdmin && (
            <div className="flex gap-4 text-sm">
              <Link to="/admin" className="hover:underline flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin Panel
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-[#591220] text-white px-4 py-2 rounded">
              <span className="font-bold text-xl">AURAZ</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products, categories, brands, sellers…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 bg-gray-50 border-gray-200"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-0 top-0 bg-[#591220] hover:bg-[#6d1728]"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Notifications - Only for logged in users */}
            {currentUser && !isAdmin && (
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#591220]">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#591220]">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#591220]">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Profile */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAdmin ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/profile">My Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders">My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/wishlist">Wishlist</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="hidden md:flex">
                  Login / Sign Up
                </Button>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products, categories, brands…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 bg-gray-50"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-0 top-0 bg-[#591220] hover:bg-[#6d1728]"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Navigation */}
      <nav className="border-t hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-3">
            {/* Categories Dropdown - Hover Based */}
            <div className="relative group">
              <Button variant="ghost" className="gap-2">
                Categories <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </Button>
              
              {/* Dropdown Menu - Shows on Hover */}
              <div className="absolute left-0 top-full mt-1 w-64 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="block px-4 py-2.5 hover:bg-gray-50 hover:text-[#591220] transition-colors"
                    >
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/deals" className="hover:text-[#591220] transition-colors">
              Today's Deals
            </Link>
            <Link to="/new-arrivals" className="hover:text-[#591220] transition-colors">
              New Arrivals
            </Link>
            <Link to="/trending" className="hover:text-[#591220] transition-colors">
              Trending
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <div className="space-y-1">
              <p className="px-3 py-2 text-sm text-gray-500">Categories</p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="block px-3 py-2 hover:bg-gray-50 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="border-t pt-2 space-y-1">
              <Link
                to="/deals"
                className="block px-3 py-2 hover:bg-gray-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Today's Deals
              </Link>
              <Link
                to="/new-arrivals"
                className="block px-3 py-2 hover:bg-gray-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
