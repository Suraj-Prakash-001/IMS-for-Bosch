import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Inventory() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [editingProductId, setEditingProductId] = useState(null);
  const [stockValue, setStockValue] = useState("");
  const [updatingStock, setUpdatingStock] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [productsResponse, categoriesResponse] =
        await Promise.all([
          fetch("http://localhost:5272/api/products"),
          fetch("http://localhost:5272/api/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const productsData =
        await productsResponse.json().catch(() => []);

      const categoriesData =
        await categoriesResponse.json().catch(() => []);

      if (!productsResponse.ok) {
        throw new Error(
          productsData?.message ||
            "Unable to load products."
        );
      }

      if (!categoriesResponse.ok) {
        throw new Error(
          categoriesData?.message ||
            "Unable to load categories."
        );
      }

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const categoryMap = useMemo(() => {
    const map = {};

    categories.forEach((category) => {
      map[category.id] = category.name;
    });

    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchValue ||
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.sku
          ?.toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        !categoryFilter ||
        product.categoryId === categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [products, search, categoryFilter]);

  const startEditingStock = (product) => {
    setEditingProductId(product.id);
    setStockValue(
      String(product.stockQuantity ?? 0)
    );
    setError("");
  };

  const cancelEditingStock = () => {
    setEditingProductId(null);
    setStockValue("");
  };

  const updateStock = async (productId) => {
    const quantity = Number(stockValue);

    if (
      stockValue === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      setError(
        "Stock quantity must be a whole number greater than or equal to 0."
      );
      return;
    }

    setUpdatingStock(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5272/api/products/${productId}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity,
          }),
        }
      );

      const data =
        await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to update stock."
        );
      }

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                stockQuantity:
                  data.stockQuantity,
                updatedAt:
                  data.updatedAt,
              }
            : product
        )
      );

      cancelEditingStock();
    } catch (err) {
      setError(
        err.message ||
          "Unable to update stock."
      );
    } finally {
      setUpdatingStock(false);
    }
  };

  const getStockClass = (quantity) => {
    if (quantity === 0) {
      return "out-of-stock";
    }

    if (quantity <= 10) {
      return "low-stock";
    }

    return "in-stock";
  };

  return (
    <div className="inventory-page">

      {/* HEADER */}

      <div className="inventory-header">
        <div>
          <p className="inventory-eyebrow">
            ADMIN WORKSPACE
          </p>

          <h1>Inventory</h1>

          <p>
            View products and manage available
            stock.
          </p>
        </div>

        <div className="inventory-summary">
          <div className="inventory-summary-item">
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>

          <div className="inventory-summary-item">
            <span>Low Stock</span>
            <strong>
              {
                products.filter(
                  (product) =>
                    product.stockQuantity > 0 &&
                    product.stockQuantity <= 10
                ).length
              }
            </strong>
          </div>

          <div className="inventory-summary-item">
            <span>Out of Stock</span>
            <strong>
              {
                products.filter(
                  (product) =>
                    product.stockQuantity === 0
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="inventory-alert error">
          {error}
        </div>
      )}

      {/* FILTERS */}

      <div className="inventory-filters">

        <div className="inventory-search">
          <label htmlFor="inventory-search">
            Search
          </label>

          <input
            id="inventory-search"
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by product name or SKU..."
          />
        </div>

        <div className="inventory-category-filter">
          <label htmlFor="inventory-category">
            Category
          </label>

          <select
            id="inventory-category"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
          >
            <option value="">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* PRODUCT TABLE */}

      <section className="inventory-card">

        <div className="inventory-card-header">
          <div>
            <h2>Product Inventory</h2>

            <p>
              {filteredProducts.length} product
              {filteredProducts.length !== 1
                ? "s"
                : ""}{" "}
              displayed
            </p>
          </div>
        </div>

        {loading ? (
          <div className="inventory-empty">
            Loading inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="inventory-empty">
            No products found.
          </div>
        ) : (
          <div className="inventory-table-wrapper">

            <table className="inventory-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => (
                    <tr key={product.id}>

                      <td>
                        <div className="inventory-product">
                          {product.imageUrl ? (
                            <img
                              src={`http://localhost:5272${product.imageUrl}`}
                              alt={product.name}
                              className="inventory-product-image"
                            />
                          ) : (
                            <div className="inventory-product-placeholder">
                              —
                            </div>
                          )}

                          <div>
                            <strong>
                              {product.name}
                            </strong>

                            {product.description && (
                              <span>
                                {product.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="inventory-sku">
                          {product.sku}
                        </span>
                      </td>

                      <td>
                        {categoryMap[
                          product.categoryId
                        ] || "Unknown"}
                      </td>

                      <td>
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td>
                        {editingProductId ===
                        product.id ? (
                          <input
                            className="inventory-stock-input"
                            type="number"
                            min="0"
                            step="1"
                            value={stockValue}
                            onChange={(event) =>
                              setStockValue(
                                event.target.value
                              )
                            }
                          />
                        ) : (
                          <span
                            className={`inventory-stock ${getStockClass(
                              product.stockQuantity
                            )}`}
                          >
                            {product.stockQuantity}
                          </span>
                        )}
                      </td>

                      <td>
                        {editingProductId ===
                        product.id ? (
                          <div className="inventory-actions">

                            <button
                              type="button"
                              className="inventory-save-button"
                              onClick={() =>
                                updateStock(
                                  product.id
                                )
                              }
                              disabled={
                                updatingStock
                              }
                            >
                              {updatingStock
                                ? "Saving..."
                                : "Save"}
                            </button>

                            <button
                              type="button"
                              className="inventory-cancel-button"
                              onClick={
                                cancelEditingStock
                              }
                              disabled={
                                updatingStock
                              }
                            >
                              Cancel
                            </button>

                          </div>
                        ) : (
                          <button
                            type="button"
                            className="inventory-edit-button"
                            onClick={() =>
                              startEditingStock(
                                product
                              )
                            }
                          >
                            Edit Stock
                          </button>
                        )}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default Inventory;