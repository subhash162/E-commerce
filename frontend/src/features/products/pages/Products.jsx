import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";
import { useState } from "react";

export default function Products() {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery=searchParams.get('search') || "";
const [searchInput,setSearchInput]=useState()
  const category = searchParams.get("category");
  const categories = [
  ...new Set(products.map((product) => product.category)),
];

  const handleSearch = () => {
  const params = {};

  if (searchInput.trim()) {
    params.search = searchInput.trim();
  }

  if (category) {
    params.category = category;
  }

  setSearchParams(params);
};

  if (loading) {
    return <h1>Loading products...</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  const filteredProducts = products.filter((product) => {
  const matchesCategory =
    !category || product.category === category;

  const matchesSearch =
    product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

  return matchesCategory && matchesSearch;
});

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

   <div className="flex flex-col md:flex-row gap-3 mb-8">
  <input
    type="text"
    placeholder="Search products..."
    value={searchInput}
    onChange={(event) => setSearchInput(event.target.value)}
    onKeyDown={(event) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    }}
    className="flex-1 border rounded-lg px-4 py-3"
  />

  <select
  value={category || ""}
  onChange={(event) => {
    const newCategory = event.target.value;

    const params = {};

    if (searchQuery) {
      params.search = searchQuery;
    }

    if (newCategory) {
      params.category = newCategory;
    }

    setSearchParams(params);
  }}
  className="border rounded-lg px-4 py-3"
>
  <option value="">All Categories</option>

  {categories.map((categoryName) => (
    <option
      key={categoryName}
      value={categoryName}
    >
      {categoryName}
    </option>
  ))}
</select>

  <button
    onClick={handleSearch}
    className="px-6 py-3 rounded-lg bg-black text-white"
  >
    Search
  </button>
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