import { apiFetch } from "../../../lib/api";

const API_URL="http://localhost:5001/api/products";

export async function createProduct(product) {
    return apiFetch('/products',{
        method:"POST",
        body:JSON.stringify(product)
    })

}
export async function getAdminProducts(){

    const response=await fetch(API_URL);
    if(!response.ok){
        throw new Error("failed to fetch products")

    }
    return response.json()
}
export async function deleteProduct(id) {
    return apiFetch(`/products/${id}`,{
        method:"DELETE",
    })
}
export async function updateProduct(id,product) {
    return apiFetch(`/products/${id}`,{
        method:"put",
        body:JSON.stringify(product)
    })
}