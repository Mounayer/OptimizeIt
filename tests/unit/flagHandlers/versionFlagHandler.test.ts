import handleVersionFlag from '../../../src/args/flag_handlers/version';
import * as path from 'path';
import { readFileSync } from 'fs';

jest.mock('fs');
jest.mock('path');

describe('handleVersionFlag', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('prints version and exits when --version flag is present', () => {
    const args: string[] = ['--version'];
    const packageJsonPath = '/mocked/path/package.json';
    const packageData = JSON.stringify({
      name: 'optimizeit',
      version: '1.0.0',
    });

    (path.resolve as jest.Mock).mockReturnValue(packageJsonPath);
    (readFileSync as jest.Mock).mockReturnValue(packageData);

    expect(() => handleVersionFlag(args)).toThrow('process.exit called');
    expect(console.log).toHaveBeenCalledWith('optimizeit version 1.0.0');
  });

  test('prints version and exits when -v flag is present', () => {
    const args: string[] = ['-v'];
    const packageJsonPath = '/mocked/path/package.json';
    const packageData = JSON.stringify({
      name: 'optimizeit',
      version: '1.0.0',
    });

    (path.resolve as jest.Mock).mockReturnValue(packageJsonPath);
    (readFileSync as jest.Mock).mockReturnValue(packageData);

    expect(() => handleVersionFlag(args)).toThrow('process.exit called');
    expect(console.log).toHaveBeenCalledWith('optimizeit version 1.0.0');
  });

  test('does nothing if neither --version nor -v flags are present', () => {
    const args: string[] = ['--other-flag'];

    expect(() => handleVersionFlag(args)).not.toThrow();
    expect(console.log).not.toHaveBeenCalled();
  });

  test('logs an error and exits if reading package.json fails', () => {
    const args: string[] = ['--version'];
    (path.resolve as jest.Mock).mockReturnValue('/mocked/path/package.json');
    (readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File read error');
    });

    expect(() => handleVersionFlag(args)).toThrow('process.exit called');
    expect(console.error).toHaveBeenCalledWith(
      'Error reading package.json:',
      expect.any(Error),
    );
  });
});
