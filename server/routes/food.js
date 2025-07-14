const express = require('express');
const { db } = require('../database/init');

const router = express.Router();

// Get all food items
router.get('/', (req, res) => {
    const { category, search } = req.query;
    let query = 'SELECT * FROM food_items WHERE available = 1';
    let params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, foods) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(foods);
    });
});

// Get food by ID
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM food_items WHERE id = ? AND available = 1', [req.params.id], (err, food) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!food) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        res.json(food);
    });
});

// Get categories
router.get('/categories/all', (req, res) => {
    db.all('SELECT DISTINCT category FROM food_items WHERE available = 1', (err, categories) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(categories.map(cat => cat.category));
    });
});

module.exports = router;