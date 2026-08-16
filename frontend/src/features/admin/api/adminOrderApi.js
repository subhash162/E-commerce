import { apiFetch } from "../../../lib/api";

export async function getAdminOrders() {
  return apiFetch("/orders/admin");
}

export async function updateOrderStatus(orderId, status) {
  return apiFetch(`/orders/admin/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}