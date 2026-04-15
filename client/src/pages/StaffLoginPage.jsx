import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StaffLoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    // DEMO LOGIN (you can connect backend later)
    if (email === 'staff@janconnect.com' && password === '123456') {
      navigate('/staff-dashboard')
    } else {
      alert('Invalid staff credentials')
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-200 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          Staff Login
        </h1>
        <p className="text-center text-slate-500 mb-6">
          Login to access staff dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Staff Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
            required
          />

          <button className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition">
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-500 text-center">
          <p>Demo Credentials:</p>
          <p>staff@janconnect.com / 123456</p>
        </div>
      </div>
    </section>
  )
}

export default StaffLoginPage