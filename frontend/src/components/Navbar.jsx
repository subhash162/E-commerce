import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../features/cart/context/CartContext'

export default function () {
    const { cart } = useCart();
    const cartCount=cart.reduce((total,product)=>{
        return total+product.quantity;
    },
    0
)
  return (
    <nav className='flex justify-around'>
        <Link to='/' >
        E-commerce
        </Link>

        <div className='flex'>
            <Link to='/products'>
            Products
            </Link>

            <Link to='/cart'>
            Cart ({cartCount})
            </Link>
        </div>
    </nav>
  )
}
