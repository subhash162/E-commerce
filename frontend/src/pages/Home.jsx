import { Link } from "react-router-dom";
import { useProducts } from "../features/products/hooks/useProducts";

export default function Home() {
  const { products, loading, error } = useProducts();

  const featuredProducts = products.slice(0, 4);

  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ].slice(0, 4);

  return (
    <main className="bg-white">

      {/* Hero */}

      <section className="bg-gray-100 px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
              Welcome to our store
            </p>

            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Find something
              <br />
              you'll love.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
              Discover quality products at great prices.
              Simple shopping, secure checkout, and everything
              you need in one place.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/products"
                className="rounded-lg bg-black px-7 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Shop Now
              </Link>

              <Link
                to="/products"
                className="rounded-lg border border-gray-300 bg-white px-7 py-3 font-medium transition hover:bg-gray-50"
              >
                Explore Products
              </Link>
            </div>
          </div>

          <div className="flex min-h-[350px] items-center justify-center rounded-2xl bg-black p-10 text-white">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                New Collection
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                Shop smarter.
              </h2>

              <p className="mt-4 text-gray-400">
                Quality products, simple experience.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* Categories */}

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Shop by Category
              </h2>
            </div>

            <Link
              to="/products"
              className="text-sm font-medium hover:underline"
            >
              View all
            </Link>
          </div>

          {categories.length === 0 ? (
            <p className="text-gray-500">
              Categories will appear here.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">

              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="group rounded-xl border bg-gray-50 p-8 transition hover:-translate-y-1 hover:bg-black hover:text-white"
                >
                  <p className="text-lg font-semibold">
                    {category}
                  </p>

                  <p className="mt-3 text-sm text-gray-500 group-hover:text-gray-300">
                    Explore collection →
                  </p>
                </Link>
              ))}

            </div>
          )}

        </div>
      </section>


      {/* Featured Products */}

      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Our picks
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              className="text-sm font-medium hover:underline"
            >
              View all products →
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500">
              Loading products...
            </p>
          ) : error ? (
            <p className="text-red-500">
              Unable to load products.
            </p>
          ) : featuredProducts.length === 0 ? (
            <p className="text-gray-500">
              No products available yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="flex h-56 items-center justify-center bg-gray-100">
                    <span className="text-gray-400">
                      Product
                    </span>
                  </div>

                  <div className="p-5">

                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      {product.category}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold">
                      {product.name}
                    </h3>

                    <p className="mt-3 font-bold">
                      Rs. {Number(product.price).toLocaleString()}
                    </p>

                  </div>

                </Link>
              ))}

            </div>
          )}

        </div>
      </section>


      {/* Why Shop */}

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Why choose us
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Shopping made simple
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-xl border p-8 text-center">
              

              <h3 className="mt-5 text-lg font-semibold">
                Fast Delivery
              </h3>

              <p className="mt-3 text-gray-500">
                Get your products delivered quickly and
                conveniently.
              </p>
            </div>

            <div className="rounded-xl border p-8 text-center">

              <h3 className="mt-5 text-lg font-semibold">
                Secure Checkout
              </h3>

              <p className="mt-3 text-gray-500">
                Your account and order information stays
                protected.
              </p>
            </div>

            <div className="rounded-xl border p-8 text-center">
              <h3 className="mt-5 text-lg font-semibold">
                Quality Products
              </h3>

              <p className="mt-3 text-gray-500">
                Browse products from different categories
                in one place.
              </p>
            </div>

          </div>

        </div>
      </section>


      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-2xl bg-black px-8 py-16 text-center text-white">

          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to start shopping?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Explore our products and find something perfect
            for you.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3 font-medium text-black transition hover:bg-gray-200"
          >
            Browse Products
          </Link>

        </div>
      </section>

    </main>
  );
}