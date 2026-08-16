import { useEffect, useState } from "react";
import {
  createProduct,
  updateProduct,
} from "../api/adminProductApi";

const emptyForm = {
  name: "",
  price: "",
  category: "",
};

export default function ProductForm({
  editingProduct,
  onProductSaved,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category,
      });
    } else {
      setFormData(emptyForm);
    }

    setError("");
  }, [editingProduct]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: formData.name.trim(),
        price: Number(formData.price),
        category: formData.category.trim(),
      };

      let savedProduct;

      if (editingProduct) {
        savedProduct = await updateProduct(
          editingProduct.id,
          productData
        );
      } else {
        savedProduct = await createProduct(
          productData
        );
      }

      onProductSaved(savedProduct);

      setFormData(emptyForm);
    } catch (error) {
      console.error("SAVE PRODUCT ERROR:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setFormData(emptyForm);
    setError("");
    onCancelEdit();
  }

  return (
    <section className="mt-10 rounded-xl border bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {editingProduct
            ? "Edit Product"
            : "Add Product"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {editingProduct
            ? "Update the product information."
            : "Add a new product to your store."}
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>
          <label className="mb-2 block text-sm font-medium">
            Product Name
          </label>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Winter Jacket"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Price
          </label>

          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 299.99"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Category
          </label>

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Jackets"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

          {editingProduct && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border px-5 py-3 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingProduct
              ? "Update Product"
              : "Create Product"}
          </button>

        </div>
      </form>
    </section>
  );
}