import { Link } from "react-router-dom";
import { campuses } from "../data/mockData";

function Campuses() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PHYSICAL LOCATIONS</p>
          <h2>Campuses</h2>
          <p>
            Select a campus to explore its buildings and floors.
          </p>
        </div>
      </div>

      <div className="location-grid">
        {campuses.map((campus) => (
          <Link
            key={campus.id}
            to={`/campuses/${campus.id}`}
            className="location-card"
          >
            <div className="location-card-icon">
              {campus.code.charAt(0)}
            </div>

            <div className="location-card-content">
              <h3>{campus.name}</h3>

              <p>
                {campus.city}, {campus.country}
              </p>

              <div className="location-card-meta">
                <span>
                  {campus.buildings.length} buildings
                </span>

                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Campuses;