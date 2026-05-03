import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyIssues } from '../services/issueService'
import StatusTimeline from '../components/StatusTimeline'
import i18n from '../i18n'

function MyComplaintsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyComplaints()
  }, [])

  const fetchMyComplaints = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('janconnect_token')

      if (!token) {
        setComplaints([])
        setError('Please login first to view your complaints.')
        return
      }

      const response = await getMyIssues()
      const issues = Array.isArray(response?.data) ? response.data : []
      setComplaints(issues)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch your complaints.')
      setComplaints([])
    } finally {
      setLoading(false)
    }
  }

  const normalizedComplaints = useMemo(() => {
    return complaints.map((item) => ({
      ...item,
      id: item._id,
      title: item.title || 'Untitled complaint',
      description: item.description || 'No description available.',
      category: item.category || 'General',
      date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : i18n.t('trackComplaint.na'),
      updatedAt: item.updatedAt
        ? new Date(item.updatedAt).toLocaleString([], {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : i18n.t('trackComplaint.na'),
      status: item.status || 'Submitted',
      gps:
        item.latitude !== undefined && item.longitude !== undefined
          ? `${item.latitude}, ${item.longitude}`
          : 'Not available',
    }))
  }, [complaints])

  const filteredComplaints = useMemo(() => {
    if (statusFilter === 'all') return normalizedComplaints

    return normalizedComplaints.filter(
      (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
    )
  }, [normalizedComplaints, statusFilter])

  const total = normalizedComplaints.length
  const pending = normalizedComplaints.filter((item) =>
    ['submitted', 'under review'].includes(item.status.toLowerCase())
  ).length
  const inProgress = normalizedComplaints.filter(
    (item) => item.status.toLowerCase() === 'in progress'
  ).length
  const resolved = normalizedComplaints.filter(
    (item) => item.status.toLowerCase() === 'resolved'
  ).length

  const getBadgeClass = (status) => {
    const normalized = status.toLowerCase()

    if (normalized === 'resolved') return 'bg-green-100 text-green-600'
    if (normalized === 'in progress') return 'bg-violet-100 text-violet-600'
    if (normalized === 'under review') return 'bg-blue-100 text-blue-600'
    return 'bg-amber-100 text-amber-600'
  }

  const toggleExpanded = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h1 className="text-4xl font-bold">{i18n.t('myComplaints.title')}</h1>
          <p className="mt-2 text-slate-600">{i18n.t('dashboard.loading')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">{i18n.t('myComplaints.title')}</h1>
            <p className="mt-2 text-slate-600">{i18n.t('myComplaints.subtitle')}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchMyComplaints}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-semibold transition"
            >
              {i18n.t('dashboard.refresh')}
            </button>

            <Link
              to="/report"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              {i18n.t('myComplaints.newComplaint')}
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-blue-600">{total}</div>
          <div className="mt-2 text-slate-600">{i18n.t('myComplaints.total')}</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-amber-500">{pending}</div>
          <div className="mt-2 text-slate-600">Submitted / Under Review</div>
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
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="In Progress">{i18n.t('myComplaints.inProgress')}</option>
          <option value="Resolved">{i18n.t('myComplaints.resolved')}</option>
        </select>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800">No complaints found</h3>
          <p className="mt-2 text-slate-600">
            Submit your first complaint to start tracking it here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredComplaints.map((complaint) => {
            const isExpanded = expandedId === complaint.id

            return (
              <div
                key={complaint.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold">{complaint.title}</h3>
                      <span className="text-sm font-medium text-slate-500">
                        {complaint.complaintId}
                      </span>
                    </div>

                    <p className="mt-2 text-slate-600">{complaint.description}</p>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                      <p>
                        <strong>{i18n.t('myComplaints.category')}:</strong> {complaint.category}
                      </p>
                      <p>
                        <strong>{i18n.t('myComplaints.date')}:</strong> {complaint.date}
                      </p>
                      <p>
                        <strong>GPS:</strong> {complaint.gps}
                      </p>
                      <p>
                        <strong>Last Updated:</strong> {complaint.updatedAt}
                      </p>
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

                    <button
                      onClick={() => toggleExpanded(complaint.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {isExpanded ? 'Hide Details ↑' : i18n.t('myComplaints.viewDetails')}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 space-y-5">
                    <StatusTimeline currentStatus={complaint.status} />

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Location Preview</h4>
                          <p className="mt-1 text-sm text-slate-600">{complaint.gps}</p>
                        </div>

                        <a
                          href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center bg-slate-900 text-white px-4 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default MyComplaintsPage