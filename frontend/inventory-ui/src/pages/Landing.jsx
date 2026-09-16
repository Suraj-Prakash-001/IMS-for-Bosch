import { Link } from "react-router-dom";
import { ArrowRight, Package, ShoppingCart, Search } from "lucide-react";

function Landing() {
  return (
    <div className="public-page">
      <header className="public-header">
        <div className="public-brand">
          <img
            src="/bosch-emblem.png"
            alt="Bosch emblem"
            className="public-brand-emblem"
          />

          <span>BOSCH</span>
        </div>

        <nav className="public-nav">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>

          <Link to="/login" className="public-login-link">
            Login
          </Link>

          <Link to="/register" className="public-register-button">
            Register
          </Link>
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-content">
            <p className="landing-eyebrow">
              INVENTORY MANAGEMENT SYSTEM
            </p>

            <h1>
              Find what you need.
              <br />
              Order it with confidence.
            </h1>

            <p className="landing-description">
              Browse available products, check stock, place orders,
              and keep track of everything from one centralized
              inventory platform.
            </p>

            <div className="landing-actions">
              <Link to="/login" className="primary-button">
                Get started
                <ArrowRight size={17} />
              </Link>

              <Link to="/register" className="secondary-button">
                Create account
              </Link>
            </div>
          </div>

          <div className="landing-visual">
            <div className="landing-card">
              <div className="landing-card-icon">
                <Package size={25} />
              </div>

              <span>Inventory</span>
              <strong>Available & organized</strong>
            </div>

            <div className="landing-card landing-card-offset">
              <div className="landing-card-icon">
                <ShoppingCart size={25} />
              </div>

              <span>Orders</span>
              <strong>Track your requests</strong>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="landing-section">
          <p className="landing-eyebrow">HOW IT WORKS</p>
          <h2>Simple from start to finish.</h2>

          <div className="landing-steps">
            <div>
              <Search />
              <span>01</span>
              <h3>Browse</h3>
              <p>Find products and check their availability.</p>
            </div>

            <div>
              <ShoppingCart />
              <span>02</span>
              <h3>Order</h3>
              <p>Select what you need and submit your order.</p>
            </div>

            <div>
              <Package />
              <span>03</span>
              <h3>Track</h3>
              <p>Follow the status of your orders from your account.</p>
            </div>
          </div>
        </section>

        <section id="features" className="landing-section landing-section-muted">
          <p className="landing-eyebrow">BUILT FOR USERS</p>
          <h2>A better inventory experience.</h2>

          <p className="landing-section-description">
            The customer portal provides a simple way to discover
            inventory and manage orders, while the administrative
            workspace provides the tools needed to manage the system.
          </p>
        </section>
      </main>

      <footer className="public-footer">
        <span>Inventory Management System</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}

export default Landing;