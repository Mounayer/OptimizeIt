/**
 * Handle the html flag
 *
 * @param { string } args - The arguments passed to the CLI.
 * @returns { boolean } True if html flag is provided, false otherwise.
 */
function handleHTMLFlag(args: string[]): boolean {
  return args.includes('--html');
}

export default handleHTMLFlag;
