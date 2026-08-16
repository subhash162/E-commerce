import { Link } from "react-router-dom";
import { useCart } from "../features/cart/context/CartContext";
import { useAuth } from "../features/auth/context/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartCount = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        E-Commerce
      </Link>

      {/* Main Navigation */}
      <div className="flex items-center gap-6">
        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        {user && <Link to="/cart">Cart ({cartCount})</Link>}

        {/* Admin navigation */}
        {user?.role === "admin" && (
          <Link to="/admin/products">
            Admin
          </Link>
        )}
      </div>

      {/* Authentication */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>
              Welcome, {user.name}
            </span>

            <button onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}