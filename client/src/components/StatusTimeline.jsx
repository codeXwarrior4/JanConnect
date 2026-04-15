function StatusTimeline({ currentStatus = 'Submitted' }) {
  const steps = ['Submitted', 'Under Review', 'In Progress', 'Resolved']

  const currentIndex = steps.findIndex((step) => step === currentStatus)
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0

  const getStepState = (index) => {
    if (index < safeCurrentIndex) return 'completed'
    if (index === safeCurrentIndex) return 'current'
    return 'upcoming'
  }

  const getCircleClass = (state) => {
    if (state === 'completed') {
      return 'bg-green-500 text-white border-green-500'
    }

    if (state === 'current') {
      return 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100'
    }

    return 'bg-white text-slate-400 border-slate-300'
  }

  const getLineClass = (index) => {
    return index < safeCurrentIndex ? 'bg-green-500' : 'bg-slate-200'
  }

  const getLabelClass = (state) => {
    if (state === 'completed') return 'text-green-700'
    if (state === 'current') return 'text-blue-700'
    return 'text-slate-500'
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Complaint Progress</h3>
          <p className="text-sm text-slate-600">
            Current stage: <span className="font-semibold">{currentStatus}</span>
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-start justify-between gap-3">
        {steps.map((step, index) => {
          const state = getStepState(index)
          const isLast = index === steps.length - 1

          return (
            <div key={step} className="flex-1 flex items-start">
              <div className="flex flex-col items-center text-center min-w-[90px]">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition ${getCircleClass(
                    state
                  )}`}
                >
                  {state === 'completed' ? '✓' : index + 1}
                </div>
                <p className={`mt-3 text-sm font-semibold ${getLabelClass(state)}`}>
                  {step}
                </p>
              </div>

              {!isLast && (
                <div className="flex-1 pt-5 px-2">
                  <div className={`h-1 rounded-full ${getLineClass(index)}`} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="space-y-3 md:hidden">
        {steps.map((step, index) => {
          const state = getStepState(index)
          const isLast = index === steps.length - 1

          return (
            <div key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${getCircleClass(
                    state
                  )}`}
                >
                  {state === 'completed' ? '✓' : index + 1}
                </div>
                {!isLast && <div className={`mt-2 w-1 flex-1 rounded-full ${getLineClass(index)}`} />}
              </div>

              <div className="pt-2 pb-4">
                <p className={`text-sm font-semibold ${getLabelClass(state)}`}>{step}</p>
                <p className="text-xs text-slate-500">
                  {state === 'completed'
                    ? 'Completed'
                    : state === 'current'
                    ? 'Current stage'
                    : 'Pending'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StatusTimeline
