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