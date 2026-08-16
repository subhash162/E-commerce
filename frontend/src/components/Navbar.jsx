import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../features/cart/context/CartContext'
import { useAuth } from '../features/auth/context/authContext';

export default function Navbar() {
  const { user , logout }=useAuth()
    const { cart } = useCart();
    const cartCount=cart.reduce((total,product)=>{
        return total+product.quantity;
    },
    0
)
  return (
    <nav className='flex justify-around'>
        {user?(
          <div>
            <span>Welcome , {user.name}</span>
            <button onClick={logout}>
              Logout
              </button>
          </div>
        ):(
          <div className='flex justify-between'>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
            
          </div>
        )}
    </nav>
  )
}
