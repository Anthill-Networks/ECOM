import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axios';

const InitialScreen = ({ onCreateAccount }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');

    try {
      const response = await axiosInstance.post('/login', {
        phone: mobileNumber
      });

      if (response.status === 200) {
        setSuccess('Login successful!');
        localStorage.setItem('token', "some_token_value");
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('username', response.data.name || 'Anonymous');
        if(response.data.role === "admin"){
          window.location.href = '/admin/products';
        }else{
          window.location.href = '/';
        }
      }
    } catch (error) {
      setError('Error logging in. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Welcome</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
            Enter Mobile Number
          </label>
          <input
            type="text"
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your mobile number"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-[#0d2946]">{success}</p>}
      <div className="mt-6">
        <button
          onClick={onCreateAccount}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default InitialScreen;
