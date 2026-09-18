import {
  LayoutDashboard,
  MapPinned,
  Building2,
  Layers3,
  Package,
  ArrowLeftRight,
  ClipboardList,
  PlusCircle,
  Tags,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* BRAND */}
      <div className="brand">
        <div className="brand-logo">
          <img
            src="/bosch-emblem.png"
            alt="Bosch emblem"
            className="bosch-emblem"
          />

          {!collapsed && (
            <span className="bosch-wordmark">
              BOSCH
            </span>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        {!collapsed && (
          <div className="nav-section-title">
            WORKSPACE
          </div>
        )}

        {/* DASHBOARD */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Dashboard"
        >
          <LayoutDashboard className="nav-icon" />

          {!collapsed && (
            <span>Dashboard</span>
          )}
        </NavLink>

        {/* CAMPUSES */}
        <NavLink
          to="/campuses"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Campuses"
        >
          <MapPinned className="nav-icon" />

          {!collapsed && (
            <span>Campuses</span>
          )}
        </NavLink>

        {!collapsed && (
          <div className="nav-section-title">
            MANAGEMENT
          </div>
        )}

        {/* INVENTORY */}
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Inventory"
        >
          <Package className="nav-icon" />

          {!collapsed && (
            <span>Inventory</span>
          )}
        </NavLink>

        {/* ORDERS */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Orders"
        >
          <ClipboardList className="nav-icon" />

          {!collapsed && (
            <span>Orders</span>
          )}
        </NavLink>

        {/* ADD PRODUCT */}
        <NavLink
          to="/admin/products/new"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Add Product"
        >
          <PlusCircle className="nav-icon" />

          {!collapsed && (
            <span>Add Product</span>
          )}
        </NavLink>

        {/* CATEGORIES */}
<NavLink
  to="/admin/categories"
  className={({ isActive }) =>
    `nav-item ${isActive ? "active" : ""}`
  }
  title="Categories"
>
  <Tags className="nav-icon" />

  {!collapsed && (
    <span>Categories</span>
  )}
</NavLink>

        {/* MOVEMENTS */}
        <NavLink
          to="/movements"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Movements"
        >
          <ArrowLeftRight className="nav-icon" />

          {!collapsed && (
            <span>Movements</span>
          )}
        </NavLink>

        {/* BUILDINGS */}
        <NavLink
          to="/buildings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Buildings"
        >
          <Building2 className="nav-icon" />

          {!collapsed && (
            <span>Buildings</span>
          )}
        </NavLink>

        {/* FLOORS */}
        <NavLink
          to="/floors"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Floors"
        >
          <Layers3 className="nav-icon" />

          {!collapsed && (
            <span>Floors</span>
          )}
        </NavLink>

      </nav>

      {/* SIDEBAR CONTROL */}
      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {collapsed ? (
            <ChevronRight className="toggle-icon" />
          ) : (
            <>
              <ChevronLeft className="toggle-icon" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;