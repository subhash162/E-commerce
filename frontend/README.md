# TechVault E-Commerce Platform

A full-featured e-commerce website built with React.js and Node.js featuring a modern, distinctive design with gradient aesthetics and smooth animations.

## Features

### Frontend (React.js)
- 🛍️ Product browsing with categories and filtering
- 🔍 Search functionality
- 🛒 Shopping cart management
- 👤 User authentication (login/register)
- 💳 Checkout process
- 📦 Order history tracking
- 📱 Responsive design
- ✨ Modern UI with animations and transitions
- 🎨 Distinctive gradient-based design system

### Backend (Node.js/Express)
- 🔐 JWT-based authentication
- 📊 RESTful API
- 💾 MongoDB database integration
- 🛡️ Password hashing with bcrypt
- 📝 Product management
- 🛒 Order processing
- 📦 Inventory tracking

## Tech Stack

### Frontend
- React.js 18
- Vite (build tool)
- Lucide React (icons)
- Context API (state management)
- CSS-in-JS styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Project Structure

```
ecommerce/
├── backend/
│   ├── server.js              # Express server and API routes
│   └── package.json           # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   └── main.jsx          # React entry point
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file in the backend directory (optional):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-change-this-in-production
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

5. Seed the database with sample products (optional):
```bash
# Send a POST request to:
POST http://localhost:5000/api/seed
```

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products (supports query params: category, search, sortBy)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (requires auth)
- `GET /api/categories` - Get all categories

### Orders
- `POST /api/orders` - Create new order (requires auth)
- `GET /api/orders` - Get user orders (requires auth)
- `GET /api/orders/:id` - Get single order (requires auth)

### Development
- `POST /api/seed` - Seed database with sample products

## Usage Guide

### For Users

1. **Browse Products**
   - View all products on the homepage
   - Filter by categories using the sidebar menu
   - Sort by price or rating
   - Search for specific products

2. **Shopping Cart**
   - Click "Add to Cart" on product cards
   - View cart by clicking the cart icon in header
   - Adjust quantities or remove items
   - See real-time total calculations

3. **Authentication**
   - Click the user icon to login/register
   - Create an account or login with existing credentials
   - Access is required for checkout and order history

4. **Checkout**
   - Proceed to checkout from cart
   - Enter shipping information
   - Review order summary
   - Place order

5. **Order History**
   - Click the package icon to view past orders
   - See order details, status, and totals

### For Developers

#### Adding New Products
```javascript
POST /api/products
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Category",
  "image": "https://image-url.com/image.jpg",
  "stock": 100,
  "rating": 4.5,
  "reviews": 100
}
```

#### Custom API Integration
The API URL is configured in the React app. To change it, update the `API_URL` constant in `App.jsx`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-change-this
```

### Frontend
Update the API URL in `src/App.jsx` if deploying to different environments.

## Design Features

- **Color Scheme**: Cyberpunk-inspired dark theme with cyan-purple gradients
- **Typography**: Inter font family for modern, clean look
- **Animations**: Smooth transitions, hover effects, and micro-interactions
- **Layout**: Responsive grid system adapting to all screen sizes
- **Components**: Modular, reusable React components

## Security Notes

⚠️ **Important for Production:**

1. Change the JWT_SECRET to a strong, random string
2. Use environment variables for sensitive data
3. Enable HTTPS in production
4. Implement rate limiting
5. Add input validation and sanitization
6. Use proper error handling
7. Implement CSRF protection
8. Set up proper CORS configuration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in .env file
- Verify network connectivity for MongoDB Atlas

### CORS Errors
- Ensure backend CORS is properly configured
- Check API_URL matches your backend URL
- Verify both servers are running

### Port Conflicts
- Backend default: 5000 (change in .env)
- Frontend default: 3000 (change in vite.config.js)

## Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Product recommendations
- [ ] Multi-currency support
- [ ] Image upload for products
- [ ] Social authentication

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using React.js and Node.js