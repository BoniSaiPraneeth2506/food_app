const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { deliveryAddress, phone, notes, paymentMethod = 'cash' } = req.body;

        // Validation
        if (!deliveryAddress || !phone) {
            return res.status(400).json({ error: 'Delivery address and phone are required' });
        }

        // Get cart items
        const cartItems = await Cart.find({ user: req.user.userId })
            .populate('food', 'name price image');

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Prepare order items
        const orderItems = cartItems.map(item => ({
            food: item.food._id,
            name: item.food.name,
            price: item.food.price,
            quantity: item.quantity,
            image: item.food.image
        }));

        // Calculate total
        const totalAmount = orderItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Create order
        const order = new Order({
            user: req.user.userId,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            phone,
            notes,
            paymentMethod,
            estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000) // 45 minutes from now
        });

        await order.save();

        // Clear cart after successful order
        await Cart.deleteMany({ user: req.user.userId });

        res.json({
            message: 'Order created successfully',
            orderId: order._id,
            totalAmount: totalAmount.toFixed(2),
            estimatedDeliveryTime: order.estimatedDeliveryTime
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Server error while creating order' });
    }
});

// Get user orders
router.get('/my-orders', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const orders = await Order.find({ user: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('items.food', 'name image');

        // Format orders for frontend
        const formattedOrders = orders.map(order => ({
            id: order._id,
            total_amount: order.totalAmount,
            status: order.status,
            delivery_address: order.deliveryAddress,
            phone: order.phone,
            created_at: order.createdAt,
            estimatedDeliveryTime: order.estimatedDeliveryTime,
            items: order.items.map(item => `${item.name} x${item.quantity}`).join(', ')
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Server error while fetching orders' });
    }
});

// Get order details
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId
        }).populate('items.food', 'name image');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid order ID' });
        }
        res.status(500).json({ error: 'Server error while fetching order' });
    }
});

// Update order status (for admin or delivery tracking)
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid order ID' });
        }
        res.status(500).json({ error: 'Server error while updating order' });
    }
});

module.exports = router;