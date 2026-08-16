import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../cart/context/CartContext";
import { createOrder } from "../services/orderApi";
import { useAuth } from "../../auth/context/authContext";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingName, setShippingName] = useState(
    user?.name || ""
  );

  const [shippingEmail, setShippingEmail] = useState(
    user?.email || ""
  );

  const [shippingAddress, setShippingAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((sum, product) => {
    return sum + Number(product.price) * product.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">

          <h1 className="text-3xl font-bold">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some products before checking out.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
          >
            Continue Shopping
          </Link>

        </div>
      </main>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const orderData = {
        shippingName,
        shippingEmail,
        shippingAddress,

        items: cart.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
        })),
      };

      const response = await createOrder(orderData);

      clearCart();

      navigate(`/order-success/${response.order.id}`);
    } catch (error) {
      console.error("ORDER ERROR:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Checkout
        </h1>

        {error && (
          <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Shipping information */}

          <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Shipping Information
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  value={shippingName}
                  onChange={(event) =>
                    setShippingName(event.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  value={shippingEmail}
                  onChange={(event) =>
                    setShippingEmail(event.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Address
                </label>

                <textarea
                  value={shippingAddress}
                  onChange={(event) =>
                    setShippingAddress(event.target.value)
                  }
                  required
                  rows="4"
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="Enter your delivery address"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>
          </div>

          {/* Order summary */}

          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              {cart.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between gap-4"
                >

                  <div>
                    <p className="font-medium">
                      {product.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Qty: {product.quantity}
                    </p>
                  </div>

                  <p className="font-medium">
                    $
                    {(
                      Number(product.price) *
                      product.quantity
                    ).toFixed(2)}
                  </p>

                </div>
              ))}

            </div>

            <div className="mt-6 flex justify-between border-t pt-5">

              <span className="font-medium">
                Total
              </span>

              <span className="text-xl font-bold">
                ${total.toFixed(2)}
              </span>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}