---
name: claude-praetorian
description: Cross-session memory - save insights after research, restore context at session start. Reduces re-exploration and prevents token waste.
---

# ⚜️ Claude Praetorian

Cross-session memory that persists across conversations.

## When to Use

**Starting a session?**
- Check for prior work → `praetorian_restore(query)`

**Just did research?**
- After WebFetch → `praetorian_compact(type="web_research", ...)`
- After WebSearch → `praetorian_compact(type="web_research", ...)`
- After Task/subagent → `praetorian_compact(type="task_result", ...)`

**Explored the codebase?**
- After significant reads → `praetorian_compact(type="file_reads", ...)`

**Made decisions?**
- Technical choices → `praetorian_compact(type="decisions", ...)`

## Best Practice

Check praetorian BEFORE:
- Re-exploring code you've seen before
- Researching topics you've researched before
- Starting work on a familiar project

Compact AFTER:
- WebFetch/WebSearch completes
- Subagent returns results
- Significant codebase exploration
- Making architectural decisions

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

For automatic hooks that prompt at key moments, install the plugin from claude-agora:

```bash
/plugin marketplace add Vvkmnn/claude-agora
/plugin install claude-praetorian@claude-agora
```

This adds hooks for SessionStart, PreCompact, PostToolUse, and Stop.
