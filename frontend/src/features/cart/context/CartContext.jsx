import { createContext, useContext, useEffect, useState } from "react";

const CartContext=createContext();
export function CartProvider({children}){
    const [cart,setCart]=useState([]);
    function addToCart( product ){
        setCart((currentCart)=>{
            const existingProduct=currentCart.find(
                (item)=>item.id===product.id
            )
            if(existingProduct){
                return currentCart.map(
                    (item)=>item.id===product.id?
                    {
                        ...item,
                        quantity:item.quantity+1
                    }
                    :item
                )
            }
            return ([
                ...currentCart,
                {
                    ...product,
                    quantity:1
                }
            ])
        })
    }
    function removeFromCart( productId ){
        setCart((currentCart)=>{
            return currentCart.filter((item)=>{
                item.id!==productId;
            })
        })
    }
   function increaseQuantity( productId ){
    setCart((currentCart)=>{
        return currentCart.map((item)=>{
            (item.id===productId)?{
                ...item,
                quantity : item.quantity+1,
            }
            :item
        })
    })
   }
   function decreaseQuantity( productId ){
    setCart((currentCart)=>{
        return currentCart.map((item)=>{
            (item.id!==productId)?{
                ...item,
                quantity : item.quantity-1,
            }
            :item
        }).filter((item)=>item.quantity>0)
    })
   }
    return (
        <CartContext.Provider 
        value={{
            addToCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity,
            cart
        }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart(){
    return useContext(CartContext);
}


