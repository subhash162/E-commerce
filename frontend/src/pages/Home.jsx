import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">

      <div className="text-center">

        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to ShopNow
        </h1>

        <p className="mt-4 text-gray-500">
          Find products you love.
        </p>

        <Link
          to="/products"
          className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Shop Products
        </Link>

      </div>

    </main>
  );
}