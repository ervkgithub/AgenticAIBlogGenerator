export interface GeneratedFile {
  path: string;
  content: string;
}

/**
 * Parses the AI response looking for the custom file format:
 * === FILE: path/to/file ===
 * code content
 */
export function parseFiles(content: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const regex = /=== FILE: (.*?) ===\n([\s\S]*?)(?=\n=== FILE:|$)/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    files.push({
      path: match[1].trim(),
      content: match[2].trim(),
    });
  }
  
  return files;
}

/**
 * Extracts a single code block if the AI doesn't use the full file system format.
 */
export function extractCodeBlock(content: string): string {
  const regex = /```(?:\w+)?\n([\s\S]*?)```/;
  const match = regex.exec(content);
  return match ? match[1].trim() : content.trim();
}
