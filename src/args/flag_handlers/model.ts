import getFlagValue from '../helpers/getFlagValue';

/**
 * This function handles the model flag and returns the model name.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @param { string } modelConfig - The model name from the config file.
 * @returns { string } The model name.
 */
function handleModelFlag(
  args: string[],
  modelConfig: string = 'llama-3.1-70b-versatile',
): string {
  const model =
    getFlagValue(args, ['-m', '--model'], modelConfig) || modelConfig;

  if (model !== modelConfig) {
    console.log('model:', model);
  }

  return model;
}

export default handleModelFlag;
