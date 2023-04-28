import { fetchOpenAi } from './fetchOpenAi.mjs';

export async function generateCommitMessage(diff: string, api: string = '') {
    if (!diff) {
      console.log('No changes to commit.');
      return false;
    }
    const prompt = `Generate a git commit message for the following diff. Format should be first line summary. If summary exceeds 50 chars, skip line then list of changes. Include all changes"\n\n${diff}\n\n`; // Prompt for the ChatGPT model
    
    // Send a request to the ChatGPT API to generate text
    const response = await fetchOpenAi(prompt, api);
    const json = await response.json();
    if(json.error) {
      if (json.error.code === 'insufficient-funds') {
        console.error('Insufficient funds. Please add more credits to your OpenAI account.');
      }
      if (json.error.code === 'context_length_exceeded') {
        console.error('Your git diff is too long for the token limit on this model. Please commit your changes in smaller chunks');
      }
      return '';
    } else {
      return json.choices[0].message.content;
    }
  }
  