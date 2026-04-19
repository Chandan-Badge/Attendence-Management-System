import { useContext, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import PortalLayout from "../Components/PortalLayout";
import StatsGrid from "../Components/StatsGrid";
import DashboardCardList from "../Components/DashboardCardList";
import { AuthContext } from "../context/AuthContext";
import { getRoleConfig } from "../data/roleConfig";

const StudentDashboard = () => {
  const { roleKey } = useParams();
  const navigate = useNavigate();
  const { authSession, isAuthLoading, logout } = useContext(AuthContext);

  const normalizedRoleKey = useMemo(() => roleKey?.toLowerCase() || "", [roleKey]);
  const role = getRoleConfig(normalizedRoleKey);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Student-specific data (hardcoded)
  const studentStats = [
    { label: "Attendance This Month", value: "92%" },
    { label: "Classes Today", value: "5" },
    { label: "Pending Leave Requests", value: "1" },
  ];

  const studentActions = [
    "View subject attendance report",
    "Apply for leave",
    "Download monthly attendance sheet",
  ];

  const studentUpdates = [
    "Math lecture moved to 11:00 AM",
    "Lab attendance closes at 4:30 PM",
    "Parent report shared for this week",
  ];

  const actionButtonBaseClassName =
    "rounded-xl border-0 px-4 py-[11px] font-body text-[0.94rem] font-bold transition-transform duration-150 ease-in-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75 disabled:transform-none";

  if (!role || normalizedRoleKey !== "student") {
    return <Navigate to="/" replace />;
  }

  if (isAuthLoading) {
    return (
      <PortalLayout activeRole={role}>
        <section className="animate-fadeInUpFast">
          <p className="mt-[10px] text-text-muted">Checking active session...</p>
        </section>
      </PortalLayout>
    );
  }

  if (!authSession.identifier || authSession.role !== "student") {
    return <Navigate to="/login/student" replace />;
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
    navigate("/login/student");
  };

  return (
    <PortalLayout activeRole={role}>
      <section className="animate-fadeInUpFast">
        <div className="mb-[18px] flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
          <div>
            <h2 className="font-heading text-[1.5rem]">Student Dashboard</h2>
            <p className="mt-[10px] text-text-muted">
              Logged in as <strong>{authSession.name || authSession.identifier}</strong>
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-2.5">
            <button
              type="button"
              className={`${actionButtonBaseClassName} bg-[#eef4ff] text-[#1f2f49]`}
              onClick={switchRole}
              disabled={isLoggingOut}
            >
              Switch Role
            </button>
            <button
              type="button"
              className={`${actionButtonBaseClassName} bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-[0_10px_20px_rgba(14,165,233,0.25)]`}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        <StatsGrid stats={studentStats} />

        <div className="grid grid-cols-1 gap-[14px] min-[901px]:grid-cols-2">
          <DashboardCardList title="Quick Actions" items={studentActions} />
          <DashboardCardList title="Today Updates" items={studentUpdates} />
        </div>
      </section>
    </PortalLayout>
  );
};

export default StudentDashboard;
