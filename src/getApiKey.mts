import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { isValidApiKey } from "./isValidApiKey.mjs";

const configFile = '.ai-commit';
const configPath = path.join(os.homedir(), configFile);

// Read API key from config file
let apiKey = '';
if ((fs.existsSync(configPath))) {
  apiKey = fs.readFileSync(configPath, 'utf8').trim();
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

export const getApiKey = () => apiKey;