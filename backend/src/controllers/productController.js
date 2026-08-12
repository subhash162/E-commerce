import { ExplainableCursor } from "mongodb";
import pool from "../config/db.js";

export async function getProducts(req,res){
    try{
        const result=await pool.query(
            "SELECT * FROM products ORDER BY id"
        );
        res.json(result.rows)
    }catch(error){
        res.status(500).json({
            message:"failed to fetch products"
        })
    }
}
export async function getProductById(req,res){
    try{
        const id=Number(req.params.id);
        const result=await pool.query(
            "SELECT * FROM products WHERE id=$1",
            [id]
        );
        if(result.rows.length===0){
            return res.status(500).json({
                message:"Product not found"
            })
        }
        res.json(result.rows[0])
    }catch(error){
        res.status(500).json({
            message:"failed to fetch product"
        });
    }
}
export async function createProduct(req,res) {
    try{
        const { name , price , category }=req.body;
        if(!name || !category || !price ){
            res.status(400).json({ 
                message:"Name , Price and Category are required",
            }
            )
        }
        const result=await pool.query(
            `INSERT INTO products (name, price, category)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name,price,category]
        );
        res.status(200).json(result.rows[0])
    }catch(error){
        res.status(500).json({
            message:"failed to add product",
            error:error.message,
        })
    }
}
export async function updateProduct(req,res){

    try{
        const id=Number(req.params.id);
    const { name , price , category }=req.body;
    if(!name || !price || !category ){
        res.status(400).json({
            message:"Name Price and Category are required",
        })
    }
    const result=await pool.query(
        `UPDATE products
       SET name = $1,
           price = $2,
           category = $3
       WHERE id = $4
       RETURNING *`,
       [ name , price , category , id ]
    ) 
    if(result.rows.length===0){
        return res.status(404).json({
            message:"Product not found"
        })
    }
     res.status(200).json(result.rows[0])
    }catch(error){
        res.status(500).json({
            message:"failed to update product"
        })
    }
    
}
export async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
}