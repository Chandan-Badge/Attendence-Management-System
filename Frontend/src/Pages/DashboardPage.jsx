import { useContext, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DashboardCardList from "../Components/DashboardCardList";
import PortalLayout from "../Components/PortalLayout";
import StatsGrid from "../Components/StatsGrid";
import { AuthContext } from "../context/AuthContext";
import { getRoleConfig } from "../data/roleConfig";

const DashboardPage = () => {
  const { roleKey } = useParams();
  const navigate = useNavigate();
  const { authSession, isAuthLoading, logout } = useContext(AuthContext);

  const normalizedRoleKey = useMemo(() => roleKey?.toLowerCase() || "", [roleKey]);
  const role = getRoleConfig(normalizedRoleKey);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (isAuthLoading) {
    return (
      <PortalLayout activeRole={role}>
        <section className="dashboard-panel">
          <p className="panel-caption">Checking active session...</p>
        </section>
      </PortalLayout>
    );
  }

  if (!authSession.identifier || authSession.role !== normalizedRoleKey) {
    return <Navigate to={`/login/${normalizedRoleKey}`} replace />;
  }

  const switchRole = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate("/");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
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
            <button
              type="button"
              className="ghost-button"
              onClick={switchRole}
              disabled={isLoggingOut}
            >
              Switch Role
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
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
