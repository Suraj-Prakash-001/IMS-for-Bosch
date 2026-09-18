import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminAddProduct() {
  const navigate = useNavigate();
  const { token } = useAuth();  

    const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    categoryId: "",
    description: "",
    price: "",
    stockQuantity: "",
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

    useEffect(() => {
  const loadCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError("");

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
          data?.message ||
            "Unable to load categories."
        );
      }

      setCategories(data);
    } catch (err) {
      setCategoriesError(
        err.message ||
          "Unable to load categories."
      );
    } finally {
      setCategoriesLoading(false);
    }
  };

  loadCategories();
}, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

 const handleImageChange = (event) => {
  const file = event.target.files?.[0] || null;

  if (!file) {
    setImage(null);
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    setError(
      "Invalid image format. Please select a JPG, JPEG, PNG, or WEBP image."
    );

    event.target.value = "";
    setImage(null);
    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    setError("Image size must be 5 MB or less.");

    event.target.value = "";
    setImage(null);
    return;
  }

  setError("");
  setImage(file);
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.sku.trim()) {
      setError("SKU is required.");
      return;
    }

    if (!form.categoryId.trim()) {
      setError("Category ID is required.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      form.stockQuantity === "" ||
      Number(form.stockQuantity) < 0
    ) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    const formData = new FormData();

    formData.append("Name", form.name.trim());
    formData.append("Sku", form.sku.trim());
    formData.append("CategoryId", form.categoryId.trim());
    formData.append("Description", form.description.trim());
    formData.append("Price", form.price);
    formData.append("StockQuantity", form.stockQuantity);

    if (image) {
      formData.append("Image", image);
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5272/api/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create the product."
        );
      }

      setSuccess("Product created successfully.");

      setForm({
        name: "",
        sku: "",
        categoryId: "",
        description: "",
        price: "",
        stockQuantity: "",
      });

      setImage(null);

      const fileInput =
        document.getElementById("product-image");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while creating the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-product-page">

      <div className="admin-add-product-header">

        <div>
          <p className="admin-add-product-eyebrow">
            ADMIN WORKSPACE
          </p>

          <h1>Add Product</h1>

          <p>
            Create a new product and add it to
            the inventory catalog.
          </p>
        </div>

        <button
          type="button"
          className="admin-add-product-back"
          onClick={() => navigate("/admin/orders")}
        >
          Back
        </button>

      </div>

      {error && (
        <div className="admin-add-product-alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-add-product-alert success">
          {success}
        </div>
      )}

      <form
        className="admin-add-product-form"
        onSubmit={handleSubmit}
      >

        {/* PRODUCT INFORMATION */}

        <section className="admin-add-product-section">

          <div className="admin-add-product-section-title">
            <h2>Product Information</h2>

            <p>
              Enter the basic information for the
              product.
            </p>
          </div>

          <div className="admin-add-product-grid">

            {/* PRODUCT NAME */}

            <div className="admin-add-product-field">

              <label htmlFor="product-name">
                Product Name
              </label>

              <input
                id="product-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: Wireless Keyboard"
                required
              />

            </div>

            {/* SKU */}

            <div className="admin-add-product-field">

              <label htmlFor="product-sku">
                SKU
              </label>

              <input
                id="product-sku"
                name="sku"
                type="text"
                value={form.sku}
                onChange={handleChange}
                placeholder="Example: KB-WL-001"
                required
              />

            </div>

            {/* CATEGORY */}

            <div className="admin-add-product-field">

              <label htmlFor="product-category">
                Category ID
              </label>

              <input
                id="product-category"
                name="categoryId"
                type="text"
                value={form.categoryId}
                onChange={handleChange}
                placeholder="Enter category ID"
                required
              />

              <small>
                We will replace this with a category
                dropdown in the next step.
              </small>

            </div>

            {/* PRICE */}

            <div className="admin-add-product-field">

              <label htmlFor="product-price">
                Price
              </label>

              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Example: 2499.00"
                required
              />

            </div>

            {/* STOCK */}

            <div className="admin-add-product-field">

              <label htmlFor="product-stock">
                Stock Quantity
              </label>

              <input
                id="product-stock"
                name="stockQuantity"
                type="number"
                min="0"
                step="1"
                value={form.stockQuantity}
                onChange={handleChange}
                placeholder="Example: 50"
                required
              />

            </div>

          </div>

          {/* DESCRIPTION */}

         <div className="admin-add-product-field">
  <label htmlFor="product-category">
    Category
  </label>

  <select
    id="product-category"
    name="categoryId"
    value={form.categoryId}
    onChange={handleChange}
    required
    disabled={categoriesLoading}
  >
    <option value="">
      {categoriesLoading
        ? "Loading categories..."
        : "Select a category"}
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

  {categoriesError && (
    <small className="admin-add-product-category-error">
      {categoriesError}
    </small>
  )}

  {!categoriesLoading &&
    !categoriesError &&
    categories.length === 0 && (
      <small>
        No categories available. Create a
        category first.
      </small>
    )}
</div><div className="admin-add-product-field full-width">
  <label htmlFor="product-description">
    Description
  </label>

  <textarea
    id="product-description"
    name="description"
    value={form.description}
    onChange={handleChange}
    placeholder="Enter a description for the product..."
    rows={5}
  />
</div>

        </section>

        {/* IMAGE */}

        <section className="admin-add-product-section">

          <div className="admin-add-product-section-title">

            <h2>Product Image</h2>

            <p>
              Upload an optional product image.
            </p>

          </div>

          <div className="admin-add-product-image-field">

            <label htmlFor="product-image">
              Product Image
            </label>

            <input
              id="product-image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
            />

            <small>
              Supported formats: JPG, JPEG, PNG and
              WEBP. Maximum size: 5 MB.
            </small>

            {image && (
              <div className="admin-add-product-file-name">
                Selected file: {image.name}
              </div>
            )}

          </div>

        </section>

        {/* ACTIONS */}

        <div className="admin-add-product-actions">

          <button
            type="button"
            className="admin-add-product-cancel"
            onClick={() => navigate("/admin/orders")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-add-product-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Product..."
              : "Create Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminAddProduct;