import { useEffect, useRef, useState } from 'react'
import ComplaintLocationPicker from '../components/ComplaintLocationPicker'
import { createIssue } from '../services/issueService'

function ReportIssuePage() {
  const initialFormData = {
    name: '',
    issueTitle: '',
    category: '',
    description: '',
    area: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
  }

  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [capturedImages, setCapturedImages] = useState([])
  const [locationAccuracy, setLocationAccuracy] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [complaintId, setComplaintId] = useState('')

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const messageRef = useRef(null)
  const streamRef = useRef(null)

  const categoryOptions = [
    'Garbage Not Collected - Sanitation',
    'Pipeline Leak - Water Management',
    'Power Outage - Electricity Board',
    'Road Damage - Public Works',
    'Street Light - Public Works',
    'Water Supply Issue - Water Management',
  ]

  const scrollToMessage = () => {
    setTimeout(() => {
      messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleLocationChange = ({ latitude, longitude }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: String(latitude),
      longitude: String(longitude),
    }))
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setSuccessMessage('')
      scrollToMessage()
      return
    }

    setError('')
    setSuccessMessage('')
    setLocationLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }))
        setLocationAccuracy(position.coords.accuracy || '')
        setLocationLoading(false)
      },
      () => {
        setError('Unable to fetch location. Please allow location access.')
        setSuccessMessage('')
        setLocationLoading(false)
        scrollToMessage()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const openCamera = async () => {
    try {
      setError('')
      setSuccessMessage('')

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported in this browser.')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream
      setCameraOpen(true)
    } catch (err) {
      setError(
        err?.message || 'Unable to access camera. Please allow camera permission.'
      )
      setSuccessMessage('')
      scrollToMessage()
    }
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setCameraOpen(false)
  }

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current
        .play()
        .catch(() => {})
    }
  }, [cameraOpen])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    if (capturedImages.length >= 5) {
      setError('You can keep up to 5 evidence images only.')
      setSuccessMessage('')
      scrollToMessage()
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const width = video.videoWidth || 1280
    const height = video.videoHeight || 720

    canvas.width = width
    canvas.height = height

    context.drawImage(video, 0, 0, width, height)

    const imageData = canvas.toDataURL('image/jpeg', 0.9)

    setCapturedImages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        src: imageData,
        type: 'camera',
        name: `camera-capture-${prev.length + 1}.jpg`,
      },
    ])
  }

  const handleAlbumUpload = (e) => {
    const files = Array.from(e.target.files || [])

    if (!files.length) return

    const remainingSlots = 5 - capturedImages.length

    if (remainingSlots <= 0) {
      setError('Maximum 5 evidence images allowed.')
      setSuccessMessage('')
      scrollToMessage()
      return
    }

    const selectedFiles = files.slice(0, remainingSlots)

    const readers = selectedFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () =>
            resolve({
              id: `${Date.now()}-${file.name}-${Math.random()}`,
              src: reader.result,
              type: 'upload',
              name: file.name,
            })
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
    )

    Promise.all(readers)
      .then((images) => {
        setCapturedImages((prev) => [...prev, ...images])
      })
      .catch(() => {
        setError('Failed to read selected images.')
        setSuccessMessage('')
        scrollToMessage()
      })

    e.target.value = ''
  }

  const removeImage = (idToRemove) => {
    setCapturedImages((prev) => prev.filter((image) => image.id !== idToRemove))
  }

  const clearAllImages = () => {
    setCapturedImages([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')
    setComplaintId('')

    try {
      const token = localStorage.getItem('janconnect_token')

      if (!token) {
        throw new Error('Please login first to submit a complaint.')
      }

      if (!formData.latitude || !formData.longitude) {
        throw new Error('Please select complaint location first.')
      }

      const payload = {
        name: formData.name.trim(),
        title: formData.issueTitle.trim(),
        issueTitle: formData.issueTitle.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        area: formData.area.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        location: {
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        },
        evidenceCount: capturedImages.length,
        evidenceImages: capturedImages.map((img) => img.src),
      }

      const response = await createIssue(payload)

      const newComplaintId =
        response?.complaintId ||
        response?.data?.complaintId ||
        response?.data?.data?.complaintId ||
        ''

      setSuccessMessage('Complaint submitted successfully.')
      setComplaintId(newComplaintId)
      setFormData(initialFormData)
      setCapturedImages([])
      setLocationAccuracy('')
      closeCamera()
      scrollToMessage()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to submit complaint. Try again.'
      )
      setSuccessMessage('')
      scrollToMessage()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-4 pb-10">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-900">
          Report New Complaint
        </h1>
        <p className="text-center text-slate-600 mt-2 mb-8">
          Geo-tag the issue, attach evidence, and submit it instantly.
        </p>

        <div ref={messageRef}>
          {error && (
            <div className="mb-5 rounded-2xl bg-red-100 border border-red-200 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 rounded-2xl bg-green-100 border border-green-200 px-4 py-3 text-green-700">
              <p className="font-semibold">{successMessage}</p>
              {complaintId && (
                <p className="mt-1">
                  Complaint ID: <span className="font-bold">{complaintId}</span>
                </p>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
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
                placeholder="e.g. Pothole near bus stop"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the issue clearly"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
                placeholder="Enter area/locality"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street / landmark"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="rounded-3xl border-2 border-blue-200 bg-blue-50 p-5 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  📍 Step 1: Geo-tag Location *
                </h2>
                <p className="text-slate-600 mt-1">
                  Use current location and adjust the pin for exact accuracy.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600"
              >
                {locationLoading ? 'Getting Location...' : 'Use Current Location'}
              </button>
            </div>

            <div className="mt-5">
              <ComplaintLocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                accuracy={locationAccuracy}
                onLocationChange={handleLocationChange}
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Latitude"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Longitude"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-yellow-300 bg-amber-50 p-5 md:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  📸 Step 2: Capture Photos/Videos *
                </h2>
                <p className="text-slate-600 mt-1">
                  Add complaint evidence from camera or album/gallery.
                </p>
              </div>

              <div className="text-sm font-medium text-slate-700">
                {capturedImages.length}/5 selected
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {!cameraOpen ? (
                <button
                  type="button"
                  onClick={openCamera}
                  className="w-full rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-white transition hover:bg-emerald-600"
                >
                  Open Camera
                </button>
              ) : (
                <button
                  type="button"
                  onClick={closeCamera}
                  className="w-full rounded-2xl bg-slate-800 py-4 text-lg font-semibold text-white transition hover:bg-slate-900"
                >
                  Close Camera
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-2xl bg-blue-500 py-4 text-lg font-semibold text-white transition hover:bg-blue-600"
              >
                Import from Album
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAlbumUpload}
                className="hidden"
              />
            </div>

            {cameraOpen && (
              <div className="mt-5 rounded-2xl border border-slate-300 bg-black overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={() => {
                    videoRef.current?.play().catch(() => {})
                  }}
                  className="w-full h-[260px] md:h-[360px] object-cover bg-black"
                />
              </div>
            )}

            {cameraOpen && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
                >
                  Take Photo
                </button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {capturedImages.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Selected Evidence
                  </h3>

                  <button
                    type="button"
                    onClick={clearAllImages}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {capturedImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <img
                        src={image.src}
                        alt={`Evidence ${index + 1}`}
                        className="h-48 w-full rounded-xl object-cover bg-slate-100"
                      />

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {image.name || `Evidence ${index + 1}`}
                          </p>
                          <p className="text-xs text-slate-500">
                            {image.type === 'camera' ? 'Captured from camera' : 'Imported from album'}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="shrink-0 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-500 py-4 text-xl font-semibold text-white transition hover:bg-blue-600 disabled:opacity-70"
          >
            {loading ? 'Submitting Complaint...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ReportIssuePage