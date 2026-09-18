import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminCategories() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5272/api/categories",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to load categories."
        );
      }

      setCategories(data);
    } catch (err) {
      setError(
        err.message || "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCategories();
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch(
        "http://localhost:5272/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || null,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create category."
        );
      }

      setSuccess("Category created successfully.");

      setName("");
      setDescription("");

      await loadCategories();
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while creating the category."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="admin-categories-page">

      <div className="admin-categories-header">
        <div>
          <p className="admin-categories-eyebrow">
            ADMIN WORKSPACE
          </p>

          <h1>Categories</h1>

          <p>
            Create and manage product categories
            used by the inventory catalog.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-categories-alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-categories-alert success">
          {success}
        </div>
      )}

      <div className="admin-categories-layout">

        {/* CREATE CATEGORY */}

        <section className="admin-categories-card">

          <div className="admin-categories-card-title">
            <h2>Add Category</h2>

            <p>
              Create a new category for products.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="admin-categories-field">
              <label htmlFor="category-name">
                Category Name
              </label>

              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Example: Keyboard"
                required
              />
            </div>

            <div className="admin-categories-field">
              <label htmlFor="category-description">
                Description
              </label>

              <textarea
                id="category-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Enter a description for this category..."
                rows={5}
              />
            </div>

            <button
              type="submit"
              className="admin-categories-submit"
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Category"}
            </button>

          </form>

        </section>

        {/* CATEGORY LIST */}

        <section className="admin-categories-card">

          <div className="admin-categories-card-title">
            <h2>Existing Categories</h2>

            <p>
              Categories currently available in the
              catalog.
            </p>
          </div>

          {loading ? (
            <div className="admin-categories-empty">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="admin-categories-empty">
              No categories found.
            </div>
          ) : (
            <div className="admin-categories-list">

              {categories.map((category) => (
                <div
                  className="admin-category-item"
                  key={category.id}
                >
                  <div>
                    <h3>{category.name}</h3>

                    {category.description && (
                      <p>
                        {category.description}
                      </p>
                    )}
                  </div>

                  <span className="admin-category-id">
                    {category.id}
                  </span>
                </div>
              ))}

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default AdminCategories;