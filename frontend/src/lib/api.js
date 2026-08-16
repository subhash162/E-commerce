const API_URL = "http://localhost:5001/api";

export async function apiFetch(endpoint,options={}) {
    const token=localStorage.getItem("token")
    const response=await fetch(`${API_URL}${endpoint}`,{
        ...options,
        headers:{
            "Content-Type":"application/json",
            ...options.headers,
            ...(token &&{
                Authorization:`Bearer ${token}`,
            }),
        },

    })
    const data=await response.json();
    if(!response.ok){
        throw new Error(data.message || "Something went wrong")
    }
    return data
}