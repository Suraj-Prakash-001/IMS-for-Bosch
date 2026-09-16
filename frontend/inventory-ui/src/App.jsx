import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerHome from "./pages/CustomerHome";

import Dashboard from "./pages/Dashboard";
import Campuses from "./pages/Campuses";
import Buildings from "./pages/Buildings";
import Floors from "./pages/Floors";

function AdminLayout({ children }) {
  return (
    <ProtectedRoute role="Admin">
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route
          path="/home"
          element={
            <ProtectedRoute role="Customer">
              <CustomerHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute role="Customer">
              <div className="simple-page">
                <h1>Products</h1>
                <p>Product catalogue coming next.</p>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute role="Customer">
              <div className="simple-page">
                <h1>My Orders</h1>
                <p>Your orders will appear here.</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/campuses"
          element={
            <AdminLayout>
              <Campuses />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/campuses/:campusId"
          element={
            <AdminLayout>
              <Buildings />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/buildings/:buildingId"
          element={
            <AdminLayout>
              <Floors />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/floors/:floorId"
          element={
            <AdminLayout>
              <div className="page">
                <div className="page-heading">
                  <p className="eyebrow">FLOOR</p>
                  <h2>Floor Map</h2>
                  <p>
                    Interactive floor map coming next.
                  </p>
                </div>
              </div>
            </AdminLayout>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;