import { useEffect, useMemo, useState } from 'react'
import i18n from '../i18n'

function StaffDashboardPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng)
    }

    i18n.on('languageChanged', handleLanguageChanged)
    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [])

  const complaints = [
    {
      id: 1,
      title: i18n.t('staffDashboard.sample1Title'),
      description: i18n.t('staffDashboard.sample1Desc'),
      status: i18n.t('staffDashboard.pending'),
      area: 'Ward 5',
    },
    {
      id: 2,
      title: i18n.t('staffDashboard.sample2Title'),
      description: i18n.t('staffDashboard.sample2Desc'),
      status: i18n.t('staffDashboard.resolved'),
      area: 'Ward 4',
    },
    {
      id: 3,
      title: i18n.t('staffDashboard.sample3Title'),
      description: i18n.t('staffDashboard.sample3Desc'),
      status: i18n.t('staffDashboard.resolved'),
      area: 'Ward 8',
    },
    {
      id: 4,
      title: i18n.t('staffDashboard.sample4Title'),
      description: i18n.t('staffDashboard.sample4Desc'),
      status: i18n.t('staffDashboard.pending'),
      area: 'Ward 2',
    },
  ]

  const filteredComplaints = useMemo(() => {
    if (statusFilter === 'all') return complaints
    return complaints.filter(
      (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
    )
  }, [statusFilter, currentLanguage])

  const total = complaints.length
  const pending = complaints.filter(
    (item) => item.status === i18n.t('staffDashboard.pending')
  ).length
  const inProgress = complaints.filter(
    (item) => item.status === i18n.t('staffDashboard.inProgress')
  ).length
  const resolved = complaints.filter(
    (item) => item.status === i18n.t('staffDashboard.resolved')
  ).length

  const getBadgeClass = (status) => {
    if (status === i18n.t('staffDashboard.resolved')) {
      return 'bg-green-100 text-green-600'
    }
    if (status === i18n.t('staffDashboard.inProgress')) {
      return 'bg-violet-100 text-violet-600'
    }
    return 'bg-amber-100 text-amber-600'
  }

  return (
    <section className="space-y-6">
      <div className="bg-blue-700 rounded-3xl text-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              🧑‍💼 {i18n.t('staffDashboard.title')}
            </h1>
            <p className="text-white/90 mt-2">
              {i18n.t('staffDashboard.department')}
            </p>
          </div>

          <div className="text-sm font-medium bg-white/10 px-4 py-2 rounded-xl">
            {i18n.t('staffDashboard.staffLabel')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-blue-600">{total}</div>
          <div className="mt-2 text-slate-600">{i18n.t('staffDashboard.total')}</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-amber-500">{pending}</div>
          <div className="mt-2 text-slate-600">{i18n.t('staffDashboard.pending')}</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-violet-500">{inProgress}</div>
          <div className="mt-2 text-slate-600">{i18n.t('staffDashboard.inProgress')}</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-green-500">{resolved}</div>
          <div className="mt-2 text-slate-600">{i18n.t('staffDashboard.resolved')}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium mb-2">
          {i18n.t('staffDashboard.filterByStatus')}
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{i18n.t('staffDashboard.all')}</option>
          <option value={i18n.t('staffDashboard.pending')}>
            {i18n.t('staffDashboard.pending')}
          </option>
          <option value={i18n.t('staffDashboard.inProgress')}>
            {i18n.t('staffDashboard.inProgress')}
          </option>
          <option value={i18n.t('staffDashboard.resolved')}>
            {i18n.t('staffDashboard.resolved')}
          </option>
        </select>
      </div>

      <div className="space-y-5">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{complaint.title}</h3>
                <p className="mt-2 text-slate-600">{complaint.description}</p>

                <div className="mt-4 text-sm text-slate-600 flex flex-wrap gap-x-6 gap-y-2">
                  <span>📍 {i18n.t('staffDashboard.locationViewMap')}</span>
                  <span>
                    <strong>{i18n.t('staffDashboard.area')}:</strong> {complaint.area}
                  </span>
                </div>

                {complaint.status === i18n.t('staffDashboard.pending') && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      {i18n.t('staffDashboard.startWorking')}
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      {i18n.t('staffDashboard.resolve')}
                    </button>
                    <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      {i18n.t('staffDashboard.reject')}
                    </button>
                  </div>
                )}

                {complaint.status === i18n.t('staffDashboard.inProgress') && (
                  <div className="mt-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      {i18n.t('staffDashboard.markResolved')}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getBadgeClass(
                    complaint.status
                  )}`}
                >
                  {complaint.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StaffDashboardPage