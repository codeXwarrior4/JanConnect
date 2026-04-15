import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="min-h-[80vh] flex items-center">
      <div className="w-full grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Smart City Citizen Management System
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
            Report civic issues with transparency using JanConnect
          </h1>
          <p className="mt-5 text-slate-600 text-lg leading-8">
            Citizens can report issues like potholes, garbage, water leakage,
            and streetlight problems. Track complaint progress and make city
            maintenance more transparent.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/report"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Report Issue
            </Link>
            <Link
              to="/track"
              className="bg-white border border-slate-300 text-slate-800 px-6 py-3 rounded-xl font-medium hover:bg-slate-100 transition"
            >
              Track Complaint
            </Link>
            <Link
              to="/dashboard"
              className="bg-slate-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-900 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Why JanConnect?</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold">Geo-tagged complaints</h3>
              <p className="text-slate-600 text-sm mt-1">
                Capture user location directly from the browser.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold">Complaint tracking</h3>
              <p className="text-slate-600 text-sm mt-1">
                Users can track status through complaint ID.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold">Transparent dashboard</h3>
              <p className="text-slate-600 text-sm mt-1">
                Show total, pending, in progress, and resolved complaints.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage