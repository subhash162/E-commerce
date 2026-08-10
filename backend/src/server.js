import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const PORT=5001;
const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.json({
        message:"API is runningggg"
    })
})

app.get("/api/products", (req, res) => {
    res.json([
    {
      id: 1,
      name: "Nike Air Max",
      price: 120,
      category: "Shoes"
    },
    {
      id: 2,
      name: "Classic T-Shirt",
      price: 30,
      category: "Clothing"
    },
    {
      id: 3,
      name: "Leather Backpack",
      price: 80,
      category: "Bags"
    }
  ]);
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})