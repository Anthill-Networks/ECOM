import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axios';
import logo from '../images/logo.png';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post('/login', {
        email: formData.email,
        password: formData.password,
        company_id: "d2f4906d-8e71-4623-afc1-c3af5654ae2a"
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('username', response.data.name);
      
      toast.success('Logged in successfully!');
      
      if(response.data.user.role === "admin") {
        window.location.href = '/admin/products';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error logging in');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!otpSent) {
        // Send OTP
        await axiosInstance.post('/send-email-otp', {
          email: formData.email,
          company_id: "d2f4906d-8e71-4623-afc1-c3af5654ae2a"
        });
        setOtpSent(true);
        toast.success('OTP sent to your email!');
      } else {
        // Reset password
        await axiosInstance.post('/reset-password', {
          email: formData.email,
          otp,
          newPassword,
          company_id: "d2f4906d-8e71-4623-afc1-c3af5654ae2a"
        });
        toast.success('Password reset successful!');
        setForgotPassword(false);
        setOtpSent(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error processing request');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {forgotPassword ? 'Reset Password' : 'Login to Your Account'}
        </h2>
        
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        
        <form onSubmit={forgotPassword ? handleForgotPassword : handleLogin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          {!forgotPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          )}

          {forgotPassword && otpSent && (
            <>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  minLength={8}
                />
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              {forgotPassword ? (otpSent ? 'Reset Password' : 'Send OTP') : 'Login'}
            </button>
          </div>
        </form>
        
        <div className="text-center space-y-2">
          <button
            onClick={() => setForgotPassword(!forgotPassword)}
            className="text-sm text-green-600 hover:text-green-500"
          >
            {forgotPassword ? 'Back to Login' : 'Forgot Password?'}
          </button>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;