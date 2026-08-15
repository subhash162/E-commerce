import pool from "../config/db.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
export async function register(req,res){
    try{
    const {name,email,password}=req.body;
    console.log("Register",{
        name,
        email,
        password
    })
    if(!name || !email || !password){
        return res.status(400).json({
            message:'Name Email and Password are required'
        })
    }
    const existingUser=await pool.query(
        "SELECT id FROM users WHERE email=$1",
        [email]
    );
    if(existingUser.rows.length>0){
        return res.status(409).json({
            message:'Email is already registered'
        })
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const result=await pool.query(
        `INSERT INTO users (name,email,password) values ($1,$2,$3) RETURNING id,name,email,role,created_at`,
        [name,email,hashedPassword]
    )

    res.status(201).json({
        message:"user registed successfully",
        user:result.rows[0]
    })
}catch(error){
    res.status(500).json({
        message:"Server error"
    })
    }
    
}
export async function login(req,res) {
    try{
        const {email,password}=req.body;
    if(!email || !password){
        res.status(400).json({
            message:"Email and password are required"
        })
    }
    const result=await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [email]
    )
    if(result.rows.length===0){
        res.status(401).json({
            message:"Invalid Email or Password"
        })
    }
    const user=result.rows[0];
    const matchPassword=await bcrypt.compare(
        password,
        user.password
    )
    if(!matchPassword){
        res.status(401).json({
            message:"Invalid username or password"
        })
    }
    const token = jwt.sign(
        {
            id:user.id,
            role:user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
    )
    res.status(200).json({
        message:"login successful",
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
        }
    })
}catch(error){
    res.status(500).json({
        message:"SERVER error"
    })
}
}