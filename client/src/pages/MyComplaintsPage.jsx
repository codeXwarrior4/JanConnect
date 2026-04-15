import { useEffect, useMemo, useState } from 'react'
import i18n from '../i18n'

function MyComplaintsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
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
      title: i18n.t('myComplaints.sample1Title'),
      description: i18n.t('myComplaints.sample1Desc'),
      category: i18n.t('myComplaints.waterSupplyIssue'),
      date: '19/12/2025',
      status: i18n.t('myComplaints.pending'),
      evidenceCount: 1,
      gps: '13.018305, 80.219906',
    },
    {
      id: 2,
      title: i18n.t('myComplaints.sample2Title'),
      description: i18n.t('myComplaints.sample2Desc'),
      category: i18n.t('myComplaints.waterSupplyIssue'),
      date: '19/12/2025',
      status: i18n.t('myComplaints.resolved'),
      evidenceCount: 1,
      gps: '13.018305, 80.219906',
    },
    {
      id: 3,
      title: i18n.t('myComplaints.sample3Title'),
      description: i18n.t('myComplaints.sample3Desc'),
      category: i18n.t('myComplaints.waterSupplyIssue'),
      date: '19/12/2025',
      status: i18n.t('myComplaints.resolved'),
      evidenceCount: 1,
      gps: '13.018305, 80.219906',
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
    (item) => item.status === i18n.t('myComplaints.pending')
  ).length
  const inProgress = complaints.filter(
    (item) => item.status === i18n.t('myComplaints.inProgress')
  ).length
  const resolved = complaints.filter(
    (item) => item.status === i18n.t('myComplaints.resolved')
  ).length

  const getBadgeClass = (status) => {
    if (status === i18n.t('myComplaints.resolved')) {
      return 'bg-green-100 text-green-600'
    }
    if (status === i18n.t('myComplaints.inProgress')) {
      return 'bg-violet-100 text-violet-600'
    }
    return 'bg-amber-100 text-amber-600'
  }

  const toggleExpanded = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">{i18n.t('myComplaints.title')}</h1>
            <p className="mt-2 text-slate-600">
              {i18n.t('myComplaints.subtitle')}
            </p>
          </div>

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold transition">
            {i18n.t('myComplaints.newComplaint')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-blue-600">{total}</div>
          <div className="mt-2 text-slate-600">{i18n.t('myComplaints.total')}</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-amber-500">{pending}</div>
          <div className="mt-2 text-slate-600">{i18n.t('myComplaints.pending')}</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-violet-500">{inProgress}</div>
          <div className="mt-2 text-slate-600">{i18n.t('myComplaints.inProgress')}</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-green-500">{resolved}</div>
          <div className="mt-2 text-slate-600">{i18n.t('myComplaints.resolved')}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium mb-2">
          {i18n.t('myComplaints.filterByStatus')}
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{i18n.t('myComplaints.allComplaints')}</option>
          <option value={i18n.t('myComplaints.pending')}>
            {i18n.t('myComplaints.pending')}
          </option>
          <option value={i18n.t('myComplaints.inProgress')}>
            {i18n.t('myComplaints.inProgress')}
          </option>
          <option value={i18n.t('myComplaints.resolved')}>
            {i18n.t('myComplaints.resolved')}
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

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => toggleExpanded(complaint.id)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                  >
                    📷 {i18n.t('myComplaints.viewEvidence')} ({complaint.evidenceCount})
                  </button>
                </div>

                {expandedId === complaint.id && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium">
                      ✓ GPS: {complaint.gps}
                    </div>
                  </div>
                )}

                <div className="mt-4 text-sm text-slate-600 flex flex-wrap gap-x-6 gap-y-2">
                  <span>
                    <strong>{i18n.t('myComplaints.category')}:</strong> {complaint.category}
                  </span>
                  <span>
                    <strong>{i18n.t('myComplaints.date')}:</strong> {complaint.date}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getBadgeClass(
                    complaint.status
                  )}`}
                >
                  {complaint.status}
                </span>

                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  {i18n.t('myComplaints.viewDetails')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MyComplaintsPage