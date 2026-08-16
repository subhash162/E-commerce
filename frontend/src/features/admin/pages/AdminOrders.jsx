import { useEffect, useState } from "react";
import {
  getAdminOrders,
  updateOrderStatus,
} from "../api/adminOrderApi";

const statuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders();

      setOrders(data);
    } catch (error) {
      console.error("LOAD ORDERS ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      await updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
      setError(error.message);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p>Loading orders...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Orders
          </h1>

          <p className="mt-2 text-gray-500">
            Manage customer orders and update their status.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              No orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >

                {/* Order Header */}

                <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order
                    </p>

                    <h2 className="text-xl font-bold">
                      #{order.id}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <p className="font-medium">
                      {order.customerName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.customerEmail}
                    </p>
                  </div>

                  {/* Status */}

                  <div>
                    <label className="mb-1 block text-sm text-gray-500">
                      Status
                    </label>

                    <select
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value
                        )
                      }
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      {statuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Products */}

                <div className="mt-5 space-y-4">

                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div>
                        <p className="font-medium">
                          {item.product_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          ${Number(item.price).toFixed(2)}
                          {" × "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold">
                        $
                        {Number(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  ))}

                </div>

                {/* Footer */}

                <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                  <div>
                    <p className="text-sm text-gray-500">
                      Shipping to
                    </p>

                    <p className="font-medium">
                      {order.shippingName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.shippingAddress}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="text-2xl font-bold">
                      $
                      {Number(
                        order.totalAmount
                      ).toFixed(2)}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}