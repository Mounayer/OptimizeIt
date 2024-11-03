import handleHelpFlag from '../../../src/args/flag_handlers/help';

describe('handleHelpFlag', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('prints the help message and exits when --help flag is present', () => {
    const args = ['--help'];

    expect(() => handleHelpFlag(args)).toThrow('process.exit called');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Usage: optimizeit <file1> [file2] [options]'),
    );
  });

  test('prints the help message and exits when -h flag is present', () => {
    const args = ['-h'];

    expect(() => handleHelpFlag(args)).toThrow('process.exit called');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Usage: optimizeit <file1> [file2] [options]'),
    );
  });

  test('does nothing if neither --help nor -h flags are present', () => {
    const args = ['--version'];

    expect(() => handleHelpFlag(args)).not.toThrow();
    expect(console.log).not.toHaveBeenCalled();
  });
});
