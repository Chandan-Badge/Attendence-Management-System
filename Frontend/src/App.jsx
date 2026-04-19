import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";
import MakeAttendancePage from "./Pages/MakeAttendancePage";
import RoleSelectionPage from "./Pages/RoleSelectionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />
      <Route path="/login/:roleKey" element={<LoginPage />} />
      <Route path="/dashboard/:roleKey" element={<DashboardPage />} />
      <Route path="/dashboard/:roleKey/attendance" element={<MakeAttendancePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;