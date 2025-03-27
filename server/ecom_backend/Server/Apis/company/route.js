const express = require('express');
const router = express.Router();
const companyHandler = require('./handler'); // Adjust path as needed

// Create a new company
router.post('/company', companyHandler.createCompany);

// Get a company by ID
router.get('/company/:id', companyHandler.getCompanyById);

// Get all companies
router.get('/company', companyHandler.getAllCompanies);

// Update a company
router.put('/company/:id', companyHandler.updateCompany);

// Delete a company
router.delete('/company/:id', companyHandler.deleteCompany);

module.exports = router;
