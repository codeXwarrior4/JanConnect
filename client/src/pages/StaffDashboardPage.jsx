import { useMemo, useState } from 'react'

function StaffDashboardPage() {
  const [statusFilter, setStatusFilter] = useState('all')

  const complaints = [
    {
      id: 1,
      title: 'water stagnant',
      description:
        'water stagnant in the street due to heavy rain for the past 2 weeks. Kindly take action regarding this issue.',
      status: 'Pending',
      area: 'Ward 5',
    },
    {
      id: 2,
      title: 'water stagnant',
      description:
        'water stagnant in the street due to heavy rain for the past 2 weeks please take action regarding this issue.',
      status: 'Resolved',
      area: 'Ward 4',
    },
    {
      id: 3,
      title: 'irregular supply of drinking water',
      description:
        'for the past 2 weeks, the water is not supplied in our locality. Kindly please take action on this issue.',
      status: 'Resolved',
      area: 'Ward 8',
    },
    {
      id: 4,
      title: 'pipeline leakage near main road',
      description:
        'continuous leakage causing water wastage and inconvenience to nearby residents.',
      status: 'Pending',
      area: 'Ward 2',
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

  return (
    <section className="space-y-6">
      <div className="bg-blue-700 rounded-3xl text-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧑‍💼 Staff Dashboard</h1>
            <p className="text-white/90 mt-2">Water Management Department</p>
          </div>

          <div className="text-sm font-medium bg-white/10 px-4 py-2 rounded-xl">
            Water Dept Staff
          </div>
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
          <option value="all">All</option>
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

                <div className="mt-4 text-sm text-slate-600 flex flex-wrap gap-x-6 gap-y-2">
                  <span>📍 Location: View on Map →</span>
                  <span>
                    <strong>Area:</strong> {complaint.area}
                  </span>
                </div>

                {complaint.status === 'Pending' && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      Start Working
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      Resolve
                    </button>
                    <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      Reject
                    </button>
                  </div>
                )}

                {complaint.status === 'In Progress' && (
                  <div className="mt-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getBadgeClass(
                    complaint.status
                  )}`}
                >
                  {complaint.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StaffDashboardPage