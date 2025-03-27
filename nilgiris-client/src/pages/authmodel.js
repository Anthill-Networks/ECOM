import React, { useState, useEffect } from 'react';
import InitialScreen from './login';
import OtpScreen from './otp';
import SignupScreen from './signup';

const AuthModal = ({ onClose }) => {
  const [screen, setScreen] = useState('initial');
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      onClose();
    }
  }, [onClose]);

  const handleMobileNumberSubmit = (number) => {
    setMobileNumber(number);
    setScreen('otp');
  };

  const handleOtpSubmit = (otp) => {
    console.log('OTP submitted:', otp);
    localStorage.setItem('token', 'some_token_value');
    onClose();
  };

  const handleCreateAccount = () => {
    setScreen('signup');
  };

  const handleSignup = (userData) => {
    console.log('User signed up:', userData);
    localStorage.setItem('token', 'some_token_value');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Authentication</h2>
        {screen === 'initial' && (
          <InitialScreen
            onMobileNumberSubmit={handleMobileNumberSubmit}
            onCreateAccount={handleCreateAccount}
          />
        )}
        {screen === 'otp' && <OtpScreen onOtpSubmit={handleOtpSubmit} />}
        {screen === 'signup' && <SignupScreen onSignup={handleSignup} />}
        <button
          className="mt-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
