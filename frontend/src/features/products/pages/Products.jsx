import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";

export default function Products() {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category");

  if (loading) {
    return <h1>Loading products...</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  return (
    <div className="px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest">
              Shop
            </p>

            <h1 className="text-4xl font-bold mt-2">
              {category || "All Products"}
            </h1>
          </div>

          {category && (
            <button
             onClick={() => setSearchParams({})}
             className="text-sm font-medium"
             >
                Clear filter
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-600">
            No products found in this category.
          </p>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  );
}