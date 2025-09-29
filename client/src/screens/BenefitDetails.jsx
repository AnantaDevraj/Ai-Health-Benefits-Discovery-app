import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBenefits } from '../context/BenefitsContext.jsx'
import { apiPlan } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function BenefitDetails() {
  const { selectedBenefit, userText } = useBenefits()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [plan, setPlan] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    if (!selectedBenefit) { navigate('/'); return }
    generate()
  },[])

  async function generate() {
    setLoading(true); setError('')
    try {
      const json = await apiPlan(selectedBenefit.id, userText)
      setPlan(json)
    } catch (e) {
      setError(e.message)
      // fallback minimal plan on UI if none
      setPlan({ steps:[
        { title:'Verify coverage', detail:'Check eligibility and gather ID.' },
        { title:'Book appointment', detail:'Collect prescriptions and bills.' },
        { title:'Submit claim', detail:'Send documents and follow up.' }
      ], notes:'Local fallback plan.' })
    } finally {
      setLoading(false)
    }
  }

  if (!selectedBenefit) return null

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">Plan for {selectedBenefit.title}</h2>
          <div className="text-sm text-gray-600 dark:text-gray-300">{selectedBenefit.description}</div>
        </div>
        <button onClick={generate} className="px-3 py-1.5 rounded border">Regenerate Plan</button>
      </div>
      {loading ? (
        <LoadingSpinner label="Generating plan..." />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : plan ? (
        <div className="space-y-3">
          <ol className="space-y-2">
            {plan.steps?.map((s, idx)=> (
              <li key={idx} className="p-3 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
                <div className="font-semibold">{idx+1}. {s.title}</div>
                <div className="text-sm opacity-90">{s.detail}</div>
                {s.estimated_time && <div className="text-xs mt-1 opacity-70">Estimated: {s.estimated_time}</div>}
              </li>
            ))}
          </ol>
          {plan.notes && <div className="text-sm opacity-80">Notes: {plan.notes}</div>}
        </div>
      ) : null}
    </div>
  )
}


