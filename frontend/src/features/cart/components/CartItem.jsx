import { useCart } from "../context/CartContext";

export default function CartItem({ product }) {
  const {
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
  } = useCart();

  const price = Number(product.price);
  const itemTotal = price * product.quantity;

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">

      {/* Product */}
      <div className="min-w-0">
        <h2 className="font-semibold text-gray-900">
          {product.name}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {product.category}
        </p>

        <p className="mt-2 font-medium">
          ${price.toFixed(2)}
        </p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => decreaseQuantity(product.id)}
          className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-gray-100"
        >
          −
        </button>

        <span className="w-6 text-center font-medium">
          {product.quantity}
        </span>

        <button
          onClick={() => increaseQuantity(product.id)}
          className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-gray-100"
        >
          +
        </button>
      </div>

      {/* Item total */}
      <div className="font-semibold">
        ${itemTotal.toFixed(2)}
      </div>

      {/* Remove */}
      <button
        onClick={() => removeFromCart(product.id)}
        className="text-sm text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  );
}