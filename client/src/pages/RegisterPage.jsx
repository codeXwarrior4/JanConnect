import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import i18n from '../i18n'

function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        throw new Error(i18n.t('register.errors.fillAllFields'))
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error(i18n.t('register.errors.passwordsDoNotMatch'))
      }

      setSuccessMessage(i18n.t('register.success'))
      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (err) {
      setError(err.message || i18n.t('register.errors.registrationFailed'))
    } finally {
      setTimeout(() => setLoading(false), 800)
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          {i18n.t('register.title')}
        </h1>
        <p className="text-center text-slate-600 mb-6">
          {i18n.t('register.subtitle')}
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
            <label className="block text-sm font-medium mb-2">
              {i18n.t('register.fullName')}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={i18n.t('register.fullNamePlaceholder')}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                {i18n.t('register.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={i18n.t('register.emailPlaceholder')}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {i18n.t('register.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={i18n.t('register.phonePlaceholder')}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                {i18n.t('register.password')}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={i18n.t('register.passwordPlaceholder')}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {i18n.t('register.confirmPassword')}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={i18n.t('register.confirmPasswordPlaceholder')}
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
            {loading
              ? i18n.t('register.creatingAccount')
              : i18n.t('register.button')}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          {i18n.t('register.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            {i18n.t('register.loginHere')}
          </Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage