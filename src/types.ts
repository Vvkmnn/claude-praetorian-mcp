export type CompactionType =
  | 'web_research'
  | 'task_result'
  | 'flow_analysis'
  | 'decisions'
  | 'conversation'
  | 'file_reads';

export interface Decision {
  chose: string;
  over?: string[];
  reason: string;
}

export interface Path {
  status: 'working' | 'broken' | 'unknown';
  trace: string[];
}

export interface Compaction {
  id: string;
  type: CompactionType;
  title: string;
  created: string;
  updated: string;

  // Flexible content fields (TOON may encode as null)
  source?: string | null;
  key_insights?: string[] | null;
  findings?: string[] | null;
  techniques?: Record<string, string> | null;
  anti_patterns?: string[] | null;
  decisions?: Decision[] | null;
  paths?: Record<string, Path> | null;
  refs?: string[] | null;
  recommendations?: string[] | null;
  next?: string[] | null;
  raw_content?: string | null;
}

export interface CompactInput {
  type: CompactionType;
  title: string;
  source?: string;
  key_insights?: string[];
  findings?: string[];
  techniques?: Record<string, string>;
  anti_patterns?: string[];
  decisions?: Decision[];
  paths?: Record<string, Path>;
  refs?: string[];
  recommendations?: string[];
  next?: string[];
  raw_content?: string;
}

export interface CompactOutput {
  id: string;
  action: 'created' | 'merged';
  merged_with?: string;
  tokens_saved: number;
}

export interface RestoreInput {
  query?: string;
  type?: CompactionType;
  limit?: number;
}

export interface RestoreOutput {
  compactions: Array<Compaction & { relevance?: number }>;
  total: number;
}

export interface SearchIndex {
  words: Record<string, string[]>; // word -> compaction IDs
  compactions: Record<
    string,
    {
      id: string;
      type: CompactionType;
      title: string;
      created: string;
      updated: string;
    }
  >;
}
