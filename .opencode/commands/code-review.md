# Rule: Creating a code review

Review the whole codebase and create a list of potential issues.

## Output

*   **Format:** Markdown (`.md`)
*   **Location:** `/review/`
*   **Filename:** `review-[commit-hash].md`

## Code review Structure

The review consists of a numbered list of issues and how to fix them. Each issue should have a checkbox: [ ]

Example:
`[ ] 1.1 Duplicated code
<description on how to solve the issue>`

**IMPORTANT:** As you complete each issue, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Duplicated code` → `- [x] 1.1 Duplicated code` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Target Audience

Assume the primary reader of the task list is a **junior developer** who will implement the feature.