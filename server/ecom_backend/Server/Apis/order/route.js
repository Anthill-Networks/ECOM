const express = require('express');
const router = express.Router();
const orderHandler = require('./handler'); // Adjust path as needed

router.post('/orders', orderHandler.createOrder);
router.post('/order_item', orderHandler.createOrderItem);
router.get('/orders/:id', orderHandler.getOrderById);
router.get('/orders', orderHandler.getAllOrders);
router.put('/orders/:id', orderHandler.updateOrder);
router.delete('/orders/:id', orderHandler.deleteOrder);
router.post("/verifyPayment", orderHandler.verifyPayment);

module.exports = router;
