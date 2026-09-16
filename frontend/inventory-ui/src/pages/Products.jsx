import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Package,
  X,
  Minus,
  Plus,
  CheckCircle2,
} from "lucide-react";

import { getProducts, createOrder } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

function Products() {
  const { name, username, token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [quantity, setQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const displayName = name || username || "Customer";

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data || []);
      } catch (err) {
        setError(
          err.message || "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    return (
      product.name?.toLowerCase().includes(search) ||
      product.sku?.toLowerCase().includes(search) ||
      product.description
        ?.toLowerCase()
        .includes(search)
    );
  });

  const openRequestModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setOrderError("");
    setOrderSuccess(false);
  };

  const closeRequestModal = () => {
    if (ordering) {
      return;
    }

    setSelectedProduct(null);
    setQuantity(1);
    setOrderError("");
    setOrderSuccess(false);
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    if (!selectedProduct) {
      return;
    }

    setQuantity((current) =>
      Math.min(
        selectedProduct.stockQuantity,
        current + 1
      )
    );
  };

  const handleCreateOrder = async () => {
    if (!selectedProduct || !token) {
      return;
    }

    try {
      setOrdering(true);
      setOrderError("");

      await createOrder(
        [
          {
            productId: selectedProduct.id,
            quantity,
          },
        ],
        token
      );

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === selectedProduct.id
            ? {
                ...product,
                stockQuantity:
                  product.stockQuantity - quantity,
              }
            : product
        )
      );

      setOrderSuccess(true);
    } catch (err) {
      setOrderError(
        err.message ||
          "Failed to submit the product request."
      );
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="customer-page">
      <Header />

      <main className="customer-content products-page">
        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <section className="products-hero">
          <div>
            <p className="landing-eyebrow">
              PRODUCT CATALOG
            </p>

            <h1>Available Products</h1>

            <p>
              Browse the available inventory and find the
              products you need.
            </p>
          </div>

          <div className="products-count">
            <Package size={20} />

            <div>
              <strong>{products.length}</strong>
              <span>Products available</span>
            </div>
          </div>
        </section>

        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="products-toolbar">
          <div className="product-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search products, SKU or description..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>
        </section>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="products-message">
            <Package size={30} />

            <h3>Loading products...</h3>

            <p>
              Please wait while we fetch the latest
              inventory.
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="products-message products-error">
            <h3>Unable to load products</h3>

            <p>{error}</p>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="products-message">
              <Search size={30} />

              <h3>
                {searchTerm
                  ? "No products found"
                  : "No products available"}
              </h3>

              <p>
                {searchTerm
                  ? "Try searching with a different product name or SKU."
                  : "There are currently no active products in the catalog."}
              </p>
            </div>
          )}

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <section className="products-grid">
              {filteredProducts.map((product) => {
                const inStock =
                  product.stockQuantity > 0;

                return (
                  <article
                    key={product.id}
                    className="product-card"
                  >
                    <div className="product-image-container">
                      {product.imageUrl ? (
                        <img
                          src={`http://localhost:5272${product.imageUrl}`}
                          alt={product.name}
                          className="product-image"
                        />
                      ) : (
                        <div className="product-image-placeholder">
                          <Package size={42} />
                          <span>No image</span>
                        </div>
                      )}

                      <span
                        className={`product-stock-badge ${
                          inStock
                            ? "stock-available"
                            : "stock-unavailable"
                        }`}
                      >
                        {inStock
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </div>

                    <div className="product-card-content">
                      <p className="product-sku">
                        {product.sku}
                      </p>

                      <h2>{product.name}</h2>

                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-card-footer">
                        <div className="product-price">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString("en-IN")}
                        </div>

                        <div
                          className={`product-stock ${
                            inStock
                              ? "stock-text"
                              : "stock-text-out"
                          }`}
                        >
                          {inStock
                            ? `${product.stockQuantity} available`
                            : "Currently unavailable"}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="product-order-button"
                        disabled={!inStock}
                        onClick={() =>
                          openRequestModal(product)
                        }
                      >
                        <ShoppingBag size={17} />

                        {inStock
                          ? "Request Product"
                          : "Out of Stock"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
      </main>

      {/* ===================================================
          REQUEST PRODUCT MODAL
      =================================================== */}

      {selectedProduct && (
        <div
          className="request-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeRequestModal();
            }
          }}
        >
          <div className="request-modal">
            {!orderSuccess ? (
              <>
                <div className="request-modal-header">
                  <div>
                    <p className="landing-eyebrow">
                      PRODUCT REQUEST
                    </p>

                    <h2>
                      Request this product
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="request-modal-close"
                    onClick={closeRequestModal}
                    disabled={ordering}
                    aria-label="Close"
                  >
                    <X size={19} />
                  </button>
                </div>

                <div className="request-product-summary">
                  <div className="request-product-image">
                    {selectedProduct.imageUrl ? (
                      <img
                        src={`http://localhost:5272${selectedProduct.imageUrl}`}
                        alt={selectedProduct.name}
                      />
                    ) : (
                      <Package size={30} />
                    )}
                  </div>

                  <div>
                    <p>
                      {selectedProduct.sku}
                    </p>

                    <h3>
                      {selectedProduct.name}
                    </h3>

                    <strong>
                      ₹
                      {Number(
                        selectedProduct.price
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="request-quantity-section">
                  <div>
                    <span>Quantity</span>

                    <small>
                      {selectedProduct.stockQuantity} available
                    </small>
                  </div>

                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={
                        ordering || quantity <= 1
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={
                        ordering ||
                        quantity >=
                          selectedProduct.stockQuantity
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="request-total">
                  <span>Total value</span>

                  <strong>
                    ₹
                    {Number(
                      selectedProduct.price * quantity
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                {orderError && (
                  <div className="request-error">
                    {orderError}
                  </div>
                )}

                <div className="request-modal-actions">
                  <button
                    type="button"
                    className="request-cancel-button"
                    onClick={closeRequestModal}
                    disabled={ordering}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="request-confirm-button"
                    onClick={handleCreateOrder}
                    disabled={ordering}
                  >
                    <ShoppingBag size={17} />

                    {ordering
                      ? "Submitting..."
                      : "Submit Request"}
                  </button>
                </div>
              </>
            ) : (
              <div className="request-success">
                <div className="request-success-icon">
                  <CheckCircle2 size={38} />
                </div>

                <p className="landing-eyebrow">
                  REQUEST SUBMITTED
                </p>

                <h2>
                  Product request submitted
                </h2>

                <p>
                  Your request has been submitted and is
                  now waiting for manager approval.
                </p>

                <div className="request-success-actions">
                  <Link
                    to="/orders"
                    className="request-view-orders"
                  >
                    View my orders
                  </Link>

                  <button
                    type="button"
                    className="request-continue-button"
                    onClick={closeRequestModal}
                  >
                    Continue browsing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;