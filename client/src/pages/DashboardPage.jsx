import { useEffect, useState } from 'react'
import { getAllIssues } from '../services/issueService'
import StatCard from '../components/StatCard'
import ComplaintCard from '../components/ComplaintCard'

function DashboardPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchComplaints()
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
        err.response?.data?.message || 'Failed to fetch dashboard data.'
      )
    } finally {
      setLoading(false)
    }
  }

  const totalComplaints = complaints.length
  const pendingCount = complaints.filter(
    (item) =>
      item.status?.toLowerCase() === 'submitted' ||
      item.status?.toLowerCase() === 'pending'
  ).length
  const inProgressCount = complaints.filter(
    (item) => item.status?.toLowerCase() === 'in progress'
  ).length
  const resolvedCount = complaints.filter(
    (item) => item.status?.toLowerCase() === 'resolved'
  ).length

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Transparent overview of all complaints.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Complaints" value={totalComplaints} />
        <StatCard title="Pending" value={pendingCount} />
        <StatCard title="In Progress" value={inProgressCount} />
        <StatCard title="Resolved" value={resolvedCount} />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          Loading complaints...
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          No complaints found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id || complaint.complaintId}
              complaint={complaint}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default DashboardPage