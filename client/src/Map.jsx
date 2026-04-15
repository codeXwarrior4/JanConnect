function Map({ latitude, longitude }) {
  const hasLocation = latitude && longitude

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Location Preview</h3>

      {hasLocation ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Latitude: <span className="font-medium">{latitude}</span>
          </p>
          <p className="text-sm text-slate-600">
            Longitude: <span className="font-medium">{longitude}</span>
          </p>

          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition"
          >
            Open in Google Maps
          </a>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No location selected yet.</p>
      )}
    </div>
  )
}

export default Map