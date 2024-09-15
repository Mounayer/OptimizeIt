/**
 * Handles the token info from Groq.
 *
 * @param {string[]} args - The arguments passed to the CLI.
 * @returns {boolean} True if the token usage flag is present, otherwise false.
 */
function handleTokenFlag(args: string[]): boolean {
  try {
    console.log(`List of arguments: ${args}`);
    const tokenFlagIndex = args.findIndex(
      (arg) => arg === '--token-usage' || arg === '-tu',
    );
    return tokenFlagIndex !== -1;
  } catch (err) {
    console.error(`Error getting token info: ${err}`);
    return false;
  }
}

export default handleTokenFlag;
