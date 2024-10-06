import getFlagValue from '../helpers/getFlagValue';

/**
 * Handle the API key flag and return the API key.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @param { string | undefined } apiKeyConfig - The API key from the config file.
 * @returns { string } The API key.
 */
function handleApiKeyFlag(
  args: string[],
  apiKeyConfig: string | undefined,
): string {
  let apiKey = process.env.GROQ_API_KEY || apiKeyConfig || '';

  const apiKeyFromFlag = getFlagValue(args, ['-a', '--api-key'], apiKey);

  return apiKeyFromFlag || apiKey;
}

export default handleApiKeyFlag;
