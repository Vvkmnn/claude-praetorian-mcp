# claude-praetorian-mcp

> **❌ under construction:** This project is under heavy construction and is not intended for public use / nor has it been published to npm. Information in the README below may be outdated, user discretion is advised.

<!-- TODO: Add demo.gif -->

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for aggressive context compaction in [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Save 90%+ tokens by compacting web research, task outputs, and conversations into beautiful, structured snapshots.

Inspired by:

- [ACE: Advanced Context Engineering for Coding Agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md) - Context is the ONLY lever
- [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) - Own your prompts, own your context
- [HumanLayer](https://github.com/humanlayer/humanlayer) - Human-in-the-loop for AI agents
- [TOON Format](https://toonformat.dev) - Token-Oriented Object Notation (30-60% savings)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Model Context Protocol

[![npm version](https://img.shields.io/npm/v/claude-praetorian-mcp.svg)](https://www.npmjs.com/package/claude-praetorian-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![GitHub stars](https://img.shields.io/github/stars/Vvkmnn/claude-praetorian-mcp?style=social)](https://github.com/Vvkmnn/claude-praetorian-mcp)
[![Claude](https://img.shields.io/badge/Claude-D97757?logo=claude&logoColor=fff)](#)

## install

Requirements:

- [Claude Code](https://claude.ai/code)

```bash
npm install -g claude-praetorian-mcp
```

**From shell:**

```bash
claude mcp add claude-praetorian-mcp -- bunx claude-praetorian-mcp
```

**From inside Claude** (restart required):

```
Add this to our global mcp config: bunx claude-praetorian-mcp

Install this mcp: https://github.com/Vvkmnn/claude-praetorian-mcp
```

**From any manually configurable `mcp.json`:** (Cursor, Windsurf, etc.)

```json
{
  "mcpServers": {
    "praetorian": {
      "command": "bunx",
      "args": ["claude-praetorian-mcp"],
      "env": {}
    }
  }
}
```

**No setup required** - zero config files, zero databases, works with `bunx` out of the box.

## token savings

| What You Save          | Before       | After       | Savings |
| ---------------------- | ------------ | ----------- | ------- |
| WebFetch (docs)        | ~1500 tokens | ~100 tokens | **93%** |
| Task/subagent output   | ~2000 tokens | ~150 tokens | **92%** |
| File exploration       | ~3000 tokens | ~200 tokens | **93%** |
| Conversation decisions | ~5000 tokens | ~300 tokens | **94%** |

**Average: 10-20x token reduction on reuse**

## features

[MCP server](https://modelcontextprotocol.io/) for aggressive context compaction. Structured snapshots with 90%+ token savings.

Runs locally (with royal guard `⚜️`):

### praetorian_compact

```
⚜️ praetorian_compact type=<type> title=<title>
  > "ACE Framework research - save 1,450 tokens"
  > "Icon rendering bug investigation - compact the findings"
  > "Database architecture decisions - preserve the rationale"
  > "WebFetch results from authentication docs"
  > "Task output from explore subagent - code structure analysis"
```

```
⚜️ compact | Created

┌─ ⚜️  ────────────────────────────────────────────────── Created ─┐
│ Compacted: "ACE Framework Research" • 1,450 tokens saved
│ Type: web_research • ID: cpt_1765245902396_nxetoc
└───────────────────────────────────────────────────────────────────┘
```

```
⚜️ compact | Merged

┌─ ⚜️  ───────────────────────────────────────────────────── Merged ─┐
│ Compacted: "Authentication Patterns" • 890 tokens saved
│ Type: decisions • ID: cpt_1765245903512_xk9mp1
│ Merged with: cpt_1765245903512_xk9mp1
└────────────────────────────────────────────────────────────────────┘
```

### praetorian_restore

```
⚜️ praetorian_restore query=<query>
  > "What did we learn about authentication?"
  > "Find the Docker container debugging session"
  > "Show recent architecture decisions"
  > "Search for MCP server implementation patterns"
  > "" (empty = recent compactions)
```

```
⚜️ restore | Search

┌─ ⚜️  ───────────────────────────────────────────────────── Search ─┐
│ Found 2 compactions
│ Query: "authentication"
└────────────────────────────────────────────────────────────────────┘
```

```
⚜️ restore | Recent

┌─ ⚜️  ───────────────────────────────────────────────────── Recent ─┐
│ Found 3 compactions
└────────────────────────────────────────────────────────────────────┘
```

**Status indicators:**

- **Created** - New compaction saved
- **Merged** - Updated existing compaction (>70% title similarity)
- **Search** - Search results returned (keyword matching)
- **Recent** - Recent compactions listed (by updated time)

## usage

Praetorian is designed for **heavy, frequent use**. The more you compact, the more you save.

**When to compact:**

- ✅ After every WebFetch
- ✅ After every Task/subagent completes
- ✅ After reading multiple files
- ✅ After making decisions
- ✅ During long conversations (proactive compaction)
- ✅ Before context gets >60% full

**Real-world example session:**

| Compaction            | Before     | After     | Saved            |
| --------------------- | ---------- | --------- | ---------------- |
| Web research (3 URLs) | 4,500      | 300       | **4,200**        |
| Subagent outputs (2)  | 3,500      | 300       | **3,200**        |
| Architecture debates  | 5,000      | 300       | **4,700**        |
| Hook research         | 1,500      | 150       | **1,350**        |
| **Total**             | **14,500** | **1,050** | **13,450 (93%)** |

Next session: `restore()` loads ~1,000 tokens. Instant resume, no re-research.

## methodology

How [claude-praetorian-mcp](https://github.com/Vvkmnn/claude-praetorian-mcp) [works](https://github.com/Vvkmnn/claude-praetorian-mcp/tree/master/src):

```
"ACE Framework" compaction
      |
      ├─> Input Validation (schemas.ts): Zod runtime validation
      |   • CompactionSchema validates all loaded .toon files
      |   • CompactInputSchema validates requests before processing
      |   • SearchIndexSchema ensures index integrity
      |
      ├─> Similarity Detection (storage/index.ts:48): Jaccard similarity
      |   • Tokenize titles into word sets (lowercase, >2 chars)
      |   • Calculate intersection/union ratio (Set operations)
      |   • >70% similarity = auto-merge with existing
      |
      ├─> TOON Encoding (storage/index.ts:162): Token-Oriented Object Notation
      |   • 30-60% fewer tokens than YAML/JSON
      |   • Schema-aware with explicit array counts [3]
      |   • Lossless JSON conversion (decode → validate → encode)
      |
      ├─> Smart Merging (storage/index.ts:74): Intelligent content combination
      |   • Arrays: Append unique items (Set deduplication)
      |   • Objects: Merge keys, update values (spread operator)
      |   • Decisions: Append to history (chronological order)
      |
      └─> Border Formatting (utils/formatting.ts): Senator-style output
          • Single-line box drawing with ⚜️ emoji (top-left)
          • Status word on top-right (Created/Merged/Search/Recent)
          • Token savings prominently displayed
```

**Core optimizations:**

- [TOON format](https://toonformat.dev): 30-60% fewer tokens than YAML/JSON
- [Zod validation](https://github.com/Vvkmnn/claude-praetorian-mcp/blob/master/src/schemas.ts): Production-grade runtime type safety
- [Jaccard similarity](https://en.wikipedia.org/wiki/Jaccard_index): Smart deduplication via title matching (>70% threshold)
- [Inverted index](https://en.wikipedia.org/wiki/Inverted_index): Fast keyword search without vector embeddings
- [Smart merging](https://github.com/Vvkmnn/claude-praetorian-mcp/blob/master/src/storage/index.ts#L74): Combine similar compactions without duplication

**File access:**

- Stores in: `<project>/.claude/praetorian/`
- TOON format: `.toon` files (30-60% smaller than YAML)
- Zero database dependencies (pure filesystem)
- Never leaves your machine

## development

```bash
git clone https://github.com/Vvkmnn/claude-praetorian-mcp && cd claude-praetorian-mcp
npm install && npm run build
```

**Package requirements:**

- **Node.js**: >=20.0.0 (ES modules)
- **npm**: >=10.0.0 (package-lock v3)
- **Runtime**: `@modelcontextprotocol/sdk`, `@toon-format/toon`, `zod`
- **Zero external databases** - works with `bunx`

**Development workflow:**

```bash
npm run build          # TypeScript compilation
npm run watch          # Watch mode with tsc --watch
node dist/index.js     # Run MCP server directly (stdio)
```

**Contributing:**

- Fork the repository and create feature branches
- Test with multiple compaction types before submitting PRs
- Follow TypeScript strict mode and [MCP protocol](https://modelcontextprotocol.io/specification)

## license

[MIT](LICENSE)

---

![Emperor Claudius](https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Claudius_crop.jpg/500px-Claudius_crop.jpg)

_Tiberius Claudius Caesar Augustus Germanicus - Declared emperor by his Praetorian Guard_
