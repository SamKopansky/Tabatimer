---
name: Next OpenSpec Task
description: Work on the next task from OpenSpec tasks.md file
category: openspec
tags: [openspec, task, workflow, automation]
---

# Next OpenSpec Task Workflow

This skill reads the OpenSpec tasks file, identifies the next task to work on, and asks for confirmation before proceeding.

## Step 1: Read Tasks File

Read the tasks file at `openspec/changes/build-personal-trainer-mvp/tasks.md`.

## Step 2: Parse and Find Next Task

Parse the file to:
1. Identify all tasks with their status:
   - `[x]` = completed
   - `[ ]` = not started/incomplete
   - Lines containing "(skipped)" in any form = skipped tasks
2. Find the **last completed task** in the file (furthest along)
3. Find the **next incomplete task** after the last completed task
4. **Skip any tasks marked with "(skipped)" or similar indicators**

## Step 3: Present Task to User

Display the task details:
```
📋 Next OpenSpec Task Found

Task: [task number and description]
Section: [which numbered section it belongs to]

Would you like to:
A) Work on this task now
B) Skip this task and move to the next one
```

Use the AskUserQuestion tool to present these options.

## Step 4: Handle User Response

### Option A: Work on Task

If user chooses to work on the task:

1. **Use OpenSpec Apply Command**:
   - Run the `/openspec:apply` skill to begin implementation
   - This will handle:
     - Branch management
     - Reading the proposal/design
     - Creating TodoWrite plan
     - Implementation workflow
     - All CLAUDE.md principles

2. **Update Tasks File After Completion**:
   - Once the implementation is complete
   - Change `[ ]` to `[x]` for the completed task
   - Commit this change

### Option B: Skip Task

If user chooses to skip:

1. Update the task in tasks.md to indicate it's skipped:
   - Change `[ ] X.X Task description` to `[ ] X.X Task description (skipped)`
2. Recursively call this workflow to find the next task (the next incomplete, non-skipped task after this one)
3. Present the new task to the user

## Important Notes

- **Leverage existing workflows** - Use `/openspec:apply` for implementation
- **Respect skipped tasks** - Don't ask about tasks already marked as skipped
- **Update tasks.md** - Mark complete after successful implementation
- **Handle skips immediately** - Update file and find next task

## Error Handling

If the tasks file:
- Doesn't exist → Inform user and stop
- Has no incomplete tasks → Inform user that all tasks are complete
- Has only skipped tasks remaining → Inform user and ask what to do

## Success Criteria

Task is complete when:
- ✅ Implementation finished via `/openspec:apply`
- ✅ Task marked [x] in tasks.md
- ✅ Changes committed (ready for PR if desired)
