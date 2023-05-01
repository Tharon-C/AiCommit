#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { execSync } from 'child_process';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import readline from 'readline';
import { generateCommitMessage } from './generateCommitMessage.mjs';
import { getApiKey } from './getApiKey.mjs';

const apiKey = getApiKey();

// TODO: Type argv
const argv: any = yargs(hideBin(process.argv))
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

generateCommitMessage(diff, apiKey)
  .then(message => {
    if (!message) {
      console.log('\nAborting');
      return;
    }
      // Create temporary file
    const tmpFile = path.join(os.tmpdir(), 'message.txt');
    fs.writeFileSync(tmpFile, message);

    // Open file in Vim for editing
    const vim = spawn('vim', [tmpFile], {
      stdio: 'inherit'
    });

    vim.on('exit', (code, signal) => {
      // Read edited message from file
      const editedMessage = fs.readFileSync(tmpFile, 'utf8').trim();

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
    });
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
