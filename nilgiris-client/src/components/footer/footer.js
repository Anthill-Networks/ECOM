import { Facebook, Twitter, Instagram } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { Link } from "react-router-dom";

export default function Footer() {
  const { settings, loading } = useSettings();

  if (loading) return null;

  return (
    <footer className="bg-[#8CC63F] text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Logo and Subscribe Section */}
          <div className="space-y-6 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3">
              {settings?.footerLogo ? (
                <img src={settings.footerLogo} alt="Logo" className="w-8 sm:w-10 h-8 sm:h-10 object-contain" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 sm:w-10 h-8 sm:h-10"
                >
                  <path d="M11.1 14.9l-2.3-2.3c-1.2-1.2-1.2-3.1 0-4.2 1.2-1.2 3.1-1.2 4.2 0l2.3 2.3c1.2 1.2 1.2 3.1 0 4.2-1.2 1.2-3.1 1.2-4.2 0z" />
                  <path d="M7.5 18.5l-3-3c-1.2-1.2-1.2-3.1 0-4.2l6.4-6.4c1.2-1.2 3.1-1.2 4.2 0l3 3c1.2 1.2 1.2 3.1 0 4.2l-6.4 6.4c-1.2 1.2-3.1 1.2-4.2 0z" />
                </svg>
              )}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {settings?.storeName || 'NILGIRI STORE'}
              </h2>
            </div>
            <p className="text-base sm:text-lg font-medium italic">"Purely Harvested, Perfectly Delivered"</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full sm:w-auto flex-1 rounded-lg sm:rounded-r-none bg-[#A4D165] text-white placeholder-white/90 border-none px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4D7C0F]"
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto rounded-lg sm:rounded-l-none bg-[#4D7C0F] hover:bg-[#3F6C0D] text-white px-6 py-3 font-medium transition-colors duration-200"
              >
                Subscribe
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Contact Info</h3>
              <p className="text-base leading-relaxed">{settings?.address || '17 Princess Road, London, Greater London NW1 8JR, UK'}</p>
              <p className="text-base leading-relaxed">{settings?.email}</p>
              <p className="text-base leading-relaxed">{settings?.phoneNumber}</p>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-4 sm:mt-0">
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              {["Tea", "Coffee", "Essential Oils", "Homemade Chocolates", "Honey", "Spices"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-base hover:text-[#4D7C0F] transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="mt-4 sm:mt-0">
            <h3 className="text-xl font-semibold mb-4">Customer Care</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              {["Call", "Email"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-base hover:text-[#4D7C0F] transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div className="mt-4 sm:mt-0">
            <h3 className="text-xl font-semibold mb-4">Pages</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              {["Home", "Products", "Blogs"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-base hover:text-[#4D7C0F] transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-[#A4D165] flex flex-col items-center sm:flex-row sm:justify-between gap-4">
          <p className="text-sm sm:text-base font-medium text-center sm:text-left">
            &copy; 2024 {settings?.storeName || 'Nilgiri Store'} - All Rights Reserved
          </p>
          <div className="flex space-x-6">
            {settings?.facebookAccount && (
              <a 
                href={settings.facebookAccount} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#4D7C0F] transition-colors duration-200"
              >
                <Facebook size={24} />
              </a>
            )}
            {settings?.twitterAccount && (
              <a 
                href={settings.twitterAccount} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#4D7C0F] transition-colors duration-200"
              >
                <Twitter size={24} />
              </a>
            )}
            {settings?.instagramAccount && (
              <a 
                href={settings.instagramAccount} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#4D7C0F] transition-colors duration-200"
              >
                <Instagram size={24} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}