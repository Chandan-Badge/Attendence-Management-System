export const ROLE_CONFIG = {
  student: {
    title: "Student",
    shortCode: "STU",
    description:
      "Track daily attendance, subjects, and leave requests from one place.",
    accentPrimary: "#0ea5e9",
    accentSecondary: "#22d3ee",
    identifierLabel: "Enrollment Number",
    dashboard: {
      stats: [
        { label: "Attendance This Month", value: "92%" },
        { label: "Classes Today", value: "5" },
        { label: "Pending Leave Requests", value: "1" },
      ],
      actions: [
        "View subject attendance report",
        "Apply for leave",
        "Download monthly attendance sheet",
      ],
      updates: [
        "Math lecture moved to 11:00 AM",
        "Lab attendance closes at 4:30 PM",
        "Parent report shared for this week",
      ],
    },
  },
  teacher: {
    title: "Teacher",
    shortCode: "TCH",
    description:
      "Mark class attendance, review trends, and manage student attendance alerts.",
    accentPrimary: "#f97316",
    accentSecondary: "#fb923c",
    identifierLabel: "Faculty ID",
    dashboard: {
      stats: [
        { label: "Classes Assigned", value: "8" },
        { label: "Attendance Marked Today", value: "4" },
        { label: "Defaulter Alerts", value: "6" },
      ],
      actions: [
        "Take attendance for next class",
        "Review absentee list",
        "Send attendance alerts",
      ],
      updates: [
        "Semester B attendance summary ready",
        "2 classes pending attendance entry",
        "Meeting with admin at 3:00 PM",
      ],
    },
  },
  admin: {
    title: "Admin",
    shortCode: "ADM",
    description:
      "Monitor institute-wide attendance, manage users, and track compliance reports.",
    accentPrimary: "#16a34a",
    accentSecondary: "#4ade80",
    identifierLabel: "Admin Email",
    demoCredentials: {
      identifier: "admin@ams.com",
      password: "admin123",
    },
    dashboard: {
      stats: [
        { label: "Total Students", value: "1,248" },
        { label: "Total Teachers", value: "84" },
        { label: "Institute Attendance", value: "88%" },
      ],
      actions: [
        "Manage student accounts",
        "Approve leave and holiday rules",
        "Export compliance reports",
      ],
      updates: [
        "Monthly attendance audit starts tomorrow",
        "3 new faculty accounts require approval",
        "System backup completed at 02:15 AM",
      ],
    },
  },
};

export const getRoleConfig = (roleKey = "") => ROLE_CONFIG[roleKey.toLowerCase()] || null;
