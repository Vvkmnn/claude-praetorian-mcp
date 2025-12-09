#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Storage } from "./storage/index.js";
import { compact, compactToolDefinition } from "./tools/compact.js";
import { restore, restoreToolDefinition } from "./tools/restore.js";
import { formatBorderedBox } from "./utils/formatting.js";
import type { CompactInput, RestoreInput } from "./types.js";

// Initialize storage
const storage = new Storage();

// Create MCP server
const server = new Server(
  {
    name: "claude-praetorian-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [compactToolDefinition, restoreToolDefinition],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "praetorian_compact") {
      const input = args as unknown as CompactInput;
      const result = await compact(storage, input);

      // Format response with senator-style border
      const status = result.action === "created" ? "Created" : "Merged";
      const content = [
        `Compacted: "${input.title}" • ${result.tokens_saved.toLocaleString()} tokens saved`,
        `Type: ${input.type} • ID: ${result.id}`,
      ];

      if (result.merged_with) {
        content.push(`Merged with: ${result.merged_with}`);
      }

      const formatted = formatBorderedBox(content, status);

      return {
        content: [
          {
            type: "text",
            text: formatted,
          },
        ],
      };
    } else if (name === "praetorian_restore") {
      const input = args as unknown as RestoreInput;
      const result = await restore(storage, input);

      // Format response with senator-style border
      const mode = input.query ? "Search" : "Recent";
      const content = [
        `Found ${result.total} compaction${result.total !== 1 ? "s" : ""}`,
      ];

      if (input.query) {
        content.push(`Query: "${input.query}"`);
      }

      const formatted = formatBorderedBox(content, mode);

      // Include full compactions data as JSON below the border
      const fullOutput = `${formatted}\n\n${JSON.stringify(result, null, 2)}`;

      return {
        content: [
          {
            type: "text",
            text: fullOutput,
          },
        ],
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Praetorian MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
