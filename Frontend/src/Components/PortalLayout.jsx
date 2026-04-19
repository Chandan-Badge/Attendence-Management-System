const PortalLayout = ({ activeRole, children }) => {
  const themedStyle = {
    "--accent-primary": activeRole?.accentPrimary || "#0ea5e9",
    "--accent-secondary": activeRole?.accentSecondary || "#22d3ee",
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(1200px_520px_at_10%_-5%,#d9f6ff,transparent_60%),radial-gradient(1000px_520px_at_90%_-8%,#ffe9c7,transparent_56%),linear-gradient(145deg,#f7fbff_0%,#eef5ff_56%,#fdf8ef_100%)] px-3 py-5 font-body text-text-main sm:px-5 sm:py-8"
      style={themedStyle}
    >
      <div className="pointer-events-none absolute left-[-80px] top-[-130px] h-[340px] w-[340px] animate-float rounded-full bg-gradient-to-b from-[var(--accent-primary)] to-transparent opacity-30" />
      <div className="pointer-events-none absolute bottom-[-190px] right-[-140px] h-[420px] w-[420px] animate-float rounded-full bg-gradient-to-b from-[var(--accent-secondary)] to-transparent opacity-30 [animation-delay:-4s]" />

      <main className="relative w-full max-w-[1020px] animate-fadeInUp rounded-[22px] border border-[rgba(255,255,255,0.86)] bg-[rgba(255,255,255,0.82)] p-[22px] shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-[10px] sm:rounded-[30px] sm:p-[34px]">
        <header className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 mt-0 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-text-muted">
              Attendance Management System
            </p>
            <h1 className="m-0 font-heading text-[clamp(1.5rem,3vw,2.2rem)]">
              Role Based Portal
            </h1>
          </div>
          {activeRole && (
            <span className="whitespace-nowrap rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-[14px] py-2 text-[0.82rem] font-bold text-white">
              {activeRole.title} Mode
            </span>
          )}
        </header>

        {children}
      </main>
    </div>
  );
};

export default PortalLayout;
