import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
        throw new Error('Please fill in all fields.')
      }

      setTimeout(() => {
        if (formData.role === 'staff') {
          navigate('/staff-dashboard')
        } else {
          navigate('/dashboard')
        }
      }, 700)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setTimeout(() => setLoading(false), 700)
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Login to Your Account</h1>
        <p className="text-center text-slate-600 mb-6">
          Access your complaint dashboard or staff panel
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Login As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="citizen">Citizen</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <h2 className="font-semibold mb-2">Test Accounts</h2>
          <p className="text-sm text-slate-600">Admin: admin@city.gov.in / password123</p>
          <p className="text-sm text-slate-600">
            Citizen: john@example.com / password123
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage