const express = require('express');
const router = express.Router();
const userHandler = require('./handler');
const { authorize } = require('../../helpers/jwt');

// Authentication routes
router.post('/users', userHandler.createUser);
router.post('/login', userHandler.login);

// OTP routes
router.post('/send-phone-otp', userHandler.sendPhoneOTP);
router.post('/verify-phone-otp', userHandler.verifyPhoneOTP);
router.post('/send-email-otp', userHandler.sendEmailOTP);
router.post('/verify-email-otp', userHandler.verifyEmailOTP);
router.post('/reset-password', userHandler.resetPassword);

// Protected routes
router.get('/users_data', authorize, userHandler.getUser);
router.put('/users_data', authorize, userHandler.updateUserbydata);
router.get('/users/:id', authorize, userHandler.getUserById);
router.get('/users', authorize, userHandler.getAllUsers);
router.put('/users/:id', authorize, userHandler.updateUser);
router.delete('/users/:id', authorize, userHandler.deleteUser);

// Update the logout route to handle both authenticated and unauthenticated requests
router.post('/logout', (req, res) => userHandler.logout(req, res));

module.exports = router;
