import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderApi";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p>Loading orders...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold">
          My Orders
        </h1>

        {error && (
          <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="mt-10 rounded-xl bg-white p-10 text-center">
            <p className="text-gray-500">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-block rounded-lg bg-black px-6 py-3 text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >

                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order
                    </p>

                    <h2 className="text-lg font-bold">
                      #{order.id}
                    </h2>
                  </div>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium capitalize text-yellow-800">
                    {order.status}
                  </span>

                  <p className="font-bold">
                    ${Number(order.totalAmount).toFixed(2)}
                  </p>

                </div>

                <div className="mt-5 space-y-3">

                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {item.product_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-medium">
                        $
                        {Number(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  ))}

                </div>

                <p className="mt-5 border-t pt-4 text-sm text-gray-500">
                  Ordered on{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}