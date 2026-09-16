import { useEffect, useState } from "react";
import { getProducts } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PRODUCT CATALOG</p>
            <h2>Products</h2>
            <p>Loading available products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PRODUCT CATALOG</p>
            <h2>Products</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PRODUCT CATALOG</p>
          <h2>Products</h2>
          <p>
            Browse available products and check their
            current stock.
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h3>No products available</h3>
          <p>
            There are currently no active products in the
            catalog.
          </p>
        </div>
      ) : (
        <div className="location-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="location-card"
            >
              {product.imageUrl && (
                <img
                  src={`http://localhost:5272${product.imageUrl}`}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "16px",
                  }}
                />
              )}

              <p className="eyebrow">
                {product.sku}
              </p>

              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <div style={{ marginTop: "16px" }}>
                <strong>
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>
              </div>

              <div style={{ marginTop: "8px" }}>
                {product.stockQuantity > 0 ? (
                  <span>
                    {product.stockQuantity} in stock
                  </span>
                ) : (
                  <span>Out of stock</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;