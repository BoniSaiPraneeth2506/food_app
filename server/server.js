const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection and models
const connectDB = require('./database/connection');
const { seedFoodItems } = require('./database/seedData');

// Import routes
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '../')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Food Ordering API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/:page', (req, res) => {
    const page = req.params.page;
    const allowedPages = [
        'index.html', 'login.html', 'register.html', 'foods.html', 
        'categories.html', 'category-foods.html', 'food-search.html',
        'order.html', 'contact.html', 'my-orders.html'
    ];
    
    if (allowedPages.includes(page) || page.endsWith('.html')) {
        const filePath = path.join(__dirname, `../${page}`);
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(404).send('Page not found');
            }
        });
    } else {
        res.status(404).send('Page not found');
    }
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Seed initial data
    setTimeout(async () => {
        await seedFoodItems();
    }, 2000); // Wait 2 seconds for DB connection to stabilize
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});