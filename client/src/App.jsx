import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import ReportIssuePage from './pages/ReportIssuePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TrackComplaintPage from './pages/TrackComplaintPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import MyComplaintsPage from './pages/MyComplaintsPage.jsx'
import StaffDashboardPage from './pages/StaffDashboardPage.jsx'
import StaffLoginPage from './pages/StaffLoginPage.jsx'


function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
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
           <Route path="/staff-dashboard" element={<StaffDashboardPage />} />
         
        </Routes>
      </main>
    </div>
  )
}

export default App