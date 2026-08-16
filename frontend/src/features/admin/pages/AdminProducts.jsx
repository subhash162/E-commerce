import { useState } from "react";
import ProductForm from "../components/ProductForm";
import AdminProductList from "../components/AdminProductList";

export default function AdminProducts() {
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [refreshProducts, setRefreshProducts] =
    useState(0);

  function handleProductSaved() {
    setEditingProduct(null);

    setRefreshProducts(
      (current) => current + 1
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Product Management
          </h1>

          <p className="mt-2 text-gray-500">
            Add, edit and manage products in your store.
          </p>
        </div>

        <AdminProductList
          onEdit={setEditingProduct}
          refreshProducts={refreshProducts}
        />

        <ProductForm
          editingProduct={editingProduct}
          onProductSaved={handleProductSaved}
          onCancelEdit={() =>
            setEditingProduct(null)
          }
        />

      </div>
    </main>
  );
}