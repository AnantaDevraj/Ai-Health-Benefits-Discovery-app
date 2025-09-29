import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBenefits } from '../context/BenefitsContext.jsx'
import { apiClassify } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function BenefitInput() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { userText, setUserText, setCategory, setClarify } = useBenefits()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await apiClassify(userText)
      setCategory(result.category || '')
      setClarify(result.clarify || '')
      navigate('/category')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Describe your issue</h1>
      <form onSubmit={onSubmit} className="space-y-4 relative">
        <textarea
          value={userText}
          onChange={e=>setUserText(e.target.value)}
          placeholder="I have tooth pain, what can I do?"
          className="w-full h-40 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 caret-blue-600"
          disabled={loading}
        />
        <div className="text-sm text-gray-600">Tip: include symptoms, urgency, or location (e.g. 'tooth pain for 2 days').</div>
        <button disabled={loading || !userText.trim()} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">Find Benefits</button>
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur flex items-center justify-center rounded-md">
            <LoadingSpinner label="Classifying..." />
          </div>
        )}
      </form>
      {error && <div className="mt-3 text-red-600">{error}</div>}
    </div>
  )
}


