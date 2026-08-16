import { apiFetch } from "../../../lib/api";

export async function getProducts(){
    return apiFetch("/products")
}

export async function getProductById(id){
   return apiFetch(`/products/${id}`)
}