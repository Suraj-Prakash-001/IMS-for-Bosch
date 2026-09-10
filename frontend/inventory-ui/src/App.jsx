import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Campuses from "./pages/Campuses";
import Buildings from "./pages/Buildings";
import Floors from "./pages/Floors";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/campuses"
            element={<Campuses />}
          />

          <Route
            path="/campuses/:campusId"
            element={<Buildings />}
          />

          <Route
            path="/buildings/:buildingId"
            element={<Floors />}
          />

          <Route
            path="/floors/:floorId"
            element={
              <div className="page">
                <div className="page-heading">
                  <p className="eyebrow">FLOOR</p>
                  <h2>Floor Map</h2>
                  <p>
                    Interactive floor map coming next.
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;