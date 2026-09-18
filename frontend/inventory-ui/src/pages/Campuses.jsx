import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createLocation,
  getLocations,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function Campuses() {
  const { token } = useAuth();

  const [campuses, setCampuses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
    description: "",
  });

  // =====================================================
  // LOAD CAMPUSES
  // =====================================================

  async function loadCampuses() {
    try {
      setLoading(true);
      setError("");

      const data = await getLocations(token);

      setCampuses(data ?? []);
    } catch (err) {
      setError(
        err.message || "Unable to load campuses."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadCampuses();
    } else {
      setLoading(false);
      setError("Admin authentication is required.");
    }
  }, [token]);

  // =====================================================
  // FORM HANDLING
  // =====================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm({
      name: "",
      code: "",
      address: "",
      description: "",
    });
  }

  // =====================================================
  // CREATE CAMPUS
  // =====================================================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createLocation(
        {
          name: form.name.trim(),
          code: form.code.trim(),
          address: form.address.trim(),
          description: form.description.trim(),
        },
        token
      );

      setSuccess("Campus created successfully.");

      resetForm();
      setShowForm(false);

      await loadCampuses();
    } catch (err) {
      setError(
        err.message || "Unable to create campus."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              PHYSICAL LOCATIONS
            </p>

            <h2>Campuses</h2>

            <p>Loading campuses...</p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-heading">
        <div>
          <p className="eyebrow">
            PHYSICAL LOCATIONS
          </p>

          <h2>Campuses</h2>

          <p>
            Manage company campuses and explore their
            buildings and floors.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            setShowForm((current) => !current);
            setError("");
            setSuccess("");
          }}
        >
          {showForm ? "Cancel" : "+ Add Campus"}
        </button>
      </div>

      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (
        <div className="location-alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="location-alert success">
          {success}
        </div>
      )}

      {/* =================================================
          CREATE CAMPUS FORM
      ================================================= */}

      {showForm && (
        <div className="location-form-card">
          <div className="location-form-header">
            <div>
              <p className="eyebrow">
                NEW LOCATION
              </p>

              <h3>Add Campus</h3>

              <p>
                Enter the basic information for the new
                company campus.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="location-form-grid">

              {/* NAME */}

              <div className="location-form-field">
                <label htmlFor="campus-name">
                  Campus Name
                </label>

                <input
                  id="campus-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore Campus"
                  required
                />
              </div>

              {/* CODE */}

              <div className="location-form-field">
                <label htmlFor="campus-code">
                  Campus Code
                </label>

                <input
                  id="campus-code"
                  name="code"
                  type="text"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="e.g. BLR"
                  required
                />
              </div>

              {/* ADDRESS */}

              <div className="location-form-field full-width">
                <label htmlFor="campus-address">
                  Address
                </label>

                <input
                  id="campus-address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. Bosch Bangalore Campus"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="location-form-field full-width">
                <label htmlFor="campus-description">
                  Description
                </label>

                <textarea
                  id="campus-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Optional description of the campus"
                  rows="4"
                />
              </div>

            </div>

            <div className="location-form-actions">
              <button
                type="button"
                className="location-cancel-button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                  setError("");
                }}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="location-submit-button"
                disabled={saving}
              >
                {saving
                  ? "Creating..."
                  : "Create Campus"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================
          CAMPUS LIST
      ================================================= */}

      {campuses.length === 0 ? (
        <div className="location-empty">
          <h3>No campuses found</h3>

          <p>
            Create your first campus using the
            <strong> + Add Campus </strong>
            button above.
          </p>
        </div>
      ) : (
        <div className="location-grid">
          {campuses.map((campus) => (
            <Link
              key={campus.id}
              to={`/campuses/${campus.id}`}
              className="location-card"
            >
              <div className="location-card-icon">
                {campus.code
                  ?.charAt(0)
                  ?.toUpperCase() || "L"}
              </div>

              <div className="location-card-content">
                <h3>{campus.name}</h3>

                <p>
                  {campus.code}
                </p>

                <div className="location-card-meta">
                  <span>
                    View buildings
                  </span>

                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Campuses;