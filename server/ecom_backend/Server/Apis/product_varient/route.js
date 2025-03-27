const express = require('express');
const router = express.Router();
const productsHandler = require('./handler');


router.post('/products_varient',  productsHandler.createProduct);
router.get('/products_varient/:id',  productsHandler.getProductById);
router.put('/products_varient/:id',  productsHandler.updateProduct);
router.delete('/products_varient/:id',  productsHandler.deleteProduct);
//list
router.get('/products_varient',  productsHandler.getAllProducts);

module.exports = router;
