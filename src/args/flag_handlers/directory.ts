/**
 * Handle the directory flag and return the directory if given, otherwise return null.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @returns { string | null } The directory if given, null if not.
 */
function handleDirectoryFlag(args: string[]): string | null {
  let directory = null;

  const directoryFlagIndex = args.findIndex(
    (arg) => arg === '-d' || arg === '--dir',
  );

  if (directoryFlagIndex !== -1 && directoryFlagIndex + 1 < args.length) {
    directory =
      args[directoryFlagIndex + 1][0] !== '-'
        ? args[directoryFlagIndex + 1]
        : directory;
  }

  return directory;
}

export default handleDirectoryFlag;
