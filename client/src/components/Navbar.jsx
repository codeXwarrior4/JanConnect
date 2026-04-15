import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-slate-700 hover:bg-slate-200'
    }`

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-700">
          JanConnect
        </Link>

        <nav className="flex flex-wrap gap-2">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/report" className={navClass}>
            Report Issue
          </NavLink>
          <NavLink to="/track" className={navClass}>
            Track Complaint
          </NavLink>
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar