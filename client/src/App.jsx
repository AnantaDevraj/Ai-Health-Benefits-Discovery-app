import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import BenefitInput from './screens/BenefitInput.jsx'
import ClassificationResult from './screens/ClassificationResult.jsx'
import BenefitList from './screens/BenefitList.jsx'
import BenefitDetails from './screens/BenefitDetails.jsx'
import { BenefitsProvider } from './context/BenefitsContext.jsx'
import { useState, useEffect } from 'react'

function Breadcrumbs() {
  const location = useLocation()
  const map = [
    { to: '/', label: 'Input' },
    { to: '/category', label: 'Category' },
    { to: '/benefits', label: 'Benefits' },
    { to: '/plan', label: 'Plan' }
  ]
  const current = location.pathname
  return (
    <nav className="text-sm text-gray-600 dark:text-gray-300">
      <ol className="flex gap-2 flex-wrap">
        {map.map((m, i) => (
          <li key={m.to} className="flex items-center gap-2">
            <Link to={m.to} className={`hover:underline ${current===m.to?'font-semibold text-blue-600 dark:text-blue-400':''}`}>{m.label}</Link>
            {i < map.length - 1 && <span className="opacity-60">→</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function App() {
  const [dark, setDark] = useState(()=>{
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') return true
    if (stored === 'light') return false
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  },[dark])

  return (
    <BenefitsProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100">
        <header className="border-b bg-white/70 dark:bg-gray-800/70 backdrop-blur sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="font-semibold">AI Benefits Discovery</Link>
            <div className="flex items-center gap-4">
              <Breadcrumbs />
              <button onClick={()=>setDark(d=>!d)} className="px-3 py-1 rounded border dark:border-gray-700">
                {dark? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<BenefitInput />} />
            <Route path="/category" element={<ClassificationResult />} />
            <Route path="/benefits" element={<BenefitList />} />
            <Route path="/plan" element={<BenefitDetails />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BenefitsProvider>
  )
}


