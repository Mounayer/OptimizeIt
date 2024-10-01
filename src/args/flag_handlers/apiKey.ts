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

  const apiKeyFlagIndex = args.findIndex(
    (arg) => arg === '-a' || arg === '--api-key',
  );

  if (apiKeyFlagIndex !== -1 && apiKeyFlagIndex + 1 < args.length) {
    apiKey =
      args[apiKeyFlagIndex + 1][0] !== '-' ? args[apiKeyFlagIndex + 1] : apiKey;
  }

  return apiKey;
}

export default handleApiKeyFlag;
