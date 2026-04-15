import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyIssues } from '../services/issueService'

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
      setError(
        err?.response?.data?.message ||
          'Failed to fetch your complaints.'
      )
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
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : 'N/A',
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
          <h1 className="text-4xl font-bold">My Complaints</h1>
          <p className="mt-2 text-slate-600">Loading your complaints...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">My Complaints</h1>
            <p className="mt-2 text-slate-600">
              View all your submitted complaints and their current status
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchMyComplaints}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-semibold transition"
            >
              Refresh
            </button>

            <Link
              to="/report-issue"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              + New Complaint
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
          <div className="mt-2 text-slate-600">Total</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-amber-500">{pending}</div>
          <div className="mt-2 text-slate-600">Submitted / Under Review</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-violet-500">{inProgress}</div>
          <div className="mt-2 text-slate-600">In Progress</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-green-500">{resolved}</div>
          <div className="mt-2 text-slate-600">Resolved</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium mb-2">Filter by Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Complaints</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
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
          {filteredComplaints.map((complaint) => (
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

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => toggleExpanded(complaint.id)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                    >
                      📍 View Location
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
                      <strong>Category:</strong> {complaint.category}
                    </span>
                    <span>
                      <strong>Area:</strong> {complaint.area || 'N/A'}
                    </span>
                    <span>
                      <strong>Date:</strong> {complaint.date}
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
                    View Details →
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

export default MyComplaintsPage