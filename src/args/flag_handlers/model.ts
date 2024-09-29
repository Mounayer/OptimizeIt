/**
 * This function handles the model flag and returns the model name.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @returns { string } The model name.
 */
function handleModelFlag(
  args: string[],
  modelConfig: string = 'llama-3.1-70b-versatile',
): string {
  let model = modelConfig;

  const modelFlagIndex = args.findIndex(
    (arg) => arg === '-m' || arg === '--model',
  );

  if (modelFlagIndex !== -1 && modelFlagIndex + 1 < args.length) {
    model =
      args[modelFlagIndex + 1][0] !== '-' ? args[modelFlagIndex + 1] : model;

    console.log('model:', model);
  }

  return model;
}

export default handleModelFlag;
