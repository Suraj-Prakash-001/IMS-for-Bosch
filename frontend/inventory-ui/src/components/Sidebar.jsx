import {
  LayoutDashboard,
  MapPinned,
  Building2,
  Layers3,
  Package,
  ArrowLeftRight,
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

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Dashboard"
        >
          <LayoutDashboard className="nav-icon" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/campuses"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Campuses"
        >
          <MapPinned className="nav-icon" />
          {!collapsed && <span>Campuses</span>}
        </NavLink>

        {!collapsed && (
          <div className="nav-section-title">
            MANAGEMENT
          </div>
        )}

        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Inventory"
        >
          <Package className="nav-icon" />
          {!collapsed && <span>Inventory</span>}
        </NavLink>

        <NavLink
          to="/movements"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Movements"
        >
          <ArrowLeftRight className="nav-icon" />
          {!collapsed && <span>Movements</span>}
        </NavLink>

        <NavLink
          to="/buildings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Buildings"
        >
          <Building2 className="nav-icon" />
          {!collapsed && <span>Buildings</span>}
        </NavLink>

        <NavLink
          to="/floors"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title="Floors"
        >
          <Layers3 className="nav-icon" />
          {!collapsed && <span>Floors</span>}
        </NavLink>
      </nav>

      {/* SIDEBAR CONTROL */}
      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={
            collapsed ? "Expand sidebar" : "Collapse sidebar"
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