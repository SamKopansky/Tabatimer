---
name: Save and Push
description: Commit and push changes to a branch, then generate a PR link
category: git
tags: [git, commit, push, pr, workflow]
---

# Save and Push Workflow

Execute this git workflow to save and push your session work:

## Step 1: Check Current Branch

Run `git branch --show-current` to get the current branch name.

- If on `main` or `master`, proceed to create a new branch
- If already on a feature branch, proceed to Step 3

## Step 2: Create Branch (if needed)

If currently on `main` or `master`:

1. Generate a descriptive branch name based on the work done in this session
   - Use kebab-case format (e.g., `feature/add-magic-link-auth`)
   - Make it concise but descriptive
2. Run `git checkout -b <branch-name>` to create and switch to the new branch

## Step 3: Stage All Changes

Run `git add .` to stage all changes.

## Step 4: Generate Commit Message

Create an informative commit message that:
- Summarizes what was accomplished in this session
- Uses imperative mood (e.g., "Add magic link authentication")
- Is concise but descriptive (1-3 lines)
- Follows the project's commit message conventions (check recent commits with `git log --oneline -5`)

## Step 5: Commit Changes

Run:
```bash
git commit -m "$(cat <<'EOF'
<your commit message>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

## Step 6: Push to Remote

Run `git push -u origin <branch-name>` to push the branch to the remote.

## Step 7: Generate PR Link

Get the repository information:
1. Run `git remote get-url origin` to get the remote URL
2. Parse the owner and repo name from the URL
3. Construct and display a clickable PR creation link:
   ```
   https://github.com/<owner>/<repo>/compare/<branch-name>?expand=1
   ```

Display the link with clear instructions:
```
✅ Changes committed and pushed successfully!

🔗 Create a pull request:
https://github.com/<owner>/<repo>/compare/<branch-name>?expand=1
```

## Important Notes

- NEVER use `git commit --amend` unless explicitly requested
- ALWAYS include the Co-Authored-By line for attribution
- If push fails (e.g., need to pull first), provide clear instructions to resolve
- The PR link should be clickable in the terminal output
