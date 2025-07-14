const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: String
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: {
        type: String,
        required: [true, 'Delivery address is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online'],
        default: 'cash'
    },
    estimatedDeliveryTime: {
        type: Date
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [200, 'Notes cannot exceed 200 characters']
    }
}, {
    timestamps: true
});

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Calculate total from items
orderSchema.pre('save', function(next) {
    if (this.items && this.items.length > 0) {
        this.totalAmount = this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);