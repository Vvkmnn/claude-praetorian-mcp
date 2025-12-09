import { z } from "zod";

/**
 * Zod schemas for runtime validation of compaction data
 */

export const CompactionTypeSchema = z.enum([
  "web_research",
  "task_result",
  "flow_analysis",
  "decisions",
  "conversation",
  "file_reads",
]);

export const DecisionSchema = z.object({
  chose: z.string(),
  over: z.array(z.string()).optional(),
  reason: z.string(),
});

export const PathSchema = z.object({
  status: z.enum(["working", "broken", "unknown"]),
  trace: z.array(z.string()),
});

export const CompactionSchema = z.object({
  id: z.string(),
  type: CompactionTypeSchema,
  title: z.string(),
  created: z.string(),
  updated: z.string(),

  // Optional flexible content fields (nullish handles both null and undefined from TOON)
  source: z.string().nullish(),
  key_insights: z.array(z.string()).nullish(),
  findings: z.array(z.string()).nullish(),
  techniques: z.record(z.string(), z.string()).nullish(),
  anti_patterns: z.array(z.string()).nullish(),
  decisions: z.array(DecisionSchema).nullish(),
  paths: z.record(z.string(), PathSchema).nullish(),
  refs: z.array(z.string()).nullish(),
  recommendations: z.array(z.string()).nullish(),
  next: z.array(z.string()).nullish(),
  raw_content: z.string().nullish(),
});

export const CompactInputSchema = z.object({
  type: CompactionTypeSchema,
  title: z.string(),
  source: z.string().optional(),
  key_insights: z.array(z.string()).optional(),
  findings: z.array(z.string()).optional(),
  techniques: z.record(z.string(), z.string()).optional(),
  anti_patterns: z.array(z.string()).optional(),
  decisions: z.array(DecisionSchema).optional(),
  paths: z.record(z.string(), PathSchema).optional(),
  refs: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  next: z.array(z.string()).optional(),
  raw_content: z.string().optional(),
});

export const SearchIndexSchema = z.object({
  words: z.record(z.string(), z.array(z.string())),
  compactions: z.record(
    z.string(),
    z.object({
      id: z.string(),
      type: CompactionTypeSchema,
      title: z.string(),
      created: z.string(),
      updated: z.string(),
    })
  ),
});
