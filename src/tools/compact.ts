import type { CompactInput, CompactOutput } from "../types.js";
import type { Storage } from "../storage/index.js";

// Estimate tokens (rough: 1 token ≈ 4 characters)
function estimateTokens(obj: any): number {
  const json = JSON.stringify(obj);
  return Math.ceil(json.length / 4);
}

export async function compact(
  storage: Storage,
  input: CompactInput
): Promise<CompactOutput> {
  const result = await storage.compact(input);

  // Estimate token savings
  // Assume original content was 10-20x larger
  const compactedSize = estimateTokens(input);
  const estimatedOriginal = compactedSize * 15; // Conservative 15x estimate
  const saved = estimatedOriginal - compactedSize;

  return {
    id: result.id,
    action: result.action,
    merged_with: result.merged_with,
    tokens_saved: Math.max(saved, 0),
  };
}

export const compactToolDefinition = {
  name: "praetorian_compact",
  description:
    "Use this HEAVILY to save token-expensive context for reuse. Compact after WebFetch, Task completion, reading multiple files, making decisions, or any valuable work. The tool automatically merges with existing similar compactions - you don't need to check if one exists. Just compact, and it handles reuse. The more you compact, the more tokens you save in future sessions.",
  inputSchema: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: [
          "web_research",
          "task_result",
          "flow_analysis",
          "decisions",
          "conversation",
          "file_reads",
        ],
        description: "Type of compaction",
      },
      title: {
        type: "string",
        description: "Concise title for this compaction",
      },
      source: {
        type: "string",
        description: "URL or source identifier",
      },
      key_insights: {
        type: "array",
        items: { type: "string" },
        description: "Bullet points of key findings or insights",
      },
      findings: {
        type: "array",
        items: { type: "string" },
        description: "List of discoveries or observations",
      },
      techniques: {
        type: "object",
        additionalProperties: { type: "string" },
        description: "Key techniques or patterns identified",
      },
      anti_patterns: {
        type: "array",
        items: { type: "string" },
        description: "What to avoid or anti-patterns identified",
      },
      decisions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            chose: { type: "string" },
            over: { type: "array", items: { type: "string" } },
            reason: { type: "string" },
          },
          required: ["chose", "reason"],
        },
        description: "Decisions made with alternatives and rationale",
      },
      paths: {
        type: "object",
        additionalProperties: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["working", "broken", "unknown"],
            },
            trace: { type: "array", items: { type: "string" } },
          },
          required: ["status", "trace"],
        },
        description: "Code flow paths with traces",
      },
      refs: {
        type: "array",
        items: { type: "string" },
        description: "file:line references (e.g., 'auth.ts:45 - Token validation')",
      },
      recommendations: {
        type: "array",
        items: { type: "string" },
        description: "Next steps or recommendations",
      },
      next: {
        type: "array",
        items: { type: "string" },
        description: "Action items or next steps",
      },
      raw_content: {
        type: "string",
        description: "Full raw content if needed for later retrieval",
      },
    },
    required: ["type", "title"],
  },
};
