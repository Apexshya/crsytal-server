const express = require('express');
const router = express.Router();
const shipping = require('../controllers/shippingAndTaxSetup');

// Import verifyToken function
const verifyToken = require('../config/jwt');

// admin routes

router.post('/admin/shipping', verifyToken, shipping.CreateShippingAndTax);

router.get('/admin/all-shipping', verifyToken, shipping.GetAllShippingAndTax);

router.put('/admin/shipping/:id', verifyToken, shipping.UpdateShippingAndTax);

router.get('/admin/shipping/:id',verifyToken,shipping.GetShippingAndTaxById)

router.delete('/admin/shipping/:id', verifyToken, shipping.DeleteShippingAndTax);

// User routes

router.get('/shipping', shipping.GetActiveShippingAndTax);

module.exports = router;
