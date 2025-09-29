export default function BenefitCard({ benefit, onView, recommended }) {
  return (
    <div className={`border rounded-md p-4 bg-white dark:bg-gray-800 dark:border-gray-700 ${recommended?'ring-2 ring-blue-500':''}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{benefit.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{benefit.description}</p>
          <div className="mt-2 text-xs"><span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">{benefit.coverage}</span></div>
        </div>
      </div>
      <div className="mt-3">
        <button className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={onView}>View Plan</button>
      </div>
    </div>
  )
}


