<img align="right" src="claude-praetorian.svg" alt="claude-praetorian-mcp" width="220">

# claude-praetorian-mcp

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for aggressive context compaction in [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Save 90%+ tokens by compacting web research, task outputs, and conversations into structured snapshots.

<br clear="right">

![claude-praetorian-mcp](demo/demo.gif)

[![npm version](https://img.shields.io/npm/v/claude-praetorian-mcp.svg)](https://www.npmjs.com/package/claude-praetorian-mcp) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/) [![Claude](https://img.shields.io/badge/Claude-D97757?logo=claude&logoColor=fff)](#) [![GitHub stars](https://img.shields.io/github/stars/Vvkmnn/claude-praetorian-mcp?style=social)](https://github.com/Vvkmnn/claude-praetorian-mcp)

---

Inspired by [this talk](https://www.youtube.com/watch?v=rmvDxxNubIg) by [Dexter Horthy](https://x.com/dexhorthy) from [HumanLayer](http://humanlayer.dev), and his team's work on [ACE: Advanced Context Engineering for Coding Agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md), [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) & the [`TOON` (Token-Oriented Object Notation) Format](https://toonformat.dev).

## install

**Requirements:**

[![Claude Code](https://img.shields.io/badge/Claude_Code-555?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxMCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KICA8IS0tIENsYXdkOiBDbGF1ZGUgQ29kZSBtYXNjb3QgLS0+CiAgPCEtLSBEZWNvZGVkIGZyb206IOKWkOKWm+KWiOKWiOKWiOKWnOKWjCAvIOKWneKWnOKWiOKWiOKWiOKWiOKWiOKWm+KWmCAvIOKWmOKWmCDilp3ilp0gLS0+CiAgPCEtLSBTdWItcGl4ZWxzIGFyZSAxIHdpZGUgeCAyIHRhbGwgdG8gbWF0Y2ggdGVybWluYWwgY2hhciBjZWxsIGFzcGVjdCByYXRpbyAtLT4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIzIiAgeT0iMCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIzIiAgeT0iMiIgd2lkdGg9IjIiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSI2IiAgeT0iMiIgd2lkdGg9IjYiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIxMyIgeT0iMiIgd2lkdGg9IjIiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIxIiAgeT0iNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIzIiAgeT0iNiIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSI0IiAgeT0iOCIgd2lkdGg9IjEiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSI2IiAgeT0iOCIgd2lkdGg9IjEiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIxMSIgeT0iOCIgd2lkdGg9IjEiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIxMyIgeT0iOCIgd2lkdGg9IjEiICBoZWlnaHQ9IjIiLz4KPC9zdmc+Cg==)](https://claude.ai/code)

**From shell:**

```bash
claude mcp add claude-praetorian-mcp -- npx claude-praetorian-mcp
```

**From inside Claude** (restart required):

```
Add this to our global mcp config: npx claude-praetorian-mcp

Install this mcp: https://github.com/Vvkmnn/claude-praetorian-mcp
```

**From any manually configurable `mcp.json`**: (Cursor, Windsurf, etc.)

```json
{
  "mcpServers": {
    "praetorian": {
      "command": "npx",
      "args": ["claude-praetorian-mcp"],
      "env": {}
    }
  }
}
```

That's it; there is **no `npm install` required** as there are no external databases or services, only flat files.

However, in the unlikely event that you pull the wrong package / `npx` registry is out of date, you can force resolution with:

```bash
npm install -g claude-praetorian-mcp
```

## skill

Optionally, install the skill to teach Claude when to proactively use praetorian:

```bash
npx skills add Vvkmnn/claude-praetorian-mcp --skill claude-praetorian --global
# Optional: add --yes to skip interactive prompt and install to all agents
```

This makes Claude automatically compact after research, subagent tasks, and before context resets. The MCP works without the skill, but the skill improves discoverability.

## plugin

For full automation with hooks, install from the [claude-emporium](https://github.com/Vvkmnn/claude-emporium) marketplace:

```bash
/plugin marketplace add Vvkmnn/claude-emporium
/plugin install claude-praetorian@claude-emporium
```

The **claude-praetorian** plugin provides:

**Hooks** (targeted, fires only at high-value moments):

- Before EnterPlanMode → Restore prior compactions for this project
- Before context compaction → Save decisions/insights before context resets
- After WebFetch/WebSearch → Compact web research findings
- After SubagentStop → Compact subagent task results

**Commands:** `/praetorian-compact`, `/praetorian-restore`, `/praetorian-search`

Requires the MCP server installed first. See the emporium for other Claude Code plugins and MCPs.

## features

[MCP server](https://modelcontextprotocol.io/) for aggressive context compaction. Generates **structured incremental snapshots** to yield 90%+ token savings and easily refresh context with ["frequent intentional compaction"](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md#slightly-smarter-intentional-compaction).

Runs project by project, saves artifacts to `{$project}/.claude/praetorian` (with a royal guard `⚜️`):

#### `praetorian_compact`

(Incrementally) compact context using the TOON format to get the most valuable tokens from an activity.

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

```json
{
  "type": "web_research",
  "title": "ACE Framework Research",
  "source": "https://github.com/humanlayer/ace-fca",
  "key_insights": [
    "Frequent intentional compaction saves 90%+ tokens",
    "TOON format is 30-60% smaller than JSON/YAML",
    "Compaction should happen after every expensive operation"
  ],
  "refs": ["ace-fca.md:42 - compaction strategy", "toon-spec.md:1 - format definition"],
  "recommendations": ["Compact after every WebFetch", "Use type='decisions' for architecture choices"]
}
```

```
⚜️ compact | Merged

┌─ ⚜️  ───────────────────────────────────────────────────── Merged ─┐
│ Compacted: "Authentication Patterns" • 890 tokens saved
│ Type: decisions • ID: cpt_1765245903512_xk9mp1
│ Merged with: cpt_1765245903512_xk9mp1
└────────────────────────────────────────────────────────────────────┘
```

```json
{
  "type": "decisions",
  "title": "Authentication Patterns",
  "decisions": [
    { "chose": "JWT with refresh tokens", "over": ["sessions", "API keys"], "reason": "Stateless, works across microservices" },
    { "chose": "httpOnly cookies", "over": ["localStorage"], "reason": "XSS protection" }
  ],
  "refs": ["src/middleware/auth.ts:45 - token validation", "src/routes/login.ts:23 - refresh flow"],
  "anti_patterns": ["Never store tokens in localStorage", "Never skip CSRF on cookie-based auth"]
}
```

#### `praetorian_restore`

Search and restore context by injecting TOON tokens back into current context as needed.

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

```json
{
  "compactions": [
    {
      "id": "cpt_1765245903512_xk9mp1",
      "type": "decisions",
      "title": "Authentication Patterns",
      "relevance": 0.85,
      "key_insights": ["JWT with refresh tokens", "httpOnly cookies for XSS protection"],
      "refs": ["src/middleware/auth.ts:45", "src/routes/login.ts:23"]
    },
    {
      "id": "cpt_1765245902396_nxetoc",
      "type": "web_research",
      "title": "OAuth2 Best Practices",
      "relevance": 0.72,
      "key_insights": ["PKCE flow for public clients", "Token rotation every 15min"]
    }
  ],
  "total": 2
}
```

```
⚜️ restore | Recent

┌─ ⚜️  ───────────────────────────────────────────────────── Recent ─┐
│ Found 3 compactions
└────────────────────────────────────────────────────────────────────┘
```

**Status indicators:**

- **Created** - New compaction saved
- **Merged** - Updated existing compaction (>70% title similarity via [Jaccard index](https://en.wikipedia.org/wiki/Jaccard_index))
- **Search** - Search results returned (keyword matching)
- **Recent** - Recent compactions listed (by updated time)

Praetorian is designed for **heavy, frequent use**. The more you compact, the more you save.

**When to compact:**

- [x] After every WebFetch
- [x] After every Task/subagent completes
- [x] After reading multiple files
- [x] After making decisions
- [x] During long conversations (proactive compaction)
- [x] Before context gets >60% full

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
              ⚜️  claude-praetorian-mcp
              ════════════════════════


        compact (save)          restore (load)
        ──────────────          ──────────────

            INPUT                   QUERY
              │                       │
              ▼                       ▼
          ┌─────────┐           ┌─────────┐
          │   Zod   │           │ Inverted│
          │Validate │           │  Index  │
          └────┬────┘           └────┬────┘
               │                     │
               ▼                     ▼
          ┌─────────┐           ┌─────────┐
          │ Jaccard │           │  TOON   │
          │ >70% ?  │           │ Decode  │
          └──┬───┬──┘           └────┬────┘
             │   │                   │
          new│   │match              ▼
             │   │                OUTPUT
             ▼   ▼
          ┌─────────┐
          │  TOON   │
          │ Encode  │
          └────┬────┘
               │
               ▼
          ┌─────────┐
          │  Index  │
          │ Update  │
          └────┬────┘
               │
               ▼
            OUTPUT


        storage: .claude/praetorian/
        ────────────────────────────
        index.json            word index + metadata
        compactions/*.toon    encoded compaction files
```

**Core optimizations:**

- [TOON format](https://toonformat.dev): 30-60% fewer tokens than YAML/JSON
- [Zod validation](https://github.com/Vvkmnn/claude-praetorian-mcp/blob/master/src/schemas.ts): Production-grade runtime type safety
- [Jaccard similarity](https://en.wikipedia.org/wiki/Jaccard_index): Smart deduplication via title matching (>70% threshold)
- [Inverted index](https://en.wikipedia.org/wiki/Inverted_index): Fast keyword search without vector embeddings
- [Smart merging](https://github.com/Vvkmnn/claude-praetorian-mcp/blob/master/src/storage/index.ts#L74): Combine similar compactions without duplication

**File access:**

- Stores in: `<project>/.claude/praetorian/`
- TOON format: `.toon` files (40% fewer bytes than YAML/XML)
- Zero database dependencies (flat files only, no external services)
- Never leaves your machine

## development

```bash
git clone https://github.com/Vvkmnn/claude-praetorian-mcp && cd claude-praetorian-mcp
npm install && npm run build
npm test
```

**Package requirements:**

- **Node.js**: >=20.0.0 (ES modules)
- **Runtime**: `@modelcontextprotocol/sdk`, `@toon-format/toon`, `zod`
- **Zero external databases** — works with `npx`

**Development workflow:**

```bash
npm run build          # TypeScript compilation with executable permissions
npm run dev            # Watch mode with tsc --watch
npm run start          # Run the MCP server directly
npm run lint           # ESLint code quality checks
npm run lint:fix       # Auto-fix linting issues
npm run format         # Prettier formatting (src/)
npm run format:check   # Check formatting without changes
npm run typecheck      # TypeScript validation without emit
npm run test           # Lint + type check
npm run prepublishOnly # Pre-publish validation (build + lint + format:check)
```

**Git hooks (via Husky):**

- **pre-commit**: Auto-formats staged `.ts` files with Prettier and ESLint

Contributing:

- Fork the repository and create feature branches
- Test with multiple compaction types before submitting PRs
- Follow TypeScript strict mode and [MCP protocol](https://modelcontextprotocol.io/specification) standards

Learn from examples:

- [Official MCP servers](https://github.com/modelcontextprotocol/servers) for reference implementations
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) for best practices
- [Creating Node.js modules](https://docs.npmjs.com/creating-node-js-modules) for npm package development

## license

[MIT](LICENSE)

<hr>

<a href="https://en.wikipedia.org/wiki/A_Roman_Emperor_AD_41"><img src="logo/praetorian-guard.jpg" alt="A Roman Emperor AD 41 — Lawrence Alma-Tadema" width="100%"></a>

_**[A Roman Emperor AD 41](https://en.wikipedia.org/wiki/A_Roman_Emperor_AD_41)** by **[Lawrence Alma-Tadema](https://en.wikipedia.org/wiki/Lawrence_Alma-Tadema)** (1871). [Gratus](https://en.wikipedia.org/wiki/Praetorian_Guard) of the [Praetorian Guard](https://en.wikipedia.org/wiki/Praetorian_Guard) discovers [Claudius](https://en.wikipedia.org/wiki/Claudius) hiding behind a curtain and [declares him emperor](https://en.wikipedia.org/wiki/Claudius#Accession). [Walters Art Museum](https://art.thewalters.org/detail/637/a-roman-emperor-41-ad/), public domain._
