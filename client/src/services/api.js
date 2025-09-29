const BASE = '' // same origin; dev uses Vite proxy (configure server or use CLIENT_ORIGIN CORS)

function withTimeout(promise, ms = 15000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Request timeout')), ms)
    promise.then(v => { clearTimeout(t); resolve(v) }).catch(e => { clearTimeout(t); reject(e) })
  })
}

export async function apiClassify(text) {
  const res = await withTimeout(fetch(`${BASE}/api/classify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) }))
  if (!res.ok) throw new Error('Failed to classify')
  return res.json()
}

export async function apiBenefits(category) {
  const res = await withTimeout(fetch(`${BASE}/api/benefits?category=${encodeURIComponent(category)}`))
  if (!res.ok) throw new Error('Failed to load benefits')
  return res.json()
}

export async function apiPlan(benefitId, userText) {
  const res = await withTimeout(fetch(`${BASE}/api/plan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ benefitId, userText }) }))
  if (!res.ok) throw new Error('Failed to generate plan')
  return res.json()
}


