import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import i18n from '../i18n'

function LoginPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'citizen',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const email = formData.email.trim().toLowerCase()

      if (!email || !formData.password) {
        throw new Error(i18n.t('errors.fillAllFields'))
      }

      setTimeout(() => {
        if (formData.role === 'staff') {
          navigate('/staff-dashboard')
        } else {
          navigate('/dashboard')
        }
      }, 700)
    } catch (err) {
      setError(err.message || i18n.t('errors.loginFailed'))
    } finally {
      setTimeout(() => setLoading(false), 700)
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-md border border-slate-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">
          {i18n.t('login.title')}
        </h1>

        <p className="text-center text-slate-600 mb-6">
          {i18n.t('login.subtitle')}
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              {i18n.t('login.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {i18n.t('login.password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={i18n.t('login.passwordPlaceholder')}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {i18n.t('login.role')}
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="citizen">{i18n.t('login.citizen')}</option>
              <option value="staff">{i18n.t('login.staff')}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition disabled:opacity-70"
          >
            {loading ? i18n.t('login.loading') : i18n.t('login.button')}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          {i18n.t('login.noAccount')}{' '}
          <Link
            to="/register"
            className="text-sky-600 font-medium hover:underline"
          >
            {i18n.t('login.register')}
          </Link>
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <h2 className="font-semibold mb-2">{i18n.t('login.testAccounts')}</h2>
          <p className="text-sm text-slate-600">
            Admin: admin@city.gov.in / password123
          </p>
          <p className="text-sm text-slate-600">
            Citizen: john@example.com / password123
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage