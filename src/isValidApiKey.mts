import { fetchOpenAi } from './fetchOpenAi.mjs';

export async function isValidApiKey(key: string) {
  if (key.length === 37 && key.startsWith('sk-')) {
    const response = await fetchOpenAi('Hello', key);
    if (response.status === 200) {
    return true;
    }
  };
return false;
}
  