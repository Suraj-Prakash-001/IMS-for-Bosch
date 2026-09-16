import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Products from "./pages/Products";
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

function SimpleAdminPage({ title, description }) {
  return (
    <AdminLayout>
      <div className="page">
        <div className="page-heading">
          <p className="eyebrow">ADMINISTRATION</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </AdminLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC
        ========================== */}

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* =========================
            CUSTOMER
        ========================== */}

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
      <Products />
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


        {/* =========================
            ADMIN
        ========================== */}

        {/* Login currently sends Admin here */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        {/* Sidebar Dashboard */}
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />


        {/* =========================
            CAMPUSES
        ========================== */}

        <Route
          path="/admin/campuses"
          element={
            <AdminLayout>
              <Campuses />
            </AdminLayout>
          }
        />

        <Route
          path="/campuses"
          element={
            <AdminLayout>
              <Campuses />
            </AdminLayout>
          }
        />


        {/* =========================
            BUILDINGS
        ========================== */}

        <Route
          path="/admin/campuses/:campusId"
          element={
            <AdminLayout>
              <Buildings />
            </AdminLayout>
          }
        />

        <Route
          path="/campuses/:campusId"
          element={
            <AdminLayout>
              <Buildings />
            </AdminLayout>
          }
        />

        {/* Existing Buildings page links to /buildings/:buildingId */}
        <Route
          path="/admin/buildings/:buildingId"
          element={
            <AdminLayout>
              <Floors />
            </AdminLayout>
          }
        />

        <Route
          path="/buildings/:buildingId"
          element={
            <AdminLayout>
              <Floors />
            </AdminLayout>
          }
        />


        {/* =========================
            SIDEBAR MANAGEMENT
        ========================== */}

        <Route
          path="/inventory"
          element={
            <SimpleAdminPage
              title="Inventory"
              description="Inventory management will be available here."
            />
          }
        />

        <Route
          path="/movements"
          element={
            <SimpleAdminPage
              title="Movements"
              description="Asset movement tracking will be available here."
            />
          }
        />

        <Route
          path="/buildings"
          element={
            <SimpleAdminPage
              title="Buildings"
              description="Select a campus from Campuses to view its buildings."
            />
          }
        />

        <Route
          path="/floors"
          element={
            <SimpleAdminPage
              title="Floors"
              description="Select a building from a campus to view its floors."
            />
          }
        />


        {/* =========================
            FLOOR MAP
        ========================== */}

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


        {/* =========================
            FALLBACK
        ========================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;