import { useEffect, useMemo, useState } from 'react'
import { getAllIssues, updateIssueStatus } from '../services/issueService'

function StaffDashboardPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const statusOptions = [
    'Submitted',
    'Under Review',
    'In Progress',
    'Resolved',
  ]

  const fetchIssues = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getAllIssues()
      const data = Array.isArray(response?.data) ? response.data : []
      setIssues(data)
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to load complaints.'
      )
      setIssues([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      setUpdatingId(issueId)
      setError('')

      const response = await updateIssueStatus(issueId, newStatus)
      const updatedIssue = response?.data

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId ? { ...issue, ...updatedIssue } : issue
        )
      )
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to update complaint status.'
      )
    } finally {
      setUpdatingId('')
    }
  }

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesStatus =
        statusFilter === 'all' ? true : issue.status === statusFilter

      const term = searchTerm.trim().toLowerCase()
      const matchesSearch =
        !term ||
        issue.complaintId?.toLowerCase().includes(term) ||
        issue.title?.toLowerCase().includes(term) ||
        issue.category?.toLowerCase().includes(term) ||
        issue.area?.toLowerCase().includes(term) ||
        issue.name?.toLowerCase().includes(term)

      return matchesStatus && matchesSearch
    })
  }, [issues, searchTerm, statusFilter])

  const stats = useMemo(() => {
    return {
      total: issues.length,
      submitted: issues.filter((i) => i.status === 'Submitted').length,
      underReview: issues.filter((i) => i.status === 'Under Review').length,
      inProgress: issues.filter((i) => i.status === 'In Progress').length,
      resolved: issues.filter((i) => i.status === 'Resolved').length,
    }
  }, [issues])

  const getStatusBadgeClass = (status) => {
    if (status === 'Resolved') return 'bg-green-100 text-green-700'
    if (status === 'In Progress') return 'bg-violet-100 text-violet-700'
    if (status === 'Under Review') return 'bg-blue-100 text-blue-700'
    return 'bg-amber-100 text-amber-700'
  }

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Staff Dashboard</h1>
            <p className="mt-2 text-slate-600">
              Review all reported complaints and update their status
            </p>
          </div>

          <button
            onClick={fetchIssues}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-semibold transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm">
          <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
          <div className="mt-2 text-slate-600">Total</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm">
          <div className="text-3xl font-bold text-amber-600">{stats.submitted}</div>
          <div className="mt-2 text-slate-600">Submitted</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm">
          <div className="text-3xl font-bold text-blue-600">{stats.underReview}</div>
          <div className="mt-2 text-slate-600">Under Review</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm">
          <div className="text-3xl font-bold text-violet-600">{stats.inProgress}</div>
          <div className="mt-2 text-slate-600">In Progress</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm">
          <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
          <div className="mt-2 text-slate-600">Resolved</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Search complaints</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by complaint ID, title, area, citizen..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Filter by status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <p className="text-slate-600">Loading complaints...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-slate-800">No complaints found</h3>
          <p className="mt-2 text-slate-600">
            Try a different search or status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredIssues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold">{issue.title}</h3>
                    <span className="text-sm font-medium text-slate-500">
                      {issue.complaintId}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusBadgeClass(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  <p className="mt-3 text-slate-600">{issue.description}</p>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                    <p>
                      <strong>Citizen:</strong> {issue.name || 'N/A'}
                    </p>
                    <p>
                      <strong>Category:</strong> {issue.category || 'N/A'}
                    </p>
                    <p>
                      <strong>Area:</strong> {issue.area || 'N/A'}
                    </p>
                    <p>
                      <strong>Date:</strong>{' '}
                      {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="md:col-span-2">
                      <strong>GPS:</strong> {issue.latitude}, {issue.longitude}
                    </p>
                  </div>
                </div>

                <div className="w-full lg:w-64">
                  <label className="block text-sm font-medium mb-2">
                    Update status
                  </label>

                  <select
                    value={issue.status}
                    onChange={(e) =>
                      handleStatusChange(issue._id, e.target.value)
                    }
                    disabled={updatingId === issue._id}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {updatingId === issue._id && (
                    <p className="mt-2 text-sm text-slate-500">Updating status...</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default StaffDashboardPage