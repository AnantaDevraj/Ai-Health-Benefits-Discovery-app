Provider adapter notes

The adapter in `src/ai/ai-adapter.js` is generic. To use a provider like Groq/OpenAI:

1) Set env:
```
AI_PROVIDER=groq
AI_PROVIDER_URL=https://api.groq.com/openai/v1/chat/completions
AI_API_KEY=sk-...
AI_AUTH_HEADER_NAME=Authorization
```

2) In `callProvider`, replace the `body` with:
```
const body = {
  model: 'mixtral-8x7b',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0
};
```

3) If response is JSON like `{ choices: [{ message: { content } }] }`, set `const text = choices[0].message.content` and use that instead of `await res.text()`.


