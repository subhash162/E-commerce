const API_URL="http://localhost:5001/api/products";

export async function createProduct(product) {
    const response=await fetch(API_URL,{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(product),

    })
    if(!response.ok){
        throw new Error("failed to create new product");
    }
    return response.json();

}
export async function getAdminProducts(){
    const response=await fetch(API_URL);
    if(!response.ok){
        throw new Error("failed to fetch products")

    }
    return response.json();
}
export async function deleteProduct(id) {
    const response=await fetch(`${API_URL}/${id}`,{
        method:"DELETE"
    })
    if(!response.ok){
        throw new Error("Failed to delete product")
    }
    return response.json();
}
export async function updateProduct(id,product) {
    const response=await fetch(`${API_URL}/${id}`,{
        method:"PUT",
        headers:{
            "Content-type":"application/json",
        },
        body:JSON.stringify(product)
    })
    if(!response.ok){
        throw new Error("Failed to update product")
    }
    return response.json();
}