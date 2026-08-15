import React, { useEffect, useState } from 'react'
import { deleteProduct, getAdminProducts } from '../api/adminProductApi';

export default function AdminProductList({ onEdit , refreshProducts }) {
    const [ products , setProducts ]=useState([]);
    const [ loading , setLoading ]=useState(true)
     useEffect(()=>{
        loadProducts()
    },[refreshProducts])
    async function loadProducts() {
        try {
            const data=await getAdminProducts();
            setProducts(data)
        } catch (error) {
            throw new Error(error)
        }finally{
            setLoading(false)
        }
    }
   
    async function handleDelete(id) {
        try {
            await deleteProduct(id);
            setProducts((currentProducts)=>
            {
                return currentProducts.filter((item)=>item.id!==id)}
            )
        } catch (error) {
            console.error(error)
        }
    }
    async function handleEdit(Product) {
        onEdit(Product)
    }
    if(loading){
        return <p>Loading.....</p>
    }
  return (
    <div>
        <h2>Products You Posted</h2>
        <div className='flex'>
            {products.map((product)=>(
                <div key={product.id} className='w-[25vh] h-[25vh] border'>
                    <h3>{product.name}</h3>
                    <p>{product.price}</p>
                    <p>{product.category}</p>
                    <button onClick={()=>handleEdit(product)}>Edit</button>
                    <button onClick={()=>handleDelete(product.id)}>Delete</button>
                </div>
            ))}
        </div>
        
    </div>
  )
}
