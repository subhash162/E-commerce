import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../../cart/context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();

  const { products, loading, error } = useProducts();

  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <div className="px-8 py-12">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-12">
        <p className="text-red-500">
          Error loading product.
        </p>
      </div>
    );
  }

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="px-8 py-12">
        <h1 className="text-2xl font-bold">
          Product not found
        </h1>

        <Link
          to="/products"
          className="inline-block mt-4 underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

 const handleAddToCart = () => {
  for (let i = 0; i < quantity; i++) {
    addToCart(product);
  }
};

  return (
    <div className="px-8 py-12">
      <div className="max-w-5xl mx-auto">

        <Link
          to="/products"
          className="text-sm text-gray-600"
        >
          ← Back to products
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mt-8">

          {/* Product image placeholder */}
          <div className="bg-gray-100 rounded-xl min-h-[400px] flex items-center justify-center">
            <span className="text-gray-400">
              Product Image
            </span>
          </div>

          {/* Product information */}
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-500">
              {product.category}
            </p>

            <h1 className="text-4xl font-bold mt-3">
              {product.name}
            </h1>

            <p className="text-2xl font-semibold mt-6">
              ${Number(product.price).toFixed(2)}
            </p>

            {/* Quantity */}
            <div className="mt-8">
              <p className="font-medium mb-3">
                Quantity
              </p>

              <div className="flex items-center border rounded-lg w-fit">

                <button
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  className="px-4 py-2"
                >
                  −
                </button>

                <span className="px-5">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((current) =>
                      current + 1
                    )
                  }
                  className="px-4 py-2"
                >
                  +
                </button>

              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">

              <button
                onClick={handleAddToCart}
                className="px-6 py-3 rounded-lg bg-black text-white"
              >
                Add to Cart
              </button>

              <Link
                to="/cart"
                className="px-6 py-3 rounded-lg border"
              >
                View Cart
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}