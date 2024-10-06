import * as fs from 'fs';
import * as path from 'path';
import MarkDownPayload from '../../interfaces/markDownPayload';

/**
 * Extract the language from the markdown code block.
 *
 * @param after - The markdown code block.
 * @returns { string } The language of the code block.
 */
export function extractLanguage(after: string | undefined): string {
  if (after) {
    const match = after.match(/^```(\w+)/);
    return match ? match[1] : '';
  }
  return '';
}

/**
 * Write the markdown file containing the before and after of every file processes.
 *
 * @param { MarkDownPayload[] } allResponses - The name, before and after of every file processed.
 */
function markDownFileWriter(allResponses: MarkDownPayload[]): void {
  const outputDir = path.resolve(__dirname, '../../output');

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const markdownFilePath = path.join(outputDir, 'changes.md');

  let content = '# Changes\n\n';

  allResponses.forEach(({ before, after, fileName }) => {
    const language = extractLanguage(after);

    content += `## ${fileName}\n\n`;
    content += `### Before\n\n`;
    content += `\`\`\`${language}\n${before.trim()}\n\`\`\`\n\n`;
    content += `### After\n\n`;
    content += `${after ? after.trim() : ''}\n\n`;
  });

  try {
    fs.writeFileSync(markdownFilePath, content.trim());
  } catch (err) {
    console.error(`Error writing to MarkDown file: ${err}`);
    process.exit(1);
  }

  console.log(
    `Markdown file created containing all changes: ${markdownFilePath}`,
  );
}

export default markDownFileWriter;
