const express = require('express');
const FoodItem = require('../models/FoodItem');

const router = express.Router();

// Get all food items with filtering and search
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10, sort = 'createdAt' } = req.query;
        
        // Build query
        let query = { available: true };
        
        if (category) {
            query.category = category.toLowerCase();
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const foods = await FoodItem.find(query)
            .sort({ [sort]: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        // Get total count for pagination
        const total = await FoodItem.countDocuments(query);

        res.json({
            foods,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching foods:', error);
        res.status(500).json({ error: 'Server error while fetching foods' });
    }
});

// Get food by ID
router.get('/:id', async (req, res) => {
    try {
        const food = await FoodItem.findById(req.params.id);
        
        if (!food || !food.available) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        
        res.json(food);
    } catch (error) {
        console.error('Error fetching food:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid food ID' });
        }
        res.status(500).json({ error: 'Server error while fetching food' });
    }
});

// Get all categories
router.get('/categories/all', async (req, res) => {
    try {
        const categories = await FoodItem.distinct('category', { available: true });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Server error while fetching categories' });
    }
});

// Get popular foods (highest rated)
router.get('/popular/items', async (req, res) => {
    try {
        const popularFoods = await FoodItem.find({ available: true })
            .sort({ rating: -1, reviews: -1 })
            .limit(6);
        
        res.json(popularFoods);
    } catch (error) {
        console.error('Error fetching popular foods:', error);
        res.status(500).json({ error: 'Server error while fetching popular foods' });
    }
});

module.exports = router;