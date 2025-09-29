/**
 * Pluggable AI adapter. Defaults to mock heuristics.
 * If AI_PROVIDER !== 'mock' and AI_API_KEY is provided, will call AI_PROVIDER_URL.
 */
import fetch from 'node-fetch';
import { validateCategory, validatePlanJson } from '../utils/validators.js';

const PROVIDER = process.env.AI_PROVIDER || 'mock';
const API_URL = process.env.AI_PROVIDER_URL || '';
const API_KEY = process.env.AI_API_KEY || '';
const AUTH_HEADER = process.env.AI_AUTH_HEADER_NAME || 'Authorization';
const FORCE_PROVIDER_ONLY = String(process.env.FORCE_PROVIDER_ONLY || 'false').toLowerCase() === 'true';

const CATEGORIES = ['Dental', 'OPD', 'Vision', 'Mental Health'];

function heuristicClassify(text) {
  const t = (text || '').toLowerCase();
  let category = 'Unrecognized';
  let confidence = 0.4;
  if (/tooth|teeth|gum|cavity|dental|dentist/.test(t)) { category = 'Dental'; confidence = 0.85; }
  else if (/eye|vision|glasses|lens|optometrist/.test(t)) { category = 'Vision'; confidence = 0.75; }
  else if (/anxiety|stress|depress|mental|therapy|counsel/.test(t)) { category = 'Mental Health'; confidence = 0.7; }
  else if (/fever|cold|cough|doctor|clinic|checkup|opd/.test(t)) { category = 'OPD'; confidence = 0.65; }
  // clarifying question if too short or ambiguous
  let clarify;
  if (category === 'Unrecognized' || (text && text.trim().split(/\s+/).length < 4)) {
    clarify = 'Could you share symptoms and duration to help classify (e.g., tooth pain for 2 days)?';
  }
  return { category, confidence, clarify };
}

function mockPlan(benefit, userText) {
  return {
    steps: [
      { title: 'Verify coverage', detail: `Confirm your eligibility for ${benefit.title} and gather your ID.` , estimated_time: 'Same day' },
      { title: 'Book appointment', detail: 'Schedule a visit and collect prescriptions, bills, and receipts.', estimated_time: '1-3 days' },
      { title: 'Submit claim', detail: 'Submit documents via portal or HR and follow up for status.', estimated_time: '1-7 days' }
    ],
    notes: benefit.description || 'Ensure you keep all receipts and referral notes.'
  };
}

function buildClassificationPrompt(userText) {
  return `Return ONLY one of these category names that best matches the user text:\n{Dental, OPD, Vision, Mental Health}\nInput: "${userText}"\nONLY output the single category name exactly as it appears above, nothing else.\nIf none match, output: "Unrecognized".`;
}

function buildClarifyPrompt(userText) {
  return `User input: "${userText}"\nIf you cannot map this to Dental, OPD, Vision, or Mental Health, reply with "Unrecognized".\nIf the input is ambiguous, ask a single clarifying question only (one sentence).`;
}

function buildPlanPrompt(benefit, userText) {
  return `You are an assistant that returns a 3-step step-by-step action plan to help the user avail a benefit.\n\nInput:\n- benefit: ${benefit.title}\n- benefit_summary: ${benefit.description}\n- user_request: "${userText}"\n\nReturn strict JSON ONLY with this shape:\n{\n  "steps": [\n    {"title": "Step 1 short title", "detail": "Action detail — what to do and where/when", "estimated_time": "e.g., 1 day or 1 hour"},\n    {"title": "Step 2 short title", "detail": "Action detail", "estimated_time": "optional"},\n    {"title": "Step 3 short title", "detail": "Action detail", "estimated_time": "optional"}\n  ],\n  "notes": "optional short notes or required documents (1-2 sentences)"\n}\n\nDo not include any explanation outside the JSON.`;
}

async function callProvider(prompt, options = {}) {
  // Generic fetch-based adapter. Adjust body shape to your provider.
  // Example for Groq/OpenAI-compatible chat completions:
  // const body = { model: 'mixtral-8x7b', messages: [{ role: 'user', content: prompt }], temperature: 0 };
  const body = options.body || { prompt }; // keep generic; user must adapt per provider
  const headers = {
    'Content-Type': 'application/json',
    [AUTH_HEADER]: AUTH_HEADER.toLowerCase().includes('authorization') ? `Bearer ${API_KEY}` : API_KEY
  };
  const res = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`Provider error ${res.status}: ${text}`);
  return text;
}

async function providerClassify(userText) {
  const prompt = buildClassificationPrompt(userText);
  try {
    const raw = await callProvider(prompt);
    // Try to extract plain category from raw text (allow JSON or quoted)
    const cleaned = (raw || '').trim().replace(/^[\s\S]*?([A-Za-z ]+)[\s\S]*$/, '$1');
    const category = validateCategory(cleaned, CATEGORIES) || 'Unrecognized';
    return { category };
  } catch (e) {
    return heuristicClassify(userText);
  }
}

async function providerClarify(userText) {
  const prompt = buildClarifyPrompt(userText);
  try {
    const raw = await callProvider(prompt);
    const out = (raw || '').trim();
    if (CATEGORIES.includes(out)) return { category: out };
    if (/unrecognized/i.test(out)) return { category: 'Unrecognized' };
    return { clarify: out };
  } catch (e) {
    return heuristicClassify(userText);
  }
}

async function providerPlan(benefit, userText) {
  const prompt = buildPlanPrompt(benefit, userText);
  try {
    const raw = await callProvider(prompt);
    let json;
    try {
      // Extract first JSON object in text
      const match = raw.match(/\{[\s\S]*\}/);
      json = match ? JSON.parse(match[0]) : JSON.parse(raw);
    } catch (e) {
      return mockPlan(benefit, userText);
    }
    const valid = validatePlanJson(json);
    return valid || mockPlan(benefit, userText);
  } catch (e) {
    return mockPlan(benefit, userText);
  }
}

export const aiAdapter = {
  async classify(userText) {
    if (FORCE_PROVIDER_ONLY) {
      if (!API_KEY || !API_URL) throw new Error('AI provider required: set AI_PROVIDER_URL and AI_API_KEY');
      return providerClassify(userText);
    } else {
      if (PROVIDER === 'mock' || !API_KEY || !API_URL) {
        return heuristicClassify(userText);
      }
      return providerClassify(userText);
    }
  },
  async clarify(userText) {
    if (FORCE_PROVIDER_ONLY) {
      if (!API_KEY || !API_URL) throw new Error('AI provider required: set AI_PROVIDER_URL and AI_API_KEY');
      return providerClarify(userText);
    } else {
      if (PROVIDER === 'mock' || !API_KEY || !API_URL) {
        return heuristicClassify(userText);
      }
      return providerClarify(userText);
    }
  },
  async plan(benefit, userText) {
    if (FORCE_PROVIDER_ONLY) {
      if (!API_KEY || !API_URL) throw new Error('AI provider required: set AI_PROVIDER_URL and AI_API_KEY');
      return providerPlan(benefit, userText);
    } else {
      if (PROVIDER === 'mock' || !API_KEY || !API_URL) {
        return mockPlan(benefit, userText);
      }
      return providerPlan(benefit, userText);
    }
  }
};


