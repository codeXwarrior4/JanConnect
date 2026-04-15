import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import ReportIssuePage from './pages/ReportIssuePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TrackComplaintPage from './pages/TrackComplaintPage.jsx'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/track" element={<TrackComplaintPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App