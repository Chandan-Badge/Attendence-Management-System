const StatsGrid = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((item) => (
        <article key={item.label} className="stat-card">
          <p>{item.label}</p>
          <h3>{item.value}</h3>
        </article>
      ))}
    </div>
  );
};

export default StatsGrid;
