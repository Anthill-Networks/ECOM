import React, { useEffect, useState } from 'react';
import { Clock, Check, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 2000);

    return () => clearInterval(timer); // Clear timer on unmount
  }, [navigate]);

  const handleContinueShopping = () => {
    navigate('/'); // Redirect to home or shop page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-5xl w-full relative">
        <Clock className="absolute top-8 left-8 w-12 h-12 text-blue-600" />
        <ClipboardList className="absolute bottom-8 right-8 w-12 h-12 text-pink-400" />
        
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 bg-green-100 rounded-full p-2">
            <Check className="w-8 h-8 text-[#0d2946]" />
          </div>
          
          <h1 className="text-2xl font-bold text-blue-900 mb-4">Your Order Is Completed!</h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your order! Your order is being processed and will be completed within 3-6 hours. You will receive an email confirmation when your order is completed.
          </p>
          
          <div 
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </div>

          <p className="mt-4 text-gray-500">
            You will be redirected in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
