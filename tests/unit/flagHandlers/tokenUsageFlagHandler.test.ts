import handleTokenFlag from '../../../src/args/flag_handlers/tokenUsageInfo';

describe('handleTokenFlag', () => {
  test('returns true if --token-usage flag is present in args', () => {
    const args: string[] = ['--token-usage'];
    const result = handleTokenFlag(args);
    expect(result).toBe(true);
  });

  test('returns true if -u flag is present in args', () => {
    const args: string[] = ['-u'];
    const result = handleTokenFlag(args);
    expect(result).toBe(true);
  });

  test('returns false if neither --token-usage nor -u flag is present and tokenConfig is false', () => {
    const args: string[] = ['--other-flag'];
    const result = handleTokenFlag(args, false);
    expect(result).toBe(false);
  });

  test('returns true if tokenConfig is true and neither --token-usage nor -u flag is present', () => {
    const args: string[] = ['--other-flag'];
    const result = handleTokenFlag(args, true);
    expect(result).toBe(true);
  });

  test('returns true if both --token-usage flag and tokenConfig are true', () => {
    const args: string[] = ['--token-usage'];
    const result = handleTokenFlag(args, true);
    expect(result).toBe(true);
  });

  test('returns true if both -u flag and tokenConfig are true', () => {
    const args: string[] = ['-u'];
    const result = handleTokenFlag(args, true);
    expect(result).toBe(true);
  });

  test('returns false if args is empty and tokenConfig is false', () => {
    const args: string[] = [];
    const result = handleTokenFlag(args, false);
    expect(result).toBe(false);
  });

  test('returns true if args is empty but tokenConfig is true', () => {
    const args: string[] = [];
    const result = handleTokenFlag(args, true);
    expect(result).toBe(true);
  });
});
