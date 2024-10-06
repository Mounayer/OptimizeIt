import getFlagValue from '../helpers/getFlagValue';

/**
 * Handle the directory flag and return the directory if given, otherwise return null.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @returns { string | null } The directory if given, null if not.
 */
function handleDirectoryFlag(args: string[]): string | null {
  return getFlagValue(args, ['-d', '--dir'], null);
}

export default handleDirectoryFlag;
