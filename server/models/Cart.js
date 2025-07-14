const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    }
}, {
    timestamps: true
});

// Compound index to ensure one cart item per user per food
cartItemSchema.index({ user: 1, food: 1 }, { unique: true });

// Calculate total price for cart item
cartItemSchema.virtual('totalPrice').get(function() {
    return this.quantity * (this.food ? this.food.price : 0);
});

// Ensure virtual fields are serialized
cartItemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Cart', cartItemSchema);