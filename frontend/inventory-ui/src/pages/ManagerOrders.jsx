import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  approveManagerOrder,
  getManagerPendingOrders,
  rejectManagerOrder,
} from "../services/api";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ManagerOrders() {
  const navigate = useNavigate();

  const {
    token,
    name,
    username,
    departmentId,
    logout,
  } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [processingId, setProcessingId] = useState("");

  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectionComment, setRejectionComment] = useState("");

  const displayName =
    name || username || "Manager";

  const loadOrders = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data =
        await getManagerPendingOrders(token);

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load pending orders."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleApprove = async (orderId) => {
    setProcessingId(orderId);
    setActionError("");

    try {
      await approveManagerOrder(
        orderId,
        token
      );

      setOrders((current) =>
        current.filter(
          (order) =>
            order.id !== orderId
        )
      );
    } catch (err) {
      setActionError(
        err.message ||
          "Unable to approve the order."
      );
    } finally {
      setProcessingId("");
    }
  };

  const openRejectModal = (order) => {
    setActionError("");
    setRejectionComment("");
    setRejectingOrder(order);
  };

  const closeRejectModal = () => {
    if (processingId) {
      return;
    }

    setRejectingOrder(null);
    setRejectionComment("");
  };

  const handleReject = async (event) => {
    event.preventDefault();

    const comment =
      rejectionComment.trim();

    if (
      !comment ||
      !rejectingOrder
    ) {
      return;
    }

    setProcessingId(
      rejectingOrder.id
    );

    setActionError("");

    try {
      await rejectManagerOrder(
        rejectingOrder.id,
        comment,
        token
      );

      setOrders((current) =>
        current.filter(
          (order) =>
            order.id !==
            rejectingOrder.id
        )
      );

      setRejectingOrder(null);
      setRejectionComment("");
    } catch (err) {
      setActionError(
        err.message ||
          "Unable to reject the order."
      );
    } finally {
      setProcessingId("");
    }
  };

  return (
    <div className="manager-page">

      {/* =========================
          HEADER
      ========================== */}

      <header className="manager-header">

        <button
          type="button"
          className="manager-brand"
          onClick={() =>
            navigate("/manager")
          }
        >
          <img
            src="/bosch-emblem.png"
            alt="Bosch emblem"
            className="manager-brand-emblem"
          />

          <span>BOSCH</span>
        </button>

        <div className="manager-header-right">

          <div className="manager-profile">

            <div className="manager-avatar">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {displayName}
              </strong>

              <small>
                Manager
              </small>
            </div>

          </div>

          <button
            type="button"
            className="manager-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="manager-content">

        <section className="manager-heading">

          <div>

            <p className="manager-eyebrow">
              MANAGER WORKSPACE
            </p>

            <h1>
              Order Approvals
            </h1>

            <p>
              Review purchase requests
              from your department before
              they move to admin processing.
            </p>

          </div>

          <div className="manager-department">

            <span>
              DEPARTMENT
            </span>

            <strong>
              {departmentId ||
                "Not assigned"}
            </strong>

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="manager-alert manager-alert-error">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={loadOrders}
            >
              Retry
            </button>

          </div>
        )}

        {actionError && (
          <div className="manager-alert manager-alert-error">
            {actionError}
          </div>
        )}

        {/* =========================
            SUMMARY
        ========================== */}

        <section className="manager-summary">

          <div>

            <span>
              Pending approvals
            </span>

            <strong>
              {orders.length}
            </strong>

          </div>

          <button
            type="button"
            className="manager-refresh"
            onClick={loadOrders}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </section>

        {/* =========================
            LOADING
        ========================== */}

        {loading && (
          <div className="manager-empty-state">

            <div className="manager-spinner" />

            <h2>
              Loading pending orders
            </h2>

            <p>
              Checking for orders awaiting
              your approval.
            </p>

          </div>
        )}

        {/* =========================
            EMPTY
        ========================== */}

        {!loading &&
          orders.length === 0 && (
            <div className="manager-empty-state">

              <div className="manager-empty-icon">
                ✓
              </div>

              <h2>
                No pending approvals
              </h2>

              <p>
                There are currently no
                orders waiting for approval
                in your department.
              </p>

            </div>
          )}

        {/* =========================
            ORDERS
        ========================== */}

        {!loading &&
          orders.length > 0 && (
            <div className="manager-order-list">

              {orders.map((order) => (

                <article
                  className="manager-order-card"
                  key={order.id}
                >

                  {/* ORDER HEADER */}

                  <div className="manager-order-top">

                    <div>

                      <span className="manager-order-label">
                        ORDER
                      </span>

                      <h2>
                        #{order.id}
                      </h2>

                      <p>
                        Requested by{" "}
                        <strong>
                          {order.customerName}
                        </strong>
                      </p>

                    </div>

                    <div className="manager-status-badge">
                      Pending Manager Approval
                    </div>

                  </div>

                  {/* ORDER INFORMATION */}

                  <div className="manager-order-meta">

                    <div>

                      <span>
                        Requested
                      </span>

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Department
                      </span>

                      <strong>
                        {order.departmentId}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Total
                      </span>

                      <strong>
                        {formatCurrency(
                          order.totalAmount
                        )}
                      </strong>

                    </div>

                  </div>

                  {/* PRODUCTS */}

                  <div className="manager-items">

                    <div className="manager-items-heading">

                      <span>
                        PRODUCT
                      </span>

                      <span>
                        QTY
                      </span>

                      <span>
                        SUBTOTAL
                      </span>

                    </div>

                    {(order.items || [])
                      .map((item) => (

                        <div
                          className="manager-item"
                          key={
                            item.productId
                          }
                        >

                          <div>

                            <strong>
                              {item.productName}
                            </strong>

                            <small>
                              {item.productId}
                            </small>

                          </div>

                          <span>
                            {item.quantity}
                          </span>

                          <strong>
                            {formatCurrency(
                              item.subtotal
                            )}
                          </strong>

                        </div>

                      ))}

                  </div>

                  {/* ACTIONS */}

                  <div className="manager-order-actions">

                    <button
                      type="button"
                      className="manager-reject-button"
                      onClick={() =>
                        openRejectModal(
                          order
                        )
                      }
                      disabled={
                        Boolean(
                          processingId
                        )
                      }
                    >
                      Reject
                    </button>

                    <button
                      type="button"
                      className="manager-approve-button"
                      onClick={() =>
                        handleApprove(
                          order.id
                        )
                      }
                      disabled={
                        Boolean(
                          processingId
                        )
                      }
                    >
                      {processingId ===
                      order.id
                        ? "Approving..."
                        : "Approve Order"}
                    </button>

                  </div>

                </article>

              ))}

            </div>
          )}

      </main>

      {/* =========================
          REJECTION MODAL
      ========================== */}

      {rejectingOrder && (

        <div
          className="manager-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeRejectModal();
            }

          }}
        >

          <form
            className="manager-modal"
            onSubmit={handleReject}
          >

            <div className="manager-modal-header">

              <div>

                <p className="manager-eyebrow">
                  REJECT ORDER
                </p>

                <h2>
                  Reject #
                  {rejectingOrder.id}
                </h2>

              </div>

              <button
                type="button"
                className="manager-modal-close"
                onClick={
                  closeRejectModal
                }
                disabled={
                  Boolean(
                    processingId
                  )
                }
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <p className="manager-modal-description">
              Provide a reason for
              rejecting this order. The
              comment will be stored with
              the order and visible to the
              customer.
            </p>

            <label className="manager-comment-label">

              Rejection reason

              <textarea
                value={
                  rejectionComment
                }
                onChange={(event) =>
                  setRejectionComment(
                    event.target.value
                  )
                }
                placeholder="Enter the reason for rejection..."
                rows={5}
                maxLength={500}
                required
                autoFocus
              />

              <small>
                {rejectionComment.length}
                /500
              </small>

            </label>

            <div className="manager-modal-actions">

              <button
                type="button"
                className="manager-cancel-button"
                onClick={
                  closeRejectModal
                }
                disabled={
                  Boolean(
                    processingId
                  )
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="manager-confirm-reject"
                disabled={
                  Boolean(
                    processingId
                  ) ||
                  !rejectionComment.trim()
                }
              >
                {processingId ===
                rejectingOrder.id
                  ? "Rejecting..."
                  : "Reject Order"}
              </button>

            </div>

          </form>

        </div>

      )}

    </div>
  );
}

export default ManagerOrders; 