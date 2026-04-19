import { useContext, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import LoginForm from "../Components/LoginForm";
import PortalLayout from "../Components/PortalLayout";
import { AuthContext } from "../context/AuthContext";
import { getRoleConfig } from "../data/roleConfig";

const LoginPage = () => {
  const { roleKey } = useParams();
  const navigate = useNavigate();
  const { authSession, isAuthLoading, login } = useContext(AuthContext);

  const normalizedRoleKey = useMemo(() => roleKey?.toLowerCase() || "", [roleKey]);
  const role = getRoleConfig(normalizedRoleKey);

  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (isAuthLoading) {
    return (
      <PortalLayout activeRole={role}>
        <section className="login-panel">
          <h2>{role.title} Login</h2>
          <p className="panel-caption">Checking active session...</p>
        </section>
      </PortalLayout>
    );
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

  const handleLogin = async (event) => {
    event.preventDefault();

    const typedIdentifier = formData.identifier.trim();
    const typedPassword = formData.password;

    if (!typedIdentifier || !typedPassword) {
      setLoginError("Please enter both ID and password.");
      return;
    }

    setIsSubmitting(true);
    setLoginError("");

    try {
      await login(normalizedRoleKey, typedIdentifier, typedPassword);
      navigate(`/dashboard/${normalizedRoleKey}`);
    } catch (error) {
      const apiError = error?.response?.data?.message;
      setLoginError(apiError || "Unable to login right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onFillDemoCredentials={fillDemoCredentials}
          onSubmit={handleLogin}
        />
      </section>
    </PortalLayout>
  );
};

export default LoginPage;
