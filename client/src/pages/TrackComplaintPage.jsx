import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { getIssueByComplaintId } from "../services/issueService"
import "leaflet/dist/leaflet.css"

function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState("")
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setComplaint(null)

    try {
      const res = await getIssueByComplaintId(complaintId.trim())
      const data = res?.data?.data || res?.data || res
      setComplaint(data)
    } catch {
      setError("Complaint not found")
    } finally {
      setLoading(false)
    }
  }

  const lat = complaint?.latitude
  const lng = complaint?.longitude
  const hasLocation = lat && lng

  return (
    <section className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Track Complaint</h1>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
            placeholder="Enter Complaint ID"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-70"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {complaint && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Complaint ID</p>
                <p className="font-semibold">{complaint.complaintId || "-"}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Status</p>
                <p className="font-semibold">{complaint.status || "-"}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Title</p>
                <p className="font-semibold">{complaint.title || complaint.issueTitle || "-"}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Category</p>
                <p className="font-semibold">{complaint.category || "-"}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Area</p>
                <p className="font-semibold">{complaint.area || "-"}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Description</p>
                <p className="font-semibold">{complaint.description || "-"}</p>
              </div>
            </div>

            {hasLocation && (
              <>
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <MapContainer
                    center={[Number(lat), Number(lng)]}
                    zoom={17}
                    className="h-80 w-full"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[Number(lat), Number(lng)]}>
                      <Popup>Complaint Location 📍</Popup>
                    </Marker>
                  </MapContainer>
                </div>

                <a
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  Open in Google Maps
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default TrackComplaintPage