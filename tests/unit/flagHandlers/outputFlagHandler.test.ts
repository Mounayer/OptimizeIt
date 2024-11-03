import handleOutputFlag from '../../../src/args/flag_handlers/output';
import OutputFlagPayload from '../../../src/interfaces/outputFlagPayload';

describe('handleOutputFlag', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns output flag and files from the short flag -o with single file', () => {
    const args: string[] = ['-o', 'output1.txt'];
    const result: OutputFlagPayload = handleOutputFlag(args, undefined);
    expect(result).toEqual({
      output: true,
      outputFiles: ['output1.txt'],
    });
  });

  test('returns output flag and files from the long flag --output with multiple files', () => {
    const args: string[] = ['--output', 'output1.txt', 'output2.txt'];
    const result: OutputFlagPayload = handleOutputFlag(args, undefined);
    expect(result).toEqual({
      output: true,
      outputFiles: ['output1.txt', 'output2.txt'],
    });
  });

  test('returns output flag and files from config if no output flag is provided', () => {
    const args: string[] = ['--other-flag'];
    const outputConfig = ['configOutput1.txt', 'configOutput2.txt'];
    const result: OutputFlagPayload = handleOutputFlag(args, outputConfig);
    expect(result).toEqual({
      output: true,
      outputFiles: outputConfig,
    });
  });

  test('returns empty output flag and files if no output flag and config are provided', () => {
    const args: string[] = ['--other-flag'];
    const result: OutputFlagPayload = handleOutputFlag(args, undefined);
    expect(result).toEqual({
      output: false,
      outputFiles: [],
    });
  });

  test('logs the output files when they are provided', () => {
    const args: string[] = ['--output', 'output1.txt'];
    handleOutputFlag(args, undefined);
    expect(console.log).toHaveBeenCalledWith(
      'outputFiles:',
      JSON.stringify(['output1.txt']),
    );
  });

  test('does not log output files if none are provided and config is empty', () => {
    const args: string[] = ['--other-flag'];
    handleOutputFlag(args, []);
    expect(console.log).not.toHaveBeenCalled();
  });

  test('stops adding files when another flag is encountered', () => {
    const args: string[] = [
      '-o',
      'output1.txt',
      '--another-flag',
      'output2.txt',
    ];
    const result: OutputFlagPayload = handleOutputFlag(args, undefined);
    expect(result).toEqual({
      output: true,
      outputFiles: ['output1.txt'],
    });
  });

  test('returns the first occurrence of output files when multiple output flags are present', () => {
    const args: string[] = ['-o', 'output1.txt', '-o', 'output2.txt'];
    const result: OutputFlagPayload = handleOutputFlag(args, undefined);
    expect(result).toEqual({
      output: true,
      outputFiles: ['output1.txt'],
    });
  });
});
