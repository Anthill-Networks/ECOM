import React, { useState } from 'react';
import axiosInstance from '../axios';
import logo from '../images/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [showOTP, setShowOTP] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^[0-9]{10}$/;  // Adjust regex as per your requirements
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!formData.phone) {
      toast.error('Please enter phone number');
      return;
    }

    try {
      await axiosInstance.post('/send-phone-otp', {
        phone: formData.phone,
        company_id: "d2f4906d-8e71-4623-afc1-c3af5653ae9a"
      });
      
      setShowOTP(true);
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/users', {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        otp: formData.otp,
        role: 'user',
        company_id: "d2f4906d-8e71-4623-afc1-c3af5653ae9a"
      });

      if (response.status === 201) {
        toast.success('Account created successfully!');
        // After successful account creation, try to log in automatically
        try {
          const loginResponse = await axiosInstance.post('/login', {
            phone: formData.phone,
            password: formData.password,
            company_id: "d2f4906d-8e71-4623-afc1-c3af5653ae9a"
          });

          if (loginResponse.status === 200) {
            localStorage.setItem('user', JSON.stringify(loginResponse.data));
            localStorage.setItem('role', loginResponse.data.user.role);
            localStorage.setItem('username', loginResponse.data.name);
            
            toast.success('Logged in successfully!');
            
            if(loginResponse.data.user.role === "admin"){
              window.location.href = '/admin/products';
            } else {
              window.location.href = '/';
            }
          }
        } catch (loginError) {
          // If auto-login fails, redirect to login page
          // navigate('/login');
          toast.error('Failed to log in automatically. Please log in manually.');
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Invalid OTP. Please try again.');
      } else if (error.response?.status === 400) {
        toast.error('Phone number already exists. Please login instead.');
      } else {
        toast.error(error.response?.data?.message || 'Error creating account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <img src={logo} alt="Logo"/>
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create New Account
        </h1>
        
        <form onSubmit={showOTP ? handleSubmit : handleSendOTP} className="mt-8 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Create a password"
                required
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Confirm your password"
                required
              />
            </div>

            {showOTP && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter OTP"
                  required
                />
              </div>
            )}

            {showOTP && (
              <div>
                {otpTimer > 0 ? (
                  <p className="text-sm text-gray-500">Resend OTP in {otpTimer}s</p>
                ) : (
                  <button 
                    type="button"
                    onClick={handleSendOTP}
                    className="text-sm text-green-600 hover:text-green-500"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Please wait...' : (showOTP ? 'Create Account' : 'Get OTP')}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#0d2946] hover:text-[#0d2946]">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupScreen;
