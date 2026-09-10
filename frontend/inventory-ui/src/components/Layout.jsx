import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => !current);
  };

  return (
    <div
      className={`app-shell ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Bosch-inspired top strip */}
      <div className="bosch-strip">
        <span className="strip-red"></span>
        <span className="strip-blue"></span>
        <span className="strip-grey"></span>
      </div>

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      <div className="main-area">
        <Header onMenuClick={toggleSidebar} />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;