import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Products from '../features/products/pages/Products'
import ProductDetails from '../features/products/pages/ProductDetails'
import Cart from '../features/cart/pages/Cart'
import AdminProducts from '../features/admin/pages/AdminProducts'
import Login from '../features/auth/pages/login'
import Register from '../features/auth/pages/Register'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'
import AdminRoute from '../features/auth/components/AdminRoute'

export default function AppRoutes() {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<ProductDetails />} />

        <Route element={<ProtectedRoute />}>
        <Route path='/cart' element={<Cart />} />
        </Route>

        <Route element={<AdminRoute />}>
        <Route path='/admin/products' element={<AdminRoute />} />
        </Route>
        
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
    </Routes>
  )
}
