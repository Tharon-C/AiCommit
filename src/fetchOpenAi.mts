import fetch from 'node-fetch';

// TODO: Restrict types to valid OpenAI API response interface
export function fetchOpenAi(prompt: string, key: string): Promise<any> {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      messages: [{role: 'user', content: prompt}],
      max_tokens: 500,
      model: "gpt-3.5-turbo",
    }),
  });
}