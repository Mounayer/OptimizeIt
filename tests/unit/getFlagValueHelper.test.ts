import getFlagValue from '../../src/args/helpers/getFlagValue';

describe('getFlagValue', () => {
  const flagVariants = ['-a', '--api-key'];
  const defaultValue = 'defaultApiKey';

  test('returns the value provided immediately after the flag', () => {
    const args = ['-a', 'providedApiKey'];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe('providedApiKey');
  });

  test('returns the default value if the flag is not present in args', () => {
    const args = ['--other-flag', 'value'];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe(defaultValue);
  });

  test('returns the default value if the flag is present but no value is provided', () => {
    const args = ['-a'];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe(defaultValue);
  });

  test('returns the default value if the flag is followed by another flag', () => {
    const args = ['-a', '--another-flag'];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe(defaultValue);
  });

  test('returns the correct value when using a long flag variant', () => {
    const args = ['--api-key', 'providedApiKey'];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe('providedApiKey');
  });

  test('returns the value of the first occurrence of the flag in args', () => {
    const args = ['-a', 'firstValue', '-a', 'secondValue'];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe('firstValue');
  });

  test('handles multiple flags correctly and returns the value of the specified flag', () => {
    const args = ['--other-flag', 'otherValue', '-a', 'providedApiKey'];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe('providedApiKey');
  });

  test('returns the default value if args is an empty array', () => {
    const args: string[] = [];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe(defaultValue);
  });

  test('returns null if no default value is provided and flag is absent', () => {
    const args = ['--other-flag', 'value'];
    const result = getFlagValue(args, flagVariants, null);
    expect(result).toBeNull();
  });

  test('returns null if no default value is provided and flag is present but no value is given', () => {
    const args = ['-a'];
    const result = getFlagValue(args, flagVariants, null);
    expect(result).toBeNull();
  });

  test('returns the default value if the flag is present at the end of the args array', () => {
    const args = ['someArg', '-a'];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe(defaultValue);
  });

  test('returns the default value if the flag is followed by an empty string', () => {
    const args = ['-a', ''];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe('');
  });

  test('ignores flags with a similar prefix but returns the correct value', () => {
    const args = ['--api-key-value', 'incorrect', '-a', 'correctValue'];
    const result = getFlagValue(args, flagVariants, defaultValue);
    expect(result).toBe('correctValue');
  });
});
