// Basic smoke tests using node-fetch against a running server.
import fetch from 'node-fetch';

const BASE = process.env.BASE_URL || 'http://localhost:5000';

async function testClassify() {
  const res = await fetch(`${BASE}/api/classify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: 'I have tooth pain for 2 days' }) });
  const json = await res.json();
  if (!json || typeof json.category !== 'string') throw new Error('Classify failed');
  console.log('Classify OK:', json);
}

async function testBenefits() {
  const res = await fetch(`${BASE}/api/benefits?category=Dental`);
  const json = await res.json();
  if (!json || !Array.isArray(json.benefits) || json.benefits.length < 1 || json.benefits.length > 4) throw new Error('Benefits failed');
  console.log('Benefits OK: count', json.benefits.length);
  return json.benefits[0]?.id;
}

async function testPlan(benefitId) {
  const res = await fetch(`${BASE}/api/plan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ benefitId, userText: 'Need help with this' }) });
  const json = await res.json();
  if (!json || !Array.isArray(json.steps) || json.steps.length !== 3) throw new Error('Plan failed');
  console.log('Plan OK');
}

(async () => {
  await testClassify();
  const id = await testBenefits();
  await testPlan(id);
  console.log('All smoke tests passed.');
})().catch(err => {
  console.error(err);
  process.exit(1);
});


