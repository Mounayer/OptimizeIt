import handleTemperatureFlag from '../../../src/args/flag_handlers/temperature';

describe('handleTemperatureFlag', () => {
  const defaultTemp = 0.5;

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

  test('returns the temperature provided with the short flag -t', () => {
    const args: string[] = ['-t', '1.0'];
    const result = handleTemperatureFlag(args, defaultTemp);
    expect(result).toBe(1.0);
  });

  test('returns the temperature provided with the long flag --temperature', () => {
    const args: string[] = ['--temperature', '1.2'];
    const result = handleTemperatureFlag(args, defaultTemp);
    expect(result).toBe(1.2);
  });

  test('returns the default temperature if no flag is provided', () => {
    const args: string[] = [];
    const result = handleTemperatureFlag(args, defaultTemp);
    expect(result).toBe(defaultTemp);
  });

  test('logs the temperature when it differs from the default config', () => {
    const args: string[] = ['--temperature', '0.8'];
    handleTemperatureFlag(args, defaultTemp);
    expect(console.log).toHaveBeenCalledWith('temperature:', 0.8);
  });

  test('throws an error and exits if an invalid temperature is provided', () => {
    const args: string[] = ['-t', 'invalid'];
    expect(() => handleTemperatureFlag(args, defaultTemp)).toThrow(
      'process.exit called',
    );
    expect(console.error).toHaveBeenCalledWith(
      'Temperature value provided is invalid.',
    );
  });
});
