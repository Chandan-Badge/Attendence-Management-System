import { useContext, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import LoginForm from "../Components/LoginForm";
import PortalLayout from "../Components/PortalLayout";
import { AuthContext } from "../context/AuthContext";
import { getRoleConfig } from "../data/roleConfig";

const LoginPage = () => {
  const { roleKey } = useParams();
  const navigate = useNavigate();
  const { authSession, login } = useContext(AuthContext);

  const normalizedRoleKey = useMemo(() => roleKey?.toLowerCase() || "", [roleKey]);
  const role = getRoleConfig(normalizedRoleKey);

  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loginError, setLoginError] = useState("");

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (authSession.role === normalizedRoleKey && authSession.identifier) {
    return <Navigate to={`/dashboard/${normalizedRoleKey}`} replace />;
  }

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
    setFormData(role.demoCredentials);
    setLoginError("");
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const typedIdentifier = formData.identifier.trim();
    const typedPassword = formData.password;

    if (!typedIdentifier || !typedPassword) {
      setLoginError("Please enter both ID and password.");
      return;
    }

    const matchesDemoId =
      typedIdentifier.toLowerCase() ===
      role.demoCredentials.identifier.toLowerCase();
    const matchesDemoPassword = typedPassword === role.demoCredentials.password;

    if (!matchesDemoId || !matchesDemoPassword) {
      setLoginError(
        `Use demo credentials: ${role.demoCredentials.identifier} / ${role.demoCredentials.password}`,
      );
      return;
    }

    login(normalizedRoleKey, typedIdentifier);
    navigate(`/dashboard/${normalizedRoleKey}`);
  };

  return (
    <PortalLayout activeRole={role}>
      <section className="login-panel">
        <button type="button" className="text-button" onClick={() => navigate("/")}>
          Back to role selection
        </button>

        <h2>{role.title} Login</h2>
        <p className="panel-caption">
          Sign in to continue to your {role.title.toLowerCase()} dashboard.
        </p>

        <LoginForm
          role={role}
          formData={formData}
          loginError={loginError}
          onInputChange={handleInputChange}
          onFillDemoCredentials={fillDemoCredentials}
          onSubmit={handleLogin}
        />
      </section>
    </PortalLayout>
  );
};

export default LoginPage;
