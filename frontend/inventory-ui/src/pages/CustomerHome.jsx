import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Clock,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

function CustomerHome() {
  const { name, username } = useAuth();

  const displayName = name || username || "Customer";

  return (
    <div className="customer-page">
      <Header />

      <main className="customer-content home-page">
        {/* =================================================
            WELCOME SECTION
        ================================================= */}

        <section className="home-hero">
          <div className="home-hero-content">
            <p className="landing-eyebrow">
              CUSTOMER PORTAL
            </p>

            <h1>
              Welcome, {displayName}.
            </h1>

            <p>
              Manage your product requests, browse available
              inventory, and keep track of your orders from
              one place.
            </p>

            <div className="home-hero-actions">
              <Link
                to="/products"
                className="primary-button"
              >
                Browse products
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/orders"
                className="home-secondary-button"
              >
                View my orders
              </Link>
            </div>
          </div>

          <div className="home-hero-summary">
            <div className="home-summary-icon">
              <Package size={22} />
            </div>

            <div>
              <span>INVENTORY PORTAL</span>
              <strong>Product access</strong>
              <p>
                Browse the current product catalog and
                request available items.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="home-section">
          <div className="home-section-heading">
            <div>
              <p className="landing-eyebrow">
                QUICK ACCESS
              </p>

              <h2>
                Manage your requests
              </h2>
            </div>
          </div>

          <div className="home-actions-grid">
            <Link
              to="/products"
              className="home-action-card"
            >
              <div className="home-action-icon">
                <Package size={22} />
              </div>

              <div className="home-action-content">
                <h3>
                  Browse products
                </h3>

                <p>
                  Explore the available inventory and check
                  product availability.
                </p>
              </div>

              <ArrowRight
                className="home-action-arrow"
                size={18}
              />
            </Link>

            <Link
              to="/orders"
              className="home-action-card"
            >
              <div className="home-action-icon">
                <ShoppingBag size={22} />
              </div>

              <div className="home-action-content">
                <h3>
                  My orders
                </h3>

                <p>
                  View your submitted requests and track
                  their current status.
                </p>
              </div>

              <ArrowRight
                className="home-action-arrow"
                size={18}
              />
            </Link>

            <div className="home-action-card home-action-disabled">
              <div className="home-action-icon">
                <Clock size={22} />
              </div>

              <div className="home-action-content">
                <h3>
                  Track requests
                </h3>

                <p>
                  Monitor the progress of your requests
                  through the approval process.
                </p>
              </div>

              <span className="home-coming-soon">
                Coming soon
              </span>
            </div>
          </div>
        </section>

        {/* =================================================
            INFORMATION PANEL
        ================================================= */}

        <section className="home-info-panel">
          <div>
            <p className="landing-eyebrow">
              HOW IT WORKS
            </p>

            <h2>
              Request products through the inventory portal.
            </h2>
          </div>

          <div className="home-info-steps">
            <div className="home-info-step">
              <span>01</span>

              <div>
                <strong>
                  Browse
                </strong>

                <p>
                  Find the product you need from the
                  available catalog.
                </p>
              </div>
            </div>

            <div className="home-info-step">
              <span>02</span>

              <div>
                <strong>
                  Request
                </strong>

                <p>
                  Submit a request for an available
                  product.
                </p>
              </div>
            </div>

            <div className="home-info-step">
              <span>03</span>

              <div>
                <strong>
                  Track
                </strong>

                <p>
                  Follow the progress of your request
                  through the system.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CustomerHome;