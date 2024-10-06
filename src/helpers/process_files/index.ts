import GroqChat from '../../groq';
import MarkDownPayload from '../../interfaces/markDownPayload';
import * as path from 'path';
import fileParser from '../file_parser';
import fileWriter from '../file_writer';

/**
 * Process each file, running it through GroqClient
 *
 * @param {string[]} fileNames - The list of files to process
 * @param {any} args - The CLI arguments passed
 * @param {GroqChat} groqClient - The instance of GroqChat client
 * @returns {Promise<MarkDownPayload[]>} The array of markdown payloads
 */
async function processFiles(
  fileNames: string[],
  args: any,
  groqClient: GroqChat,
): Promise<MarkDownPayload[]> {
  let allResponses: MarkDownPayload[] = [];

  for (let i = 0; i < fileNames.length; ++i) {
    const filePath = path.resolve(fileNames[i]);
    const data = fileParser(filePath);

    console.log(`\nOptimizing ${fileNames[i]}...\n`);

    const response = await groqClient.run(
      fileNames[i],
      data,
      args.model,
      args.temperature,
      args.tokenUsageInformation,
    );

    if (response === 'Unable To Process') continue;

    if (args.markDown || args.html) {
      allResponses.push({
        before: data,
        after: response as string,
        fileName: fileNames[i],
      });
    }

    if (args.output && i < args.outputFiles.length) {
      fileWriter(response as string, args.outputFiles[i]);
    }
  }

  return allResponses;
}

export default processFiles;
