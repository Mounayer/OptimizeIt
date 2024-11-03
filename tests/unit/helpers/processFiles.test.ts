import processFiles from '../../../src/helpers/process_files';
import GroqChat from '../../../src/groq';
import fileParser from '../../../src/helpers/file_parser';
import fileWriter from '../../../src/helpers/file_writer';
import MarkDownPayload from '../../../src/interfaces/markDownPayload';

jest.mock('../../../src/helpers/file_parser');
jest.mock('../../../src/helpers/file_writer');
jest.mock('../../../src/groq');

describe('processFiles', () => {
  const mockArgs = {
    model: 'defaultModel',
    temperature: 0.7,
    tokenUsageInformation: false,
    markDown: true,
    html: false,
    output: true,
    outputFiles: ['output1.md', 'output2.md'],
  };

  const mockFileNames = ['file1.txt', 'file2.txt'];

  const mockData = 'Original content of the file';
  const mockResponse = 'Optimized content of the file';

  let mockGroqClient: jest.Mocked<GroqChat>;

  beforeEach(() => {
    jest.clearAllMocks();

    (fileParser as jest.Mock).mockReturnValue(mockData);
    (fileWriter as jest.Mock).mockImplementation(() => {});

    // mock singleton instance
    mockGroqClient = {
      run: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as jest.Mocked<GroqChat>;

    (GroqChat.getInstance as jest.Mock).mockReturnValue(mockGroqClient);
  });

  test('processes each file and returns markdown payloads if markdown or html is specified', async () => {
    const result = await processFiles(mockFileNames, mockArgs, mockGroqClient);

    const expectedPayloads: MarkDownPayload[] = [
      { before: mockData, after: mockResponse, fileName: 'file1.txt' },
      { before: mockData, after: mockResponse, fileName: 'file2.txt' },
    ];

    expect(fileParser).toHaveBeenCalledTimes(mockFileNames.length);
    expect(mockGroqClient.run).toHaveBeenCalledTimes(mockFileNames.length);
    expect(result).toEqual(expectedPayloads);
  });

  test('writes optimized content to output files when output flag is set', async () => {
    await processFiles(mockFileNames, mockArgs, mockGroqClient);

    expect(fileWriter).toHaveBeenCalledWith(mockResponse, 'output1.md');
    expect(fileWriter).toHaveBeenCalledWith(mockResponse, 'output2.md');
  });

  test('skips file if GroqClient returns "Unable To Process"', async () => {
    mockGroqClient.run.mockResolvedValueOnce('Unable To Process');

    const result = await processFiles(mockFileNames, mockArgs, mockGroqClient);

    expect(result.length).toBe(1); // Only one file should be processed, second is skipped
    expect(result[0]).toEqual({
      before: mockData,
      after: mockResponse,
      fileName: 'file2.txt',
    });
  });

  test('does not write to output if output flag is false', async () => {
    const argsWithoutOutput = { ...mockArgs, output: false };

    await processFiles(mockFileNames, argsWithoutOutput, mockGroqClient);

    expect(fileWriter).not.toHaveBeenCalled();
  });

  test('does not add to responses if neither markdown nor html is specified', async () => {
    const argsWithoutMarkDownOrHtml = {
      ...mockArgs,
      markDown: false,
      html: false,
    };

    const result = await processFiles(
      mockFileNames,
      argsWithoutMarkDownOrHtml,
      mockGroqClient,
    );

    expect(result).toEqual([]);
  });
});
