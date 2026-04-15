import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import API from '../api'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirectPath = location.state?.from || '/dashboard'

  useEffect(() => {
    const token = localStorage.getItem('janconnect_token')

    if (token) {
      navigate(redirectPath, { replace: true })
    }
  }, [navigate, redirectPath])

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

      const response = await API.post('/api/auth/login', {
        email,
        password: formData.password,
      })

      const result = response.data

      localStorage.setItem('janconnect_token', result.data.token)
      localStorage.setItem('janconnect_user', JSON.stringify(result.data))

      window.dispatchEvent(new Event('storage'))

      navigate(redirectPath, { replace: true })
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Login to Your Account</h1>
        <p className="text-center text-slate-600 mb-6">
          Access your JanConnect account
        </p>

        {location.state?.from && (
          <div className="mb-4 rounded-xl bg-blue-100 text-blue-700 px-4 py-3">
            Please login to continue.
          </div>
        )}

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
      </div>
    </section>
  )
}

export default LoginPage