import { Facebook, Twitter, Instagram } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { Link } from "react-router-dom";

export default function Footer() {
  const { settings, loading } = useSettings();

  if (loading) return null;

  return (
    <footer className="bg-[#faeed8] text-black">
      <div className="container w-full md:w-[80%] mx-auto px-4 py-6">
        {/* Register Now Section */}
        <div className="bg-[#4D7C0F] mx-auto rounded-lg p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h3 className="text-lg sm:text-xl font-semibold text-center sm:text-left whitespace-nowrap">
              Register Now
            </h3>
            <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your Email"
                className="flex-1 rounded-lg bg-white text-gray-800 px-4 py-2 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#C75D5D] hover:bg-[#B54A4A] text-white px-6 py-2 whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links and Social Media */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <Link to="/" className="hover:text-gray-800">
              Home
            </Link>
            <Link to="/products" className="hover:text-gray-800">
              Products
            </Link>
            <Link to="/blogs" className="hover:text-gray-800">
              Blogs
            </Link>
            <Link to="/contact" className="hover:text-gray-800">
              Contact
            </Link>
          </nav>

          {/* Social Media Icons */}
          <div className="flex gap-4">
            {settings?.facebookAccount && (
              <a
                href={settings.facebookAccount}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={24} />
              </a>
            )}
            {settings?.twitterAccount && (
              <a
                href={settings.twitterAccount}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={24} />
              </a>
            )}
            {settings?.instagramAccount && (
              <a
                href={settings.instagramAccount}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={24} />
              </a>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="text-left lg:ml-0 ml-10 text-xs mb-4">
          <address>
            12/576 d 7 f, Vadakedath,
            <br />
            Gudalur, Thottamoola, Ezhumuram,
            <br />
            Tamil Nadu, The Nilgiris, PIN 643212
          </address>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm border-t border-gray-300 pt-4 gap-4">
          <p className="text-center sm:text-left">
            &copy; 2025 AURANUTRI. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex flex-wrap gap-4">
              <Link to="/terms" className="hover:text-gray-800 whitespace-nowrap">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="hover:text-gray-800 whitespace-nowrap">
                Privacy Policy
              </Link>
              <Link to="/refund" className="hover:text-gray-800 whitespace-nowrap">
                Refund & Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
