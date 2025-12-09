/**
 * Creates a beautiful bordered box with senator-style formatting
 *
 * @param content - Array of content lines to display
 * @param status - Status word to display in top-right corner (e.g., "Created", "Merged", "Found")
 * @param width - Total width of the box (default: 70)
 * @returns Formatted bordered box as a string
 */
export function formatBorderedBox(
  content: string[],
  status: string,
  width: number = 70
): string {
  const lines: string[] = [];

  // Top border: ┌─ ⚜️  ─────... [Status] ─┐
  const topLeft = "┌─ ⚜️  ";
  const topRight = ` ${status} ─┐`;
  const dashCount = width - topLeft.length - topRight.length;
  const topBorder = topLeft + "─".repeat(Math.max(0, dashCount)) + topRight;
  lines.push(topBorder);

  // Content lines: │ [content]
  for (const line of content) {
    lines.push(`│ ${line}`);
  }

  // Bottom border: └─────...─┘
  const bottomBorder = "└" + "─".repeat(width - 2) + "┘";
  lines.push(bottomBorder);

  return lines.join("\n");
}
