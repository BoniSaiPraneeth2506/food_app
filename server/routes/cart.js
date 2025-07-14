const express = require('express');
const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get cart items
router.get('/', authenticateToken, async (req, res) => {
    try {
        const cartItems = await Cart.find({ user: req.user.userId })
            .populate('food', 'name price image description')
            .sort({ createdAt: -1 });

        // Calculate totals
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.food.price * item.quantity);
        }, 0);

        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        // Format response
        const items = cartItems.map(item => ({
            id: item._id,
            food_id: item.food._id,
            name: item.food.name,
            price: item.food.price,
            image: item.food.image,
            description: item.food.description,
            quantity: item.quantity
        }));

        res.json({
            items,
            total: total.toFixed(2),
            count
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Server error while fetching cart' });
    }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { foodId, quantity = 1 } = req.body;

        // Validate food item exists
        const food = await FoodItem.findById(foodId);
        if (!food || !food.available) {
            return res.status(404).json({ error: 'Food item not found or unavailable' });
        }

        // Check if item already exists in cart
        const existingCartItem = await Cart.findOne({
            user: req.user.userId,
            food: foodId
        });

        if (existingCartItem) {
            // Update quantity
            existingCartItem.quantity += parseInt(quantity);
            await existingCartItem.save();
            res.json({ message: 'Cart updated successfully' });
        } else {
            // Create new cart item
            const cartItem = new Cart({
                user: req.user.userId,
                food: foodId,
                quantity: parseInt(quantity)
            });
            await cartItem.save();
            res.json({ message: 'Item added to cart successfully' });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid food ID' });
        }
        res.status(500).json({ error: 'Server error while adding to cart' });
    }
});

// Update cart item quantity
router.put('/update/:id', authenticateToken, async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        const cartItem = await Cart.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { quantity: parseInt(quantity) },
            { new: true }
        );

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error updating cart:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid cart item ID' });
        }
        res.status(500).json({ error: 'Server error while updating cart' });
    }
});

// Remove item from cart
router.delete('/remove/:id', authenticateToken, async (req, res) => {
    try {
        const cartItem = await Cart.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Item removed successfully' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid cart item ID' });
        }
        res.status(500).json({ error: 'Server error while removing from cart' });
    }
});

// Clear entire cart
router.delete('/clear', authenticateToken, async (req, res) => {
    try {
        await Cart.deleteMany({ user: req.user.userId });
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Server error while clearing cart' });
    }
});

module.exports = router;