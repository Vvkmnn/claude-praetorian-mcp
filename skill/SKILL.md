---
name: praetorian-memory
description: Cross-session memory - ALWAYS invoke at session start and after research
triggers: [SessionStart, WebFetch, Task]
---

# ⚜️ Praetorian Memory Protocol

Cross-session memory that persists across conversations.

## MANDATORY ACTIONS

### At Session Start
ALWAYS call `praetorian_restore()` to check for prior work on the current topic.

### After WebFetch
MUST call `praetorian_compact(type="web_research", title="<topic>", key_insights=[...])` to preserve research findings.

### After Task Completion
MUST call `praetorian_compact(type="task_result", title="<summary>", key_insights=[...])` to preserve subagent results.

### Before Context Gets Full
Proactively compact valuable insights to prevent loss during auto-compaction.

## Format

```
praetorian_restore(query?)     // Load past work
praetorian_compact(
  type: "web_research" | "task_result" | "file_reads" | "decisions",
  title: "<concise title>",
  key_insights: ["insight 1", "insight 2"],
  refs: ["file.ts:123"]
)
```

Auto-merges similar titles. Compact freely.

## Full Automation

For automatic enforcement via hooks, install the claude-praetorian plugin:

```bash
claude install claude-agora v/claude-agora
```

This adds hooks that prompt at:
- SessionStart → restore reminder
- PreCompact → save before context reset
- PostToolUse → compact after WebFetch/Task
