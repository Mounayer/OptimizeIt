import handleFileNames from '../../src/args/helpers/handleFileNames';

describe('handleFileNames', () => {
  beforeAll(() => {
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('returns all arguments if no flags are present', () => {
    const args = ['file1.txt', 'file2.txt'];
    const result = handleFileNames(args);
    expect(result).toEqual(['file1.txt', 'file2.txt']);
  });

  test('returns only file names before the first flag', () => {
    const args = ['file1.txt', 'file2.txt', '--flag'];
    const result = handleFileNames(args);
    expect(result).toEqual(['file1.txt', 'file2.txt']);
  });

  test('returns an empty array and exits with an error if no file names are provided', () => {
    const args: string[] = ['--flag'];
    expect(() => handleFileNames(args)).toThrow('process.exit called');
    expect(console.error).toHaveBeenCalledWith(
      'Please provide a file name as an argument.',
    );
  });

  test('returns only the file names if multiple flags are present after file names', () => {
    const args = ['file1.txt', 'file2.txt', '--flag', '-a'];
    const result = handleFileNames(args);
    expect(result).toEqual(['file1.txt', 'file2.txt']);
  });

  test('returns a single file name if only one file is provided before a flag', () => {
    const args = ['file1.txt', '--flag'];
    const result = handleFileNames(args);
    expect(result).toEqual(['file1.txt']);
  });

  test('handles no flags and no files gracefully by exiting with an error', () => {
    const args: string[] = [];
    expect(() => handleFileNames(args)).toThrow('process.exit called');
    expect(console.error).toHaveBeenCalledWith(
      'Please provide a file name as an argument.',
    );
  });

  test('returns all arguments as file names if flags are only at the end', () => {
    const args = ['file1.txt', 'file2.txt', 'file3.txt'];
    const result = handleFileNames(args);
    expect(result).toEqual(['file1.txt', 'file2.txt', 'file3.txt']);
  });
});
