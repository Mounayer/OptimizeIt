import argHandler from '../../src/args/index';
import directoryParser from '../../src/args/helpers/directoryParser';
import tomlParser from '../../src/helpers/toml_parser';
import handleFileNames from '../../src/args/helpers/handleFileNames';
import { jest } from '@jest/globals';

jest.mock('../../src/helpers/toml_parser');
jest.mock('../../src/args/helpers/directoryParser');
jest.mock('../../src/args/helpers/handleFileNames');

describe('argHandler', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    (tomlParser as jest.Mock).mockReturnValue({
      model: 'default-model',
      temperature: 0.5,
      apiKey: 'default-api-key',
      output: ['default-output-file.txt'],
      markdown: false,
      html: false,
      tokenUsage: false,
    });

    (handleFileNames as jest.Mock).mockReturnValue(['default-file.txt']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns directoryParser result when directory flag is provided', () => {
    const args = ['--dir', 'test-directory'];
    process.argv = ['node', 'script.js', ...args];
    const mockFiles = ['file1.txt', 'file2.txt'];
    (directoryParser as jest.Mock).mockReturnValue(mockFiles);

    const result = argHandler();

    expect(result.fileNames).toEqual(mockFiles);
    expect(directoryParser).toHaveBeenCalledWith('test-directory');
  });

  test('returns handleFileNames result when no directory flag is provided', () => {
    const args = ['file1.txt', 'file2.txt'];
    process.argv = ['node', 'script.js', ...args];
    (handleFileNames as jest.Mock).mockReturnValue(args);

    const result = argHandler();

    expect(result.fileNames).toEqual(args);
  });

  test('falls back to config when no CLI arguments are provided', () => {
    process.argv = ['node', 'script.js'];
    const result = argHandler();

    expect(result.model).toBe('default-model');
    expect(result.temperature).toBe(0.5);
    expect(result.apiKey).toBe('default-api-key');
    expect(result.outputFiles).toEqual(['default-output-file.txt']);
    expect(result.markDown).toBe(false);
    expect(result.html).toBe(false);
    expect(result.tokenUsageInformation).toBe(false);
  });

  test('overrides config with CLI arguments for model and temperature flags', () => {
    const args = ['--model', 'cli-model', '--temperature', '1.2'];
    process.argv = ['node', 'script.js', ...args];

    const result = argHandler();

    expect(result.model).toBe('cli-model');
    expect(result.temperature).toBe(1.2);
  });

  test('handles simultaneous output flag with multiple output files and config fallback', () => {
    const args = ['--output', 'output1.txt', 'output2.txt'];
    process.argv = ['node', 'script.js', ...args];

    const result = argHandler();

    expect(result.outputFiles).toEqual(['output1.txt', 'output2.txt']);
    expect(result.output).toBe(true);
  });

  test('uses token usage config when CLI flag is not provided', () => {
    const args: string[] = [];
    process.argv = ['node', 'script.js', ...args];
    (tomlParser as jest.Mock).mockReturnValue({
      tokenUsage: true,
    });

    const result = argHandler();

    expect(result.tokenUsageInformation).toBe(true);
  });

  test('logs version and exits when --version flag is provided', () => {
    const args = ['--version'];
    process.argv = ['node', 'script.js', ...args];

    expect(() => argHandler()).toThrow('process.exit called');
  });

  test('logs help and exits when --help flag is provided', () => {
    const args = ['--help'];
    process.argv = ['node', 'script.js', ...args];

    expect(() => argHandler()).toThrow('process.exit called');
  });

  test('returns directoryParser result and ignores handleFileNames when both directory and file names are provided', () => {
    const args = ['--dir', 'test-directory', 'file1.txt'];
    process.argv = ['node', 'script.js', ...args];
    const mockFiles = ['dirFile1.txt'];
    (directoryParser as jest.Mock).mockReturnValue(mockFiles);

    const result = argHandler();

    expect(result.fileNames).toEqual(mockFiles);
    expect(directoryParser).toHaveBeenCalledWith('test-directory');
  });
});
