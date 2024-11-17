import * as fs from 'fs';
import * as path from 'path';
import MarkDownPayload from '../../interfaces/markDownPayload';
import { extractLanguage } from '../markdown_file_writer';
import { marked } from 'marked';

/**
 * Convert markdown text to HTML.
 *
 * @param markdownText - The markdown text to convert.
 * @returns { string } The converted HTML text.
 */
async function markdownToHtml(markdownText: string): Promise<string> {
  return marked(markdownText);
}

/**
 * Write the HTML file containing the converted HTML from Markdown.
 *
 * @param { MarkDownPayload[] } allResponses - The name, before and after of every file processed.
 */
async function htmlFileWriter(allResponses: MarkDownPayload[]): Promise<void> {
  const outputDir = path.join(process.cwd(), 'output');

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const htmlFilePath = path.join(outputDir, 'changes.html');

  let content = `
                  <!DOCTYPE html>
                  <html lang="en">
                  <head>
                      <meta charset="UTF-8" />
                      <title>Changes</title>
                      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
                      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
                      <style>
                          body { 
                              font-family: Arial, sans-serif; 
                              margin: 20px; 
                              background: #f9f9f9;
                              color: #333;
                          }
                          .file-changes {
                              background: #ffffff;
                              border: 1px solid #ddd;
                              padding: 15px;
                              border-radius: 5px;
                              margin-bottom: 40px;
                              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
                              overflow: hidden;
                          }
                          .file-header {
                              font-size: 1.2em;
                              font-weight: bold;
                              margin-bottom: 20px;
                              text-align: center;
                          }
                          .change-block {
                              display: flex;
                              justify-content: space-between;
                          }
                          .change-block > div {
                              flex: 1;
                              background: #f0f0f0;
                              padding: 10px;
                              border-radius: 5px;
                              margin: 0 10px;
                          }
                          pre {
                              background: #e0e0e0;
                              border-left: 3px solid #333;
                              padding: 10px;
                              overflow-x: auto;
                              white-space: pre-wrap;
                              word-break: break-word;
                          }
                          @media (max-width: 768px) {
                              .change-block {
                                  flex-direction: column;
                              }
                          }
                      </style>
                  </head>
                  <body>
                      <h1>Changes</h1>
                      <!-- Add your content here -->
                  </body>
                  </html>
                  `;

  try {
    const htmlBlocks = await Promise.all(
      allResponses.map(async ({ before, after, fileName }) => {
        const language = extractLanguage(after);

        // Convert the before and after markdown to HTML
        const beforeHtml = await markdownToHtml(
          `\`\`\`${language}\n${before.trim()}\n\`\`\``,
        );

        // Convert the after markdown to HTML
        const afterHtml = await markdownToHtml(after ? after.trim() : '');

        return `<div class="file-changes">
                    <div class="file-header">${fileName}</div>
                    <div class="change-block">
                    <div>
                        <h3>Before</h3>
                        <div>${beforeHtml}</div>
                    </div>
                    <div>
                        <h3>After</h3>
                        <div>${afterHtml}</div>
                    </div>
                    </div>
                </div>`;
      }),
    );

    htmlBlocks.forEach((block) => (content += block));

    content += `<script>
                    hljs.highlightAll();
                  </script>
                  </body>
                  </html>`;

    fs.writeFileSync(htmlFilePath, content.trim());
  } catch (err) {
    console.error(`Error writing to HTML file: ${err}`);
    process.exit(1);
  }

  console.log(`HTML file created containing all changes: ${htmlFilePath}`);
}

export default htmlFileWriter;
