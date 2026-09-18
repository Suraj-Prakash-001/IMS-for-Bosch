import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Package,
  RefreshCw,
  Search,
  User,
} from "lucide-react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // =========================================================
  // LOAD ORDERS
  // =========================================================

  const loadOrders = useCallback(
    async (isRefresh = false) => {
      if (!token) {
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const data = await getAllOrders(token);

        setOrders(data || []);
      } catch (err) {
        console.error(err);

        setError(
          err.message || "Failed to load orders."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setError("");

      await updateOrderStatus(
        orderId,
        status,
        token
      );

      await loadOrders();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to update order status."
      );
    }
  };

  // =========================================================
  // LOAD ORDERS ON PAGE LOAD
  // =========================================================

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    return (
      order.id?.toLowerCase().includes(search) ||
      order.customerId
        ?.toLowerCase()
        .includes(search) ||
      order.status
        ?.toString()
        .toLowerCase()
        .includes(search)
    );
  });

  // =========================================================
  // STATUS LABEL
  // =========================================================

  const getStatusLabel = (status) => {
    if (typeof status === "number") {
      switch (status) {
        case 0:
          return "Pending Manager Approval";

        case 1:
          return "Pending Admin Processing";

        case 2:
          return "Rejected By Manager";

        case 3:
          return "In Progress";

        case 4:
          return "Completed";

        default:
          return "Unknown";
      }
    }

    return status || "Unknown";
  };

  // =========================================================
  // STATUS CSS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    const label = getStatusLabel(status)
      .toLowerCase()
      .replaceAll(" ", "-");

    if (label.includes("rejected")) {
      return "admin-order-status rejected";
    }

    if (label.includes("completed")) {
      return "admin-order-status completed";
    }

    if (label.includes("progress")) {
      return "admin-order-status progress";
    }

    if (label.includes("pending")) {
      return "admin-order-status pending";
    }

    return "admin-order-status";
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="page admin-orders-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-orders-header">
        <div>
          <p className="eyebrow">
            ORDER MANAGEMENT
          </p>

          <h2>Orders</h2>

          <p className="admin-orders-subtitle">
            View and manage product requests submitted
            by employees.
          </p>
        </div>

        <button
          type="button"
          className="admin-orders-refresh"
          onClick={() => loadOrders(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "admin-orders-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="admin-orders-summary">

        {/* TOTAL ORDERS */}

        <div className="admin-orders-summary-card">
          <div className="admin-orders-summary-icon">
            <ClipboardList size={21} />
          </div>

          <div>
            <strong>
              {orders.length}
            </strong>

            <span>
              Total Orders
            </span>
          </div>
        </div>

        {/* PENDING ORDERS */}

        <div className="admin-orders-summary-card">
          <div className="admin-orders-summary-icon">
            <Package size={21} />
          </div>

          <div>
            <strong>
              {
                orders.filter(
                  (order) =>
                    getStatusLabel(order.status)
                      .toLowerCase()
                      .includes("pending")
                ).length
              }
            </strong>

            <span>
              Pending Orders
            </span>
          </div>
        </div>

        {/* CUSTOMERS */}

        <div className="admin-orders-summary-card">
          <div className="admin-orders-summary-icon">
            <User size={21} />
          </div>

          <div>
            <strong>
              {
                new Set(
                  orders
                    .map(
                      (order) =>
                        order.customerId
                    )
                    .filter(Boolean)
                ).size
              }
            </strong>

            <span>
              Customers
            </span>
          </div>
        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="admin-orders-toolbar">
        <div className="admin-orders-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by order ID, customer or status..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="admin-orders-message">
          <ClipboardList size={30} />

          <h3>
            Loading orders...
          </h3>

          <p>
            Please wait while we fetch the latest
            orders.
          </p>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="admin-orders-message admin-orders-error">
          <h3>
            Unable to load orders
          </h3>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadOrders()}
          >
            Try again
          </button>
        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        filteredOrders.length === 0 && (
          <div className="admin-orders-message">

            <ClipboardList size={30} />

            <h3>
              {searchTerm
                ? "No matching orders"
                : "No orders found"}
            </h3>

            <p>
              {searchTerm
                ? "Try a different search term."
                : "There are currently no orders in the system."}
            </p>

          </div>
        )}

      {/* =================================================
          ORDERS TABLE
      ================================================= */}

      {!loading &&
        !error &&
        filteredOrders.length > 0 && (

          <div className="admin-orders-table-wrapper">

            <table className="admin-orders-table">

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredOrders.map((order) => (

                  <tr key={order.id}>

                    {/* ORDER ID */}

                    <td>
                      <span className="admin-order-id">
                        {order.id}
                      </span>
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      <div className="admin-order-customer">

                        <div className="admin-order-customer-icon">
                          <User size={16} />
                        </div>

                        <span>
                          {order.customerId ||
                            "Unknown customer"}
                        </span>

                      </div>
                    </td>

                    {/* ITEMS */}

                    <td>
                      <div className="admin-order-items">
                        {order.items?.length || 0}{" "}
                        item
                        {order.items?.length === 1
                          ? ""
                          : "s"}
                      </div>
                    </td>

                    {/* TOTAL */}

                    <td>
                      <strong>
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={getStatusClass(
                          order.status
                        )}
                      >
                        {getStatusLabel(
                          order.status
                        )}
                      </span>
                    </td>

                    {/* CREATED */}

                    <td>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "—"}
                    </td>

                    {/* ACTIONS */}

                    <td>

                      {/* STATUS 1 → START PROCESSING */}

                      {Number(order.status) === 1 && (
                        <button
                          type="button"
                          className="admin-orders-action-btn"
                          onClick={() =>
                            handleStatusUpdate(
                              order.id,
                              3
                            )
                          }
                        >
                          Start Processing
                        </button>
                      )}

                      {/* STATUS 3 → COMPLETE */}

                      {Number(order.status) === 3 && (
                        <button
                          type="button"
                          className="admin-orders-action-btn"
                          onClick={() =>
                            handleStatusUpdate(
                              order.id,
                              4
                            )
                          }
                        >
                          Complete
                        </button>
                      )}

                      {/* STATUS 4 → COMPLETED */}

                      {Number(order.status) === 4 && (
                        <span className="admin-orders-completed">
                          Completed
                        </span>
                      )}

                      {/* STATUS 2 → REJECTED */}

                      {Number(order.status) === 2 && (
                        <span className="admin-orders-rejected">
                          Rejected
                        </span>
                      )}

                      {/* STATUS 0 → WAITING FOR MANAGER */}

                      {Number(order.status) === 0 && (
                        <span className="admin-orders-waiting">
                          Awaiting Manager
                        </span>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

    </div>
  );
}

export default AdminOrders;