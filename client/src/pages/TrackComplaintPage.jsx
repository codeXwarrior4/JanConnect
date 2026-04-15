import { useState } from 'react'
import { getIssueByComplaintId } from '../services/issueService'

function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [complaint, setComplaint] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!complaintId.trim()) {
      setError('Please enter a complaint ID.')
      return
    }

    setLoading(true)
    setError('')
    setComplaint(null)

    try {
      const response = await getIssueByComplaintId(complaintId.trim())

      setComplaint(response.data)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Complaint not found. Please check the ID.'
      )
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    const s = status?.toLowerCase()

    if (s === 'resolved') return 'bg-green-100 text-green-600'
    if (s === 'in progress') return 'bg-purple-100 text-purple-600'
    if (s === 'under review') return 'bg-blue-100 text-blue-600'
    return 'bg-yellow-100 text-yellow-600'
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Track Your Complaint
        </h1>

        <p className="text-center text-slate-600 mb-6">
          Enter your complaint ID to check the latest status
        </p>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="Enter Complaint ID (e.g. JAN123456)"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {complaint && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{complaint.title}</h2>

              <span
                className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(
                  complaint.status
                )}`}
              >
                {complaint.status}
              </span>
            </div>

            <p className="text-slate-600">{complaint.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <strong>Category:</strong> {complaint.category}
              </p>
              <p>
                <strong>Area:</strong> {complaint.area}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Complaint ID:</strong> {complaint.complaintId}
              </p>
            </div>

            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl">
              📍 Location: {complaint.latitude}, {complaint.longitude}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TrackComplaintPage