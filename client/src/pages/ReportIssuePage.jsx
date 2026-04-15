import { useEffect, useRef, useState } from 'react'
import { createIssue } from '../services/issueService'

function ReportIssuePage() {
  const [formData, setFormData] = useState({
    name: '',
    issueTitle: '',
    category: '',
    description: '',
    area: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
  })

  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [capturedImages, setCapturedImages] = useState([])
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [complaintId, setComplaintId] = useState('')

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const categoryOptions = [
    'Garbage Not Collected - Sanitation',
    'Pipeline Leak - Water Management',
    'Power Outage - Electricity Board',
    'Road Damage - Public Works',
    'Street Light - Public Works',
    'Water Supply Issue - Water Management',
  ]

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

  const openCamera = async () => {
    try {
      setError('')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })

      streamRef.current = stream
      setCameraOpen(true)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 0)
    } catch {
      setError('Unable to access camera. Please allow camera permission.')
    }
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraOpen(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 360
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = canvas.toDataURL('image/png')
    setCapturedImages((prev) => [...prev, imageData])

    window.alert(`Photo ${capturedImages.length + 1} captured!`)
  }

  const removeImage = (indexToRemove) => {
    setCapturedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    )
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

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
        address: formData.address,
        city: formData.city,
        location: {
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        evidenceCount: capturedImages.length,
      }

      const response = await createIssue(payload)

      setSuccessMessage('Complaint submitted successfully.')
      setComplaintId(response.complaintId || response.data?.complaintId || '')
      setFormData({
        name: '',
        issueTitle: '',
        category: '',
        description: '',
        area: '',
        address: '',
        city: '',
        latitude: '',
        longitude: '',
      })
      setCapturedImages([])
      closeCamera()
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit complaint. Try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-4xl font-bold text-center mb-2">Submit New Complaint</h1>
        <p className="text-center text-slate-600 mb-8">
          GPS and evidence capture supported for transparent complaint reporting
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Issue Title *</label>
              <input
                type="text"
                name="issueTitle"
                value={formData.issueTitle}
                onChange={handleChange}
                placeholder="e.g. Water stagnant on road"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the complaint in detail"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Area *</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Enter area or locality"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
            <h2 className="text-xl font-bold mb-4">📍 Step 1: Capture GPS Location *</h2>

            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              {locationLoading ? 'Getting Current Location...' : 'Get Current Location'}
            </button>

            {(formData.latitude || formData.longitude) && (
              <div className="mt-4 bg-green-100 text-green-700 rounded-xl px-4 py-3 font-medium">
                ✅ Location: {formData.latitude}, {formData.longitude}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none"
              />
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address (optional)"
                className="md:col-span-2 w-full px-4 py-3 border border-slate-300 rounded-xl outline-none"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="md:col-span-2 w-full px-4 py-3 border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
            <h2 className="text-xl font-bold mb-2">📸 Step 2: Capture Photos/Videos *</h2>
            <p className="text-sm text-slate-600 mb-4">
              Take complaint evidence using your browser camera
            </p>

            <div className="space-y-4">
              {!cameraOpen ? (
                <button
                  type="button"
                  onClick={openCamera}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  Open Camera
                </button>
              ) : (
                <>
                  <div className="w-full rounded-2xl overflow-hidden bg-black border border-slate-800">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-[260px] object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold transition"
                    >
                      Take Photo ({capturedImages.length}/5)
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold transition"
                    >
                      Start Recording (0/2)
                    </button>
                    <button
                      type="button"
                      onClick={closeCamera}
                      className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold transition"
                    >
                      Close Camera
                    </button>
                  </div>
                </>
              )}

              <canvas ref={canvasRef} className="hidden" />

              {capturedImages.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Captured Evidence</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {capturedImages.map((image, index) => (
                      <div
                        key={image}
                        className="bg-white border border-slate-200 rounded-2xl p-3"
                      >
                        <img
                          src={image}
                          alt={`Complaint evidence ${index + 1}`}
                          className="w-full h-40 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="mt-3 w-full bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg font-medium transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-70"
          >
            {loading ? 'Submitting Complaint...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ReportIssuePage