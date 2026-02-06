import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart, User, Search, Menu, X, Star, Trash2, Plus, Minus, LogOut, Package } from 'lucide-react';

// Context for global state management
const AppContext = createContext();

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// API Configuration
const API_URL = 'http://localhost:5001/api';

// API Service
const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  },

  // Auth
  register: (userData) => api.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => api.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getCurrentUser: () => api.request('/auth/me'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/products${query ? `?${query}` : ''}`);
  },
  getProduct: (id) => api.request(`/products/${id}`),
  getCategories: () => api.request('/categories'),

  // Orders
  createOrder: (orderData) => api.request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  getOrders: () => api.request('/orders'),
};

// App Provider Component
const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await api.getCurrentUser();
        setUser(userData.user);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }

    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }

    setLoading(false);
  };

  const login = async (credentials) => {
    const data = await api.login(credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        products,
        categories,
        loading,
        login,
        register,
        logout,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        setProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Components

const Header = ({ onMenuClick, currentView, setCurrentView }) => {
  const { user, logout, cartCount } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="menu-btn" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          <h1 className="logo" onClick={() => setCurrentView('home')}>
            TECH<span>VAULT</span>
          </h1>
        </div>

        <div className="header-center">
          {searchOpen ? (
            <div className="search-bar">
              <Search size={20} />
              <input type="text" placeholder="Search products..." />
              <button onClick={() => setSearchOpen(false)}>
                <X size={20} />
              </button>
            </div>
          ) : (
            <button className="icon-btn" onClick={() => setSearchOpen(true)}>
              <Search size={24} />
            </button>
          )}
        </div>

        <div className="header-right">
          <button
            className="icon-btn cart-btn"
            onClick={() => setCurrentView('cart')}
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>

          {user ? (
            <div className="user-menu">
              <button className="icon-btn" onClick={() => setCurrentView('orders')}>
                <Package size={24} />
              </button>
              <button className="icon-btn" onClick={logout}>
                <LogOut size={24} />
              </button>
              <span className="user-name">{user.name}</span>
            </div>
          ) : (
            <button
              className="icon-btn"
              onClick={() => setCurrentView('auth')}
            >
              <User size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const Sidebar = ({ isOpen, onClose, currentCategory, setCurrentCategory }) => {
  const { categories } = useApp();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Categories</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentCategory === null ? 'active' : ''}`}
            onClick={() => {
              setCurrentCategory(null);
              onClose();
            }}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`nav-item ${currentCategory === category ? 'active' : ''}`}
              onClick={() => {
                setCurrentCategory(category);
                onClose();
              }}
            >
              {category}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

const ProductCard = ({ product, onAddToCart }) => {
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    onAddToCart(product);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="product-overlay">
          <button
            className={`add-to-cart-btn ${adding ? 'adding' : ''}`}
            onClick={handleAdd}
          >
            {adding ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
            />
          ))}
          <span>({product.reviews})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-stock">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ category }) => {
  const { products, addToCart } = useApp();
  const [sortBy, setSortBy] = useState('');

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="product-grid-container">
      <div className="product-grid-header">
        <h2>{category || 'All Products'}</h2>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort by</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="product-grid">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

const Cart = ({ setCurrentView }) => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, user } = useApp();

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingCart size={64} />
        <h2>Your cart is empty</h2>
        <button className="btn-primary" onClick={() => setCurrentView('home')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      <div className="cart-items">
        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.name} />

            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>

            <div className="cart-item-actions">
              <div className="quantity-control">
                <button onClick={() => updateCartQuantity(item._id, item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateCartQuantity(item._id, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item._id)}
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-amount">${cartTotal.toFixed(2)}</span>
        </div>

        {user ? (
          <button
            className="btn-primary checkout-btn"
            onClick={() => setCurrentView('checkout')}
          >
            Proceed to Checkout
          </button>
        ) : (
          <button
            className="btn-primary checkout-btn"
            onClick={() => setCurrentView('auth')}
          >
            Login to Checkout
          </button>
        )}
      </div>
    </div>
  );
};

