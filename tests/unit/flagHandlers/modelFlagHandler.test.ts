import handleModelFlag from '../../../src/args/flag_handlers/model';

describe('handleModelFlag', () => {
  const defaultModel = 'llama-3.1-70b-versatile';

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns the model name provided with the short flag -m', () => {
    const args: string[] = ['-m', 'custom-model'];
    const result = handleModelFlag(args, defaultModel);
    expect(result).toBe('custom-model');
  });

  test('returns the model name provided with the long flag --model', () => {
    const args: string[] = ['--model', 'custom-model'];
    const result = handleModelFlag(args, defaultModel);
    expect(result).toBe('custom-model');
  });

  test('returns the model name from config if no flag is provided', () => {
    const args: string[] = [];
    const result = handleModelFlag(args, defaultModel);
    expect(result).toBe(defaultModel);
  });

  test('logs the model name when it differs from the default config', () => {
    const args: string[] = ['--model', 'custom-model'];
    handleModelFlag(args, defaultModel);
    expect(console.log).toHaveBeenCalledWith('model:', 'custom-model');
  });

  test('does not log the model name if it matches the default config', () => {
    const args: string[] = [];
    handleModelFlag(args, defaultModel);
    expect(console.log).not.toHaveBeenCalled();
  });

  test('returns the default model if args is empty and config is the default', () => {
    const args: string[] = [];
    const result = handleModelFlag(args);
    expect(result).toBe(defaultModel);
  });

  test('returns the first model value if the flag appears multiple times', () => {
    const args: string[] = ['-m', 'first-model', '--model', 'second-model'];
    const result = handleModelFlag(args, defaultModel);
    expect(result).toBe('first-model');
  });

  test('returns the default model if the flag is provided without a value', () => {
    const args: string[] = ['-m'];
    const result = handleModelFlag(args, defaultModel);
    expect(result).toBe(defaultModel);
  });
});
