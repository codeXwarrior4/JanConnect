import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'

function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('janconnect_token')

    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

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
    setSuccessMessage('')

    try {
      const { name, email, password, confirmPassword } = formData

      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Please fill in all fields.')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.')
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.')
      }

      await API.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      })

      setSuccessMessage('Registration successful. Redirecting to login...')

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1200)
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || 'Registration failed.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Create Your Account</h1>
        <p className="text-center text-slate-600 mb-6">
          Register to report and track civic issues
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-xl bg-green-100 text-green-700 px-4 py-3">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage