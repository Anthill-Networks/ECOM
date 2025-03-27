import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';
import logo from '../images/logo.png';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
    otp: '',
  });
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(loginData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/send-phone-otp', {
        phone: loginData.phone,
        company_id: "d2f4906d-8e71-4623-afc1-c3af5653ae9a"
      });

      if (response.status === 200) {
        setShowOTP(true);
        setOtpTimer(30); // Start 30 second timer
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Phone number not registered. Please sign up.');
      } else {
        toast.error(error.response?.data?.message || 'Error sending OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/login', {
        phone: loginData.phone,
        password: loginMethod === 'password' ? loginData.password : undefined,
        otp: loginMethod === 'otp' ? loginData.otp : undefined,
        company_id: "d2f4906d-8e71-4623-afc1-c3af5653ae9a"
      });

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('username', response.data.name);
        
        toast.success('Logged in successfully!');
        
        if(response.data.user.role === "admin"){
          window.location.href = '/admin/products';
        } else {
          window.location.href = '/';
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <img src={logo} alt="Logo" className="max-h-50" />
      </div>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Login to Your Account</h2>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('password');
                setShowOTP(false);
                setLoginData({ ...loginData, otp: '' });
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                loginMethod === 'password'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 bg-gray-100'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('otp');
                setLoginData({ ...loginData, password: '' });
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                loginMethod === 'otp'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 bg-gray-100'
              }`}
            >
              OTP
            </button>
          </div>
        </div>

        <form onSubmit={loginMethod === 'otp' && !showOTP ? handleSendOTP : handleSubmit} 
              className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={loginData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {loginMethod === 'password' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            )}

            {loginMethod === 'otp' && showOTP && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={loginData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
                <div className="mt-2">
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
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading
                ? 'Please wait...'
                : loginMethod === 'otp' && !showOTP
                ? 'Get OTP'
                : 'Login'}
            </button>
          </div>
        </form>

        <div className="text-center space-y-2">
          {loginMethod === 'password' && (
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-green-600 hover:text-green-500"
            >
              Forgot Password?
            </button>
          )}
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-[#0d2946] hover:text-[#0d2946]"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;