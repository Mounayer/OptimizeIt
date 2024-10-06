/**
 * Handles the file names passed as arguments.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @returns { string[] } The file names.
 */
function handleFileNames(args: string[]): string[] {
  const stopIndex = args.findIndex((arg) => arg.startsWith('-'));
  const fileNames = stopIndex === -1 ? args : args.slice(0, stopIndex);

  if (fileNames.length === 0) {
    console.error('Please provide a file name as an argument.');
    process.exit(1);
  }

  return fileNames;
}

export default handleFileNames;
