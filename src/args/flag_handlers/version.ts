import * as path from 'path';
import { readFileSync } from 'fs';

/**
 * Handles the version flag. If the flag is present, the version and name of the package is printed to the console.
 *
 * @param { string[] } args
 */
function handleVersionFlag(args: string[]) {
  try {
    if (args.includes('--version') || args.includes('-v')) {
      const packageJsonPath = path.resolve(__dirname, '../../../package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      console.log(`${packageJson.name} version ${packageJson.version}`);
      process.exit(0);
    }
  } catch (err) {
    console.error('Error reading package.json:', err);
    process.exit(1);
  }
}

export default handleVersionFlag;
