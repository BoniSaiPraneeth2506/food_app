# Enhanced Food Ordering Website

A complete food ordering website with frontend and backend integration.

## Features

### Frontend
- Responsive design with modern UI
- User authentication (login/register)
- Food browsing and search
- Shopping cart functionality
- Order placement and tracking
- User profile management

### Backend
- Node.js with Express server
- SQLite database
- JWT authentication
- RESTful API endpoints
- User management
- Cart management
- Order processing

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```

3. **Access the Website**
   Open your browser and go to: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Food Items
- `GET /api/food` - Get all food items
- `GET /api/food/:id` - Get specific food item
- `GET /api/food/categories/all` - Get all categories

### Cart Management
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order details

## Database Schema

The application uses SQLite with the following tables:
- `users` - User information
- `food_items` - Food menu items
- `cart` - Shopping cart items
- `orders` - Order information
- `order_items` - Order item details

## File Structure

```
├── server/
│   ├── database/
│   │   └── init.js          # Database initialization
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── cart.js          # Cart management routes
│   │   ├── food.js          # Food item routes
│   │   └── order.js         # Order management routes
│   └── server.js            # Main server file
├── js/
│   ├── api.js               # API client functions
│   ├── auth.js              # Authentication handling
│   ├── cart.js              # Cart functionality
│   ├── food.js              # Food display and search
│   ├── orders.js            # Order management
│   └── custom.js            # Original custom functions
├── css/                     # Stylesheets
├── img/                     # Images and assets
├── *.html                   # HTML pages
└── package.json             # Dependencies and scripts
```

## Usage

1. **Registration**: New users can register with name, email, phone, address, and password
2. **Login**: Existing users can login with email and password
3. **Browse Food**: View food items by category or search
4. **Add to Cart**: Add items to shopping cart with quantity
5. **Place Order**: Fill delivery details and confirm order
6. **Track Orders**: View order history and status

## Technologies Used

### Backend
- Node.js
- Express.js
- SQLite3
- JWT (JSON Web Tokens)
- bcryptjs (Password hashing)
- CORS

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- jQuery
- Font Awesome
- Responsive Design

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- SQL injection prevention

## Future Enhancements

- Payment gateway integration
- Real-time order tracking
- Admin panel for food management
- Email notifications
- Mobile app development
- Advanced search and filtering

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.