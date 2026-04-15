import { useState } from 'react'
import { createIssue } from '../services/issueService'

function ReportIssuePage() {
  const [formData, setFormData] = useState({
    name: '',
    issueTitle: '',
    category: '',
    description: '',
    area: '',
    latitude: '',
    longitude: '',
  })

  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [complaintId, setComplaintId] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setError('')
    setLocationLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }))
        setLocationLoading(false)
      },
      () => {
        setError('Unable to fetch location. Please allow location access.')
        setLocationLoading(false)
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')
    setComplaintId('')

    try {
      const payload = {
        name: formData.name,
        issueTitle: formData.issueTitle,
        category: formData.category,
        description: formData.description,
        area: formData.area,
        location: {
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
      }

      const response = await createIssue(payload)

      setSuccessMessage('Issue submitted successfully.')
      setComplaintId(response.complaintId || response.data?.complaintId || '')
      setFormData({
        name: '',
        issueTitle: '',
        category: '',
        description: '',
        area: '',
        latitude: '',
        longitude: '',
      })
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit issue. Try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-2">Report Issue</h1>
        <p className="text-slate-600 mb-6">
          Fill in the details below to register a civic complaint.
        </p>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-xl">
            <p>{successMessage}</p>
            {complaintId && (
              <p className="mt-1 font-semibold">Complaint ID: {complaintId}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Issue Title</label>
            <input
              type="text"
              name="issueTitle"
              value={formData.issueTitle}
              onChange={handleChange}
              placeholder="e.g. Pothole on main road"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              <option value="Pothole">Pothole</option>
              <option value="Garbage">Garbage</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Drainage">Drainage</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue"
              rows="4"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Area</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Enter area/locality"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-slate-500">
                  Use browser geolocation to capture latitude and longitude.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                className="bg-slate-800 text-white px-5 py-3 rounded-xl hover:bg-slate-900 transition"
              >
                {locationLoading ? 'Getting Location...' : 'Get Location'}
              </button>
            </div>

            {(formData.latitude || formData.longitude) && (
              <div className="mt-4 text-sm text-slate-700 space-y-1">
                <p>
                  <span className="font-medium">Latitude:</span>{' '}
                  {formData.latitude}
                </p>
                <p>
                  <span className="font-medium">Longitude:</span>{' '}
                  {formData.longitude}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? 'Submitting...' : 'Submit Issue'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ReportIssuePage