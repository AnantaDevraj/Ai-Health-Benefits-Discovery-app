export function validateCategory(text, categories) {
  const t = (text || '').trim();
  if (categories.includes(t)) return t;
  // Try case-insensitive match
  const found = categories.find(c => c.toLowerCase() === t.toLowerCase());
  return found || null;
}

export function validatePlanJson(obj) {
  if (!obj || typeof obj !== 'object') return null;
  if (!Array.isArray(obj.steps) || obj.steps.length !== 3) return null;
  const steps = obj.steps.map(s => ({
    title: String(s.title || '').slice(0, 80) || 'Step',
    detail: String(s.detail || '').slice(0, 400) || 'Details unavailable',
    ...(s.estimated_time ? { estimated_time: String(s.estimated_time).slice(0, 40) } : {})
  }));
  const out = { steps };
  if (obj.notes) out.notes = String(obj.notes).slice(0, 200);
  return out;
}


