
import { useState } from 'react'
import { getIssueByComplaintId } from '../services/issueService'

function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [complaint, setComplaint] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setComplaint(null)

    try {
      const response = await getIssueByComplaintId(complaintId.trim())
      const issue = response.data || response
      setComplaint(issue)
    } catch (err) {
      setError(
        err.response?.data?.message || 'Complaint not found. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const getStatusStyle = (status) => {
    const normalized = status?.toLowerCase()

    if (normalized === 'resolved') {
      return 'bg-green-100 text-green-700'
    }

    if (normalized === 'in progress') {
      return 'bg-yellow-100 text-yellow-700'
    }

    if (normalized === 'under review') {
      return 'bg-purple-100 text-purple-700'
    }

    return 'bg-red-100 text-red-700'
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-2">Track Complaint</h1>
        <p className="text-slate-600 mb-6">
          Enter complaint ID to check the status of your issue.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="Enter Complaint ID"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="mt-5 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {complaint && (
          <div className="mt-6 border border-slate-200 rounded-2xl p-5 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold">{complaint.issueTitle}</h2>
                <p className="text-slate-500 text-sm">{complaint.category}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusStyle(
                  complaint.status
                )}`}
              >
                {complaint.status || 'Submitted'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-medium">Complaint ID:</span>{' '}
                {complaint.complaintId}
              </p>
              <p>
                <span className="font-medium">Area:</span> {complaint.area}
              </p>
              <p>
                <span className="font-medium">Description:</span>{' '}
                {complaint.description}
              </p>
              <p>
                <span className="font-medium">Date:</span>{' '}
                {complaint.createdAt
                  ? new Date(complaint.createdAt).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TrackComplaintPage