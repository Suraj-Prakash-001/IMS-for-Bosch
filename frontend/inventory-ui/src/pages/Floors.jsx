import { Link, useLocation, useParams } from "react-router-dom";
import { campuses } from "../data/mockData";

function Floors() {
  const { buildingId } = useParams();
  const location = useLocation();

  let building = null;
  let campus = null;

  for (const currentCampus of campuses) {
    const foundBuilding = currentCampus.buildings.find(
      (item) => item.id === buildingId
    );

    if (foundBuilding) {
      building = foundBuilding;
      campus = currentCampus;
      break;
    }
  }

  if (!building) {
    return <div>Building not found.</div>;
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            {location.state?.campusName || campus.name}
          </p>

          <h2>{building.name}</h2>

          <p>Select a floor to view its floor plan.</p>
        </div>
      </div>

      <div className="floor-list">
        {building.floors
          .slice()
          .sort((a, b) => a.number - b.number)
          .map((floor) => (
            <Link
              key={floor.id}
              to={`/floors/${floor.id}`}
              className="floor-card"
            >
              <div className="floor-number">
                {floor.number === 0 ? "G" : floor.number}
              </div>

              <div>
                <h3>{floor.name}</h3>
                <p>View floor map and locations</p>
              </div>

              <span>→</span>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Floors;