import handleVersionFlag from './flag_handlers/version';
import handleTemperatureFlag from './flag_handlers/temperature';
import handleModelFlag from './flag_handlers/model';
import handleHelpFlag from './flag_handlers/help';
import handleApiKeyFlag from './flag_handlers/apiKey';
import handleOutputFlag from './flag_handlers/output';
import handleMarkdownFlag from './flag_handlers/markdown';
import handleHTMLFlag from './flag_handlers/html';
import { Config } from '../interfaces';
import handleTokenFlag from './flag_handlers/tokenInfo';
import handleDirectoryFlag from './flag_handlers/directory';
import directoryParser from './directory_parser';

/**
 * Handles the file names passed as arguments.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @returns { string[] } The file names.
 */
function handleFileNames(args: string[]): string[] {
  const stopIndex = args.findIndex((arg) => arg.startsWith('-'));
  const fileNames = stopIndex === -1 ? args : args.slice(0, stopIndex);

  if (fileNames.length === 0) {
    console.error('Please provide a file name as an argument.');
    process.exit(1);
  }

  return fileNames;
}

/**
 * Handles the arguments passed to the CLI.
 *
 * @returns The arguments passed to the CLI.
 */
function argHandler(configOptions: Config) {
  const args = process.argv.slice(2);

  handleVersionFlag(args);
  handleHelpFlag(args);
  const directory = handleDirectoryFlag(args);
  const fileNames =
    directory !== null ? directoryParser(directory) : handleFileNames(args);
  const model = handleModelFlag(args, configOptions.model);
  const temperature = handleTemperatureFlag(args, configOptions.temperature);
  const apiKey = handleApiKeyFlag(args, configOptions.apiKey);
  const { output, outputFiles } = handleOutputFlag(args, configOptions.output);
  const markDown = handleMarkdownFlag(args, configOptions.markdown);
  const html = handleHTMLFlag(args, configOptions.html);
  const tokenUsageInformation = handleTokenFlag(args, configOptions.tokenUsage);

  return {
    fileNames,
    model,
    temperature,
    apiKey,
    output,
    outputFiles,
    markDown,
    html,
    tokenUsageInformation,
  };
}

export default argHandler;
