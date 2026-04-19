/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  DEPARTMENT_LABEL_BY_VALUE,
  DEPARTMENT_OPTIONS,
  SUBJECT_LABEL_BY_VALUE,
  SUBJECT_OPTIONS,
} from "../data/academicOptions";

const INITIAL_FORM = {
  role: "teacher",
  name: "",
  identifier: "",
  password: "",
  departments: [],
  subjects: [],
};

const EMPTY_SUMMARY = {
  teachers: 0,
  students: 0,
  totalManaged: 0,
};

const IDENTIFIER_LABEL_BY_ROLE = {
  teacher: "Faculty ID",
  student: "Enrollment Number",
};

const formatOptionList = (values, labelMap) => {
  if (!Array.isArray(values) || values.length === 0) {
    return "Not assigned";
  }

  return values.map((value) => labelMap[value] || value).join(", ");
};

const AdminUserManagementPanel = () => {
  const { createManagedUser, deleteManagedUser, getManagedUsers } = useContext(AuthContext);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [roleFilter, setRoleFilter] = useState("all");
  const [managedUsers, setManagedUsers] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fieldInputClassName =
    "w-full rounded-[10px] border border-[#d2dbea] bg-white px-3 py-2.5 font-body text-[0.95rem] focus:border-[var(--accent-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75";

  const primaryButtonClassName =
    "rounded-xl border-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] px-4 py-[11px] font-body text-[0.94rem] font-bold text-white shadow-[0_10px_20px_rgba(14,165,233,0.25)] transition-transform duration-150 ease-in-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75 disabled:transform-none";

  const selectedIdentifierLabel = IDENTIFIER_LABEL_BY_ROLE[formData.role] || "Identifier";

  const clearMessages = () => {
    if (errorMessage) {
      setErrorMessage("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const getRolePillClassName = (role) => {
    if (role === "teacher") {
      return "bg-[#fff0df] text-[#9a3f02]";
    }

    if (role === "student") {
      return "bg-[#e8f7ff] text-[#045b8e]";
    }

    return "bg-[#eef4ff] text-[#1f2f49]";
  };

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

    setFormData((previous) => {
      if (name === "role") {
        const nextRole = String(value).toLowerCase();
        const nextDepartments =
          nextRole === "student" ? previous.departments.slice(0, 1) : previous.departments;

        return {
          ...previous,
          role: nextRole,
          departments: nextDepartments,
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });

    clearMessages();
  };

  const handleTeacherDepartmentToggle = (departmentValue) => {
    setFormData((previous) => {
      const isSelected = previous.departments.includes(departmentValue);

      return {
        ...previous,
        departments: isSelected
          ? previous.departments.filter((value) => value !== departmentValue)
          : [...previous.departments, departmentValue],
      };
    });

    clearMessages();
  };

  const handleStudentDepartmentChange = (departmentValue) => {
    setFormData((previous) => ({
      ...previous,
      departments: departmentValue ? [departmentValue] : [],
    }));

    clearMessages();
  };

  const handleSubjectToggle = (subjectValue) => {
    setFormData((previous) => {
      const isSelected = previous.subjects.includes(subjectValue);

      return {
        ...previous,
        subjects: isSelected
          ? previous.subjects.filter((value) => value !== subjectValue)
          : [...previous.subjects, subjectValue],
      };
    });

    clearMessages();
  };

  const getFormValidationMessage = (payload) => {
    if (!payload.role || !payload.name || !payload.identifier || !payload.password) {
      return "Please fill all required fields to create an account.";
    }

    if (payload.role === "teacher" && payload.departments.length < 1) {
      return "Teacher must be assigned at least one department.";
    }

    if (payload.role === "student" && payload.departments.length !== 1) {
      return "Student must be assigned exactly one department.";
    }

    if (payload.subjects.length < 1) {
      return "Please assign at least one subject.";
    }

    return "";
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    const payload = {
      role: formData.role,
      name: formData.name.trim(),
      identifier: formData.identifier.trim(),
      password: formData.password,
      departments: formData.departments,
      subjects: formData.subjects,
    };

    const validationMessage = getFormValidationMessage(payload);

    if (validationMessage) {
      setErrorMessage(validationMessage);
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
        departments: [],
        subjects: [],
      }));
      await loadUsers(roleFilter);
    } catch (error) {
      const apiError = error?.response?.data?.message;
      setErrorMessage(apiError || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    const deleteConfirmation = window.confirm(
      `Delete ${user.role} account for ${user.name}? This cannot be undone.`,
    );

    if (!deleteConfirmation) {
      return;
    }

    setDeletingUserId(user.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await deleteManagedUser(user.id);
      setSuccessMessage(data?.message || "Account deleted successfully.");
      await loadUsers(roleFilter);
    } catch (error) {
      const apiError = error?.response?.data?.message;
      setErrorMessage(apiError || "Unable to delete account.");
    } finally {
      setDeletingUserId("");
    }
  };

  return (
    <section className="mt-[18px] rounded-2xl border border-[#dde8f7] bg-[linear-gradient(155deg,#ffffff,#f4f9ff)] p-[18px]">
      <div>
        <h3 className="font-heading">Admin User Management</h3>
        <p className="mt-2 text-[0.92rem] text-text-muted">
          Create teacher and student accounts, assign academics, and manage active users.
        </p>
      </div>

      <div className="mt-[14px] grid grid-cols-1 gap-2.5 min-[901px]:grid-cols-3">
        <article className="rounded-xl border border-[#e2ecfa] bg-white p-3">
          <p className="m-0 text-[0.84rem] text-text-muted">Total Teachers</p>
          <h4 className="mt-2 font-heading text-[1.25rem]">{summary.teachers}</h4>
        </article>
        <article className="rounded-xl border border-[#e2ecfa] bg-white p-3">
          <p className="m-0 text-[0.84rem] text-text-muted">Total Students</p>
          <h4 className="mt-2 font-heading text-[1.25rem]">{summary.students}</h4>
        </article>
        <article className="rounded-xl border border-[#e2ecfa] bg-white p-3">
          <p className="m-0 text-[0.84rem] text-text-muted">Total Managed Users</p>
          <h4 className="mt-2 font-heading text-[1.25rem]">{summary.totalManaged}</h4>
        </article>
      </div>

      <form
        className="mt-[14px] grid grid-cols-1 gap-2.5 min-[901px]:grid-cols-2"
        onSubmit={handleCreateUser}
      >
        <div className="grid gap-1.5">
          <label htmlFor="role" className="text-[0.88rem] font-bold">
            Role
          </label>
          <select
            id="role"
            name="role"
            className={fieldInputClassName}
            value={formData.role}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="name" className="text-[0.88rem] font-bold">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={fieldInputClassName}
            value={formData.name}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="Enter full name"
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="identifier" className="text-[0.88rem] font-bold">
            {selectedIdentifierLabel}
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            className={fieldInputClassName}
            value={formData.identifier}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder={`Enter ${selectedIdentifierLabel.toLowerCase()}`}
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="new-password" className="text-[0.88rem] font-bold">
            Password
          </label>
          <input
            id="new-password"
            name="password"
            type="password"
            className={fieldInputClassName}
            value={formData.password}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="At least 6 characters"
          />
        </div>

        <div className="col-span-full grid gap-1.5 rounded-xl border border-[#e2ebf8] bg-white p-3">
          <label className="text-[0.88rem] font-bold">Assign Departments</label>
          <p className="text-[0.82rem] text-text-muted">
            {formData.role === "teacher"
              ? "Teacher can be assigned to multiple departments."
              : "Student can be assigned to only one department."}
          </p>

          {formData.role === "teacher" ? (
            <div className="grid grid-cols-1 gap-2 min-[901px]:grid-cols-2">
              {DEPARTMENT_OPTIONS.map((department) => (
                <label
                  key={department.value}
                  htmlFor={`department-${department.value}`}
                  className="flex items-center gap-2 rounded-lg border border-[#dbe6f6] px-3 py-2"
                >
                  <input
                    id={`department-${department.value}`}
                    type="checkbox"
                    checked={formData.departments.includes(department.value)}
                    onChange={() => handleTeacherDepartmentToggle(department.value)}
                    disabled={isSubmitting}
                  />
                  <span className="text-[0.92rem]">{department.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <select
              id="student-department"
              className={fieldInputClassName}
              value={formData.departments[0] || ""}
              onChange={(event) => handleStudentDepartmentChange(event.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select one department</option>
              {DEPARTMENT_OPTIONS.map((department) => (
                <option key={department.value} value={department.value}>
                  {department.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="col-span-full grid gap-1.5 rounded-xl border border-[#e2ebf8] bg-white p-3">
          <label className="text-[0.88rem] font-bold">Assign Subjects</label>
          <p className="text-[0.82rem] text-text-muted">
            Both teacher and student can be assigned multiple subjects.
          </p>
          <div className="grid grid-cols-1 gap-2 min-[901px]:grid-cols-2">
            {SUBJECT_OPTIONS.map((subject) => (
              <label
                key={subject.value}
                htmlFor={`subject-${subject.value}`}
                className="flex items-center gap-2 rounded-lg border border-[#dbe6f6] px-3 py-2"
              >
                <input
                  id={`subject-${subject.value}`}
                  type="checkbox"
                  checked={formData.subjects.includes(subject.value)}
                  onChange={() => handleSubjectToggle(subject.value)}
                  disabled={isSubmitting}
                />
                <span className="text-[0.92rem]">{subject.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="col-span-full mt-0.5 flex justify-start">
          <button type="submit" className={primaryButtonClassName} disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </form>

      {(errorMessage || successMessage) && (
        <p
          className={
            errorMessage
              ? "mb-1 mt-0.5 text-[0.88rem] font-bold text-[#c02f2f]"
              : "my-2.5 text-[0.9rem] font-bold text-[#1e7f3f]"
          }
        >
          {errorMessage || successMessage}
        </p>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
        <label htmlFor="filter-role" className="text-[0.88rem] font-bold">
          Filter Users
        </label>
        <div className="w-full min-[540px]:w-[220px]">
          <select
            id="filter-role"
            className={fieldInputClassName}
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            disabled={isLoadingUsers}
          >
            <option value="all">All</option>
            <option value="teacher">Teachers</option>
            <option value="student">Students</option>
          </select>
        </div>
      </div>

      {isLoadingUsers ? (
        <p className="mt-[10px] text-text-muted">Loading managed users...</p>
      ) : (
        <div className="mt-3 grid gap-2.5">
          {managedUsers.length === 0 ? (
            <p className="mt-[10px] text-text-muted">No users found for this filter.</p>
          ) : (
            managedUsers.map((user) => (
              <article
                key={user.id}
                className="rounded-xl border border-[#e2ebf8] bg-white p-3"
              >
                <div className="flex flex-col gap-2.5 min-[901px]:flex-row min-[901px]:items-start min-[901px]:justify-between">
                  <div>
                    <h4 className="font-heading text-[1rem]">{user.name}</h4>
                    <p className="mt-1 text-[0.9rem] text-text-muted">{user.identifier}</p>
                    <p className="mt-1 text-[0.86rem] text-[#344054]">
                      <strong>Departments:</strong>{" "}
                      {formatOptionList(user.departments, DEPARTMENT_LABEL_BY_VALUE)}
                    </p>
                    <p className="mt-1 text-[0.86rem] text-[#344054]">
                      <strong>Subjects:</strong>{" "}
                      {formatOptionList(user.subjects, SUBJECT_LABEL_BY_VALUE)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[0.78rem] font-bold capitalize ${getRolePillClassName(user.role)}`}
                    >
                      {user.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user)}
                      disabled={deletingUserId === user.id}
                      className="rounded-lg border border-[#f6c8c8] bg-[#fff2f2] px-3 py-1.5 text-[0.82rem] font-bold text-[#b42318] transition-colors hover:bg-[#ffe4e4] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingUserId === user.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default AdminUserManagementPanel;
