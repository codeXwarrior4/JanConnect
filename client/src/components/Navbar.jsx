import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import i18n from '../i18n'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')
  const profileRef = useRef(null)

  const navClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-white text-sky-600 shadow-sm'
        : 'text-white/95 hover:bg-white/20 hover:text-white'
    }`

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeAllMenus = () => {
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng)
    setCurrentLanguage(lng)
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-sky-400 to-blue-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={closeAllMenus}
            className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap"
          >
            {i18n.t('appName')}
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentLanguage.startsWith('en')
                    ? 'bg-white text-sky-600'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('hi')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentLanguage.startsWith('hi')
                    ? 'bg-white text-sky-600'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                हिं
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('mr')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentLanguage.startsWith('mr')
                    ? 'bg-white text-sky-600'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                म
              </button>
            </div>

            <div className="relative hidden md:block" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="w-11 h-11 rounded-full bg-white/95 text-sky-600 flex items-center justify-center shadow-sm hover:bg-white transition"
                aria-label={i18n.t('nav.profile')}
                title={i18n.t('nav.profile')}
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
                    <p className="text-sm font-semibold text-slate-800">Guest User</p>
                    <p className="text-xs text-slate-500">janconnect@example.com</p>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/my-complaints"
                      onClick={closeAllMenus}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {i18n.t('nav.myComplaints')}
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={closeAllMenus}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {i18n.t('nav.dashboard')}
                    </Link>
                    <Link
                      to="/login"
                      onClick={closeAllMenus}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {i18n.t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeAllMenus}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {i18n.t('nav.register')}
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 py-2">
                    <Link
                      to="/login"
                      onClick={closeAllMenus}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      {i18n.t('nav.logout')}
                    </Link>
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
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-end gap-2 mt-4">
          <NavLink to="/" className={navClass}>
            {i18n.t('nav.home')}
          </NavLink>
          <NavLink to="/dashboard" className={navClass}>
            {i18n.t('nav.dashboard')}
          </NavLink>
          <NavLink to="/track" className={navClass}>
            {i18n.t('nav.trackComplaint')}
          </NavLink>
          <NavLink to="/staff-login" className={navClass}>
            {i18n.t('nav.staffLogin')}
          </NavLink>
          <NavLink to="/login" className={navClass}>
            {i18n.t('nav.login')}
          </NavLink>
          <NavLink to="/register" className={navClass}>
            {i18n.t('nav.register')}
          </NavLink>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-3 space-y-2">
            <NavLink to="/" className={navClass} onClick={closeAllMenus}>
              {i18n.t('nav.home')}
            </NavLink>
            <NavLink to="/dashboard" className={navClass} onClick={closeAllMenus}>
              {i18n.t('nav.dashboard')}
            </NavLink>
            <NavLink to="/track" className={navClass} onClick={closeAllMenus}>
              {i18n.t('nav.trackComplaint')}
            </NavLink>
            <NavLink to="/staff-login" className={navClass} onClick={closeAllMenus}>
              {i18n.t('nav.staffLogin')}
            </NavLink>
            <NavLink to="/login" className={navClass} onClick={closeAllMenus}>
              {i18n.t('nav.login')}
            </NavLink>
            <NavLink to="/register" className={navClass} onClick={closeAllMenus}>
              {i18n.t('nav.register')}
            </NavLink>

            <div className="border-t border-white/20 pt-3 mt-3">
              <div className="flex gap-2 px-2 mb-3">
                <button
                  type="button"
                  onClick={() => changeLanguage('en')}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-sky-600"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => changeLanguage('hi')}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-sky-600"
                >
                  हिं
                </button>
                <button
                  type="button"
                  onClick={() => changeLanguage('mr')}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-sky-600"
                >
                  म
                </button>
              </div>

              <Link
                to="/my-complaints"
                onClick={closeAllMenus}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-white/95 hover:bg-white/20"
              >
                {i18n.t('nav.myComplaints')}
              </Link>
              <Link
                to="/login"
                onClick={closeAllMenus}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-white/95 hover:bg-white/20"
              >
                {i18n.t('nav.logout')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar