import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  createSection,
  getSections,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function Sections() {
  const { floorId } = useParams();
  const location = useLocation();
  const { token } = useAuth();

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  async function loadSections() {
    try {
      setLoading(true);
      setError("");

      const data = await getSections(floorId, token);

      setSections(data ?? []);
    } catch (err) {
      setError(
        err.message || "Unable to load sections."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token && floorId) {
      loadSections();
    } else {
      setLoading(false);
      setError("Admin authentication is required.");
    }
  }, [token, floorId]);

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
      description: "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createSection(
        floorId,
        {
          name: form.name.trim(),
          code: form.code.trim(),
          description: form.description.trim(),
        },
        token
      );

      setSuccess("Section created successfully.");

      resetForm();
      setShowForm(false);

      await loadSections();
    } catch (err) {
      setError(
        err.message || "Unable to create section."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              PHYSICAL LOCATIONS
            </p>

            <h2>Loading...</h2>

            <p>
              Loading floor sections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            {location.state?.floorName || "FLOOR"}
          </p>

          <h2>Sections</h2>

          <p>
            Manage sections within this floor and
            explore their seats.
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
          {showForm ? "Cancel" : "+ Add Section"}
        </button>
      </div>

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

      {showForm && (
        <div className="location-form-card">
          <div className="location-form-header">
            <div>
              <p className="eyebrow">
                NEW SECTION
              </p>

              <h3>Add Section</h3>

              <p>
                Add a section to this floor.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="location-form-grid">
              <div className="location-form-field">
                <label htmlFor="section-name">
                  Section Name
                </label>

                <input
                  id="section-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Section A"
                  required
                />
              </div>

              <div className="location-form-field">
                <label htmlFor="section-code">
                  Section Code
                </label>

                <input
                  id="section-code"
                  name="code"
                  type="text"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="e.g. SEC-A"
                  required
                />
              </div>

              <div className="location-form-field full-width">
                <label htmlFor="section-description">
                  Description
                </label>

                <textarea
                  id="section-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Optional section description"
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
                  : "Create Section"}
              </button>
            </div>
          </form>
        </div>
      )}

      {sections.length === 0 ? (
        <div className="location-empty">
          <div className="building-icon">
            ▦
          </div>

          <h3>No sections found</h3>

          <p>
            Add the first section to this floor.
          </p>
        </div>
      ) : (
        <div className="location-grid">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={`/sections/${section.id}`}
              state={{
                floorName:
                  location.state?.floorName,
              }}
              className="location-card"
            >
              <div className="building-icon">
                ▦
              </div>

              <div className="location-card-content">
                <h3>{section.name}</h3>

                <p>{section.code}</p>

                <div className="location-card-meta">
                  <span>
                    View seats
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

export default Sections;