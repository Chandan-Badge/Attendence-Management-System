const LoginForm = ({
  role,
  formData,
  loginError,
  onInputChange,
  onFillDemoCredentials,
  onSubmit,
}) => {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label htmlFor="identifier">{role.identifierLabel}</label>
      <input
        id="identifier"
        name="identifier"
        type="text"
        value={formData.identifier}
        onChange={onInputChange}
        placeholder={`Enter ${role.identifierLabel.toLowerCase()}`}
        autoComplete="username"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={onInputChange}
        placeholder="Enter password"
        autoComplete="current-password"
      />

      {loginError && <p className="error-text">{loginError}</p>}

      <div className="login-actions">
        <button
          type="button"
          className="ghost-button"
          onClick={onFillDemoCredentials}
        >
          Use Demo Credentials
        </button>
        <button type="submit" className="primary-button">
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
