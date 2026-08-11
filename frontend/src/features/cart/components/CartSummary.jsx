import React from 'react'
import { useCart } from '../context/CartContext'

export default function CartSummary() {
    const { cart } = useCart();
    const Total=cart.reduce((total,product)=>{
        return total+ product.price * product.quantity
    },
0
)
  return (
    <div>
        <h2>Cart Summary</h2>

        <p>
           Total: {Total}
        </p>
        
        <button className='bg-red-500'>
            Checkout
        </button>
    </div>
  )
}
