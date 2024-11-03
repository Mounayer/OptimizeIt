import handleMarkdownFlag from '../../../src/args/flag_handlers/markdown';

describe('handleMarkdownFlag', () => {
  test('returns true if --markdown flag is present in args', () => {
    const args = ['--markdown'];
    const result = handleMarkdownFlag(args);
    expect(result).toBe(true);
  });

  test('returns true if -md flag is present in args', () => {
    const args = ['-md'];
    const result = handleMarkdownFlag(args);
    expect(result).toBe(true);
  });

  test('returns false if neither --markdown nor -md flag is present and markdownConfig is false', () => {
    const args = ['--other-flag'];
    const result = handleMarkdownFlag(args, false);
    expect(result).toBe(false);
  });

  test('returns true if markdownConfig is true and neither --markdown nor -md flag is present', () => {
    const args = ['--other-flag'];
    const result = handleMarkdownFlag(args, true);
    expect(result).toBe(true);
  });

  test('returns true if both --markdown flag and markdownConfig are true', () => {
    const args = ['--markdown'];
    const result = handleMarkdownFlag(args, true);
    expect(result).toBe(true);
  });

  test('returns true if both -md flag and markdownConfig are true', () => {
    const args = ['-md'];
    const result = handleMarkdownFlag(args, true);
    expect(result).toBe(true);
  });

  test('returns false if args is empty and markdownConfig is false', () => {
    const args: string[] = [];
    const result = handleMarkdownFlag(args, false);
    expect(result).toBe(false);
  });

  test('returns true if args is empty but markdownConfig is true', () => {
    const args: string[] = [];
    const result = handleMarkdownFlag(args, true);
    expect(result).toBe(true);
  });
});
