import GroqChat from '../../groq';
import MarkDownPayload from '../../interfaces/markDownPayload';
import markDownFileWriter from '../markdown_file_writer';
import htmlFileWriter from '../html_file_writer';

/**
 * Handles the output of responses, logging token usage and writing files if necessary
 *
 * @param {MarkDownPayload[]} allResponses - The array of markdown payloads
 * @param {any} args - The CLI arguments passed
 * @param {GroqChat} groqClient - The instance of GroqChat client
 */
function handleOutput(
  allResponses: MarkDownPayload[],
  args: any,
  groqClient: GroqChat,
): void {
  if (args.tokenUsageInformation) {
    groqClient.logTotalTokenUsage(args.fileNames);
  }

  if (args.markDown) {
    markDownFileWriter(allResponses);
  }

  if (args.html) {
    htmlFileWriter(allResponses);
  }
}

export default handleOutput;
