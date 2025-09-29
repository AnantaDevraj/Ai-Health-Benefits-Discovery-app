import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { aiAdapter } from '../../src/ai/ai-adapter.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/benefits.json');

router.post('/', async (req, res) => {
  try {
    const { benefitId, userText } = req.body || {};
    if (!benefitId) return res.status(400).json({ error: 'benefitId is required' });
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(raw);
    const all = Object.values(data).flat();
    const benefit = all.find(b => b.id === benefitId);
    if (!benefit) return res.status(404).json({ error: 'Benefit not found' });

    const plan = await aiAdapter.plan(benefit, userText || '');
    return res.json(plan);
  } catch (err) {
    console.error('Plan error', err);
    return res.status(500).json({ steps: [
      { title: 'Contact HR or provider', detail: 'Request claim form and coverage details.' },
      { title: 'Book appointment and prepare docs', detail: 'Collect ID, bills, and prescriptions.' },
      { title: 'Submit claim and follow up', detail: 'Send documents and track claim status.' }
    ], notes: 'Fallback plan used due to an error.' });
  }
});

export default router;


