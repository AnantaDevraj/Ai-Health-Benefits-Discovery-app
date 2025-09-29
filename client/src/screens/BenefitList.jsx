import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBenefits } from '../context/BenefitsContext.jsx'
import { apiBenefits } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import BenefitCard from '../components/BenefitCard.jsx'

export default function BenefitList() {
  const { category, setSelectedBenefit } = useBenefits()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [benefits, setBenefits] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    if (!category) { navigate('/'); return }
    setLoading(true); setError('')
    apiBenefits(category).then(json=>{
      setBenefits(json.benefits || [])
    }).catch(e=>{
      setError(e.message)
    }).finally(()=> setLoading(false))
  },[category])

  function onView(benefit) {
    setSelectedBenefit(benefit)
    navigate('/plan')
  }

  if (loading) return <LoadingSpinner label="Loading benefits..." />
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Benefits for {category}</h2>
      <div className="grid gap-3">{
        benefits.map(b => (
          <BenefitCard key={b.id} benefit={b} recommended={b.recommended} onView={()=>onView(b)} />
        ))
      }</div>
    </div>
  )
}


