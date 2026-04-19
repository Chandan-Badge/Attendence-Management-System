const PortalLayout = ({ activeRole, children }) => {
  const themedStyle = activeRole
    ? {
        "--accent-primary": activeRole.accentPrimary,
        "--accent-secondary": activeRole.accentSecondary,
      }
    : {};

  return (
    <div className="ams-shell" style={themedStyle}>
      <div className="ambient-shape ambient-shape-one" />
      <div className="ambient-shape ambient-shape-two" />

      <main className="ams-card">
        <header className="ams-header">
          <div>
            <p className="eyebrow">Attendance Management System</p>
            <h1>Role Based Portal</h1>
          </div>
          {activeRole && (
            <span className="active-role-badge">{activeRole.title} Mode</span>
          )}
        </header>

        {children}
      </main>
    </div>
  );
};

export default PortalLayout;
