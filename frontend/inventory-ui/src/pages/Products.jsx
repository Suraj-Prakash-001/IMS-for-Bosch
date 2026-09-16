import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Package } from "lucide-react";

import { getProducts } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Products() {
  const { name, username, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
      product.description?.toLowerCase().includes(search)
    );
  });

  const displayName = name || username || "Customer";

  return (
    <div className="customer-page">
      {/* =========================
          CUSTOMER HEADER
      ========================== */}

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
          <Link to="/home">Home</Link>

          <Link
            to="/products"
            className="customer-nav-active"
          >
            Products
          </Link>

          <Link to="/orders">My Orders</Link>

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

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="customer-content products-page">

        {/* PAGE INTRO */}

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

        {/* SEARCH */}

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

        {/* LOADING */}

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

        {/* ERROR */}

        {!loading && error && (
          <div className="products-message products-error">
            <h3>Unable to load products</h3>

            <p>{error}</p>
          </div>
        )}

        {/* EMPTY */}

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

        {/* PRODUCTS */}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <section className="products-grid">
              {filteredProducts.map((product) => {
                const inStock = product.stockQuantity > 0;

                return (
                  <article
                    key={product.id}
                    className="product-card"
                  >
                    {/* IMAGE */}

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

                    {/* DETAILS */}

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
    </div>
  );
}

export default Products;