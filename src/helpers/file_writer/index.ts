import * as fs from 'fs';
import * as path from 'path';

/**
 * Writes the data to a file in the output directory.
 *
 * @param { string } data - The data to write to the file.
 * @param { string } outputFile - The name of the output file.
 */
function fileWriter(data: string, outputFile: string): void {
  try {
    if (data.startsWith('```')) {
      const dataParts = data.split('\n');
      dataParts.shift();
      data = dataParts.join('\n');
    }

    data = data.replace(/```$/, '').trim();

    const outputDir = path.resolve(__dirname, '../../output');

    console.log('outputDir', outputDir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, outputFile);
    fs.writeFileSync(outputPath, data);
  } catch (err) {
    console.error(`Error writing to file: ${err}`);
    process.exit(1);
  }
}

export default fileWriter;
