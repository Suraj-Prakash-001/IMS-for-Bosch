import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { name, username, logout } = useAuth();
  const location = useLocation();

  const displayName = name || username || "Customer";

  const isActive = (path) => {
    return location.pathname === path
      ? "customer-nav-active"
      : "";
  };

  return (
    <header className="customer-header">
      <Link to="/home" className="public-brand">
        <img
          src="/bosch-emblem.png"
          alt="Bosch emblem"
          className="public-brand-emblem"
        />

        <span>BOSCH</span>
      </Link>

      <nav className="customer-nav">
        <Link
          to="/home"
          className={isActive("/home")}
        >
          Home
        </Link>

        <Link
          to="/products"
          className={isActive("/products")}
        >
          Products
        </Link>

        <Link
          to="/orders"
          className={isActive("/orders")}
        >
          My Orders
        </Link>

        <div className="customer-profile">
          <div className="customer-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <span>{displayName}</span>
        </div>

        <button
          type="button"
          onClick={logout}
          className="customer-logout"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;