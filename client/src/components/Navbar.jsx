import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState(null)

  const profileRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const syncUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('janconnect_user')
        setUser(storedUser ? JSON.parse(storedUser) : null)
      } catch {
        setUser(null)
      }
    }

    syncUserFromStorage()
    window.addEventListener('storage', syncUserFromStorage)

    return () => {
      window.removeEventListener('storage', syncUserFromStorage)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-white text-sky-600 shadow-sm'
        : 'text-white/95 hover:bg-white/20 hover:text-white'
    }`

  const closeAllMenus = () => {
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('janconnect_token')
    localStorage.removeItem('janconnect_user')
    setUser(null)
    closeAllMenus()
    navigate('/login')
  }

  const displayName = user?.name || 'Guest User'
  const displayEmail = user?.email || 'janconnect@example.com'
  const isLoggedIn = Boolean(localStorage.getItem('janconnect_token'))

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-sky-400 to-blue-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={closeAllMenus}
            className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap"
          >
            JanConnect
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="w-11 h-11 rounded-full bg-white/95 text-sky-600 flex items-center justify-center shadow-sm hover:bg-white transition"
                aria-label="Profile"
                title="Profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                    <p className="text-xs text-slate-500">{displayEmail}</p>
                  </div>

                  <div className="py-2">
                    {isLoggedIn ? (
                      <>
                        <Link
                          to="/my-complaints"
                          onClick={closeAllMenus}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Complaints
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={closeAllMenus}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/report"
                          onClick={closeAllMenus}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Report Issue
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={closeAllMenus}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={closeAllMenus}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="border-t border-slate-100 py-2">
                    {isLoggedIn ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={closeAllMenus}
                        className="block px-4 py-2 text-sm text-sky-600 hover:bg-sky-50"
                      >
                        Login to continue
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden w-11 h-11 rounded-xl bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition"
              aria-label="Open menu"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-end gap-2 mt-4">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink to="/report" className={navClass}>
                Report Issue
              </NavLink>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
              <NavLink to="/my-complaints" className={navClass}>
                My Complaints
              </NavLink>
            </>
          )}

          <NavLink to="/track" className={navClass}>
            Track Complaint
          </NavLink>
          <NavLink to="/staff-login" className={navClass}>
            Staff Login
          </NavLink>

          {!isLoggedIn && (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClass}>
                Register
              </NavLink>
            </>
          )}
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-3 space-y-2">
            <NavLink to="/" className={navClass} onClick={closeAllMenus}>
              Home
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink to="/report" className={navClass} onClick={closeAllMenus}>
                  Report Issue
                </NavLink>
                <NavLink to="/dashboard" className={navClass} onClick={closeAllMenus}>
                  Dashboard
                </NavLink>
                <NavLink
                  to="/my-complaints"
                  className={navClass}
                  onClick={closeAllMenus}
                >
                  My Complaints
                </NavLink>
              </>
            )}

            <NavLink to="/track" className={navClass} onClick={closeAllMenus}>
              Track Complaint
            </NavLink>

            <NavLink to="/staff-dashboard" className={navClass} onClick={closeAllMenus}>
              Staff Portal
            </NavLink>

            {!isLoggedIn && (
              <>
                <NavLink to="/login" className={navClass} onClick={closeAllMenus}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navClass} onClick={closeAllMenus}>
                  Register
                </NavLink>
              </>
            )}

            <div className="border-t border-white/20 pt-3 mt-3">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-10 h-10 rounded-full bg-white text-sky-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{displayName}</p>
                  <p className="text-white/80 text-xs">{displayEmail}</p>
                </div>
              </div>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-white/95 hover:bg-white/20"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeAllMenus}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white/95 hover:bg-white/20"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar