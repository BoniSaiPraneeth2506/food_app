const FoodItem = require('../models/FoodItem');

const seedFoodItems = async () => {
    try {
        // Check if food items already exist
        const existingItems = await FoodItem.countDocuments();
        if (existingItems > 0) {
            console.log('Food items already exist, skipping seed');
            return;
        }

        const foodItems = [
            {
                name: 'Margherita Pizza',
                description: 'Fresh tomatoes, mozzarella cheese, basil leaves on crispy crust',
                price: 12.99,
                image: 'img/food/p1.jpg',
                category: 'pizza',
                rating: 4.5,
                reviews: 128
            },
            {
                name: 'Pepperoni Pizza',
                description: 'Classic pepperoni with mozzarella cheese and tomato sauce',
                price: 14.99,
                image: 'img/food/p1.jpg',
                category: 'pizza',
                rating: 4.7,
                reviews: 95
            },
            {
                name: 'Club Sandwich',
                description: 'Triple layer sandwich with chicken, bacon, lettuce, tomato',
                price: 8.99,
                image: 'img/food/s1.jpg',
                category: 'sandwich',
                rating: 4.3,
                reviews: 67
            },
            {
                name: 'Grilled Chicken Sandwich',
                description: 'Grilled chicken breast with fresh vegetables and mayo',
                price: 9.99,
                image: 'img/food/s1.jpg',
                category: 'sandwich',
                rating: 4.4,
                reviews: 89
            },
            {
                name: 'Beef Burger',
                description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
                price: 10.99,
                image: 'img/food/b1.jpg',
                category: 'burger',
                rating: 4.6,
                reviews: 156
            },
            {
                name: 'Cheese Burger',
                description: 'Double cheese burger with pickles and our signature sauce',
                price: 11.99,
                image: 'img/food/b1.jpg',
                category: 'burger',
                rating: 4.5,
                reviews: 134
            }
        ];

        await FoodItem.insertMany(foodItems);
        console.log('Food items seeded successfully');
    } catch (error) {
        console.error('Error seeding food items:', error);
    }
};

module.exports = { seedFoodItems };