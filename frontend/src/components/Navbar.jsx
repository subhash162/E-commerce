import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../features/cart/context/CartContext";
import { useAuth } from "../features/auth/context/authContext";
import { useProducts } from "../features/products/hooks/useProducts";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { products } = useProducts();

  const [showCategories, setShowCategories] = useState(false);

  const cartCount = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}

        <Link
          to="/"
          className="text-xl font-bold"
        >
          E-Commerce
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="text-sm font-medium hover:text-gray-500"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium hover:text-gray-500"
          >
            Products
          </Link>

          {/* Categories */}

          <div className="relative">

            <button
              onClick={() =>
                setShowCategories(
                  (current) => !current
                )
              }
              className="text-sm font-medium"
            >
              Categories
              <span className="ml-1">
                ▾
              </span>
            </button>

            {showCategories && (
              <div className="absolute left-0 top-8 z-50 w-48 rounded-lg border bg-white p-2 shadow-lg">

                {categories.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-gray-500">
                    No categories
                  </p>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category}
                      to={`/products?category=${encodeURIComponent(
                        category
                      )}`}
                      onClick={() =>
                        setShowCategories(false)
                      }
                      className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      {category}
                    </Link>
                  ))
                )}

              </div>
            )}

          </div>

          {/* Cart */}

          <Link
            to="/cart"
            className="text-sm font-medium"
          >
            Cart
            {cartCount > 0 && (
              <span className="ml-2 rounded-full bg-black px-2 py-1 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Authentication */}

          {user ? (
            <div className="flex items-center gap-4">

              <span className="text-sm">
                Welcome, {user.name}
              </span>

              <Link
                to="/orders"
                className="text-sm font-medium"
              >
                  My Orders
              </Link>

              {user.role === "admin" && (
  <>
    <Link
      to="/admin/products"
      className="text-sm font-medium"
    >
      Products
    </Link>

    <Link
      to="/admin/orders"
      className="text-sm font-medium"
    >
      Orders
    </Link>
  </>
)}

              <button
                onClick={logout}
                className="text-sm font-medium text-red-500"
              >
                Logout
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-4">

              <Link
                to="/login"
                className="text-sm font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-black px-4 py-2 text-sm text-white"
              >
                Register
              </Link>

            </div>
          )}

        </div>

      </div>
    </nav>
  );
}