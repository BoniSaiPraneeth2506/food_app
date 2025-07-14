const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Food name is required'],
        trim: true,
        maxlength: [100, 'Food name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        default: 'img/food/default.jpg'
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['pizza', 'burger', 'sandwich', 'pasta', 'salad', 'dessert', 'drinks'],
        lowercase: true
    },
    available: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better search performance
foodItemSchema.index({ name: 'text', description: 'text' });
foodItemSchema.index({ category: 1 });
foodItemSchema.index({ available: 1 });

module.exports = mongoose.model('FoodItem', foodItemSchema);