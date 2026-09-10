import {
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

function Header({ onMenuClick }) {
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
            Workspace / Dashboard
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
          <Bell
            size={19}
            strokeWidth={1.8}
          />

          <span className="notification-dot"></span>
        </button>

        <div className="header-user">
          <div className="user-avatar">
            A
          </div>

          <div className="header-user-info">
            <div className="user-name">
              Administrator
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
      </div>
    </header>
  );
}

export default Header;