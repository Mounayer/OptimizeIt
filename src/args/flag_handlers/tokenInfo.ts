/**
 * Handle the token usage information flag and returns the true or false state,
 * that use to provide token information on completion.
 * @param {string[]} args - The arguments passed to the CLI.
 * @returns {boolean} True if the token usage flag is present, otherwise false.
 */
function handleTokenFlag(args: string[]): boolean {
  return args.includes('--token-usage') || args.includes('-tu');
}

export default handleTokenFlag;
