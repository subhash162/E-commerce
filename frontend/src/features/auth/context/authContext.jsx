import React, { createContext, useContext, useState } from 'react'
import { loginUser, registerUser } from '../api/authApi';
const AuthContext=createContext();

export function AuthProvider({children}) {
    const [user,setUser]=useState(()=>{
        const savedUser=localStorage.getItem('user');
        return savedUser?JSON.parse(savedUser):null;
    });
    const [token,setToken]=useState(()=>{
        return localStorage.getItem("token")
    });

    async function login(credintials) {
        const data=await loginUser(credintials);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("token",data.token);
        localStorage.setItem("user",JSON.stringify(data.user))
        return data
    }
    async function register(userData) {
        const data=await registerUser(userData);
        return data
    }
    function logout(){
        setUser(null);
        setToken(null);
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
  return (
   <AuthContext.Provider
   value={{
    user,
    token,
    login,
    register,
    logout
   }}
   >
    {children}
   </AuthContext.Provider>
  )
}
export function useAuth(){
    return useContext(AuthContext)
}