const Checkout = ({ setCurrentView }) => {
  const { cart, cartTotal, clearCart, user } = useApp();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: formData,
      };

      await api.createOrder(orderData);
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        setCurrentView('orders');
      }, 2000);
    } catch (error) {
      alert('Order failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="empty-state success">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Shipping Information</h3>

          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <div className="form-row">
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
          />

          <button type="submit" className="btn-primary" disabled={processing}>
            {processing ? 'Processing...' : `Place Order - $${cartTotal.toFixed(2)}`}
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item._id} className="summary-item">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Auth = ({ setCurrentView }) => {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      setCurrentView('home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <Package size={64} />
        <h2>No orders yet</h2>
        <p>Start shopping to see your orders here</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.slice(-8)}</h3>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-status">{order.status}</div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-total">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const { loading } = useApp();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading TechVault...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
      />

      <main className="main-content">
        {currentView === 'home' && <ProductGrid category={currentCategory} />}
        {currentView === 'cart' && <Cart setCurrentView={setCurrentView} />}
        {currentView === 'checkout' && <Checkout setCurrentView={setCurrentView} />}
        {currentView === 'auth' && <Auth setCurrentView={setCurrentView} />}
        {currentView === 'orders' && <Orders />}
      </main>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
          color: #e0e6ed;
          min-height: 100vh;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .header {
          background: rgba(10, 14, 39, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .header-left,
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          font-size: 1.75rem;
          font-weight: 900;
          cursor: pointer;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo span {
          background: linear-gradient(135deg, #ff0080 0%, #ff8c00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .menu-btn,
        .icon-btn {
          background: transparent;
          border: none;
          color: #e0e6ed;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-btn:hover,
        .icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .cart-btn {
          position: relative;
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: linear-gradient(135deg, #ff0080 0%, #ff8c00 100%);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 0.5rem 1rem;
          min-width: 300px;
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: #e0e6ed;
          outline: none;
          flex: 1;
          font-size: 0.95rem;
        }

        .search-bar input::placeholder {
          color: rgba(224, 230, 237, 0.5);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-name {
          font-size: 0.9rem;
          color: #00d4ff;
          font-weight: 600;
        }

        /* Sidebar */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 200;
        }

        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .sidebar {
          position: fixed;
          left: -300px;
          top: 0;
          bottom: 0;
          width: 300px;
          background: rgba(10, 14, 39, 0.98);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem;
          transition: left 0.3s ease;
          z-index: 201;
          overflow-y: auto;
        }

        .sidebar.open {
          left: 0;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .sidebar-header h2 {
          font-size: 1.5rem;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          background: transparent;
          border: none;
          color: #e0e6ed;
          padding: 1rem;
          text-align: left;
          cursor: pointer;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(123, 47, 247, 0.1) 100%);
          border-color: rgba(0, 212, 255, 0.3);
          color: #00d4ff;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          padding: 2rem;
        }

        /* Product Grid */
        .product-grid-container {
          animation: fadeIn 0.5s ease;
        }

        .product-grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .product-grid-header h2 {
          font-size: 2rem;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .product-grid-header select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e0e6ed;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          outline: none;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: slideUp 0.5s ease;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
          border-color: rgba(0, 212, 255, 0.3);
        }

        .product-image {
          position: relative;
          height: 250px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.2);
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.1);
        }

        .product-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 24px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          transform: translateY(20px);
        }

        .product-card:hover .add-to-cart-btn {
          transform: translateY(0);
        }

        .add-to-cart-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
        }

        .add-to-cart-btn.adding {
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-name {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .product-description {
          color: rgba(224, 230, 237, 0.7);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #ffd700;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }

        .product-rating span {
          color: rgba(224, 230, 237, 0.6);
          margin-left: 0.5rem;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .product-stock {
          font-size: 0.85rem;
          color: rgba(224, 230, 237, 0.6);
        }

        /* Cart */
        .cart-container {
          max-width: 900px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease;
        }

        .cart-container h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .cart-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          display: grid;
          grid-template-columns: 100px 1fr auto auto;
          gap: 1.5rem;
          align-items: center;
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(0, 212, 255, 0.3);
        }

        .cart-item img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
        }

        .cart-item-info h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .cart-item-info p {
          color: rgba(224, 230, 237, 0.7);
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 0.25rem;
        }

        .quantity-control button {
          background: transparent;
          border: none;
          color: #e0e6ed;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .quantity-control button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .quantity-control span {
          min-width: 30px;
          text-align: center;
          font-weight: 600;
        }

        .remove-btn {
          background: transparent;
          border: none;
          color: #ff4757;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: rgba(255, 71, 87, 0.1);
          transform: scale(1.1);
        }

        .cart-item-total {
          font-size: 1.25rem;
          font-weight: 700;
          color: #00d4ff;
        }

        .cart-summary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }

        .total-amount {
          font-weight: 700;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Checkout */
        .checkout-container {
          max-width: 1000px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease;
        }

        .checkout-container h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
        }

        .checkout-form {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
        }

        .checkout-form h3 {
          margin-bottom: 1.5rem;
          color: #00d4ff;
        }

        .checkout-form input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e0e6ed;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .checkout-form input:focus {
          border-color: #00d4ff;
          background: rgba(255, 255, 255, 0.08);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .order-summary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          height: fit-content;
        }

        .order-summary h3 {
          margin-bottom: 1.5rem;
          color: #00d4ff;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid rgba(0, 212, 255, 0.3);
        }

        /* Auth */
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 200px);
          animation: fadeIn 0.5s ease;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 3rem;
          max-width: 450px;
          width: 100%;
        }

        .auth-card h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }

        .auth-card input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e0e6ed;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .auth-card input:focus {
          border-color: #00d4ff;
          background: rgba(255, 255, 255, 0.08);
        }

        .error-message {
          background: rgba(255, 71, 87, 0.1);
          border: 1px solid rgba(255, 71, 87, 0.3);
          color: #ff4757;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
        }

        .auth-switch {
          text-align: center;
          margin-top: 1.5rem;
          color: rgba(224, 230, 237, 0.7);
        }

        .auth-switch button {
          background: transparent;
          border: none;
          color: #00d4ff;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .auth-switch button:hover {
          text-decoration: underline;
        }

        /* Orders */
        .orders-container {
          max-width: 900px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease;
        }

        .orders-container h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .order-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .order-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(0, 212, 255, 0.3);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .order-header h3 {
          color: #00d4ff;
          margin-bottom: 0.25rem;
        }

        .order-header p {
          color: rgba(224, 230, 237, 0.6);
          font-size: 0.9rem;
        }

        .order-status {
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .order-items {
          margin-bottom: 1rem;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .order-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid rgba(0, 212, 255, 0.3);
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
          animation: fadeIn 0.5s ease;
        }

        .empty-state svg {
          color: rgba(224, 230, 237, 0.3);
          margin-bottom: 1rem;
        }

        .empty-state h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          color: rgba(224, 230, 237, 0.7);
        }

        .empty-state p {
          color: rgba(224, 230, 237, 0.5);
          margin-bottom: 2rem;
        }

        .empty-state.success {
          color: #00ff88;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          animation: scaleIn 0.5s ease;
        }

        /* Loading */
        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 2rem;
        }

        .loader {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #00d4ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: rgba(224, 230, 237, 0.7);
          font-size: 1.1rem;
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .checkout-content {
            grid-template-columns: 1fr;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 1rem;
          }

          .logo {
            font-size: 1.25rem;
          }

          .search-bar {
            min-width: 200px;
          }

          .main-content {
            padding: 1rem;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }

          .cart-item {
            grid-template-columns: 80px 1fr;
            gap: 1rem;
          }

          .cart-item-total {
            grid-column: 2;
          }

          .cart-item-actions {
            grid-column: 1 / -1;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

// Root Component
const Root = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default Root;