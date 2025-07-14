const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'foodorder.db');
const db = new sqlite3.Database(dbPath);

const initDatabase = () => {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Food items table
    db.run(`
        CREATE TABLE IF NOT EXISTS food_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            image TEXT,
            category TEXT NOT NULL,
            available BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Cart table
    db.run(`
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            food_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (food_id) REFERENCES food_items (id)
        )
    `);

    // Orders table
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            status TEXT DEFAULT 'pending',
            delivery_address TEXT NOT NULL,
            phone TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // Order items table
    db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            food_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id),
            FOREIGN KEY (food_id) REFERENCES food_items (id)
        )
    `);

    // Insert sample food items
    db.run(`
        INSERT OR IGNORE INTO food_items (id, name, description, price, image, category) VALUES
        (1, 'Margherita Pizza', 'Fresh tomatoes, mozzarella cheese, basil leaves', 12.99, 'img/food/p1.jpg', 'pizza'),
        (2, 'Club Sandwich', 'Triple layer sandwich with chicken, bacon, lettuce', 8.99, 'img/food/s1.jpg', 'sandwich'),
        (3, 'Beef Burger', 'Juicy beef patty with cheese, lettuce, tomato', 10.99, 'img/food/b1.jpg', 'burger'),
        (4, 'Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 14.99, 'img/food/p1.jpg', 'pizza'),
        (5, 'Grilled Chicken Sandwich', 'Grilled chicken breast with fresh vegetables', 9.99, 'img/food/s1.jpg', 'sandwich'),
        (6, 'Cheese Burger', 'Double cheese burger with special sauce', 11.99, 'img/food/b1.jpg', 'burger')
    `);

    console.log('Database initialized successfully');
};

module.exports = { db, initDatabase };