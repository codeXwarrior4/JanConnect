import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function MapUpdater({ center }) {
  const map = useMap()

  if (center?.lat && center?.lng) {
    map.setView([center.lat, center.lng], 17, { animate: true })
  }

  return null
}

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick({
        latitude: event.latlng.lat.toFixed(6),
        longitude: event.latlng.lng.toFixed(6),
      })
    },
  })

  return null
}

function ComplaintLocationPicker({
  latitude,
  longitude,
  accuracy,
  onLocationChange,
}) {
  const hasLocation = Boolean(latitude) && Boolean(longitude)

  const defaultCenter = hasLocation
    ? { lat: Number(latitude), lng: Number(longitude) }
    : { lat: 18.5204, lng: 73.8567 }

  const markerPosition = hasLocation
    ? [Number(latitude), Number(longitude)]
    : null

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden border border-slate-200">
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}
          zoom={hasLocation ? 17 : 12}
          scrollWheelZoom
          className="h-80 w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapUpdater center={defaultCenter} />
          <MapClickHandler onPick={onLocationChange} />

          {markerPosition && (
            <Marker
              position={markerPosition}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const marker = event.target
                  const position = marker.getLatLng()

                  onLocationChange({
                    latitude: position.lat.toFixed(6),
                    longitude: position.lng.toFixed(6),
                  })
                },
              }}
            >
              <Popup>
                Complaint location selected
                <br />
                Drag marker or click map to adjust.
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500 mb-1">Latitude</p>
          <p className="font-semibold text-slate-900">
            {latitude || 'Not selected'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500 mb-1">Longitude</p>
          <p className="font-semibold text-slate-900">
            {longitude || 'Not selected'}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500 mb-1">GPS Accuracy</p>
        <p className="font-semibold text-slate-900">
          {accuracy ? `~ ${Math.round(Number(accuracy))} meters` : 'Not available yet'}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Tip: Tap “Use Current Location”, then drag the pin if GPS is slightly off.
        </p>
      </div>

      {hasLocation && (
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800"
        >
          Open in Google Maps
        </a>
      )}
    </div>
  )
}

export default ComplaintLocationPicker