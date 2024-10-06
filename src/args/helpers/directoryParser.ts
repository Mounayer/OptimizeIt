import * as fs from 'fs';
import * as path from 'path';

/**
 * Returns an array of file names in the given directory, prefixed with the directory name.
 *
 * @param {string} dirName - The name of the directory to read.
 * @returns {string[]} An array of file names, including their extensions, prefixed by the directory name.
 */
export default function directoryParser(dirName: string): string[] {
  try {
    const directoryPath = path.resolve(dirName);

    const files = fs.readdirSync(directoryPath);

    return files.map((file) => path.join(dirName, file));
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
    process.exit(1);
  }
}
