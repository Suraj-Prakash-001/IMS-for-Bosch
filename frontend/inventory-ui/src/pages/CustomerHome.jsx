import { Link } from "react-router-dom";
import { Package, ShoppingBag, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function CustomerHome() {
  const { name, logout } = useAuth();

  return (
    <div className="customer-page">
      <header className="customer-header">
  <div className="public-brand">
    <img
      src="/bosch-emblem.png"
      alt="Bosch emblem"
      className="public-brand-emblem"
    />
    <span>BOSCH</span>
  </div>

  <nav>
    <Link to="/home">Home</Link>
    <Link to="/products">Products</Link>
    <Link to="/orders">My Orders</Link>

    <button
      type="button"
      onClick={logout}
      className="customer-logout"
    >
      Logout
    </button>
  </nav>
</header>

      <main className="customer-content">
        <section className="customer-welcome">
          <p className="landing-eyebrow">
            CUSTOMER PORTAL
          </p>

          <h1>
            Welcome, {name}.
          </h1>

          <p>
            Browse available inventory, place orders, and
            keep track of your requests.
          </p>

          <Link
            to="/products"
            className="primary-button"
          >
            Browse products
          </Link>
        </section>

        <section className="customer-actions">
          <Link to="/products" className="customer-action-card">
            <Package />
            <h3>Browse products</h3>
            <p>Explore available inventory.</p>
          </Link>

          <Link to="/orders" className="customer-action-card">
            <ShoppingBag />
            <h3>My orders</h3>
            <p>View your order history.</p>
          </Link>

          <div className="customer-action-card">
            <Clock />
            <h3>Track requests</h3>
            <p>Monitor order progress and status.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CustomerHome;