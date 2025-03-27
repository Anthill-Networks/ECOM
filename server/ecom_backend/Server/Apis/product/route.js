const express = require('express');
const router = express.Router();
const productsHandler = require('./handler');

router.post('/products', productsHandler.createProduct);
router.get('/products/:id', productsHandler.getProductById);
router.put('/products/:id', productsHandler.updateProduct);
router.delete('/products/:id', productsHandler.deleteProduct);
//list
router.get('/products', productsHandler.getAllProducts);

module.exports = router;
