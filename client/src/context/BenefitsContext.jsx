import { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)

export function BenefitsProvider({ children }) {
  const [userText, setUserText] = useState('')
  const [category, setCategory] = useState('')
  const [clarify, setClarify] = useState('')
  const [selectedBenefit, setSelectedBenefit] = useState(null)
  return (
    <Ctx.Provider value={{ userText, setUserText, category, setCategory, clarify, setClarify, selectedBenefit, setSelectedBenefit }}>
      {children}
    </Ctx.Provider>
  )
}

export function useBenefits() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useBenefits must be used within BenefitsProvider')
  return ctx
}


