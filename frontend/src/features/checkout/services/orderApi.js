import { apiFetch } from "../../../lib/api";

export async function createOrder(orderData) {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function getMyOrders() {
  return apiFetch("/orders/my-orders");
}