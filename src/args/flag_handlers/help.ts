/**
 * Handles the help flag and prints the help message to the console.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 */
function handleHelpFlag(args: string[]) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
  Usage: optimizeit [options] <file1> [file2]
  
  Options:
    -h, --help             Show this help message and exit
    -v, --version          Show version information
    -md, --markdown        Generate a markdown file with all changes
    -o, --output <files>   Specify output file(s) to save changes
    -m, --model <name>     Specify the model name to use
    -t, --temperature <n>  Set model temperature (0.1 to 2)
    -a, --api-key <key>    Provide your API key
  
  Examples:
    optimizeit file1
    optimizeit file1 file2
    optimizeit -v
    optimizeit file1 --markdown
    optimizeit file1 -o outputFile
    optimizeit file1 --model model_name
    optimizeit file1 -t 0.5
    optimizeit file1 --api-key your_api_key
      `);
    process.exit(0);
  }
}

export default handleHelpFlag;
