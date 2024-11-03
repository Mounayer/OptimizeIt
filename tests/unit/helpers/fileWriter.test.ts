import fileWriter from '../../../src/helpers/file_writer';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('fileWriter', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('writes data to the specified output file', () => {
    const data = 'Sample file content';
    const outputFile = 'output.txt';
    const outputDir = '/mocked/output';
    const outputPath = `${outputDir}/${outputFile}`;

    (path.resolve as jest.Mock).mockReturnValue(outputDir);
    (path.join as jest.Mock).mockReturnValue(outputPath);
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    fileWriter(data, outputFile);

    expect(fs.writeFileSync).toHaveBeenCalledWith(outputPath, data);
  });

  test('trims surrounding code block markers from data', () => {
    const data = '```\nSample file content\n```';
    const trimmedData = 'Sample file content';
    const outputFile = 'output.txt';
    const outputDir = '/mocked/output';
    const outputPath = `${outputDir}/${outputFile}`;

    (path.resolve as jest.Mock).mockReturnValue(outputDir);
    (path.join as jest.Mock).mockReturnValue(outputPath);
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    fileWriter(data, outputFile);

    expect(fs.writeFileSync).toHaveBeenCalledWith(outputPath, trimmedData);
  });

  test('creates the output directory if it does not exist', () => {
    const data = 'Sample file content';
    const outputFile = 'output.txt';
    const outputDir = '/mocked/output';
    const outputPath = `${outputDir}/${outputFile}`;

    (path.resolve as jest.Mock).mockReturnValue(outputDir);
    (path.join as jest.Mock).mockReturnValue(outputPath);
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    fileWriter(data, outputFile);

    expect(fs.mkdirSync).toHaveBeenCalledWith(outputDir, { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(outputPath, data);
  });

  test('logs an error and exits if writing to file fails', () => {
    const data = 'Sample file content';
    const outputFile = 'output.txt';
    const outputDir = '/mocked/output';
    const outputPath = `${outputDir}/${outputFile}`;

    (path.resolve as jest.Mock).mockReturnValue(outputDir);
    (path.join as jest.Mock).mockReturnValue(outputPath);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Write error');
    });

    expect(() => fileWriter(data, outputFile)).toThrow('process.exit called');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error writing to file: Error: Write error'),
    );
  });
});
