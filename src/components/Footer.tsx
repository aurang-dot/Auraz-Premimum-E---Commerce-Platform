import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Lock, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { AboutUsSheet } from './footer-sections/AboutUsSheet';
import { CareersSheet } from './footer-sections/CareersSheet';
import { PressSheet } from './footer-sections/PressSheet';
import { SustainabilitySheet } from './footer-sections/SustainabilitySheet';
import { TermsSheet } from './footer-sections/TermsSheet';
import { PrivacySheet } from './footer-sections/PrivacySheet';
import { CookiePolicySheet } from './footer-sections/CookiePolicySheet';
import { ShippingPolicySheet } from './footer-sections/ShippingPolicySheet';
import { HelpCenterSheet } from './footer-sections/HelpCenterSheet';
import { TrackOrderSheet } from './footer-sections/TrackOrderSheet';
import { ReturnsSheet } from './footer-sections/ReturnsSheet';
import { ContactSheet } from './footer-sections/ContactSheet';
import { FAQSheet } from './footer-sections/FAQSheet';

export function Footer() {
  const [openSheet, setOpenSheet] = useState<string | null>(null);

  const handleOpenSheet = (sheetName: string) => {
    setOpenSheet(sheetName);
  };

  const handleCloseSheet = () => {
    setOpenSheet(null);
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* About Section */}
          <div>
            {/* Brand Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 bg-[#591220] rounded-lg flex items-center justify-center">
                <span className="text-white">A</span>
              </div>
              <div>
                <p className="text-gray-800">AURAZ</p>
                <p className="text-gray-500 text-xs">Premium E-Commerce</p>
              </div>
            </div>
            
            <ul className="space-y-2.5 text-gray-600 text-sm">
              <li>
                <button 
                  onClick={() => handleOpenSheet('about')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('careers')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Careers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('press')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Press & Media
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('sustainability')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Sustainability
                </button>
              </li>
              <li className="pt-2 border-t border-gray-200 mt-3">
                <Link to="/admin" className="hover:text-[#591220] transition-all inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100">
                  <Lock className="h-3 w-3" />
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="mb-4 text-[#591220]">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-gray-600 text-sm">
              <li>
                <button 
                  onClick={() => handleOpenSheet('help')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('track')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Track Order
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('returns')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('contact')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('faq')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-[#591220]">
              Legal
            </h3>
            <ul className="space-y-2.5 text-gray-600 text-sm">
              <li>
                <button 
                  onClick={() => handleOpenSheet('terms')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('privacy')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('cookie')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Cookie Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('shipping')} 
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#591220] transition-colors"></span>
                  Shipping Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="mb-4 text-[#591220]">
              Get in Touch
            </h3>
            <ul className="space-y-2.5 text-gray-600 text-sm">
              <li>
                <button 
                  onClick={() => handleOpenSheet('contact')}
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-start gap-2 group text-left"
                >
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:text-[#591220] transition-colors" />
                  <span>aurazsupport@gmail.com</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('contact')}
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-start gap-2 group text-left"
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:text-[#591220] transition-colors" />
                  <span>01604710170</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenSheet('contact')}
                  className="hover:text-[#591220] transition-all hover:translate-x-1 inline-flex items-start gap-2 group text-left"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:text-[#591220] transition-colors" />
                  <span>1 No Road Kalusha Sorok, Barisal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-6"></div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-sm">© 2025 AURAZ. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <span className="text-gray-600 text-sm hidden sm:block">Follow Us:</span>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-white border border-gray-300 hover:border-[#591220] hover:bg-[#591220] hover:text-white transition-all flex items-center justify-center group"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-white border border-gray-300 hover:border-[#591220] hover:bg-[#591220] hover:text-white transition-all flex items-center justify-center group"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-white border border-gray-300 hover:border-[#591220] hover:bg-[#591220] hover:text-white transition-all flex items-center justify-center group"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-white border border-gray-300 hover:border-[#591220] hover:bg-[#591220] hover:text-white transition-all flex items-center justify-center group"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* All Sheets */}
      <AboutUsSheet open={openSheet === 'about'} onOpenChange={handleCloseSheet} />
      <CareersSheet open={openSheet === 'careers'} onOpenChange={handleCloseSheet} />
      <PressSheet open={openSheet === 'press'} onOpenChange={handleCloseSheet} />
      <SustainabilitySheet open={openSheet === 'sustainability'} onOpenChange={handleCloseSheet} />
      <TermsSheet open={openSheet === 'terms'} onOpenChange={handleCloseSheet} />
      <PrivacySheet open={openSheet === 'privacy'} onOpenChange={handleCloseSheet} />
      <CookiePolicySheet open={openSheet === 'cookie'} onOpenChange={handleCloseSheet} />
      <ShippingPolicySheet open={openSheet === 'shipping'} onOpenChange={handleCloseSheet} />
      <HelpCenterSheet open={openSheet === 'help'} onOpenChange={handleCloseSheet} />
      <TrackOrderSheet open={openSheet === 'track'} onOpenChange={handleCloseSheet} />
      <ReturnsSheet open={openSheet === 'returns'} onOpenChange={handleCloseSheet} />
      <ContactSheet open={openSheet === 'contact'} onOpenChange={handleCloseSheet} />
      <FAQSheet open={openSheet === 'faq'} onOpenChange={handleCloseSheet} />
    </footer>
  );
}
