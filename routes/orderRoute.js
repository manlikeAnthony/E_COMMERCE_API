const express = require('express');
const router = express.Router();
const {authenticateUser , authorizePermissions} = require('../middleware/authMiddleware')
const {
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder
} = require('../controllers/orderController')

router.route('/').get(authenticateUser,authorizePermissions('admin'),getAllOrders).post(authenticateUser , createOrder)
router.route('/showAllMyOrders').get(authenticateUser , getCurrentUserOrders)
router.route('/:id').get(authenticateUser,getSingleOrder).patch(authenticateUser , updateOrder)

module.exports = router