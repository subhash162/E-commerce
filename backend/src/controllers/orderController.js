import pool from "../config/db.js";

export async function createOrder(req, res) {
  const client = await pool.connect();

  try {
    const userId = req.user.id;

    const {
      shippingName,
      shippingEmail,
      shippingAddress,
      items,
    } = req.body;

    // Validate request
    if (
      !shippingName ||
      !shippingEmail ||
      !shippingAddress ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Shipping information and cart items are required",
      });
    }

    await client.query("BEGIN");

    let totalAmount = 0;
    const orderItems = [];

    // Get actual product information from database
    for (const item of items) {
      const productResult = await client.query(
        `
        SELECT id, name, price
        FROM products
        WHERE id = $1
        `,
        [item.productId]
      );

      if (productResult.rows.length === 0) {
        throw new Error(
          `Product with id ${item.productId} not found`
        );
      }

      const product = productResult.rows[0];

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error(
          `Invalid quantity for product ${product.id}`
        );
      }

      const price = Number(product.price);
      const subtotal = price * quantity;

      totalAmount += subtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        price,
        quantity,
        subtotal,
      });
    }

    // Create order
    const orderResult = await client.query(
      `
      INSERT INTO orders (
        user_id,
        total_amount,
        shipping_name,
        shipping_email,
        shipping_address
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        userId,
        totalAmount,
        shippingName,
        shippingEmail,
        shippingAddress,
      ]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of orderItems) {
      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          price,
          quantity,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          order.id,
          item.productId,
          item.productName,
          item.price,
          item.quantity,
          item.subtotal,
        ]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Order created successfully",
      order: {
        id: order.id,
        totalAmount: order.total_amount,
        status: order.status,
        shippingName: order.shipping_name,
        shippingEmail: order.shipping_email,
        shippingAddress: order.shipping_address,
        items: orderItems,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      message: "Failed to create order",
    });
  } finally {
    client.release();
  }
}
export async function getMyOrders(req, res) {
  try {
    const userId = req.user.id;

    const ordersResult = await pool.query(
      `
      SELECT
        id,
        total_amount,
        status,
        shipping_name,
        shipping_email,
        shipping_address,
        created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const orders = [];

    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `
        SELECT
          id,
          product_id,
          product_name,
          price,
          quantity,
          subtotal
        FROM order_items
        WHERE order_id = $1
        ORDER BY id
        `,
        [order.id]
      );

      orders.push({
        id: order.id,
        totalAmount: order.total_amount,
        status: order.status,
        shippingName: order.shipping_name,
        shippingEmail: order.shipping_email,
        shippingAddress: order.shipping_address,
        createdAt: order.created_at,
        items: itemsResult.rows,
      });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
}
export async function getAllOrders(req, res) {
  try {
    const ordersResult = await pool.query(`
      SELECT
        o.id,
        o.user_id,
        u.name AS customer_name,
        u.email AS customer_email,
        o.total_amount,
        o.status,
        o.shipping_name,
        o.shipping_email,
        o.shipping_address,
        o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    const orders = [];

    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `
        SELECT
          id,
          product_id,
          product_name,
          price,
          quantity,
          subtotal
        FROM order_items
        WHERE order_id = $1
        ORDER BY id
        `,
        [order.id]
      );

      orders.push({
        id: order.id,
        userId: order.user_id,

        customerName: order.customer_name,
        customerEmail: order.customer_email,

        totalAmount: order.total_amount,
        status: order.status,

        shippingName: order.shipping_name,
        shippingEmail: order.shipping_email,
        shippingAddress: order.shipping_address,

        createdAt: order.created_at,

        items: itemsResult.rows,
      });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
}
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const result = await pool.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = result.rows[0];

    return res.status(200).json({
      message: "Order status updated successfully",
      order: {
        id: order.id,
        totalAmount: order.total_amount,
        status: order.status,
        shippingName: order.shipping_name,
        shippingEmail: order.shipping_email,
        shippingAddress: order.shipping_address,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return res.status(500).json({
      message: "Failed to update order status",
    });
  }
}