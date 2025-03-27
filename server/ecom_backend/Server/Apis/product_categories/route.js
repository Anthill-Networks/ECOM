const express = require('express');
const router = express.Router();
const categoryHandler = require('./handler');

router.post('/category', categoryHandler.createCategory);
router.get('/category/:id', categoryHandler.getCategoryById);
router.put('/category/:id', categoryHandler.updateCategory);
router.delete('/category/:id', categoryHandler.deleteCategory);
//list
router.get('/category', categoryHandler.getAllCategories);

module.exports = router;
