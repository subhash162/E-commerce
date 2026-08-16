import React, { useState } from 'react'
import { useAuth } from '../context/authContext'

export default function Login() {
    const {login} = useAuth()
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data=await login({
                email,
                password
            })
            console.log("Login Success",data)
        } catch (error) {
            console.error("Login error:",error.message);
        }
    }

  return (
    <div>
        <h1>Login</h1>
       <form onSubmit={handleSubmit}>
        <div>
            <span>Email</span>
            <input type="email"
            className='border'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
              />
        </div>
        <div>
            <span>Password</span>
            <input 
            type="password"
            className='border'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
             />
        </div>
        <button 
        type='submit'
        className='bg-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500'
        >
            Login
        </button>
       </form>
    </div>
  )
}
