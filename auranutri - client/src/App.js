import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage';
import './App.css'; // Make sure to import your custom CSS
import ProductShowcase from './pages/ProductShowcase';
import Cart from './pages/cart';
import Products from './pages/products';
import AuthModal from './pages/authmodel';
import { useEffect, useState } from 'react';
import CheckoutPage from './pages/Checkout';
import ContactPage from './pages/contactus';
import AdminDashboard from './pages/Admin/AdminDashboard';
import OrderManagement from './pages/Admin/orders';
import ProductManagement from './pages/Admin/product';
import UserManagement from './pages/Admin/user';
import AdminLogin from './pages/Admin/login';
import CategoryManagement from './pages/Admin/category';
import BlogsScreen from './pages/blogs';
import SingleBlogPost from './pages/blog';
import Profile from './pages/profile';
import BlogsAdminScreen from './pages/Admin/blog';
import EnquiryAdminScreen from './pages/Admin/Enquiry';
import OrderSuccess from './pages/ordersuccess';
import LoginPage from './pages/loginpage';
import SignupScreen from './pages/signup';
import OtpScreen from './pages/otp';
import { Toaster } from 'react-hot-toast';
import OrderItems from './pages/orderitems';
import OrderItemsScreen from './pages/orderitems';
import Orders from './components/order/orders';
import OrdersScreen from './pages/orders';
import Settings from './pages/Admin/settings';
import { SettingsProvider } from './context/SettingsContext';
import ForgotPassword from './pages/ForgotPassword';
import TermsAndConditions from './pages/terms';
import PrivacyPolicy from './pages/privacy';
import RefundPolicy from './pages/refund';
import { CartProvider } from './context/CartContext';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // useEffect(() => {
  //   // Check if there is a token in local storage
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     setShowAuthModal(true);
  //   }
  //   else {
  //     setShowAuthModal(false);
  //   }
  // }, []);

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  return (
    <SettingsProvider>
      <CartProvider>
        <div className='josefin-sans'>
          <Toaster position="bottom-center" />
         
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductShowcase />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/products" element={<Products />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path='/blogs' element={<BlogsScreen />} />
              <Route path='/blog/:id' element={<SingleBlogPost />} />
              <Route path='profile' element={<Profile />} />
              <Route path='ordersuccess' element={<OrderSuccess />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<SignupScreen />} />
              <Route path='/verify-otp' element={<OtpScreen />} />
              <Route path='/orderitems/:orderNumber' element={<OrderItemsScreen />} />
              <Route path='/orders' element={<OrdersScreen />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
        
              <>
              {localStorage.getItem('role') === "admin" && (
                <>  
                {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
                <Route path="/admin/categories" element={<CategoryManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/user" element={<UserManagement />} />
                <Route path="/admin/blog" element={<BlogsAdminScreen />} />
                <Route path="/admin/enquiry" element={<EnquiryAdminScreen />} />
                <Route path="/admin/settings" element={<Settings />} />
                </>
              )}
              </>

              {localStorage.getItem('role') !== "admin" && (
                <Route path="/admin/*" element={<LoginPage />} />
              )}
          
            </Routes>
          </Router>
        </div>
      </CartProvider>
    </SettingsProvider>
  );
}

export default App;