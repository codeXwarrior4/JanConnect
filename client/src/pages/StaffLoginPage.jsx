import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import i18n from '../i18n'

function StaffLoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (email === 'staff@janconnect.com' && password === '123456') {
      navigate('/staff-dashboard')
    } else {
      setError(i18n.t('staffLogin.invalidCredentials'))
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-200 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          {i18n.t('staffLogin.title')}
        </h1>

        <p className="text-center text-slate-500 mb-6">
          {i18n.t('staffLogin.subtitle')}
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder={i18n.t('staffLogin.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-400"
            required
          />

          <input
            type="password"
            placeholder={i18n.t('staffLogin.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-400"
            required
          />

          <button className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition font-semibold">
            {i18n.t('staffLogin.button')}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-500 text-center">
          <p>{i18n.t('staffLogin.demoCredentials')}</p>
          <p>staff@janconnect.com / 123456</p>
        </div>
      </div>
    </section>
  )
}

export default StaffLoginPage