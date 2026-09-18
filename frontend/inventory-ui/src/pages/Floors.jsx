import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  createFloor,
  getFloors,
  getBuildings,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function Floors() {
  const { buildingId } = useParams();
  const location = useLocation();
  const { token } = useAuth();

  const [building, setBuilding] = useState(null);
  const [floors, setFloors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    floorNumber: "",
    code: "",
  });

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [floorData, buildings] = await Promise.all([
        getFloors(buildingId, token),
        getBuildings(location.state?.campusId || "", token),
      ]);

      setFloors(floorData ?? []);

      const currentBuilding = buildings?.find(
        (buildingItem) => buildingItem.id === buildingId
      );

      if (currentBuilding) {
        setBuilding(currentBuilding);
      }
    } catch (err) {
      /*
       * If the campus ID isn't available in navigation state,
       * we can still load the floors directly.
       */
      try {
        const floorData = await getFloors(buildingId, token);
        setFloors(floorData ?? []);
      } catch (floorError) {
        setError(
          floorError.message || "Unable to load building floors."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token && buildingId) {
      loadData();
    } else {
      setLoading(false);
      setError("Admin authentication is required.");
    }
  }, [token, buildingId]);

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
      floorNumber: "",
      code: "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createFloor(
        buildingId,
        {
          name: form.name.trim(),
          floorNumber: Number(form.floorNumber),
          code: form.code.trim(),
        },
        token
      );

      setSuccess("Floor created successfully.");

      resetForm();
      setShowForm(false);

      await loadData();
    } catch (err) {
      setError(err.message || "Unable to create floor.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PHYSICAL LOCATIONS</p>
            <h2>Loading...</h2>
            <p>Loading building floors.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">BUILDING FLOORS</p>

          <h2>
            {building?.name || "Building Floors"}
          </h2>

          <p>
            Manage floors within this building and explore
            their floor plans.
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
          {showForm ? "Cancel" : "+ Add Floor"}
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
              <p className="eyebrow">NEW FLOOR</p>

              <h3>Add Floor</h3>

              <p>
                Add a floor to{" "}
                <strong>
                  {building?.name || "this building"}
                </strong>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="location-form-grid">
              <div className="location-form-field">
                <label htmlFor="floor-name">
                  Floor Name
                </label>

                <input
                  id="floor-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Ground Floor"
                  required
                />
              </div>

              <div className="location-form-field">
                <label htmlFor="floor-number">
                  Floor Number
                </label>

                <input
                  id="floor-number"
                  name="floorNumber"
                  type="number"
                  value={form.floorNumber}
                  onChange={handleChange}
                  placeholder="e.g. 0"
                  required
                />
              </div>

              <div className="location-form-field">
                <label htmlFor="floor-code">
                  Floor Code
                </label>

                <input
                  id="floor-code"
                  name="code"
                  type="text"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="e.g. GF"
                  required
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
                {saving ? "Creating..." : "Create Floor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {floors.length === 0 ? (
        <div className="location-empty">
          <div className="building-icon">▥</div>

          <h3>No floors found</h3>

          <p>
            Add the first floor to{" "}
            <strong>
              {building?.name || "this building"}
            </strong>.
          </p>
        </div>
      ) : (
        <div className="floor-list">
          {floors
            .slice()
            .sort(
              (a, b) =>
                a.floorNumber - b.floorNumber
            )
            .map((floor) => (
              <Link
  key={floor.id}
  to={`/floors/${floor.id}`}
  state={{
    floorName: floor.name,
  }}
  className="floor-card"
>
                <div className="floor-number">
                  {floor.floorNumber === 0
                    ? "G"
                    : floor.floorNumber}
                </div>

                <div>
                  <h3>{floor.name}</h3>

                  <p>
                    {floor.code} · View floor map
                    and locations
                  </p>
                </div>

                <span>→</span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}

export default Floors;