import { useMemo, useState } from 'react'

function MyComplaintsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const complaints = [
    {
      id: 1,
      title: 'water stagnant',
      description:
        'water stagnant in the street due to heavy rain for the past 2 weeks. Kindly take action regarding this issue.',
      category: 'Water Supply Issue',
      date: '19/12/2025',
      status: 'Pending',
      evidenceCount: 1,
      gps: '13.018305, 80.219906',
    },
    {
      id: 2,
      title: 'water stagnant',
      description:
        'water stagnant in the street due to heavy rain for the past 2 weeks please take action regarding this issue.',
      category: 'Water Supply Issue',
      date: '19/12/2025',
      status: 'Resolved',
      evidenceCount: 1,
      gps: '13.018305, 80.219906',
    },
    {
      id: 3,
      title: 'irregular supply of drinking water',
      description:
        'for the past 2 weeks, the water is not supplied in our locality. Kindly please take action on this issue.',
      category: 'Water Supply Issue',
      date: '19/12/2025',
      status: 'Resolved',
      evidenceCount: 1,
      gps: '13.018305, 80.219906',
    },
  ]

  const filteredComplaints = useMemo(() => {
    if (statusFilter === 'all') return complaints
    return complaints.filter(
      (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
    )
  }, [statusFilter])

  const total = complaints.length
  const pending = complaints.filter((item) => item.status === 'Pending').length
  const inProgress = complaints.filter((item) => item.status === 'In Progress').length
  const resolved = complaints.filter((item) => item.status === 'Resolved').length

  const getBadgeClass = (status) => {
    if (status === 'Resolved') return 'bg-green-100 text-green-600'
    if (status === 'In Progress') return 'bg-violet-100 text-violet-600'
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
            <h1 className="text-4xl font-bold">My Complaints</h1>
            <p className="mt-2 text-slate-600">
              View all your submitted complaints and their current status
            </p>
          </div>

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold transition">
            + New Complaint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-blue-600">{total}</div>
          <div className="mt-2 text-slate-600">Total</div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="text-4xl font-bold text-amber-500">{pending}</div>
          <div className="mt-2 text-slate-600">Pending</div>
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
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
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
                    📷 View Evidence ({complaint.evidenceCount})
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
    </section>
  )
}

export default MyComplaintsPage