const DashboardCardList = ({ title, items }) => {
  return (
    <article className="dashboard-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
};

export default DashboardCardList;
