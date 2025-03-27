const express = require('express');
const router = express.Router();
const orderHandler = require('./handler'); // Adjust path as needed

router.post('/orders_items', orderHandler.createOrder);
router.get('/orders_items/:id', orderHandler.getOrderById);
router.get('/orders_items', orderHandler.getAllOrders);
router.put('/orders_items/:id', orderHandler.updateOrder);
router.delete('/orders_items/:id', orderHandler.deleteOrder);

module.exports = router;
