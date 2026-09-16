const API_BASE_URL = "http://localhost:5272/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
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
}) {
  return request("/Auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      name,
      password,
    }),
  });
}

export default request;