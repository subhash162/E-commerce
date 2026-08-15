import React, { useEffect, useState } from 'react'
import { createProduct, updateProduct } from '../api/adminProductApi';

export default function ProductForm({
    editingProduct,
    onProductSaved,
    onCancelEdit,
}) {
    const [ formData , setFormData ]=useState({
        name:"",
        price:"",
        category:""
    })
    const [ loading , setLoading ]=useState(false);
    useEffect(()=>{
        if(editingProduct){
            setFormData({
                name:editingProduct.name,
                price:editingProduct.price,
                category:editingProduct.category,
            })
        }
    },[editingProduct])
    function handleChange(event){
        const { name , value }=event.target;

        setFormData((current)=>(
            {
                ...current,
                [name]:value
            }
        ))
    }
    async function handleSubmit(event){
        event.preventDefault();

        try {
            setLoading(true);
            let savedProduct;

            if(editingProduct){
                savedProduct=await updateProduct(
                    editingProduct.id,
                    {
                        ...formData,
                        price:Number(formData.price)
                    }
                )
            }else{
                savedProduct=await createProduct({
                    ...formData,
                    price:Number(formData.price)
                })
            }
            onProductSaved(savedProduct);
            setFormData({
                name:"",
                price:"",
                category:""
            })
        } catch (error) {
            console.error(error)
        }finally{
            setLoading(false)
        }
    }
  return (
    <form onSubmit={handleSubmit} className=' place-items-center'>
        <div className='h-[90vh] w-[90vh] grid place-content-center '>
        <div className='h-[10vh] w-[50vh] flex justify-between place-items-center'>
            <div>Product Name:</div>
            <div>
                <input 
                    className='border-2 rounded-lg'
                    name='name'
                    value={formData.name} 
                    onChange={handleChange} 
               />
            </div>
        </div>
         <div className='h-[10vh] w-[50vh] flex justify-between place-items-center'>
           <div>Price:</div> 
            <div className='place-self-center'>
              <input 
             name='price'
             type='number' 
             value={formData.price} 
             onChange={handleChange} 
              className='border-2 rounded-lg'
              />
            </div>
        </div>
        <div className='h-[10vh] w-[50vh] flex justify-between place-items-center'>
            <div>Category:</div>
             <div>
             <input 
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='border-2 rounded-lg'
             />
            </div>
        </div>
        <button type='submit' disabled={loading} className='flex justify-self-end   rounded-lg  p-[10px] bg-blue-500 transition delay-150 duration-700 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500'>
        {
        loading?
        "Saving...."
        :editingProduct
        ?"Update Product"
        :"CREATE Product"
        }
       </button>
       {
        editingProduct && (
            <button
            type='button'
            onClick={onCancelEdit}
            >
                cancel
            </button>
        )
       }
        </div>
       
    </form>
  )
}
