function Dashboard() {
  return (
    <div className="dashboard">
      <section className="welcome-section">
        <div>
          <p className="eyebrow">COMPANY INVENTORY</p>

          <h2>Welcome back, Administrator.</h2>

          <p className="welcome-text">
            Monitor your company's physical spaces and inventory from a
            single workspace.
          </p>
        </div>

        <button className="primary-button">
          + Add Inventory
        </button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Campuses</span>
          <strong>3</strong>
          <span className="stat-description">Active locations</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Buildings</span>
          <strong>12</strong>
          <span className="stat-description">Across all campuses</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Floors</span>
          <strong>48</strong>
          <span className="stat-description">Mapped floors</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Inventory Items</span>
          <strong>18,426</strong>
          <span className="stat-description">Tracked assets</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">LOCATION</span>
              <h3>Campus Overview</h3>
            </div>

            <button className="text-button">View all →</button>
          </div>

          <div className="campus-list">
            <div className="campus-item">
              <div className="location-icon">B</div>

              <div className="location-info">
                <strong>Bengaluru Campus</strong>
                <span>5 buildings · 21 floors</span>
              </div>

              <span className="status-badge success">Active</span>
            </div>

            <div className="campus-item">
              <div className="location-icon">M</div>

              <div className="location-info">
                <strong>Mumbai Campus</strong>
                <span>4 buildings · 15 floors</span>
              </div>

              <span className="status-badge success">Active</span>
            </div>

            <div className="campus-item">
              <div className="location-icon">P</div>

              <div className="location-info">
                <strong>Pune Campus</strong>
                <span>3 buildings · 12 floors</span>
              </div>

              <span className="status-badge success">Active</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">INVENTORY</span>
              <h3>Current Status</h3>
            </div>
          </div>

          <div className="inventory-status">
            <div className="status-row">
              <span>
                <i className="dot occupied"></i>
                Assigned
              </span>
              <strong>14,921</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="dot available"></i>
                Available
              </span>
              <strong>2,841</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="dot maintenance"></i>
                Maintenance
              </span>
              <strong>421</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="dot storage"></i>
                Storage
              </span>
              <strong>243</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;