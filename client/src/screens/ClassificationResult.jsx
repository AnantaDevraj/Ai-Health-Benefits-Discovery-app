import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBenefits } from '../context/BenefitsContext.jsx'
import { apiClassify } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function ClassificationResult() {
  const { userText, category, setCategory, clarify, setClarify } = useBenefits()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{
    if (!userText) navigate('/')
  },[userText])

  async function regenerate() {
    setLoading(true); setError('')
    try {
      const result = await apiClassify(userText)
      setCategory(result.category || '')
      setClarify(result.clarify || '')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function proceed() {
    navigate('/benefits')
  }

  const unrec = !category || category === 'Unrecognized'

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Classification</h2>
      {loading ? (
        <LoadingSpinner label="Re-classifying..." />
      ) : (
        <div className="space-y-2">
          {unrec ? (
            <div className="p-4 border rounded bg-yellow-50 dark:bg-yellow-900/30">
              <div className="font-medium">We couldn't classify that — would you like to clarify?</div>
              {clarify && <div className="text-sm mt-1 opacity-80">Suggestion: {clarify}</div>}
            </div>
          ) : (
            <div className="p-4 border rounded bg-green-50 dark:bg-green-900/30">
              <div>Category:</div>
              <div className="text-2xl font-bold">{category}</div>
              {/* Confidence badge if available */}
              <ConfidenceBadge />
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={regenerate} className="px-3 py-1.5 rounded border">Regenerate</button>
            {!unrec && <button onClick={proceed} className="px-3 py-1.5 rounded bg-blue-600 text-white">See Benefits</button>}
          </div>
          <div className="pt-2">
            <label className="text-sm">Edit input</label>
            <textarea className="w-full p-2 border rounded mt-1" value={userText} onChange={e=>window.dispatchEvent(new CustomEvent('updateUserText',{ detail: e.target.value }))}></textarea>
          </div>
        </div>
      )}
    </div>
  )
}

function ConfidenceBadge() {
  // Simple mock: read last classify result from session if stored via window event
  const [confidence, setConfidence] = useState(null)
  useEffect(()=>{
    const handler = (e)=>{ /* no-op */ }
    window.addEventListener('classifyResult', handler)
    return ()=> window.removeEventListener('classifyResult', handler)
  },[])
  if (!confidence) return null
  return <span className="inline-block text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded ml-2">Confidence {Math.round(confidence*100)}%</span>
}


