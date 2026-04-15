import { Link } from 'react-router-dom'

function HomePage() {
  const stats = [
    { label: 'Total Complaints', value: '0', color: 'text-blue-600' },
    { label: 'Pending', value: '0', color: 'text-amber-500' },
    { label: 'In Progress', value: '0', color: 'text-violet-500' },
    { label: 'Resolved', value: '0', color: 'text-green-500' },
  ]

  const steps = [
    {
      title: 'Raise a complaint',
      description:
        'Submit your civic issue with title, category, location, and description.',
    },
    {
      title: 'Attach location and proof',
      description:
        'Capture GPS coordinates and optionally add complaint evidence.',
    },
    {
      title: 'Track complaint status',
      description:
        'Monitor whether your complaint is pending, in progress, or resolved.',
    },
  ]

  return (
    <section className="space-y-10">

      {/* HERO SECTION (WHITE CLEAN) */}
      <div className="rounded-3xl bg-white px-6 py-16 md:py-24 text-center shadow-sm border border-slate-200">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
          Make Your Voice Heard
        </h1>

        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Report civic issues and help improve your community using JanConnect
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/report"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Get Started
          </Link>

          <Link
            to="/track"
            className="bg-slate-100 text-blue-600 hover:bg-slate-200 px-8 py-3 rounded-xl font-semibold transition"
          >
            Track Complaint
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Platform Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center"
            >
              <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="mt-3 text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-600 leading-7">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

export default HomePage