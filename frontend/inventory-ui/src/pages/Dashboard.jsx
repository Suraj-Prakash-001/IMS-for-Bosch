import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboard(token);

        if (!cancelled) {
          setDashboard(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load dashboard data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (token) {
      loadDashboard();
    } else {
      setLoading(false);
      setError("Admin authentication is required.");
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="dashboard">
        <section className="welcome-section">
          <div>
            <p className="eyebrow">COMPANY INVENTORY</p>
            <h2>Loading dashboard...</h2>
            <p className="welcome-text">
              Fetching the latest inventory and order information.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <section className="welcome-section">
          <div>
            <p className="eyebrow">COMPANY INVENTORY</p>
            <h2>Dashboard unavailable</h2>
            <p className="welcome-text">{error}</p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </section>
      </div>
    );
  }

  const products = dashboard?.products ?? {};
  const orders = dashboard?.orders ?? {};
  const locations = dashboard?.locations ?? {};
  const campuses = locations.campuses ?? [];

  return (
    <div className="dashboard">
      <section className="welcome-section">
        <div>
          <p className="eyebrow">COMPANY INVENTORY</p>

          <h2>Welcome back, Administrator.</h2>

          <p className="welcome-text">
            Monitor your company's physical spaces and inventory from a
            single workspace.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() => navigate("/admin/products/new")}
        >
          + Add Product
        </button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Locations</span>
          <strong>{locations.total ?? 0}</strong>
          <span className="stat-description">
            Active company locations
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Buildings</span>
          <strong>{locations.buildings ?? 0}</strong>
          <span className="stat-description">
            Across all locations
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Floors</span>
          <strong>{locations.floors ?? 0}</strong>
          <span className="stat-description">
            Mapped floors
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Products</span>
          <strong>{products.total ?? 0}</strong>
          <span className="stat-description">
            Active catalog products
          </span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">LOCATION</span>
              <h3>Campus Overview</h3>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={() => navigate("/campuses")}
            >
              View all →
            </button>
          </div>

          <div className="campus-list">
            {campuses.length === 0 ? (
              <div className="location-info">
                <strong>No locations found</strong>
                <span>Add a location to see it here.</span>
              </div>
            ) : (
              campuses.map((campus) => (
                <div className="campus-item" key={campus.id}>
                  <div className="location-icon">
                    {campus.name?.charAt(0)?.toUpperCase() || "L"}
                  </div>

                  <div className="location-info">
                    <strong>{campus.name}</strong>
                    <span>
                      {campus.buildingCount} buildings · {campus.floorCount} floors
                    </span>
                  </div>

                  <span className="status-badge success">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">ORDERS</span>
              <h3>Order Status</h3>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={() => navigate("/admin/orders")}
            >
              View all →
            </button>
          </div>

          <div className="inventory-status">
            <div className="status-row">
              <span>
                <i className="dot available"></i>
                Pending Manager Approval
              </span>
              <strong>{orders.pendingManagerApproval ?? 0}</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="dot storage"></i>
                Pending Admin Processing
              </span>
              <strong>{orders.pendingAdminProcessing ?? 0}</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="dot occupied"></i>
                In Progress
              </span>
              <strong>{orders.inProgress ?? 0}</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="dot maintenance"></i>
                Completed
              </span>
              <strong>{orders.completed ?? 0}</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="dot storage"></i>
                Rejected
              </span>
              <strong>{orders.rejected ?? 0}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">INVENTORY</span>
              <h3>Inventory Summary</h3>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={() => navigate("/inventory")}
            >
              Open inventory →
            </button>
          </div>

          <div className="inventory-status">
            <div className="status-row">
              <span>
                <i className="dot available"></i>
                Active Products
              </span>
              <strong>{products.total ?? 0}</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="dot maintenance"></i>
                Low Stock
              </span>
              <strong>{products.lowStock ?? 0}</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="dot occupied"></i>
                Total Stock Units
              </span>
              <strong>{products.totalStockUnits ?? 0}</strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">ORDERS</span>
              <h3>Total Orders</h3>
            </div>
          </div>

          <div className="inventory-status">
            <div className="status-row">
              <span>
                <i className="dot available"></i>
                All Orders
              </span>
              <strong>{orders.total ?? 0}</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="dot maintenance"></i>
                Rejected
              </span>
              <strong>{orders.rejected ?? 0}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;