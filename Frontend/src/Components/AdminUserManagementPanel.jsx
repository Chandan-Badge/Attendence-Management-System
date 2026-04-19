import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const INITIAL_FORM = {
  role: "teacher",
  name: "",
  identifier: "",
  password: "",
};

const EMPTY_SUMMARY = {
  teachers: 0,
  students: 0,
  totalManaged: 0,
};

const AdminUserManagementPanel = () => {
  const { createManagedUser, getManagedUsers } = useContext(AuthContext);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [roleFilter, setRoleFilter] = useState("all");
  const [managedUsers, setManagedUsers] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUsers = async (nextRoleFilter = roleFilter) => {
    try {
      setIsLoadingUsers(true);
      setErrorMessage("");

      const roleQuery = nextRoleFilter === "all" ? "" : nextRoleFilter;
      const data = await getManagedUsers(roleQuery);

      setManagedUsers(data?.users || []);
      setSummary(data?.summary || EMPTY_SUMMARY);
    } catch (error) {
      const apiError = error?.response?.data?.message;
      setErrorMessage(apiError || "Unable to load managed users.");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers(roleFilter);
  }, [roleFilter]);

  const handleInputChange = ({ target }) => {
    const { name, value } = target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    const payload = {
      role: formData.role,
      name: formData.name.trim(),
      identifier: formData.identifier.trim(),
      password: formData.password,
    };

    if (!payload.role || !payload.name || !payload.identifier || !payload.password) {
      setErrorMessage("Please fill all required fields to create an account.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await createManagedUser(payload);
      setSuccessMessage(data?.message || "Account created successfully.");
      setFormData((previous) => ({
        ...previous,
        name: "",
        identifier: "",
        password: "",
      }));
      await loadUsers(roleFilter);
    } catch (error) {
      const apiError = error?.response?.data?.message;
      setErrorMessage(apiError || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-management">
      <div className="admin-header">
        <h3>Admin User Management</h3>
        <p>Create teacher and student accounts, then share credentials for login.</p>
      </div>

      <div className="admin-summary-grid">
        <article className="admin-summary-card">
          <p>Total Teachers</p>
          <h4>{summary.teachers}</h4>
        </article>
        <article className="admin-summary-card">
          <p>Total Students</p>
          <h4>{summary.students}</h4>
        </article>
        <article className="admin-summary-card">
          <p>Total Managed Users</p>
          <h4>{summary.totalManaged}</h4>
        </article>
      </div>

      <form className="admin-form" onSubmit={handleCreateUser}>
        <div className="admin-field">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="Enter full name"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="identifier">Identifier</label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            value={formData.identifier}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="teacher01 or student01"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="new-password">Password</label>
          <input
            id="new-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="At least 6 characters"
          />
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </form>

      {(errorMessage || successMessage) && (
        <p className={errorMessage ? "error-text" : "success-text"}>
          {errorMessage || successMessage}
        </p>
      )}

      <div className="admin-list-controls">
        <label htmlFor="filter-role">Filter Users</label>
        <select
          id="filter-role"
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          disabled={isLoadingUsers}
        >
          <option value="all">All</option>
          <option value="teacher">Teachers</option>
          <option value="student">Students</option>
        </select>
      </div>

      {isLoadingUsers ? (
        <p className="panel-caption">Loading managed users...</p>
      ) : (
        <div className="managed-users-list">
          {managedUsers.length === 0 ? (
            <p className="panel-caption">No users found for this filter.</p>
          ) : (
            managedUsers.map((user) => (
              <article key={user.id} className="managed-user-card">
                <div>
                  <h4>{user.name}</h4>
                  <p>{user.identifier}</p>
                </div>
                <span className={`user-role-pill role-${user.role}`}>{user.role}</span>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default AdminUserManagementPanel;
