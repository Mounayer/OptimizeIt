import handleVersionFlag from './flag_handlers/version';
import handleTemperatureFlag from './flag_handlers/temperature';
import handleModelFlag from './flag_handlers/model';
import handleHelpFlag from './flag_handlers/help';
import handleApiKeyFlag from './flag_handlers/apiKey';
import handleOutputFlag from './flag_handlers/output';
import handleMarkdownFlag from './flag_handlers/markdown';
import handleHTMLFlag from './flag_handlers/html';
import TomlConfig from '../interfaces/tomlConfig';
import handleTokenFlag from './flag_handlers/tokenUsageInfo';
import handleDirectoryFlag from './flag_handlers/directory';
import directoryParser from './helpers/directoryParser';
import tomlParser from '../helpers/toml_parser';
import handleFileNames from './helpers/handleFileNames';

/**
 * Handles the arguments passed to the CLI.
 *
 * @returns The arguments passed to the CLI.
 */
function argHandler() {
  const configOptions: TomlConfig = tomlParser();
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
