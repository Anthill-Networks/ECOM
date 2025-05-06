import React, { useEffect, useState } from 'react';
import Header from '../components/navbar/header';
import Nav from '../components/navbar/nav';
import ProductDetailsHeader from '../components/product/ProductDetailsHeader';
import Footer from '../components/footer/footer';
import axiosInstance from '../axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    country: '',
    city: '', 
    state: '',
    zip: '',
    mobileNumber: '',
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [error, setError] = useState(null);
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Check if this is a "Buy Now" checkout
        const searchParams = new URLSearchParams(location.search);
        const isBuyNow = searchParams.get('buyNow') === 'true';
        
        if (isBuyNow) {
          // Get the single item from session storage
          const buyNowItem = sessionStorage.getItem('buyNowItem');
          if (buyNowItem) {
            setCartItems([JSON.parse(buyNowItem)]);
          } else {
            toast.error('Buy now item not found');
            navigate('/');
          }
        } else {
          // Regular cart checkout
          let response = await axiosInstance.get('/carts');
          setCartItems(response.data.cart_items);
        }
      } catch (error) {
        const errorMessage = error.message === 'Network Error'
          ? 'Unable to connect to server. Please check your internet connection.'
          : 'Error fetching cart items. Please try again later.';
        toast.error(errorMessage);
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [location.search, navigate]);

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const response = await axiosInstance.get('/users_data');
        
        // Only set saved addresses if address data exists
        if (response.data && response.data.address) {
          setSavedAddresses({
            first_name: response.data.address.first_name || '',
            last_name: response.data.address.last_name || '',
            address: response.data.address.address || '',
            apartment: response.data.address.apartment || '',
            country: response.data.address.country || '',
            city: response.data.address.city || '',
            state: response.data.address.state || '',
            zip: response.data.address.zip || '',
            phone: response.data.phone || '',
          });
        }
        
        // Set contact info if available
        if (response.data) {
          setContactInfo({
            email: response.data.email || '',
            mobileNumber: response.data.mobileNumber || ''
          });
        }

        // Only set shipping address if useDefaultAddress is true and address data exists
        if (useDefaultAddress && response.data && response.data.address) {
          setShippingAddress({
            firstName: response.data.address.first_name || '',
            lastName: response.data.address.last_name || '',
            address: response.data.address.address || '',
            apartment: response.data.address.apartment || '',
            country: response.data.address.country || '',
            city: response.data.address.city || '',
            state: response.data.address.state || '',
            zip: response.data.address.zip || '',
            mobileNumber: response.data.phone || '',
          });
        }
      } catch (error) {
        const errorMessage = error.message === 'Network Error'
          ? 'Unable to connect to server. Please check your internet connection.'
          : 'Error fetching saved addresses. Please try again later.';
        toast.error(errorMessage);
        console.error("Error fetching saved addresses:", error);
      }
    };

    fetchSavedAddresses();
  }, [useDefaultAddress]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setShippingAddress({
        firstName: selectedAddress.first_name,
        lastName: selectedAddress.last_name,
        address: selectedAddress.address,
        apartment: selectedAddress.apartment || '',
        country: selectedAddress.country,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip,
        phone: selectedAddress.phone,
      });
    }
  };

  const subtotal = cartItems?.reduce((sum, item) => {
    const variant = item.product.variants.find(v => v.id === item.variant_id);
    return sum + (variant ? variant.price * item.quantity : 0);
  }, 0) || 0;
  
  const total = subtotal + 0.00; // Adding shipping cost

  const handleOrderPlacement = async () => {
    try {
      // Validate required fields
      if (!contactInfo.email || !shippingAddress.firstName || !shippingAddress.lastName || 
          !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || 
          !shippingAddress.zip || !shippingAddress.phone) {
        toast.error('Please fill in all required fields');
        return;
      }

      const order = {
        company_id: "d2f4906d-8e71-4623-afc1-c3af5654ae2a",
        total_amount: subtotal + 0.00,
        status: "pending",
        address: {
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          address: shippingAddress.address,
          apartment: shippingAddress.apartment,
          country: shippingAddress.country,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
        },
        phone: shippingAddress.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const orderResponse = await axiosInstance.post('/orders', order);
      const { primaryResult, razorpayOrder } = orderResponse.data;

      // Check if this is a "Buy Now" checkout
      const searchParams = new URLSearchParams(location.search);
      const isBuyNow = searchParams.get('buyNow') === 'true';

      for (const item of cartItems) {
        const variant = item.product.variants.find(v => v.id === item.variant_id);
        const orderItem = {
          order_id: primaryResult.id,
          product_id: item.product.id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          original_price: variant ? variant.price : item.product.base_price,
          discounted_price: variant ? variant.price : item.product.base_price,
          company_id: item.product.company_id,
          product_name: item.product.name,
          variant_name: variant ? variant.name : '',
        };

        await axiosInstance.post('/order_item', orderItem);
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_live_7zuH154CVQA9YI",
        amount: total * 100, // Convert to smallest currency unit
        currency: razorpayOrder.currency,
        name: "Nilgiris Store",
        description: "Order Transaction",
        image: "https://example.com/your_logo",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axiosInstance.post('/verifyPayment', {
              order_id: razorpayOrder.id,
              DB_order_id: primaryResult.id,
              payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.status === "success") {
              // If this was a normal cart purchase, clear the cart
              if (!isBuyNow) {
                localStorage.removeItem('cart');
              } else {
                // Clear the buy now item from session storage
                sessionStorage.removeItem('buyNowItem');
              }
              
              toast.success('Payment successful!');
              navigate('/ordersuccess');
            } else {
              toast.error('Payment verification failed');
              navigate('/order-failed');
            }
          } catch (error) {
            const errorMessage = error.message === 'Network Error'
              ? 'Payment verification failed due to network error'
              : 'Payment verification failed';
            toast.error(errorMessage);
            navigate('/order-failed');
          }
        },
        prefill: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: contactInfo.email,
          contact: shippingAddress.phone,
        },
        notes: {
          address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zip}`,
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      const errorMessage = error.message === 'Network Error'
        ? 'Unable to place order due to network error. Please check your connection.'
        : 'Error placing order. Please try again later.';
      toast.error(errorMessage);
      console.error("Error placing order:", error);
      navigate('/order-failed');
    }
  };

  return (
    <>
      <Header />
      <Nav />
      <ProductDetailsHeader 
        title="Checkout"
        breadcrumbs={[
          { text: 'Home' , link: '/' },
          { text: 'Cart', link: '/cart' },
          { text: 'Checkout' , link: '/checkout' }
        ]}
      />

      <div className="container mx-auto lg:px-10 px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Check out</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <input 
                type="email" 
                placeholder="Email or mobile phone number" 
                className="mb-4 border rounded p-2 w-full"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                required
              />
              <div className="flex items-center mb-4">
                <input type="checkbox" id="offers" className="mr-2" />
                <label htmlFor="offers" className="text-sm">Keep me up to date on news and exclusive offers</label>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="useDefaultAddress" className="font-medium">
                    Use default address from profile
                  </label>
                  <input
                    type="checkbox"
                    id="useDefaultAddress"
                    checked={useDefaultAddress}
                    onChange={(e) => setUseDefaultAddress(e.target.checked)}
                    className="h-4 w-4 text-blue-600"
                  />
                </div>
                
                {savedAddresses && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Saved Address:</h3>
                    <div className="text-sm text-gray-600">
                      <p>{savedAddresses.first_name} {savedAddresses.last_name}</p>
                      <p>{savedAddresses.address}</p>
                      {savedAddresses.apartment && <p>{savedAddresses.apartment}</p>}
                      <p>{savedAddresses.city}, {savedAddresses.state} {savedAddresses.zip}</p>
                      <p>{savedAddresses.country}</p>
                      <p>Phone: {savedAddresses.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Shipping address</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First name *
                    </label>
                    <input 
                      id="firstName"
                      placeholder="First name" 
                      className="border rounded p-2 w-full"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      required
                      disabled={useDefaultAddress}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last name *
                    </label>
                    <input 
                      id="lastName"
                      placeholder="Last name" 
                      className="border rounded p-2 w-full"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      required
                      disabled={useDefaultAddress}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input 
                    id="address"
                    placeholder="Address" 
                    className="border rounded p-2 w-full"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    required
                    disabled={useDefaultAddress}
                  />
                </div>
                <div>
                  <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                    Apartment (optional)
                  </label>
                  <input 
                    id="apartment"
                    placeholder="Apartment, suite, etc." 
                    className="border rounded p-2 w-full"
                    value={shippingAddress.apartment}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                    disabled={useDefaultAddress}
                  />
                </div>
                {/* <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country/Region *
                  </label>
                  <select 
                    id="country"
                    className="border rounded p-2 w-full" 
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    required
                    disabled={useDefaultAddress}
                  >
                    <option value="" disabled>Select Country/Region</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                  </select>
                </div> */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input 
                      id="city"
                      placeholder="City" 
                      className="border rounded p-2 w-full"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                      disabled={useDefaultAddress}
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input 
                      id="state"
                      placeholder="State" 
                      className="border rounded p-2 w-full"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      required
                      disabled={useDefaultAddress}
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP code *
                    </label>
                    <input 
                      id="zip"
                      placeholder="ZIP code" 
                      className="border rounded p-2 w-full"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                      required
                      disabled={useDefaultAddress}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input 
                    id="phone"
                    placeholder="Phone" 
                    className="border rounded p-2 w-full"
                    value={shippingAddress.mobileNumber}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, mobileNumber: e.target.value })}
                    required
                    disabled={useDefaultAddress}
                  />
                </div>
              </form>
            </div>
            {/* <button className="mt-6 bg-blue-500 text-white p-2 rounded">Change Details</button> */}
          </div>
          <div className="lg:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg">
              {cartItems?.map((item) => {
                const variant = item.product.variants.find(v => v.id === item.variant_id);
                const price = variant ? variant.price : item.product.base_price;

                return (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                    <div className="relative">
                      <img src={item.product.images[0]} alt={item.product.name} width={50} height={50} className="rounded" />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">{variant ? variant.name : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{price}</p>
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹6.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>₹{total}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Shipping & taxes calculated at checkout</p>
              <button 
                className="w-full mt-4 bg-green-500 text-white p-2 rounded"
                onClick={handleOrderPlacement}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}