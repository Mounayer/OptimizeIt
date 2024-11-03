import handleHTMLFlag from '../../../src/args/flag_handlers/html';

describe('handleHTMLFlag', () => {
  test('returns true if --html flag is present in args', () => {
    const args = ['--html'];
    const result = handleHTMLFlag(args);
    expect(result).toBe(true);
  });

  test('returns false if --html flag is not present in args and htmlConfig is false', () => {
    const args = ['--other-flag'];
    const result = handleHTMLFlag(args, false);
    expect(result).toBe(false);
  });

  test('returns true if htmlConfig is true and --html flag is not present in args', () => {
    const args = ['--other-flag'];
    const result = handleHTMLFlag(args, true);
    expect(result).toBe(true);
  });

  test('returns true if both --html flag and htmlConfig are true', () => {
    const args = ['--html'];
    const result = handleHTMLFlag(args, true);
    expect(result).toBe(true);
  });

  test('returns false if args is empty and htmlConfig is false', () => {
    const args: string[] = [];
    const result = handleHTMLFlag(args, false);
    expect(result).toBe(false);
  });

  test('returns true if args is empty but htmlConfig is true', () => {
    const args: string[] = [];
    const result = handleHTMLFlag(args, true);
    expect(result).toBe(true);
  });
});
