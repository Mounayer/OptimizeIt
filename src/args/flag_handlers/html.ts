/**
 * Handle the html flag
 *
 * @param { string } args - The arguments passed to the CLI.
 * @param { boolean } htmlConfig - The html flag from the config file.
 * @returns { boolean } True if html flag is provided, false otherwise.
 */
function handleHTMLFlag(args: string[], htmlConfig: boolean = false): boolean {
  return args.includes('--html') || htmlConfig;
}

export default handleHTMLFlag;
