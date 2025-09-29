import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/benefits.json');

router.get('/', (req, res) => {
  try {
    const category = req.query.category;
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(raw);
    const list = (data[category] || []).slice(0, 4);
    return res.json({ benefits: list });
  } catch (err) {
    console.error('Benefits error', err);
    return res.status(500).json({ benefits: [] });
  }
});

export default router;


