import { Link } from 'react-router-dom'
import i18n from '../i18n'

function HomePage() {
  const stats = [
    { label: i18n.t('home.totalComplaints'), value: '0', color: 'text-blue-600' },
    { label: i18n.t('home.pending'), value: '0', color: 'text-amber-500' },
    { label: i18n.t('home.inProgress'), value: '0', color: 'text-violet-500' },
    { label: i18n.t('home.resolved'), value: '0', color: 'text-green-500' },
  ]

  const steps = [
    {
      title: i18n.t('home.step1Title'),
      description: i18n.t('home.step1Desc'),
    },
    {
      title: i18n.t('home.step2Title'),
      description: i18n.t('home.step2Desc'),
    },
    {
      title: i18n.t('home.step3Title'),
      description: i18n.t('home.step3Desc'),
    },
  ]

  return (
    <section className="space-y-10">
      <div className="rounded-3xl bg-white px-6 py-16 md:py-24 text-center shadow-sm border border-slate-200">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
          {i18n.t('home.heroTitle')}
        </h1>

        <p className="mt-4 text-lg md:text-xl text-slate-600">
          {i18n.t('home.heroSubtitle')}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/report"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            {i18n.t('home.getStarted')}
          </Link>

          <Link
            to="/track"
            className="bg-slate-100 text-blue-600 hover:bg-slate-200 px-8 py-3 rounded-xl font-semibold transition"
          >
            {i18n.t('home.trackComplaint')}
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8">
          {i18n.t('home.platformStats')}
        </h2>
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

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10">
        <h2 className="text-3xl font-bold text-center mb-8">
          {i18n.t('home.howItWorks')}
        </h2>

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