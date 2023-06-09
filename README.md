# AiCommit

`AiCommit` is a command line tool that generates commit messages using ChatGPT. It takes a diff of staged changes as input and uses the OpenAI API to generate a short, meaningful commit message that summarizes the changes.

## Installation

To install `AiCommit`, run the following command:

```
npm install -g ai-commit-js
```

This will install the `ai-commit` command globally on your system.

## Usage

To use `AiCommit`, navigate to a Git repository with staged changes and run the following command:

```
ai-commit
```

This will prompt you to enter your OpenAI API key, which will be stored in a file named `.ai-commit` in your home directory. If you don't have an API key, you can sign up for one at the [OpenAI website](https://openai.com/).

Once you've entered your API key, `AiCommit` will generate a commit message based on the diff of the currently staged changes using OpenAI, and open the commit message in vim for you to edit. Close and save and a you will be prompted to confirm the commit. If you want to print the generated commit message without committing the changes, use the `--dry-run` option:

```
ai-commit --dry-run
```

This will print the generated commit message to the console without committing the changes.

## Note
There is a max token limit to your diff determined by your OpenAI account. Large diffs may be too large for your account's limit. If you encounter any issues, consider breaking up your changes into smaller commits or upgrading your OpenAI account.

## Contributing

If you find a bug or want to suggest a feature, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/Tharon-C/AiCommit).