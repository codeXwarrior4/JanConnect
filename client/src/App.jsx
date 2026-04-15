import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import HomePage from "./pages/HomePage.jsx";
import ReportIssuePage from "./pages/ReportIssuePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TrackComplaintPage from "./pages/TrackComplaintPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import MyComplaintsPage from "./pages/MyComplaintsPage.jsx";
import StaffDashboardPage from "./pages/StaffDashboardPage.jsx";
import StaffLoginPage from "./pages/StaffLoginPage.jsx";

import Map from "./Map"; // ✅ Leaflet Map import

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* 🔥 Temporary Map preview (optional - remove later if not needed) */}
        <div className="mb-6">
          <Map />
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/track" element={<TrackComplaintPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-complaints" element={<MyComplaintsPage />} />
          <Route path="/staff-dashboard" element={<StaffDashboardPage />} />
          <Route path="/staff-login" element={<StaffLoginPage />} />
        </Routes>

      </main>
    </div>
  );
}

export default App;