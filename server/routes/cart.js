const express = require('express');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get cart items
router.get('/', authenticateToken, (req, res) => {
    const query = `
        SELECT c.id, c.quantity, f.id as food_id, f.name, f.price, f.image, f.description
        FROM cart c
        JOIN food_items f ON c.food_id = f.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    `;

    db.all(query, [req.user.userId], (err, items) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        res.json({
            items: items,
            total: total.toFixed(2),
            count: items.reduce((sum, item) => sum + item.quantity, 0)
        });
    });
});

// Add item to cart
router.post('/add', authenticateToken, (req, res) => {
    const { foodId, quantity = 1 } = req.body;

    // Check if item already exists in cart
    db.get('SELECT * FROM cart WHERE user_id = ? AND food_id = ?', [req.user.userId, foodId], (err, existingItem) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (existingItem) {
            // Update quantity
            db.run(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND food_id = ?',
                [quantity, req.user.userId, foodId],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to update cart' });
                    }
                    res.json({ message: 'Cart updated successfully' });
                }
            );
        } else {
            // Add new item
            db.run(
                'INSERT INTO cart (user_id, food_id, quantity) VALUES (?, ?, ?)',
                [req.user.userId, foodId, quantity],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to add to cart' });
                    }
                    res.json({ message: 'Item added to cart successfully' });
                }
            );
        }
    });
});

// Update cart item quantity
router.put('/update/:id', authenticateToken, (req, res) => {
    const { quantity } = req.body;

    db.run(
        'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, req.params.id, req.user.userId],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update cart' });
            }
            res.json({ message: 'Cart updated successfully' });
        }
    );
});

// Remove item from cart
router.delete('/remove/:id', authenticateToken, (req, res) => {
    db.run(
        'DELETE FROM cart WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.userId],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to remove item' });
            }
            res.json({ message: 'Item removed successfully' });
        }
    );
});

// Clear cart
router.delete('/clear', authenticateToken, (req, res) => {
    db.run('DELETE FROM cart WHERE user_id = ?', [req.user.userId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to clear cart' });
        }
        res.json({ message: 'Cart cleared successfully' });
    });
});

module.exports = router;