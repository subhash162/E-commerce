import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartSummary() {
  const { cart } = useCart();

  const total = cart.reduce((sum, product) => {
    return sum + Number(product.price) * product.quantity;
  }, 0);

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold">
        Cart Summary
      </h2>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <span className="text-gray-600">
          Total
        </span>

        <span className="text-2xl font-bold">
          ${total.toFixed(2)}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">

        <Link
          to="/products"
          className="rounded-lg border px-6 py-3 text-center font-medium hover:bg-gray-50"
        >
          Continue Shopping
        </Link>

        <Link
          to="/checkout"
          className="rounded-lg bg-black px-6 py-3 text-center font-medium text-white hover:bg-gray-800"
        >
          Checkout
        </Link>

      </div>
    </div>
  );
}