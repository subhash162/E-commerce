import React from 'react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';

export default function Cart() {
    const { cart }=useCart();
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-5xl">

            <h1 className="text-3xl font-bold">
                Shopping Cart
            </h1>
            
            {cart.length===0?(
                <div className="py-20 text-center">
                    <p className='text-gray-500'>
                        Your cart is emty.
                    </p>
                    <Link
                    to='/products'
                    className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
                    >
                    Continue Shopping
                    </Link>
                </div>
            ):(
                <div>
                <div className="mt-8">
                    {
                        cart.map((product)=>(
                            <CartItem 
                            key={product.id} 
                            product={product} 
                            />
                        ))
                    }
                </div>
                <CartSummary />
                </div>
            )
            }

        </div>
    </main>
  )
}


