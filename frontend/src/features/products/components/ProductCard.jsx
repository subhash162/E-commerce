import { Link } from "react-router-dom";
import { useCart } from "../../cart/context/CartContext";

export default function ProductCard({ product }) {
    let { addToCart , cart }=useCart();
  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-sm">
        {/*Product image */}
      <Link to={`/products/${product.id}`}>
        <div className="h-64 bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
      </Link>
      {/* Product information */}
      <div className="p-5">
        <p className="text-sm text-gray-500">
          {product.category}
        </p>
        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h2 className="mt-2 text-lg font-semibold">
            {product.name}
          </h2>
        </Link>
        {/* Price + Add to Cart */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold">
            ${product.price}
          </p>

          <button 
          className="rounded-lg bg-black px-4 py-2 text-white" 
          onClick={()=>{
            console.log("Button clicked");
            console.log("Product:", product);
            addToCart(product);
            console.log("cartttt",cart)
            console.log("Product added to cart:", product);
        }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}