import { useMemo, useState } from "react";
import "./App.css";

const ROLE_CONFIG = {
  student: {
    title: "Student",
    shortCode: "STU",
    description:
      "Track daily attendance, subjects, and leave requests from one place.",
    accentPrimary: "#0ea5e9",
    accentSecondary: "#22d3ee",
    identifierLabel: "Enrollment ID",
    demoCredentials: {
      identifier: "student01",
      password: "student123",
    },
    dashboard: {
      stats: [
        { label: "Attendance This Month", value: "92%" },
        { label: "Classes Today", value: "5" },
        { label: "Pending Leave Requests", value: "1" },
      ],
      actions: [
        "View subject attendance report",
        "Apply for leave",
        "Download monthly attendance sheet",
      ],
      updates: [
        "Math lecture moved to 11:00 AM",
        "Lab attendance closes at 4:30 PM",
        "Parent report shared for this week",
      ],
    },
  },
  teacher: {
    title: "Teacher",
    shortCode: "TCH",
    description:
      "Mark class attendance, review trends, and manage student attendance alerts.",
    accentPrimary: "#f97316",
    accentSecondary: "#fb923c",
    identifierLabel: "Faculty ID",
    demoCredentials: {
      identifier: "teacher01",
      password: "teacher123",
    },
    dashboard: {
      stats: [
        { label: "Classes Assigned", value: "8" },
        { label: "Attendance Marked Today", value: "4" },
        { label: "Defaulter Alerts", value: "6" },
      ],
      actions: [
        "Take attendance for next class",
        "Review absentee list",
        "Send attendance alerts",
      ],
      updates: [
        "Semester B attendance summary ready",
        "2 classes pending attendance entry",
        "Meeting with admin at 3:00 PM",
      ],
    },
  },
  admin: {
    title: "Admin",
    shortCode: "ADM",
    description:
      "Monitor institute-wide attendance, manage users, and track compliance reports.",
    accentPrimary: "#16a34a",
    accentSecondary: "#4ade80",
    identifierLabel: "Admin Email",
    demoCredentials: {
      identifier: "admin@ams.com",
      password: "admin123",
    },
    dashboard: {
      stats: [
        { label: "Total Students", value: "1,248" },
        { label: "Total Teachers", value: "84" },
        { label: "Institute Attendance", value: "88%" },
      ],
      actions: [
        "Manage student accounts",
        "Approve leave and holiday rules",
        "Export compliance reports",
      ],
      updates: [
        "Monthly attendance audit starts tomorrow",
        "3 new faculty accounts require approval",
        "System backup completed at 02:15 AM",
      ],
    },
  },
};

function App() {
  const [view, setView] = useState("roles");
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loggedInUser, setLoggedInUser] = useState("");
  const [loginError, setLoginError] = useState("");

  const activeRole = selectedRole ? ROLE_CONFIG[selectedRole] : null;

  const themedStyle = useMemo(() => {
    if (!activeRole) {
      return {};
    }

    return {
      "--accent-primary": activeRole.accentPrimary,
      "--accent-secondary": activeRole.accentSecondary,
    };
  }, [activeRole]);

  const openRoleLogin = (roleKey) => {
    setSelectedRole(roleKey);
    setView("login");
    setFormData({ identifier: "", password: "" });
    setLoggedInUser("");
    setLoginError("");
  };

  const goToRoleSelection = () => {
    setSelectedRole("");
    setView("roles");
    setFormData({ identifier: "", password: "" });
    setLoggedInUser("");
    setLoginError("");
  };

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (loginError) {
      setLoginError("");
    }
  };

  const fillDemoCredentials = () => {
    if (!activeRole) {
      return;
    }

    setFormData(activeRole.demoCredentials);
    setLoginError("");
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!activeRole) {
      return;
    }

    if (!formData.identifier.trim() || !formData.password.trim()) {
      setLoginError("Please enter both ID and password.");
      return;
    }

    const matchesDemoId =
      formData.identifier.trim().toLowerCase() ===
      activeRole.demoCredentials.identifier.toLowerCase();
    const matchesDemoPassword =
      formData.password === activeRole.demoCredentials.password;

    if (!matchesDemoId || !matchesDemoPassword) {
      setLoginError(
        `Use demo credentials: ${activeRole.demoCredentials.identifier} / ${activeRole.demoCredentials.password}`,
      );
      return;
    }

    setLoggedInUser(formData.identifier.trim());
    setLoginError("");
    setView("dashboard");
  };

  const logout = () => {
    setView("login");
    setFormData({ identifier: "", password: "" });
    setLoggedInUser("");
    setLoginError("");
  };

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

        {view === "roles" && (
          <section className="role-selection">
            <h2>Select Your Role</h2>
            <p>
              Choose Student, Teacher, or Admin to continue to the dedicated
              login screen.
            </p>

            <div className="role-grid">
              {Object.entries(ROLE_CONFIG).map(([roleKey, role]) => (
                <button
                  key={roleKey}
                  className="role-card"
                  type="button"
                  onClick={() => openRoleLogin(roleKey)}
                  style={{
                    "--card-primary": role.accentPrimary,
                    "--card-secondary": role.accentSecondary,
                  }}
                >
                  <span className="role-chip">{role.shortCode}</span>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                  <span className="role-link">Open {role.title} Login</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {view === "login" && activeRole && (
          <section className="login-panel">
            <button
              type="button"
              className="text-button"
              onClick={goToRoleSelection}
            >
              Back to role selection
            </button>

            <h2>{activeRole.title} Login</h2>
            <p className="panel-caption">
              Sign in to continue to your {activeRole.title.toLowerCase()} dashboard.
            </p>

            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor="identifier">{activeRole.identifierLabel}</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder={`Enter ${activeRole.identifierLabel.toLowerCase()}`}
                autoComplete="username"
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                autoComplete="current-password"
              />

              {loginError && <p className="error-text">{loginError}</p>}

              <div className="login-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={fillDemoCredentials}
                >
                  Use Demo Credentials
                </button>
                <button type="submit" className="primary-button">
                  Login
                </button>
              </div>
            </form>
          </section>
        )}

        {view === "dashboard" && activeRole && (
          <section className="dashboard-panel">
            <div className="dashboard-top">
              <div>
                <h2>{activeRole.title} Dashboard</h2>
                <p>
                  Logged in as <strong>{loggedInUser}</strong>
                </p>
              </div>

              <div className="dashboard-controls">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={goToRoleSelection}
                >
                  Switch Role
                </button>
                <button type="button" className="primary-button" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>

            <div className="stats-grid">
              {activeRole.dashboard.stats.map((item) => (
                <article key={item.label} className="stat-card">
                  <p>{item.label}</p>
                  <h3>{item.value}</h3>
                </article>
              ))}
            </div>

            <div className="dashboard-grid">
              <article className="dashboard-card">
                <h3>Quick Actions</h3>
                <ul>
                  {activeRole.dashboard.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </article>

              <article className="dashboard-card">
                <h3>Today Updates</h3>
                <ul>
                  {activeRole.dashboard.updates.map((update) => (
                    <li key={update}>{update}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;