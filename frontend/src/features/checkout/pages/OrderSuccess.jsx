import { Link, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-20">

      <div className="mx-auto max-w-xl rounded-xl bg-white p-10 text-center shadow-sm">

        <div className="text-5xl">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-gray-500">
          Thank you for your purchase.
        </p>

        <p className="mt-4">
          Order ID:
          <span className="ml-2 font-semibold">
            #{id}
          </span>
        </p>

        <div className="mt-8 flex justify-center gap-4">

          <Link
            to="/products"
            className="rounded-lg bg-black px-6 py-3 text-white"
          >
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="rounded-lg border px-6 py-3"
          >
            Home
          </Link>

        </div>

      </div>

    </main>
  );
}