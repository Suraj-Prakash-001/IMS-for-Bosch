import {
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Header({ onMenuClick }) {
  const { name, username, logout } = useAuth();

  const displayName = name || username || "Administrator";

  return (
    <header className="header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>

        <div>
          <div className="breadcrumb">
            Admin Workspace / Dashboard
          </div>

          <h1>Inventory Overview</h1>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.8} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-user">
          <div className="user-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="header-user-info">
            <div className="user-name">
              {displayName}
            </div>

            <div className="user-role">
              System Admin
            </div>
          </div>

  

          <ChevronDown
            className="profile-chevron"
            size={15}
            strokeWidth={1.8}
          />
        </div>
        <button
  type="button"
  onClick={logout}
  className="customer-logout"
>
  Logout
</button>
      </div>
    </header>
  );
}

export default Header;