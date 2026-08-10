import React from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from '../components/ProductGrid';

export default function Products() {
    const { 
        products , 
        loading , 
        error 
    } =useProducts();
  return (
    <main className='min-h-screen bg-gray-50'>

        {/* Header */}
        <section className='border-b bg-white'>
            <div className="mx-auto max-w-7xl px-6 py-12">

                <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                    shop
                </p>

                <h1 className='mt-2 text-4xl font-bold text-gray-900'>
                    All Products
                </h1>

                <p className="mt-3 max-w-xl text-gray-500">
                    Browse our collection of products and find the perfect fit for your needs. From the latest trends to timeless classics, we have something for everyone.
                </p>

            </div>
        </section>

        {/* products */}
        <section className='mx-auto max-w-7xl px-6 py-12'>
            {loading && (
                <div className='py-20 text-center'>
                    <p className="text-gray-500">Loading products...</p>
                </div>
            )}

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <ProductGrid products={products} />
            )}
        </section>
    </main>
  )
}
