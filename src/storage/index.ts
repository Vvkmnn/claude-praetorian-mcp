import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { encode, decode } from "@toon-format/toon";
import { CompactionSchema, SearchIndexSchema, CompactInputSchema } from "../schemas.js";
import type { Compaction, CompactInput, SearchIndex } from "../types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Storage {
  private baseDir: string;
  private compactionsDir: string;
  private indexPath: string;

  constructor(projectRoot?: string) {
    // Use project root or current working directory
    this.baseDir = path.join(projectRoot || process.cwd(), ".claude", "praetorian");
    this.compactionsDir = path.join(this.baseDir, "compactions");
    this.indexPath = path.join(this.baseDir, "index.json");
  }

  async init(): Promise<void> {
    await fs.mkdir(this.compactionsDir, { recursive: true });

    // Initialize index if it doesn't exist
    try {
      await fs.access(this.indexPath);
    } catch {
      const initialIndex: SearchIndex = {
        words: {},
        compactions: {},
      };
      await fs.writeFile(this.indexPath, JSON.stringify(initialIndex, null, 2));
    }
  }

  private generateId(): string {
    return `cpt_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  private calculateSimilarity(title1: string, title2: string): number {
    const words1 = new Set(this.tokenize(title1));
    const words2 = new Set(this.tokenize(title2));

    const intersection = new Set([...words1].filter((w) => words2.has(w)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  async findSimilar(title: string, type: string): Promise<string | null> {
    const index = await this.loadIndex();

    // Find compactions with similar titles (>70% similarity)
    for (const [id, meta] of Object.entries(index.compactions)) {
      if (meta.type === type) {
        const similarity = this.calculateSimilarity(title, meta.title);
        if (similarity > 0.7) {
          return id;
        }
      }
    }

    return null;
  }

  private mergeCompaction(
    existing: Compaction,
    input: CompactInput
  ): Compaction {
    const merged: Compaction = { ...existing, updated: new Date().toISOString() };

    // Merge arrays - append unique items (handle null from TOON format)
    const mergeArrays = (
      existingArr?: string[] | null,
      newArr?: string[] | null
    ): string[] | null | undefined => {
      if (!newArr) return existingArr;
      if (!existingArr) return newArr;
      const combined = [...existingArr, ...newArr];
      return [...new Set(combined)]; // Remove duplicates
    };

    merged.key_insights = mergeArrays(existing.key_insights, input.key_insights);
    merged.findings = mergeArrays(existing.findings, input.findings);
    merged.anti_patterns = mergeArrays(existing.anti_patterns, input.anti_patterns);
    merged.refs = mergeArrays(existing.refs, input.refs);
    merged.recommendations = mergeArrays(existing.recommendations, input.recommendations);
    merged.next = mergeArrays(existing.next, input.next);

    // Merge objects (handle null from TOON format)
    if (input.techniques) {
      merged.techniques = { ...(existing.techniques || {}), ...input.techniques };
    }
    if (input.paths) {
      merged.paths = { ...(existing.paths || {}), ...input.paths };
    }
    if (input.decisions) {
      merged.decisions = [...(existing.decisions || []), ...input.decisions];
    }

    // Update scalars if provided
    if (input.source) merged.source = input.source;
    if (input.raw_content) merged.raw_content = input.raw_content;

    return merged;
  }

  async compact(input: CompactInput): Promise<{
    id: string;
    action: "created" | "merged";
    merged_with?: string;
  }> {
    await this.init();

    // Runtime validation of input
    const validatedInput = CompactInputSchema.parse(input);

    // Check for similar existing compaction
    const similarId = await this.findSimilar(validatedInput.title, validatedInput.type);

    if (similarId) {
      // Merge with existing
      const existing = await this.load(similarId);
      const merged = this.mergeCompaction(existing, validatedInput);
      await this.save(merged);
      await this.updateIndex(merged);

      return {
        id: similarId,
        action: "merged",
        merged_with: similarId,
      };
    } else {
      // Create new compaction
      const id = this.generateId();
      const now = new Date().toISOString();
      const compaction: Compaction = {
        ...validatedInput,
        id,
        created: now,
        updated: now,
      };

      await this.save(compaction);
      await this.updateIndex(compaction);

      return {
        id,
        action: "created",
      };
    }
  }

  private async save(compaction: Compaction): Promise<void> {
    const filePath = path.join(this.compactionsDir, `${compaction.id}.toon`);
    const toonContent = encode(compaction);
    await fs.writeFile(filePath, toonContent, "utf-8");
  }

  async load(id: string): Promise<Compaction> {
    const filePath = path.join(this.compactionsDir, `${id}.toon`);
    const content = await fs.readFile(filePath, "utf-8");
    const decoded = decode(content);

    // Runtime validation with Zod
    const validated = CompactionSchema.parse(decoded);
    return validated;
  }

  private async loadIndex(): Promise<SearchIndex> {
    const content = await fs.readFile(this.indexPath, "utf-8");
    const parsed = JSON.parse(content);

    // Runtime validation with Zod
    const validated = SearchIndexSchema.parse(parsed);
    return validated;
  }

  private async saveIndex(index: SearchIndex): Promise<void> {
    await fs.writeFile(this.indexPath, JSON.stringify(index, null, 2));
  }

  private async updateIndex(compaction: Compaction): Promise<void> {
    const index = await this.loadIndex();

    // Update compactions metadata
    index.compactions[compaction.id] = {
      id: compaction.id,
      type: compaction.type,
      title: compaction.title,
      created: compaction.created,
      updated: compaction.updated,
    };

    // Update word index
    const text = [
      compaction.title,
      compaction.source || "",
      ...(compaction.key_insights || []),
      ...(compaction.findings || []),
      ...(compaction.refs || []),
    ].join(" ");

    const words = this.tokenize(text);
    for (const word of words) {
      if (!index.words[word]) {
        index.words[word] = [];
      }
      if (!index.words[word].includes(compaction.id)) {
        index.words[word].push(compaction.id);
      }
    }

    await this.saveIndex(index);
  }

  async search(
    query: string,
    type?: string,
    limit: number = 3
  ): Promise<Array<Compaction & { relevance: number }>> {
    const index = await this.loadIndex();
    const words = this.tokenize(query);

    // Count matches per compaction
    const scores: Record<string, number> = {};

    for (const word of words) {
      const matchingIds = index.words[word] || [];
      for (const id of matchingIds) {
        scores[id] = (scores[id] || 0) + 1;
      }
    }

    // Filter by type if specified
    let candidates = Object.entries(scores);
    if (type) {
      candidates = candidates.filter(
        ([id]) => index.compactions[id]?.type === type
      );
    }

    // Sort by score and take top results
    candidates.sort((a, b) => b[1] - a[1]);
    const topIds = candidates.slice(0, limit).map(([id]) => id);

    // Load full compactions
    const results = await Promise.all(
      topIds.map(async (id) => {
        const compaction = await this.load(id);
        const maxScore = Math.max(...Object.values(scores));
        return {
          ...compaction,
          relevance: scores[id] / maxScore,
        };
      })
    );

    return results;
  }

  async getRecent(
    type?: string,
    limit: number = 3
  ): Promise<Compaction[]> {
    const index = await this.loadIndex();

    let compactions = Object.values(index.compactions);
    if (type) {
      compactions = compactions.filter((c) => c.type === type);
    }

    // Sort by updated date (most recent first)
    compactions.sort(
      (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
    );

    const topIds = compactions.slice(0, limit).map((c) => c.id);
    return Promise.all(topIds.map((id) => this.load(id)));
  }
}
