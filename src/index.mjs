#!/usr/bin/env node

import { execSync } from 'child_process';
import fetch from 'node-fetch'; // You'll need to install this package
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import readline from 'readline';
import fs from 'fs';
import os from 'os';
import path from 'path';

const configFile = '.aiCommit';
const configPath = path.join(os.homedir(), configFile);

// Read API key from config file
let apiKey = '';
if ((fs.existsSync(configPath))) {
  apiKey = fs.readFileSync(configPath, 'utf8').trim();
}

function fetchOpenAi(prompt, key) {
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

async function isValidApiKey(key) {
  if (key.length === 37 && key.startsWith('sk-')) {
    const response = await fetchOpenAi('Hello', key);
    if (response.status === 200) {
      return true;
    }
  };
  return false;
}

// Check if config file exists, if not, create it
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, '');
}

// If API key is not set or is invalid, prompt user to enter it
if (!apiKey || !isValidApiKey(apiKey)) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Please enter your API key: ', (key) => {
    // Store API key in config file
    fs.writeFileSync(configPath, key.trim());

    rl.close();
  });
}

async function generateCommitMessage(diff) {
  if (!diff) {
    console.log('No changes to commit.');
    return false;
  }
  const prompt = `Generate a git commit message for the following diff. Format should be first line summary. If summary exceeds 50 chars, skip line then list of changes. Include all changes"\n\n${diff}\n\n`; // Prompt for the ChatGPT model
  
  // Send a request to the ChatGPT API to generate text
  const response = await fetchOpenAi(prompt, apiKey);
  const json = await response.json();
  console.log(json);
  const message = json.choices[0].message.content;

  return message;
}

const argv = yargs(hideBin(process.argv))
  .command('$0', 'Generate a commit message using OpenAI')
  .option('dry-run', {
    alias: 'n',
    describe: 'Print the commit message without committing',
    type: 'boolean',
    default: false,
  })
  .help()
  .alias('help', 'h').argv;

const diff = execSync('git diff --cached', { encoding: 'utf-8' });

generateCommitMessage(diff)
  .then(message => {
    if (!message) {
      return;
    }
    // Prompt the user to approve the commit message
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(`Commit message: ${message}\n Approve? (y/n) `, answer => {
      rl.close();
      if (answer.toLowerCase() === 'y') {
        if (!argv.dryRun) {
          execSync(`git commit -m "${message}"`);
        }
      } else {
        console.log('Commit message not approved. Aborting.');
      }
    });
  })
  .catch(error => console.error(error));
