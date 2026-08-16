import { useEffect, useState } from "react";
import {
  deleteProduct,
  getAdminProducts,
} from "../api/adminProductApi";

export default function AdminProductList({
  onEdit,
  refreshProducts,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, [refreshProducts]);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminProducts();

      setProducts(data);
    } catch (error) {
      console.error("LOAD PRODUCTS ERROR:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      setError(error.message);
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Products
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your store products.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-gray-500">
            No products found.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {product.category}
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                  {product.name}
                </h3>

                <p className="mt-2 text-xl font-bold">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(product.id)
                  }
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}