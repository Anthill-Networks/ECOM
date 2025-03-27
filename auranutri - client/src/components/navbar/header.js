import React, { useEffect, useState } from "react";
import { Mail, Phone, User, ShoppingCart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../../axios";
import { useSettings } from "../../context/SettingsContext";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const { settings, loading } = useSettings();

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        if(localStorage.getItem('cartCount')){  
          setCartCount(localStorage.getItem('cartCount'));
        }else{
          const cartCount = await axiosInstance.post('/carts/itemcount');
          setCartCount(cartCount.data.item_count);
          localStorage.setItem('cartCount', cartCount.data.item_count);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, []);

  return null;


  // return (
  //   <header className="bg-green-800 text-white py-2 px-4 flex flex-wrap justify-between items-center">
  //     <div id="head" className="flex items-center space-x-2 text-sm">
  //       <Mail className="h-4 lg:block hidden w-4" />
  //       <a 
  //         href={`mailto:${settings?.email || 'themlgistore@gmail.com'}`}
  //         className="lg:block hidden hover:underline"
  //       >
  //         {settings?.email || 'themlgistore@gmail.com'}
  //       </a>
  //       <Phone className="h-4 w-4 ml-4" />
  //       <a 
  //         href={`tel:${settings?.phoneNumber || '+918958406836'}`}
  //         className="hover:underline"
  //       >
  //         {settings?.phoneNumber || '+91 8958406836'}
  //       </a>
  //     </div>
  //     <div className="flex items-center space-x-4 mt-2">
  //       <Link to="/profile" className="bg-transparent text-white border-none cursor-pointer flex items-center">
  //         <User className="h-4 w-4 mr-2" />
  //         <span className="lg:block hidden">Profile</span>
  //       </Link>
  //       <Link to="/orders" className="bg-transparent text-white border-none cursor-pointer flex items-center">
  //         <ShoppingBag className="h-4 w-4 mr-2" />
  //         <span className="lg:block hidden">Orders</span>
  //       </Link>
  //       <Link to="/cart" className="bg-transparent text-white border-none cursor-pointer relative">
  //         <ShoppingCart className="h-4 w-4" />
  //         {cartCount > 0 && (
  //           <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 p-2 flex items-center justify-center text-xs">
  //             {cartCount}
  //           </span>
  //         )}
  //       </Link>
  //     </div>
  //   </header>
  // );
}
