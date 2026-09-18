const API_BASE_URL = "http://localhost:5272/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

// ===============================
// AUTH
// ===============================

export function loginUser(username, password) {
  return request("/Auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });
}

export function registerUser({
  username,
  email,
  name,
  password,
  departmentId,
}) {
  return request("/Auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      name,
      password,
      departmentId,
    }),
  });
}

// ===============================
// PRODUCTS
// ===============================

export function getProducts(categoryId = null) {
  const query = categoryId
    ? `?categoryId=${encodeURIComponent(categoryId)}`
    : "";

  return request(`/products${query}`, {
    method: "GET",
  });
}

export function getProduct(productId) {
  return request(`/products/${productId}`, {
    method: "GET",
  });
}

// ===============================
// ORDERS
// ===============================

export function createOrder(items, token) {
  return request("/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items,
    }),
  });
}

export function getMyOrders(token) {
  return request("/orders/mine", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAllOrders(token) {
  return request("/orders/admin", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateOrderStatus(orderId, status, token) {
  return request(`/orders/admin/${orderId}/status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status,
    }),
  });
}

// ===============================
// MANAGER APPROVALS
// ===============================

export function getManagerPendingOrders(token) {
  return request("/orders/manager/pending", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function approveManagerOrder(orderId, token) {
  return request(`/orders/manager/${orderId}/approve`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function rejectManagerOrder(orderId, comment, token) {
  return request(`/orders/manager/${orderId}/reject`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      comment,
    }),
  });
}

// ===============================
// ADMIN DASHBOARD
// ===============================

export function getAdminDashboard(token) {
  return request("/admin/dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export default request;