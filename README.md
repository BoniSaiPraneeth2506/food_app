# Enhanced Food Ordering Website with MongoDB

A complete food ordering website with MongoDB backend, Express.js API, and modern frontend.

## 🚀 Features

### Backend (MongoDB + Express)
- **MongoDB Database** with Mongoose ODM
- **User Authentication** with JWT tokens and bcrypt password hashing
- **RESTful API** with proper error handling and validation
- **Cart Management** with real-time updates
- **Order Processing** with status tracking
- **Data Seeding** with sample food items
- **Input Validation** and security middleware

### Frontend
- **Responsive Design** with modern UI/UX
- **User Authentication** (Register/Login)
- **Dynamic Food Browsing** with search and filtering
- **Shopping Cart** with real-time updates
- **Order Placement** and tracking
- **User Profile** management

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service: `mongod`
- Database will be created automatically at: `mongodb://localhost:27017/foodordering`

**Option B: MongoDB Atlas (Cloud)**
- Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a cluster and get connection string
- Update `.env` file with your connection string

### 3. Environment Configuration
The `.env` file is already configured for local development:
```env
MONGODB_URI=mongodb://localhost:27017/foodordering
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

**For production, update:**
- `MONGODB_URI` with your MongoDB Atlas connection string
- `JWT_SECRET` with a secure random string
- `NODE_ENV=production`

### 4. Start the Application
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### 5. Access the Website
Open your browser and go to: `http://localhost:3000`

## 📊 Database Schema

### Collections:

**Users**
```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phone: String (required),
  address: String (required),
  role: String (default: 'user'),
  timestamps: true
}
```

**Food Items**
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  image: String (required),
  category: String (enum: pizza, burger, sandwich, etc.),
  available: Boolean (default: true),
  rating: Number (0-5),
  reviews: Number,
  timestamps: true
}
```

**Cart**
```javascript
{
  user: ObjectId (ref: User),
  food: ObjectId (ref: FoodItem),
  quantity: Number (min: 1),
  timestamps: true
}
```

**Orders**
```javascript
{
  user: ObjectId (ref: User),
  items: [OrderItem],
  totalAmount: Number,
  status: String (enum: pending, confirmed, preparing, ready, delivered, cancelled),
  deliveryAddress: String,
  phone: String,
  paymentStatus: String,
  paymentMethod: String,
  estimatedDeliveryTime: Date,
  notes: String,
  timestamps: true
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Food Items
- `GET /api/food` - Get all food items (with filtering, search, pagination)
- `GET /api/food/:id` - Get specific food item
- `GET /api/food/categories/all` - Get all categories
- `GET /api/food/popular/items` - Get popular food items

### Cart Management
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update/:id` - Update cart item quantity (protected)
- `DELETE /api/cart/remove/:id` - Remove item from cart (protected)
- `DELETE /api/cart/clear` - Clear entire cart (protected)

### Orders
- `POST /api/orders/create` - Create new order (protected)
- `GET /api/orders/my-orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get specific order details (protected)
- `PUT /api/orders/:id/status` - Update order status (protected)

### Health Check
- `GET /api/health` - API health status

## 🏗️ Project Structure

```
├── server/
│   ├── models/
│   │   ├── User.js              # User model with authentication
│   │   ├── FoodItem.js          # Food item model
│   │   ├── Cart.js              # Shopping cart model
│   │   └── Order.js             # Order model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── food.js              # Food item routes
│   │   ├── cart.js              # Cart management routes
│   │   └── order.js             # Order management routes
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── database/
│   │   ├── connection.js        # MongoDB connection setup
│   │   └── seedData.js          # Initial data seeding
│   └── server.js                # Main server file
├── js/
│   ├── api.js                   # Frontend API client
│   ├── auth.js                  # Authentication handling
│   ├── cart.js                  # Cart functionality
│   ├── food.js                  # Food display and search
│   ├── orders.js                # Order management
│   └── custom.js                # UI interactions
├── css/                         # Stylesheets
├── img/                         # Images and assets
├── *.html                       # HTML pages
├── .env                         # Environment variables
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🔐 Security Features

- **Password Hashing** with bcrypt (10 salt rounds)
- **JWT Authentication** with expiration
- **Input Validation** with Mongoose schemas
- **Protected Routes** with authentication middleware
- **CORS Configuration** for cross-origin requests
- **Error Handling** without exposing sensitive information

## 🎯 Usage Guide

### For Users:
1. **Register** - Create account with name, email, phone, address, password
2. **Login** - Access your account
3. **Browse** - View food items by category or search
4. **Add to Cart** - Select items with quantities
5. **Place Order** - Provide delivery details and confirm
6. **Track Orders** - View order history and status

### For Developers:
1. **API Testing** - Use tools like Postman or curl
2. **Database Management** - Use MongoDB Compass or CLI
3. **Logging** - Check console for detailed error messages
4. **Development** - Use `npm run dev` for auto-restart

## 🚀 Deployment

### Local Development
```bash
npm install
npm start
```

### Production Deployment
1. Set up MongoDB Atlas or production MongoDB instance
2. Update environment variables in `.env`
3. Set `NODE_ENV=production`
4. Deploy to platforms like Heroku, DigitalOcean, or AWS

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodordering
JWT_SECRET=your-super-secure-random-string-here
PORT=3000
NODE_ENV=production
```

## 🔧 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with responsive design
- **JavaScript (ES6+)** - Client-side logic
- **jQuery** - DOM manipulation
- **Font Awesome** - Icons

## 🐛 Troubleshooting

### Common Issues:

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or check Atlas connection string
- Verify network access and credentials

**JWT Token Issues:**
- Check if JWT_SECRET is set in environment variables
- Verify token expiration and format

**CORS Errors:**
- Check CORS configuration in server.js
- Ensure frontend and backend URLs match

**Port Already in Use:**
- Change PORT in .env file
- Kill existing processes: `lsof -ti:3000 | xargs kill -9`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Submit pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
1. Check this README for common solutions
2. Review console logs for error details
3. Ensure all dependencies are installed correctly
4. Verify MongoDB connection and environment variables

---

**Happy Coding! 🍕🍔🥪**