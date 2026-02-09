---
name: squash-wip-commits
description: Squash multiple wip commits into a single commit with a git commit messages using modern semantic commit best practices. Use this when you detect the user is preparing a squash.
---

# Semantic Commit Master

This skill enables you to act as a senior developer who takes pride in clean, descriptive, and standardized commit history.

## When to use this skill
- When the user asks "Squash my changes".

## Workflow

1. **Analyze Changes**: Run `git log master..HEAD` and `git show <commit-hash>` to understand exactly what was committed.
2. **Determine Commits**: Choose the commits with commit message `wip` or similar and squash them
3. **Determine Type**: Choose the most appropriate semantic prefix:
    - `feat`: A new feature
    - `fix`: A bug fix
    - `docs`: Documentation only changes
    - `refactor`: A code change that neither fixes a bug nor adds a feature
    - `test`: Adding missing tests or correcting existing tests
    - `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
    - `chore`: Other changes that don't modify src or test files
4. **Identify Scope**: (Optional) Determine the component or area affected (e.g., `(api)`, `(ui)`, `(ai)`, `(auth)`).
5. **Draft Summary**: Write a concise (max 50 chars) summary in imperative mood (e.g., "add login logic" instead of "added login logic").
6. **Add Body**: (If complex) Add a blank line followed by a more detailed explanation of the *why* and *how*.

## Example Output

feat(auth): add OAuth2 provider support

Implemented Google and GitHub login providers to allow users
to register without a password. Updated the user schema to
store external provider IDs.