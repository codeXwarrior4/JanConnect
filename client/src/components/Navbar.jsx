import { Link, NavLink, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? 'bg-green-500 text-white'
        : 'text-white/90 hover:bg-white/10 hover:text-white'
    }`

  const isStaffPage = location.pathname === '/staff-dashboard'
  const isCitizenLoggedIn =
    location.pathname === '/report' ||
    location.pathname === '/my-complaints' ||
    location.pathname === '/dashboard'
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register'

  return (
    <header className="sticky top-0 z-50 bg-blue-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          Complaint Management
        </Link>

        {!isStaffPage && !isCitizenLoggedIn && !isAuthPage && (
          <nav className="flex flex-wrap gap-2">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/track" className={navClass}>
              Track Complaint
            </NavLink>
            <NavLink to="/login" className={navClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={navClass}>
              Register
            </NavLink>
          </nav>
        )}

        {isAuthPage && (
          <nav className="flex flex-wrap gap-2">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/login" className={navClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={navClass}>
              Register
            </NavLink>
          </nav>
        )}

        {isCitizenLoggedIn && !isStaffPage && (
          <nav className="flex flex-wrap gap-2">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/report" className={navClass}>
              New Complaint
            </NavLink>
            <NavLink to="/my-complaints" className={navClass}>
              My Complaints
            </NavLink>
            <NavLink to="/track" className={navClass}>
              All Issues
            </NavLink>
            <Link
              to="/login"
              className="px-3 py-2 rounded-md text-sm font-medium transition bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </Link>
          </nav>
        )}

        {isStaffPage && (
          <nav className="flex flex-wrap gap-2">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/staff-dashboard" className={navClass}>
              Staff Portal
            </NavLink>
            <button
              type="button"
              className="px-3 py-2 rounded-md text-sm font-medium transition bg-slate-700 text-white hover:bg-slate-800"
            >
              Water Dept Staff
            </button>
            <Link
              to="/login"
              className="px-3 py-2 rounded-md text-sm font-medium transition bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Navbar