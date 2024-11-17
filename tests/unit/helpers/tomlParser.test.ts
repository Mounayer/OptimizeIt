import * as fs from 'fs';
import * as path from 'path';
import os from 'os';
import { parse } from 'smol-toml';
import tomlParser from '../../../src/helpers/toml_parser';

jest.mock('fs');
jest.mock('os');
jest.mock('smol-toml');

describe('tomlParser', () => {
  const mockConfigContent = `
    key1 = "value1"
    key2 = 123
    key3 = true
  `;
  const parsedConfig = {
    key1: 'value1',
    key2: 123,
    key3: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (os.homedir as jest.Mock).mockReturnValue('/mocked/home');
  });

  test('parses and returns TOML configuration if file exists', () => {
    const configFile = path.join('/mocked/home', '.optimizeit-config.toml');

    // Mock file existence and reading
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockConfigContent);
    (parse as jest.Mock).mockReturnValue(parsedConfig);

    const result = tomlParser();

    expect(fs.existsSync).toHaveBeenCalledWith(configFile);
    expect(fs.readFileSync).toHaveBeenCalledWith(configFile, 'utf8');
    expect(parse).toHaveBeenCalledWith(mockConfigContent);
    expect(result).toEqual(parsedConfig);
  });

  test('returns an empty object if the TOML file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = tomlParser();

    expect(result).toEqual({});
    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(parse).not.toHaveBeenCalled();
  });

  test('logs an error and exits the process if an error occurs', () => {
    const mockError = new Error('Mocked parser error');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const processExitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => {
        throw new Error('exit called');
      });

    expect(() => tomlParser()).toThrow('exit called');

    expect(consoleErrorSpy).toHaveBeenCalledWith(`${mockError}`);
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
