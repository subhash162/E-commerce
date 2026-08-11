import React from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from '../components/ProductGrid';

export default function Products() {
    const { 
        products , 
        loading , 
        error 
    } =useProducts();
    if(loading){
        return <h1>Loading products...</h1>
    }
    if(error){
        return <h1>Error:{error}</h1>
    }
  return (
    <div>
        <h1>Products</h1>
        <ProductGrid products={products} />
    </div>
  )
}
