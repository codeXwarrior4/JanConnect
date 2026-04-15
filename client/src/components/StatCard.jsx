function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="text-3xl font-bold mt-2 text-slate-800">{value}</h3>
    </div>
  )
}

export default StatCard