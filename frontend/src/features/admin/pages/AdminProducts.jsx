import React, { useState } from 'react'
import ProductForm from '../components/ProductForm'
import AdminProductList from '../components/AdminProductList'

export default function AdminProducts() {
    const [ editingProduct , setEditingProduct ] = useState(null);
    const [ refreshProducts , setRefreshProducts ] = useState(0)
    function handleProductSaved(){
        setEditingProduct(null);
        setRefreshProducts((current)=>current+1)
    }
  return (
    <>
     <AdminProductList
    onEdit={setEditingProduct}
    refreshProducts={refreshProducts}
     />
     
    <ProductForm
    editingProduct={editingProduct}
    onProductSaved={handleProductSaved}
    onCancelEdit={()=>setEditingProduct(null)}
     />
   
    </>
  )
}
