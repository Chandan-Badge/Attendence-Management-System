import PortalLayout from "../Components/PortalLayout";
import RoleCard from "../Components/RoleCard";
import { ROLE_CONFIG } from "../data/roleConfig";

const RoleSelectionPage = () => {
  return (
    <PortalLayout>
      <section className="role-selection">
        <h2>Select Your Role</h2>
        <p>
          Choose Student, Teacher, or Admin to continue to the dedicated login
          screen.
        </p>

        <div className="role-grid">
          {Object.entries(ROLE_CONFIG).map(([roleKey, role]) => (
            <RoleCard key={roleKey} roleKey={roleKey} role={role} />
          ))}
        </div>
      </section>
    </PortalLayout>
  );
};

export default RoleSelectionPage;
