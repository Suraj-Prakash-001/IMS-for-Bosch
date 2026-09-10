import { Link, useParams } from "react-router-dom";
import { campuses } from "../data/mockData";

function Buildings() {
  const { campusId } = useParams();

  const campus = campuses.find(
    (item) => item.id === campusId
  );

  if (!campus) {
    return <div>Campus not found.</div>;
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{campus.city.toUpperCase()}</p>

          <h2>{campus.name}</h2>

          <p>Select a building to view its floors.</p>
        </div>
      </div>

      <div className="location-grid">
        {campus.buildings.map((building) => (
          <Link
            key={building.id}
            to={`/buildings/${building.id}`}
            state={{ campusName: campus.name }}
            className="location-card"
          >
            <div className="building-icon">▥</div>

            <div className="location-card-content">
              <h3>{building.name}</h3>

              <p>{building.code}</p>

              <div className="location-card-meta">
                <span>
                  {building.floors.length} floors
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

export default Buildings;