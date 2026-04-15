import { useState } from 'react'
import { getIssueByComplaintId } from '../services/issueService'
import StatusTimeline from '../components/StatusTimeline'

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
      const response = await getIssueByComplaintId(complaintId.trim().toUpperCase())
      setComplaint(response.data)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Complaint not found. Please check the ID and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    const s = status?.toLowerCase()

    if (s === 'resolved') return 'bg-green-100 text-green-700 border-green-200'
    if (s === 'in progress') return 'bg-violet-100 text-violet-700 border-violet-200'
    if (s === 'under review') return 'bg-blue-100 text-blue-700 border-blue-200'
    return 'bg-amber-100 text-amber-700 border-amber-200'
  }

  const formatDate = (value) => {
    if (!value) return 'N/A'

    return new Date(value).toLocaleString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-4xl font-bold text-center mb-4">Track Your Complaint</h1>

        <p className="text-center text-slate-600 mb-6 max-w-2xl mx-auto">
          Enter your complaint ID to view the latest progress, complaint details,
          and current resolution stage.
        </p>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-2">
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
            placeholder="Enter Complaint ID (e.g. JAN123456)"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? 'Searching...' : 'Track Complaint'}
          </button>
        </form>
      </div>

      {complaint && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Complaint ID</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{complaint.complaintId}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Current Status</p>
              <div className="mt-2">
                <span
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-bold border ${getStatusClass(
                    complaint.status
                  )}`}
                >
                  {complaint.status}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Reported On</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatDate(complaint.createdAt)}
              </p>
            </div>
          </div>

          <StatusTimeline currentStatus={complaint.status} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Complaint Summary</p>
                  <h2 className="mt-1 text-3xl font-bold text-slate-900">{complaint.title}</h2>
                  <p className="mt-3 text-slate-600 leading-7">{complaint.description}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-slate-500">Citizen Name</p>
                  <p className="mt-1 font-semibold text-slate-900">{complaint.name || 'N/A'}</p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-slate-500">Category</p>
                  <p className="mt-1 font-semibold text-slate-900">{complaint.category || 'N/A'}</p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-slate-500">Area</p>
                  <p className="mt-1 font-semibold text-slate-900">{complaint.area || 'N/A'}</p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-slate-500">Last Updated</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatDate(complaint.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">Location</h3>
                <p className="mt-3 text-sm text-slate-600 leading-6">
                  Latitude: <span className="font-semibold">{complaint.latitude}</span>
                  <br />
                  Longitude: <span className="font-semibold">{complaint.longitude}</span>
                </p>

                <a
                  href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center bg-slate-900 text-white px-4 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
                >
                  Open in Google Maps
                </a>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-blue-900">What this means</h3>
                <p className="mt-3 text-sm text-blue-800 leading-6">
                  Your complaint is currently marked as <strong>{complaint.status}</strong>.
                  The progress tracker above shows which stage is completed and what step comes next.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default TrackComplaintPage
