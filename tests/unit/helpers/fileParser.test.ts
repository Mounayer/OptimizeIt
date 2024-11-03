import fileParser from '../../../src/helpers/file_parser';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('fileParser', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns file data when file is read successfully', () => {
    const fileName = 'test-file.txt';
    const filePath = '/mocked/path/test-file.txt';
    const fileData = 'Sample file content';

    (path.resolve as jest.Mock).mockReturnValue(filePath);
    (fs.readFileSync as jest.Mock).mockReturnValue(fileData);

    const result = fileParser(fileName);

    expect(result).toBe(fileData);
    expect(path.resolve).toHaveBeenCalledWith(fileName);
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
  });

  test('logs an error and exits if the file cannot be read', () => {
    const fileName = 'nonexistent-file.txt';
    const filePath = '/mocked/path/nonexistent-file.txt';

    (path.resolve as jest.Mock).mockReturnValue(filePath);
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => fileParser(fileName)).toThrow('process.exit called');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error reading file: Error: File not found'),
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
  });
});
