import { Link } from "react-router-dom";
import { useProducts } from "../features/products/hooks/useProducts";
import ProductCard from "../features/products/components/ProductCard";

export default function Home() {
  const { products, loading, error } = useProducts();

  const featuredProducts = products.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="min-h-[70vh] flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4">
              Welcome to our store
            </p>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Find products you'll love.
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Discover quality products, great prices, and everything you need
              in one place.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/products"
                className="px-6 py-3 rounded-lg bg-black text-white"
              >
                Shop Now
              </Link>

              <Link
                to="/products"
                className="px-6 py-3 rounded-lg border"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest">
                Featured
              </p>

              <h2 className="text-3xl font-bold mt-2">
                Popular Products
              </h2>
            </div>

            <Link
              to="/products"
              className="text-sm font-medium"
            >
              View all →
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <p>Loading products...</p>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-500">
              {error}
            </p>
          )}

          {/* Products */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          {/* No products */}
          {!loading && !error && products.length === 0 && (
            <p>No products available.</p>
          )}
        </div>
      </section>

      {/* Categories */}
<section className="px-8 py-16">
  <div className="max-w-7xl mx-auto">
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-widest">
        Explore
      </p>

      <h2 className="text-3xl font-bold mt-2">
        Shop by Category
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link
        to="/products?category=Shirts"
        className="border rounded-xl p-8 hover:shadow-md transition"
      >
        <h3 className="text-2xl font-semibold">
          Shirts
        </h3>

        <p className="mt-2 text-gray-600">
          Explore our collection of shirts.
        </p>

        <span className="inline-block mt-6 font-medium">
          Shop Shirts →
        </span>
      </Link>

      <Link
        to="/products?category=Jackets"
        className="border rounded-xl p-8 hover:shadow-md transition"
      >
        <h3 className="text-2xl font-semibold">
          Jackets
        </h3>

        <p className="mt-2 text-gray-600">
          Find jackets for every occasion.
        </p>

        <span className="inline-block mt-6 font-medium">
          Shop Jackets →
        </span>
      </Link>

      <Link
        to="/products?category=Winter%20Collection"
        className="border rounded-xl p-8 hover:shadow-md transition"
      >
        <h3 className="text-2xl font-semibold">
          Winter Collection
        </h3>

        <p className="mt-2 text-gray-600">
          Stay comfortable this winter.
        </p>

        <span className="inline-block mt-6 font-medium">
          Shop Winter →
        </span>
      </Link>
    </div>
  </div>
</section>
    </div>
  );
}