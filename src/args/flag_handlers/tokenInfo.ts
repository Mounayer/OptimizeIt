/**
 * Handles the token info from Groq.
 *
 * @param {string[]} args - The arguments passed to the CLI.
 * @returns {boolean} True if the token usage flag is present, otherwise false.
 */
function handleTokenFlag(args: string[]): boolean {
  try {
    return args.includes('--token-usage') || args.includes('-tu');
  } catch (err) {
    console.error(`Error getting token info: ${err}`);
    return false;
  }
}

export default handleTokenFlag;
