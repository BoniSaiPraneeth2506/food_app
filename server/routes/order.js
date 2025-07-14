const express = require('express');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/create', authenticateToken, (req, res) => {
    const { deliveryAddress, phone } = req.body;

    // Get cart items
    const cartQuery = `
        SELECT c.quantity, f.id as food_id, f.price
        FROM cart c
        JOIN food_items f ON c.food_id = f.id
        WHERE c.user_id = ?
    `;

    db.all(cartQuery, [req.user.userId], (err, cartItems) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order
        db.run(
            'INSERT INTO orders (user_id, total_amount, delivery_address, phone) VALUES (?, ?, ?, ?)',
            [req.user.userId, totalAmount, deliveryAddress, phone],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create order' });
                }

                const orderId = this.lastID;

                // Insert order items
                const orderItemsQuery = 'INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)';
                let completed = 0;

                cartItems.forEach(item => {
                    db.run(orderItemsQuery, [orderId, item.food_id, item.quantity, item.price], (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to create order items' });
                        }

                        completed++;
                        if (completed === cartItems.length) {
                            // Clear cart after successful order
                            db.run('DELETE FROM cart WHERE user_id = ?', [req.user.userId], (err) => {
                                if (err) {
                                    console.error('Failed to clear cart:', err);
                                }

                                res.json({
                                    message: 'Order created successfully',
                                    orderId: orderId,
                                    totalAmount: totalAmount.toFixed(2)
                                });
                            });
                        }
                    });
                });
            }
        );
    });
});

// Get user orders
router.get('/my-orders', authenticateToken, (req, res) => {
    const query = `
        SELECT o.*, 
               GROUP_CONCAT(f.name || ' x' || oi.quantity) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN food_items f ON oi.food_id = f.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;

    db.all(query, [req.user.userId], (err, orders) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(orders);
    });
});

// Get order details
router.get('/:id', authenticateToken, (req, res) => {
    const orderQuery = 'SELECT * FROM orders WHERE id = ? AND user_id = ?';
    const itemsQuery = `
        SELECT oi.*, f.name, f.image
        FROM order_items oi
        JOIN food_items f ON oi.food_id = f.id
        WHERE oi.order_id = ?
    `;

    db.get(orderQuery, [req.params.id, req.user.userId], (err, order) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        db.all(itemsQuery, [req.params.id], (err, items) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({
                ...order,
                items: items
            });
        });
    });
});

module.exports = router;