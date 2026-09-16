import { useEffect, useState } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

import Header from "../components/Header";
import { getMyOrders } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders(token);

        setOrders(data || []);
      } catch (err) {
        setError(
          err.message || "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "order-status-completed";

      case "RejectedByManager":
        return "order-status-rejected";

      case "PendingManagerApproval":
      case "PendingAdminProcessing":
      case "InProgress":
        return "order-status-pending";

      default:
        return "order-status-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={15} />;

      case "RejectedByManager":
        return <XCircle size={15} />;

      default:
        return <Clock size={15} />;
    }
  };

  const formatStatus = (status) => {
  if (status === null || status === undefined) {
    return "Unknown";
  }

  const statusNames = {
  0: "Pending Manager Approval",
  1: "Pending Admin Processing",
  2: "Rejected By Manager",
  3: "In Progress",
  4: "Completed",
};

  if (typeof status === "number") {
    return statusNames[status] || `Status ${status}`;
  }

  return String(status)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ");
};

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="customer-page">
      <Header />

      <main className="customer-content orders-page">
        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <section className="orders-hero">
          <div>
            <p className="landing-eyebrow">
              ORDER MANAGEMENT
            </p>

            <h1>My Orders</h1>

            <p>
              View your product requests and keep track of
              their current approval and processing status.
            </p>
          </div>

          <div className="orders-count">
            <Package size={20} />

            <div>
              <strong>{orders.length}</strong>
              <span>Total orders</span>
            </div>
          </div>
        </section>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="orders-message">
            <Package size={30} />

            <h3>Loading your orders...</h3>

            <p>
              Please wait while we fetch your latest
              requests.
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="orders-message orders-error">
            <XCircle size={30} />

            <h3>Unable to load orders</h3>

            <p>{error}</p>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="orders-message">
              <ShoppingBagIcon />

              <h3>No orders yet</h3>

              <p>
                You haven't submitted any product requests
                yet.
              </p>
            </div>
          )}

        {/* =================================================
            ORDER LIST
        ================================================= */}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <section className="orders-list">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="order-card"
                >
                  <div className="order-card-header">
                    <div>
                      <p className="order-number-label">
                        ORDER
                      </p>

                      <h2>
                        #{order.id}
                      </h2>
                    </div>

                    <div
                      className={`order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}

                      <span>
                        {formatStatus(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-card-body">
                    <div className="order-detail">
                      <span>Submitted</span>

                      <strong>
                        {formatDate(order.createdAt)}
                      </strong>
                    </div>

                    <div className="order-detail">
                      <span>Department</span>

                      <strong>
                        {order.departmentId || "—"}
                      </strong>
                    </div>

                    <div className="order-detail">
                      <span>Items</span>

                      <strong>
                        {order.items?.length || 0}
                      </strong>
                    </div>
                  </div>

                  {order.items?.length > 0 && (
                    <div className="order-items">
                      <div className="order-items-heading">
                        <span>
                          Requested products
                        </span>
                      </div>

                      {order.items.map((item, index) => (
                        <div
                          key={
                            item.productId ||
                            `${order.id}-${index}`
                          }
                          className="order-item"
                        >
                          <div className="order-item-icon">
                            <Package size={17} />
                          </div>

                          <div className="order-item-info">
                            <strong>
                              {item.productName ||
                                item.name ||
                                "Product"}
                            </strong>

                            <span>
                              Quantity:{" "}
                              {item.quantity || 1}
                            </span>
                          </div>

                          <ArrowRight
                            size={16}
                            className="order-item-arrow"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {order.rejectionComment && (
                    <div className="order-rejection">
                      <strong>
                        Rejection reason
                      </strong>

                      <p>
                        {order.rejectionComment}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}
      </main>
    </div>
  );
}

function ShoppingBagIcon() {
  return (
    <div className="orders-empty-icon">
      <Package size={30} />
    </div>
  );
}

export default Orders;