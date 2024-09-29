import type { OutputFlagPayload } from '../../interfaces';

/**
 * Handle the output flag and return the output flag and output files.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @returns  { OutputFlagPayload } The output flag and output files.
 */
function handleOutputFlag(
  args: string[],
  outputConfig: string[] | undefined,
): OutputFlagPayload {
  const outputFiles: string[] = outputConfig || []; // Initialize as an empty array

  const outputFlagIndex = args.findIndex(
    (arg) => arg === '-o' || arg === '--output',
  );

  if (outputFlagIndex !== -1) {
    // Collect all filenames after the '-o' or '--output' flag
    for (let i = outputFlagIndex + 1; i < args.length; i++) {
      if (args[i][0] === '-') break; // Stop if another flag is encountered
      outputFiles.push(args[i]); // Add the file name to the array
    }
  }

  if (outputFiles.length > 0) {
    console.log('outputFiles:', JSON.stringify(outputFiles));
  }

  return {
    output: outputFiles.length > 0,
    outputFiles,
  };
}

export default handleOutputFlag;
