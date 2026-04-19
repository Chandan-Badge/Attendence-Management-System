import { Link } from "react-router-dom";

const RoleCard = ({ roleKey, role }) => {
  return (
    <Link
      to={`/login/${roleKey}`}
      className="role-card"
      style={{
        "--card-primary": role.accentPrimary,
        "--card-secondary": role.accentSecondary,
      }}
    >
      <span className="role-chip">{role.shortCode}</span>
      <h3>{role.title}</h3>
      <p>{role.description}</p>
      <span className="role-link">Open {role.title} Login</span>
    </Link>
  );
};

export default RoleCard;
