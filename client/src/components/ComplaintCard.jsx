function ComplaintCard({ complaint }) {
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-semibold">{complaint.issueTitle}</h3>
          <p className="text-sm text-slate-500">{complaint.category}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
            complaint.status
          )}`}
        >
          {complaint.status || 'Submitted'}
        </span>
      </div>

      <div className="space-y-1 text-sm text-slate-600">
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
  )
}

export default ComplaintCard