import { useEffect ,useState } from "react";
import { getProducts } from "../services/productApi";

export function useProducts(){
    const [products,setProducts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    useEffect(()=>{
        async function fetchProducts(){
            try{
                const data=await getProducts();
                setProducts(data);
            }
            catch(error){
                setError(error.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchProducts();
    },[]);
    return { 
        products,
        loading,
        error ,
    }
}