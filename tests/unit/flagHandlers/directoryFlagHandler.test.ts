import handleDirectoryFlag from '../../../src/args/flag_handlers/directory';

describe('handleDirectoryFlag', () => {
  test('returns the directory value from the short flag `-d`', () => {
    const args = ['-d', 'myDirectory'];
    const result = handleDirectoryFlag(args);
    expect(result).toBe('myDirectory');
  });

  test('returns the directory value from the long flag `--dir`', () => {
    const args = ['--dir', 'myDirectory'];
    const result = handleDirectoryFlag(args);
    expect(result).toBe('myDirectory');
  });

  test('returns null if the directory flag is not provided', () => {
    const args = ['--other-flag', 'value'];
    const result = handleDirectoryFlag(args);
    expect(result).toBeNull();
  });

  test('returns null if the directory flag is provided without a value', () => {
    const args = ['-d'];
    const result = handleDirectoryFlag(args);
    expect(result).toBeNull();
  });

  test('returns the first directory value if the flag appears multiple times', () => {
    const args = ['-d', 'firstDirectory', '-d', 'secondDirectory'];
    const result = handleDirectoryFlag(args);
    expect(result).toBe('firstDirectory');
  });

  test('returns the directory value if other flags are present', () => {
    const args = ['--other-flag', 'otherValue', '-d', 'myDirectory'];
    const result = handleDirectoryFlag(args);
    expect(result).toBe('myDirectory');
  });
});
