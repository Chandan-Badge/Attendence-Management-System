const LoginForm = ({
  role,
  formData,
  loginError,
  isSubmitting,
  showDemoCredentialsButton,
  onInputChange,
  onFillDemoCredentials,
  onSubmit,
}) => {
  const inputClassName =
    "w-full rounded-xl border border-[#d2dbea] bg-white px-[14px] py-3 font-body text-[0.98rem] focus:border-[var(--accent-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75";

  const buttonBaseClassName =
    "rounded-xl border-0 px-4 py-[11px] font-body text-[0.94rem] font-bold transition-transform duration-150 ease-in-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75 disabled:transform-none";

  return (
    <form className="mt-5 grid max-w-[520px] gap-2.5" onSubmit={onSubmit}>
      <label htmlFor="identifier" className="text-[0.9rem] font-bold">
        {role.identifierLabel}
      </label>
      <input
        id="identifier"
        name="identifier"
        type="text"
        className={inputClassName}
        value={formData.identifier}
        onChange={onInputChange}
        disabled={isSubmitting}
        placeholder={`Enter ${role.identifierLabel.toLowerCase()}`}
        autoComplete="username"
      />

      <label htmlFor="password" className="text-[0.9rem] font-bold">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        className={inputClassName}
        value={formData.password}
        onChange={onInputChange}
        disabled={isSubmitting}
        placeholder="Enter password"
        autoComplete="current-password"
      />

      {loginError && <p className="mb-1 mt-0.5 text-[0.88rem] font-bold text-[#c02f2f]">{loginError}</p>}

      <div className="mt-2 flex flex-wrap gap-2.5">
        {showDemoCredentialsButton && (
          <button
            type="button"
            className={`${buttonBaseClassName} bg-[#eef4ff] text-[#1f2f49]`}
            onClick={onFillDemoCredentials}
            disabled={isSubmitting}
          >
            Use Demo Credentials
          </button>
        )}
        <button
          type="submit"
          className={`${buttonBaseClassName} bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-[0_10px_20px_rgba(14,165,233,0.25)]`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
