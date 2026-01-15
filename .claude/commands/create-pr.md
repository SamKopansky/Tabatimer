---
name: Create PR
description: Commit and push changes to a branch, then create a pull request
category: git
tags: [git, commit, push, pr, workflow]
---

# Create PR Workflow

Execute this git workflow to save your session work and create a pull request:

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

## Step 7: Create Pull Request

Get the repository information and create the PR:

1. Run `git remote get-url origin` to get the remote URL
2. Parse the owner and repo name from the URL
3. Determine the base branch (usually `main` or `master`):
   - Run `git remote show origin | grep "HEAD branch"` to find the default branch
   - Or use `main` as the default
4. Generate a PR title and body based on the commit message(s):
   - Title: Use the first line of the most recent commit message
   - Body: Include a summary of changes with a link to Claude Code
     ```markdown
     ## Summary
     [Brief description of changes]

     🤖 Generated with [Claude Code](https://claude.com/claude-code)
     ```
5. Use the GitHub MCP tool to create the PR:
   ```
   mcp__github__create_pull_request({
     owner: "<owner>",
     repo: "<repo>",
     title: "<pr-title>",
     head: "<branch-name>",
     base: "<base-branch>",
     body: "<pr-body>"
   })
   ```
6. Display the PR URL from the response:
   ```
   ✅ Changes committed and pushed successfully!

   🎉 Pull request created: <PR URL>
   ```

## Important Notes

- NEVER use `git commit --amend` unless explicitly requested
- ALWAYS include the Co-Authored-By line for attribution
- If push fails (e.g., need to pull first), provide clear instructions to resolve
- The PR will be created automatically using the GitHub MCP tool
- Ensure you have proper GitHub authentication configured for PR creation
- If PR creation fails, fall back to providing a manual PR creation link
