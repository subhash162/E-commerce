import React, { useState } from 'react'
import { useAuth } from '../context/authContext'

export default function Register() {
    const { register }=useAuth()
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = await register({
                name,
                email,
                password
            })
             console.log("REGISTER SUCCESS:", data);
        } catch (error) {
            console.error("registration error",error.message)
        }
    }
  return (
     <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  )
}
