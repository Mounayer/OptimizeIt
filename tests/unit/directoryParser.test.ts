import * as fs from 'fs';
import * as path from 'path';
import directoryParser from '../../src/args/helpers/directoryParser';

jest.mock('fs');
jest.mock('path');

describe('directoryParser', () => {
  const mockDir = 'testDir';
  const mockFiles = ['file1.txt', 'file2.js', 'file3.md'];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  test('returns an array of file paths prefixed with the directory name', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
    (path.resolve as jest.Mock).mockReturnValue(`/mocked/path/${mockDir}`);
    (path.join as jest.Mock).mockImplementation((...paths) => paths.join('/'));

    const result = directoryParser(mockDir);

    expect(result).toEqual([
      'testDir/file1.txt',
      'testDir/file2.js',
      'testDir/file3.md',
    ]);
  });

  test('resolves the directory path using path.resolve', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
    directoryParser(mockDir);
    expect(path.resolve).toHaveBeenCalledWith(mockDir);
  });

  test('throws an error and exits if the directory does not exist', () => {
    (fs.readdirSync as jest.Mock).mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory');
    });

    expect(() => directoryParser(mockDir)).toThrow('process.exit called');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error reading directory'),
    );
  });

  test('throws an error and exits if readdirSync encounters an error', () => {
    (fs.readdirSync as jest.Mock).mockImplementation(() => {
      throw new Error('Some unexpected error');
    });

    expect(() => directoryParser(mockDir)).toThrow('process.exit called');
    expect(console.error).toHaveBeenCalledWith(
      'Error reading directory: Error: Some unexpected error',
    );
  });

  test('joins each file name with the directory name using path.join', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
    (path.join as jest.Mock).mockImplementation((...paths) => paths.join('/'));

    directoryParser(mockDir);

    mockFiles.forEach((file) => {
      expect(path.join).toHaveBeenCalledWith(mockDir, file);
    });
  });
});
