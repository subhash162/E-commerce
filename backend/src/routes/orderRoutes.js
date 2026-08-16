import express from "express";
import { createOrder, getAllOrders, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get('/my-orders',
    authenticateToken,
    getMyOrders
)
router.get('/admin',
    authenticateToken,
    requireAdmin,
    getAllOrders
)
router.patch('/admin/:id/status',
    authenticateToken,
    requireAdmin,
    updateOrderStatus
)
export default router;