import React, { useState, useEffect } from 'react';
import { Loader, Loader2Icon, Minus, Plus, X } from 'lucide-react';
import Header from '../components/navbar/header';
import Nav from '../components/navbar/nav';
import ProductDetailsHeader from '../components/product/ProductDetailsHeader';
import Footer from '../components/footer/footer';
import axiosInstance from '../axios';
import { Link } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateCartCount } = useCart();

  useEffect(() => {
    axiosInstance.get('/carts/')
      .then(response => {
        setCartItems(response.data.cart_items);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      });
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
  };

  const removeItem = (itemId) => {
    axiosInstance.post('/carts/remove', { item_id: itemId })
      .then(() => {
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);
        updateCartCount();
      })
      .catch(error => {
        console.error('Error removing item from cart:', error);
      });
  };

  const clearCart = async () => {
    for (const item of cartItems) {
      await axiosInstance.post('/carts/remove', { item_id: item.id });
    }
    setCartItems([]);
    updateCartCount();
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const variantPrice = item.product.variants.find(variant => variant.id === item.variant_id)?.price || 0;
    return sum + (variantPrice * item.quantity);
  }, 0);
  
  const total = subtotal + 6.00;

  if (loading) {
    return (
      <>
        <Header />
        <Nav />
        <ProductDetailsHeader 
          title="Shopping Cart"
          breadcrumbs={[
            { text: 'Home' , link: '/' },
            { text: 'Cart' , link: '/cart' }
          ]}
        />
        <div className='min-h-[50vh] flex justify-center items-center'>
          <HashLoader color="#1fcb52" />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <Nav />
      <ProductDetailsHeader 
        title="Shopping Cart"
        breadcrumbs={[
          { text: 'Home' , link: '/' },
          { text: 'Cart' , link: '/cart' }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Shopping Cart ({cartItems.length} items)</h2>
              {cartItems.length > 0 && (
                <button 
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>

            <div className="space-y-6">
              {cartItems.map((item) => {
                const variant = item.product.variants.find(v => v.id === item.variant_id);
                const price = variant ? variant.price : item.product.base_price;
                const image = item.product.images[0];

                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <img 
                          src={image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg truncate">{item.product.name}</h3>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.product.description}</p>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                          <div className="flex items-center border rounded-lg">
                            <button 
                              className="p-2 hover:bg-gray-50" 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 border-x">{item.quantity}</span>
                            <button 
                              className="p-2 hover:bg-gray-50" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-lg font-medium">
                            ₹{(price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹6.00</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="block mt-8 bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
