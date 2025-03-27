const express = require('express');
const router = express.Router();
const cartHandler = require('./handler'); // Adjust path as needed
const { authorize, softAuthorize } = require('../../helpers/jwt');

router.post('/carts',authorize,  cartHandler.createCart);
router.get('/carts',authorize,  cartHandler.getCartByUserId);
router.post('/carts/add', authorize, cartHandler.addItemToCart);
router.post('/carts/remove',authorize,  cartHandler.removeItemFromCart);
router.put('/carts',authorize,  cartHandler.updateCart);
router.delete('/carts/:userId',authorize,  cartHandler.deleteCart);

router.post('/carts/itemcount',softAuthorize, cartHandler.getItemCount);

module.exports = router;
