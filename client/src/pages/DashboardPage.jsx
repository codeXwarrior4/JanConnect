import { useEffect, useMemo, useState } from 'react'
import { getAllIssues } from '../services/issueService'
import i18n from '../i18n'

function DashboardPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')

  useEffect(() => {
    fetchComplaints()

    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng)
    }

    i18n.on('languageChanged', handleLanguageChanged)
    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await getAllIssues()

      const issues = Array.isArray(response)
        ? response
        : Array.isArray(response.data)
        ? response.data
        : []

      setComplaints(issues)
    } catch (err) {
      setError(
        err.response?.data?.message || i18n.t('dashboard.fetchError')
      )
    } finally {
      setLoading(false)
    }
  }

  const normalizedComplaints = useMemo(() => {
    return complaints.map((item, index) => ({
      ...item,
      complaintId: item.complaintId || `JC${1000 + index}`,
      issueTitle: item.issueTitle || i18n.t('dashboard.defaultTitle'),
      description: item.description || i18n.t('dashboard.defaultDescription'),
      category: item.category || i18n.t('dashboard.defaultCategory'),
      area: item.area || i18n.t('dashboard.defaultArea'),
      status: item.status || i18n.t('dashboard.pending'),
      createdAt: item.createdAt || new Date().toISOString(),
      evidenceCount: item.evidenceCount || 1,
    }))
  }, [complaints, currentLanguage])

  const filteredComplaints =
    statusFilter === 'all'
      ? normalizedComplaints
      : normalizedComplaints.filter(
          (item) => item.status.toLowerCase() === statusFilter
        )

  const totalComplaints = normalizedComplaints.length
  const pendingCount = normalizedComplaints.filter((item) =>
    ['submitted', 'pending'].includes(item.status.toLowerCase())
  ).length
  const inProgressCount = normalizedComplaints.filter(
    (item) => item.status.toLowerCase() === 'in progress'
  ).length
  const resolvedCount = normalizedComplaints.filter(
    (item) => item.status.toLowerCase() === 'resolved'
  ).length

  const getBadgeClass = (status) => {
    const normalized = status.toLowerCase()

    if (normalized === 'resolved') {
      return 'bg-green-100 text-green-600'
    }

    if (normalized === 'in progress') {
      return 'bg-violet-100 text-violet-600'
    }

    return 'bg-amber-100 text-amber-600'
  }

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">{i18n.t('dashboard.title')}</h1>
            <p className="mt-2 text-slate-600">
              {i18n.t('dashboard.subtitle')}
            </p>
          </div>

          <button
            onClick={fetchComplaints}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            {i18n.t('dashboard.refresh')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-blue-600">{totalComplaints}</div>
          <div className="mt-2 text-slate-600">{i18n.t('dashboard.total')}</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-amber-500">{pendingCount}</div>
          <div className="mt-2 text-slate-600">{i18n.t('dashboard.pending')}</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-violet-500">{inProgressCount}</div>
          <div className="mt-2 text-slate-600">{i18n.t('dashboard.inProgress')}</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-green-500">{resolvedCount}</div>
          <div className="mt-2 text-slate-600">{i18n.t('dashboard.resolved')}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium mb-2">
          {i18n.t('dashboard.filterByStatus')}
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{i18n.t('dashboard.allComplaints')}</option>
          <option value="pending">{i18n.t('dashboard.pending')}</option>
          <option value="submitted">{i18n.t('dashboard.submitted')}</option>
          <option value="in progress">{i18n.t('dashboard.inProgress')}</option>
          <option value="resolved">{i18n.t('dashboard.resolved')}</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          {i18n.t('dashboard.loading')}
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          {i18n.t('dashboard.noComplaints')}
        </div>
      ) : (
        <div className="space-y-5">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint._id || complaint.complaintId}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{complaint.issueTitle}</h3>
                  <p className="mt-2 text-slate-600 line-clamp-2">
                    {complaint.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium">
                      📷 {i18n.t('dashboard.viewEvidence')} ({complaint.evidenceCount})
                    </span>
                  </div>

                  <div className="mt-4 text-sm text-slate-600 flex flex-wrap gap-x-6 gap-y-2">
                    <span>
                      <strong>{i18n.t('dashboard.category')}:</strong> {complaint.category}
                    </span>
                    <span>
                      <strong>{i18n.t('dashboard.area')}:</strong> {complaint.area}
                    </span>
                    <span>
                      <strong>{i18n.t('dashboard.date')}:</strong>{' '}
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      <strong>{i18n.t('dashboard.id')}:</strong> {complaint.complaintId}
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
                    {i18n.t('dashboard.viewDetails')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default DashboardPage