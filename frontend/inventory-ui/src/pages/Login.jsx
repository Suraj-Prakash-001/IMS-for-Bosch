import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, isManager } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
  let destination = "/home";

  if (isAdmin) {
    destination = "/admin";
  } else if (isManager) {
    destination = "/manager";
  }

  return (
    <Navigate
      to={destination}
      replace
    />
  );
}

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser(
        form.username,
        form.password
      );

      login(response);

if (response.role === "Admin") {
  navigate("/admin", { replace: true });
} else if (response.role === "Manager") {
  navigate("/manager", { replace: true });
} else {
  navigate("/home", { replace: true });
}
    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <img
          src="/bosch-emblem.png"
          alt="Bosch emblem"
        />
        <span>BOSCH</span>
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <p className="landing-eyebrow">WELCOME BACK</p>
          <h1>Sign in</h1>
          <p>
            Sign in to access your inventory workspace.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>

        <Link to="/" className="auth-back">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default Login;