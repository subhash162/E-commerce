import React from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../../cart/context/CartContext';
import { Link, useParams } from 'react-router-dom';

export default function ProductDetails() {
    const { id } = useParams()
    const { products , loading , error } = useProducts();
    const { addToCart } = useCart();
    if(loading){
        return <h1>Loading....</h1>
    }
    if(error){
        return <h2>Error loading product</h2>
    }
    const product=products.find(
        (item)=>item.id===Number(id)
    );
    if(!product){
        return(
           <div>
            <H1>Product not found</H1>

            <Link 
            to='/products'
            >
            Back to products
            </Link>
           </div>
        )
    }
  return (
    <div>
        <h1>{product.name}</h1>

        <p>Category:{product.category}</p>

        <p>Price:{product.price}</p>

        <button onClick={()=>addToCart(product)}>
            Add to Cart
        </button>

        <br />

        <Link to="/cart">
        Go to Cart
        </Link>
    </div>
  )
}
