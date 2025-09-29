import { Router } from 'express';
import { aiAdapter } from '../../src/ai/ai-adapter.js';

const router = Router();

// POST /api/classify { text }
router.post('/', async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required' });
    }
    const result = await aiAdapter.classify(text);
    return res.json(result);
  } catch (err) {
    console.error('Classify error', err);
    return res.status(500).json({ category: 'Unrecognized' });
  }
});

export default router;


