import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../firebase/productService";
import { Menu, X, ShoppingCart, LogOut } from "lucide-react";
import defaultLogo from "../../images/logo.png";
import { useSettings } from "../../context/SettingsContext";
import axiosInstance from "../../axios";
import { useCart } from '../../context/CartContext';

export default function Nav() {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await getAllProducts();
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products?.filter((product) =>
      product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleLogout = async () => {
    try {
      // Clear all localStorage items
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      
      // Get the backend domain from your axios configuration or environment
      ///ecomserver.anthillnetworks.com
      const backendDomain = 'ecomserver.anthillnetworks.com';
      
      // Clear cookies with various path and domain combinations
      const cookieOptions = [
        'path=/',
        'path=/; domain=' + window.location.hostname,
        'path=/; domain=.' + window.location.hostname,
        'path=/; domain=' + backendDomain,
        'path=/; domain=.' + backendDomain,
        'path=/; secure',
        'path=/; secure; SameSite=None'
      ];

      const cookiesToClear = ['token', 'refreshToken', 'user', 'role', 'username'];

      // Clear cookies for both frontend and backend domains
      cookiesToClear.forEach(cookieName => {
        cookieOptions.forEach(option => {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${option}`;
        });
      });

      // Also make a logout request to backend to clear server-side session if needed
      try {
        await axiosInstance.post('/api/users/logout');
      } catch (err) {
        // Continue with logout even if backend request fails
        console.warn('Backend logout failed:', err);
      }

      // Reset isLoggedIn state
      setIsLoggedIn(false);
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className={`bg-white py-4 px-6 flex flex-col md:flex-row justify-between items-center shadow-md ${menuOpen ? "bg-white" : ""}`}>
      <div className="flex justify-between items-center w-full">
        <Link to="/" className="mb-2 md:mb-0">
          <img 
            src={settings?.headerLogo || defaultLogo} 
            alt={settings?.storeName || "Nilgiri Harvest"} 
            className="h-14 lg:h-20" 
          />
        </Link>

        {/* Mobile: Search, Menu, and Cart */}
        <div className="flex items-center gap-4 lg:hidden">
          <div className="relative">
            <input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2.5 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            {/* Mobile Search Results */}
            {searchTerm && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500 text-center">No products found</div>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-green-800" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className={`md:flex ${menuOpen ? "block" : "hidden"} absolute md:static top-12 left-0 w-full bg-white md:bg-transparent`}>
        {menuOpen && (
          <div className="absolute inset-0 bg-white z-10" onClick={() => setMenuOpen(false)} />
        )}
        <div className={`flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 p-4 md:p-0 relative z-20`}>
          <button onClick={() => setMenuOpen(false)} className="md:hidden mb-2 flex items-center">
            <X className="h-6 w-6 text-green-800" />
          </button>
          <Link to="/" className="text-green-800 hover:text-[#0d2946]">Home</Link>
          <Link to="/products" className="text-green-800 hover:text-[#0d2946]">Products</Link>
          <Link to="/blogs" className="text-green-800 hover:text-[#0d2946]">Blog</Link>
          <Link to="/contact" className="text-green-800 hover:text-[#0d2946]">Contact</Link>
          {isLoggedIn && (
            <>
              <Link to="/orders" className="text-green-800 hover:text-[#0d2946]">Orders</Link>
              <Link to="/profile" className="text-green-800 hover:text-[#0d2946]">Profile</Link>
              <button 
                onClick={handleLogout}
                className="md:hidden flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-800 rounded-lg hover:bg-[#0d2946] transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </button>
            </>
          )}
          {!isLoggedIn && (
            <Link 
              to="/login" 
              className="md:hidden flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-800 rounded-lg hover:bg-[#0d2946] transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Desktop: Search, Cart and Auth */}
      <div className="relative hidden lg:flex items-center gap-6">
        <div className="relative">
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64 p-2.5 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          {/* Desktop Search Results */}
          {searchTerm && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.name}
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500 text-center">No products found</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-green-800" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </Link>
          
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-800 rounded-lg hover:bg-[#0d2946] transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </button>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-800 rounded-lg hover:bg-[#0d2946] transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
