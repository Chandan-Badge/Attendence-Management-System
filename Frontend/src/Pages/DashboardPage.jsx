import { useContext, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DashboardCardList from "../Components/DashboardCardList";
import PortalLayout from "../Components/PortalLayout";
import StatsGrid from "../Components/StatsGrid";
import { AuthContext } from "../context/AuthContext";
import { getRoleConfig } from "../data/roleConfig";

const DashboardPage = () => {
  const { roleKey } = useParams();
  const navigate = useNavigate();
  const { authSession, logout } = useContext(AuthContext);

  const normalizedRoleKey = useMemo(() => roleKey?.toLowerCase() || "", [roleKey]);
  const role = getRoleConfig(normalizedRoleKey);

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (!authSession.identifier || authSession.role !== normalizedRoleKey) {
    return <Navigate to={`/login/${normalizedRoleKey}`} replace />;
  }

  const switchRole = () => {
    logout();
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate(`/login/${normalizedRoleKey}`);
  };

  return (
    <PortalLayout activeRole={role}>
      <section className="dashboard-panel">
        <div className="dashboard-top">
          <div>
            <h2>{role.title} Dashboard</h2>
            <p>
              Logged in as <strong>{authSession.identifier}</strong>
            </p>
          </div>

          <div className="dashboard-controls">
            <button type="button" className="ghost-button" onClick={switchRole}>
              Switch Role
            </button>
            <button type="button" className="primary-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <StatsGrid stats={role.dashboard.stats} />

        <div className="dashboard-grid">
          <DashboardCardList title="Quick Actions" items={role.dashboard.actions} />
          <DashboardCardList title="Today Updates" items={role.dashboard.updates} />
        </div>
      </section>
    </PortalLayout>
  );
};

export default DashboardPage;
