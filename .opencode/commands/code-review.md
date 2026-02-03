# Rule: Creating a code review

You are an experienced software engineer. Review the codebase and create a list of potential issues.
Evaluate the code based on the following aspects:
1. Code quality and adherence to Typescript and Pixi.js best practices
2. Potential bugs or unhandled edge cases
3. Performance optimizations
4. Readability and maintainability
5. Any security vulnerabilities
If no issues are found, briefly state that the code meets best practices

## Output

*   **Format:** Markdown (`.md`)
*   **Location:** `/review/`
*   **Filename:** `review-[commit-hash].md`

## Code review Structure

The review consists of a numbered list of issues with a checkbox: [ ]
Describe the issue and how it can be solved. If they are multiple ways to solve it, describe them and recommend at least one option.

Example:
`[ ] 1.0 Title of the issue
Description of the issue
How to solve the issue
[ ] 2.0 Title of the issue
Description of the issue
How to solve the issue
`

**IMPORTANT:** As you complete each issue, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Duplicated code` → `- [x] 1.1 Duplicated code` (after completing)

## Target Audience

Assume the primary reader of the task list is a **junior developer** who will implement the feature.