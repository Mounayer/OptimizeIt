import handleOutput from '../../../src/helpers/handle_output';
import GroqChat from '../../../src/groq';
import MarkDownPayload from '../../../src/interfaces/markDownPayload';
import markDownFileWriter from '../../../src/helpers/markdown_file_writer';
import htmlFileWriter from '../../../src/helpers/html_file_writer';

jest.mock('../../../src/helpers/markdown_file_writer');
jest.mock('../../../src/helpers/html_file_writer');

describe('handleOutput', () => {
  let groqClientMock: jest.Mocked<GroqChat>;
  let mockResponses: MarkDownPayload[];

  beforeEach(() => {
    groqClientMock = {
      logTotalTokenUsage: jest.fn(),
    } as unknown as jest.Mocked<GroqChat>;

    mockResponses = [
      {
        before: 'Original content',
        after: 'Updated content',
        fileName: 'file1.md',
      },
      {
        before: 'Original content 2',
        after: 'Updated content 2',
        fileName: 'file2.md',
      },
    ];

    jest.clearAllMocks();
  });

  test('logs token usage if tokenUsageInformation flag is set', () => {
    const args = { tokenUsageInformation: true, fileNames: ['file1', 'file2'] };

    handleOutput(mockResponses, args, groqClientMock);

    expect(groqClientMock.logTotalTokenUsage).toHaveBeenCalledWith(
      args.fileNames,
    );
    expect(markDownFileWriter).not.toHaveBeenCalled();
    expect(htmlFileWriter).not.toHaveBeenCalled();
  });

  test('writes markdown file if markDown flag is set', () => {
    const args = { markDown: true };

    handleOutput(mockResponses, args, groqClientMock);

    expect(markDownFileWriter).toHaveBeenCalledWith(mockResponses);
    expect(groqClientMock.logTotalTokenUsage).not.toHaveBeenCalled();
    expect(htmlFileWriter).not.toHaveBeenCalled();
  });

  test('writes HTML file if html flag is set', () => {
    const args = { html: true };

    handleOutput(mockResponses, args, groqClientMock);

    expect(htmlFileWriter).toHaveBeenCalledWith(mockResponses);
    expect(groqClientMock.logTotalTokenUsage).not.toHaveBeenCalled();
    expect(markDownFileWriter).not.toHaveBeenCalled();
  });

  test('logs token usage, writes markdown, and writes HTML if all flags are set', () => {
    const args = {
      tokenUsageInformation: true,
      markDown: true,
      html: true,
      fileNames: ['file1', 'file2'],
    };

    handleOutput(mockResponses, args, groqClientMock);

    expect(groqClientMock.logTotalTokenUsage).toHaveBeenCalledWith(
      args.fileNames,
    );
    expect(markDownFileWriter).toHaveBeenCalledWith(mockResponses);
    expect(htmlFileWriter).toHaveBeenCalledWith(mockResponses);
  });

  test('does nothing if no flags are set', () => {
    const args = {};

    handleOutput(mockResponses, args, groqClientMock);

    expect(groqClientMock.logTotalTokenUsage).not.toHaveBeenCalled();
    expect(markDownFileWriter).not.toHaveBeenCalled();
    expect(htmlFileWriter).not.toHaveBeenCalled();
  });
});
