import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads the file and returns the data.
 *
 * @param { string } fileName - The name of the file to read.
 * @returns { string } The data from the file.
 */
export default function fileParser(fileName: string): string {
  try {
    const filePath = path.resolve(fileName);

    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(`Error reading file: ${err}`);
    process.exit(1);
  }
}
