import React from 'react'
import { useCart } from '../context/CartContext'

export default function CartItem({ product }) {
    const { removeFromCart , decreaseQuantity , increaseQuantity } = useCart();

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
        {/* Product Information */}
        <div>
            <h2 className="font-semibold text-gray-900">
                {product.name}
            </h2>
            <p className="mt-1 text-gray-500">
                {product.price}
            </p>
        </div>
        {/* Quantity */}
        <div className="flex items-center gap-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-md border" onClick={()=>decreaseQuantity(product.id)}>
                -
            </button>
            <span className="font-medium">
                {product.quantity}
            </span>
            <button className="flex h-8 w-8 items-center justify-center rounded-md border" onClick={()=>increaseQuantity(product.id)}>
                +
            </button>
        </div>
        {/* Total */}
        <div className="font-semibold">
            {product.price*product.quantity}
        </div>
        {/* Remove */}
        <button 
        onClick={()=>removeFromCart(product.id)}
        className="text-sm text-red-500 hover:text-red-700"
        >
            Remove
        </button>
    </div>
  )
}
