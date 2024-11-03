import handleApiKeyFlag from '../../../src/args/flag_handlers/apiKey';

describe('handleApiKeyFlag', () => {
  const mockArgsWithFlag = ['-a', 'flagApiKey'];
  const mockArgsWithLongFlag = ['--api-key', 'flagApiKey'];
  const configApiKey = 'configApiKey';

  beforeEach(() => {
    jest.resetModules();
    process.env.GROQ_API_KEY = '';
  });

  test('returns the API key from the environment variable if available', () => {
    process.env.GROQ_API_KEY = 'envApiKey';

    const result = handleApiKeyFlag([], configApiKey);

    expect(result).toBe('envApiKey');
  });

  test('returns the API key from the config if environment variable and flag are not provided', () => {
    const result = handleApiKeyFlag([], configApiKey);

    expect(result).toBe(configApiKey);
  });

  test('returns an empty string if no API key is provided via env, config, or flag', () => {
    const result = handleApiKeyFlag([], undefined);

    expect(result).toBe('');
  });

  test('returns the API key from the short flag when provided', () => {
    const result = handleApiKeyFlag(mockArgsWithFlag, configApiKey);

    expect(result).toBe('flagApiKey');
  });

  test('returns the API key from the long flag when provided', () => {
    const result = handleApiKeyFlag(mockArgsWithLongFlag, configApiKey);

    expect(result).toBe('flagApiKey');
  });

  test('gives priority to the API key from the flag over the environment variable and config', () => {
    process.env.GROQ_API_KEY = 'envApiKey';

    const result = handleApiKeyFlag(mockArgsWithFlag, configApiKey);

    expect(result).toBe('flagApiKey');
  });

  test('gives priority to the environment variable over the config if no flag is provided', () => {
    process.env.GROQ_API_KEY = 'envApiKey';

    const result = handleApiKeyFlag([], configApiKey);

    expect(result).toBe('envApiKey');
  });
});
