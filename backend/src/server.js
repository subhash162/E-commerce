import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from '../src/routes/productRoutes.js'
import authRoutes from "../src/routes/authRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
const PORT=5001;
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/products",productRoutes)
app.use("/api/orders",orderRoutes)
app.get("/",(req,res)=>{
    res.json({
        message:"E-commerce API is runningggg"
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})