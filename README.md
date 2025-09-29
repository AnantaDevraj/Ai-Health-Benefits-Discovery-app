AI Benefits Discovery (MERN)

A ready-to-run MERN app implementing the "AI-Powered Benefits Discovery Flow" with a pluggable AI adapter. Works out-of-the-box with mock AI.

Quick start

1. Install dependencies:
```
npm run install:all
```
2. Start dev servers (client 5173, server 5000):
```
npm run dev
```
Open http://localhost:5173

Environment
Copy `.env.example` to `.env` in project root or `server/`.

```
AI_PROVIDER=mock
AI_PROVIDER_URL=
AI_API_KEY=
AI_AUTH_HEADER_NAME=Authorization
USE_DB=false
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

- AI_PROVIDER: `mock` (default) uses local heuristic. Any other value will try the provider.
- AI_PROVIDER_URL: Endpoint for your AI provider (POST). For Groq/OpenAI-like chat, set to their `/chat/completions`.
- AI_API_KEY: Your key (not committed). Do not share.
- AI_AUTH_HEADER_NAME: `Authorization` or `x-api-key` etc.

Pluggable AI adapter
See `server/src/ai/ai-adapter.js`.
- Mock heuristics return categories and plans.
- Provider mode uses generic `fetch`. Adjust request `body` to your provider.

Groq/OpenAI-style request example (replace body in `callProvider`):
```
// const body = {
//   model: 'mixtral-8x7b',
//   messages: [{ role: 'user', content: prompt }],
//   temperature: 0
// };
```
If response is `{ choices: [{ message: { content } }] }`, set `raw = content` before parsing.

Prompts used
- Classification: returns ONLY one of {Dental, OPD, Vision, Mental Health} or `Unrecognized`.
- Clarify: returns `Unrecognized` or a single clarifying question.
- Plan: strict JSON `{ steps: [3 items], notes? }`.

API
- POST `/api/classify` { text } -> `{ category, confidence?, clarify? }`
- GET `/api/benefits?category=Dental` -> `{ benefits: [...] }`
- POST `/api/plan` { benefitId, userText } -> `{ steps:[...], notes? }`

Example curl
```
curl -s http://localhost:5000/api/benefits?category=Dental

curl -s -X POST http://localhost:5000/api/classify \
  -H "Content-Type: application/json" \
  -d '{"text":"I have tooth pain for 2 days"}'

curl -s -X POST http://localhost:5000/api/plan \
  -H "Content-Type: application/json" \
  -d '{"benefitId":"dental-basic-checkup","userText":"tooth pain"}'
```

Frontend
- React + Vite, Tailwind via CDN only (no config).
- React Router with 4 screens: Input → Category → Benefits → Plan.
- Lottie loading animation and dark mode toggle.

Tests
Run smoke tests (server must be running):
```
npm --prefix server run test
```
Checks: classify returns a category string; benefits returns 2–4 items; plan returns 3 steps.

Production serving
```
npm --prefix client run build
npm start
# Visit http://localhost:5000
```

Known issues / Future work
- Add multi-turn clarifying questions.
- Add real database-backed benefits and admin editor.
- Add richer provider-specific request shaping and parsing.


