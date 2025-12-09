import type { RestoreInput, RestoreOutput } from "../types.js";
import type { Storage } from "../storage/index.js";

export async function restore(
  storage: Storage,
  input: RestoreInput
): Promise<RestoreOutput> {
  const limit = input.limit || 3;

  let compactions;

  if (input.query) {
    // Search mode
    compactions = await storage.search(input.query, input.type, limit);
  } else {
    // Recent mode
    const recent = await storage.getRecent(input.type, limit);
    compactions = recent.map((c) => ({ ...c, relevance: 1.0 }));
  }

  return {
    compactions,
    total: compactions.length,
  };
}

export const restoreToolDefinition = {
  name: "praetorian_restore",
  description:
    "Use at session start to load relevant past work, search for specific topics, or see recent compactions. This is your search and retrieval tool. With query: searches and ranks by relevance. Without query: returns recent compactions.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "Search query (e.g., 'auth JWT', 'icon rendering'). Leave empty to get recent compactions.",
      },
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
        description: "Optional filter by compaction type",
      },
      limit: {
        type: "number",
        description: "Maximum number of results to return (default: 3)",
        default: 3,
      },
    },
  },
};
