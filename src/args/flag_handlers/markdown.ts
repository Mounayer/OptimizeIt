/**
 * Handle the markdown flag
 *
 * @param { string } args - The arguments passed to the CLI.
 * @returns { boolean } True if markdown flag is provided, false otherwise.
 */
function handleMarkdownFlag(
  args: string[],
  markdownConfig: boolean = false,
): boolean {
  return args.includes('--markdown') || args.includes('-md') || markdownConfig;
}

export default handleMarkdownFlag;
