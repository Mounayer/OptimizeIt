import htmlFileWriter from '../../../src/helpers/html_file_writer';
import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import MarkDownPayload from '../../../src/interfaces/markDownPayload';
import { extractLanguage } from '../../../src/helpers/markdown_file_writer';

jest.mock('fs');
jest.mock('path');
jest.mock('marked', () => ({
  marked: jest.fn((text: string) => `<p>${text}</p>`),
}));
jest.mock('../../../src/helpers/markdown_file_writer');

describe('htmlFileWriter', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('writes HTML file with converted markdown for each response', async () => {
    const mockResponses: MarkDownPayload[] = [
      {
        before: 'Original content',
        after: 'Updated content',
        fileName: 'file1.md',
      },
      { before: 'Old content', after: 'New content', fileName: 'file2.md' },
    ];

    const outputDir = '/mocked/output';
    const htmlFilePath = `${outputDir}/changes.html`;

    (path.resolve as jest.Mock).mockReturnValue(outputDir);
    (path.join as jest.Mock).mockReturnValue(htmlFilePath);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (extractLanguage as jest.Mock).mockReturnValue('markdown');

    await htmlFileWriter(mockResponses);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('<div class="file-changes">'),
    );
    expect(marked).toHaveBeenCalledTimes(4);
  });

  test('creates output directory if it does not exist', async () => {
    const mockResponses: MarkDownPayload[] = [
      {
        before: 'Original content',
        after: 'Updated content',
        fileName: 'file1.md',
      },
    ];

    const mockCwd = '/mocked/current/directory';
    const outputDir = '/mocked/current/directory/output';
    const htmlFilePath = `${outputDir}/changes.html`;

    jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

    (path.join as jest.Mock)
      .mockReturnValueOnce(outputDir)
      .mockReturnValueOnce(htmlFilePath);

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await htmlFileWriter(mockResponses);

    expect(process.cwd).toHaveBeenCalled();
    expect(path.join).toHaveBeenCalledWith(mockCwd, 'output');
    expect(path.join).toHaveBeenCalledWith(outputDir, 'changes.html');
    expect(fs.mkdirSync).toHaveBeenCalledWith(outputDir, { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('<div class="file-changes">'),
    );
  });

  test('logs an error and exits if writing to HTML file fails', async () => {
    const mockResponses: MarkDownPayload[] = [
      {
        before: 'Original content',
        after: 'Updated content',
        fileName: 'file1.md',
      },
    ];

    const outputDir = '/mocked/output';
    const htmlFilePath = `${outputDir}/changes.html`;

    (path.resolve as jest.Mock).mockReturnValue(outputDir);
    (path.join as jest.Mock).mockReturnValue(htmlFilePath);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Write error');
    });

    await expect(htmlFileWriter(mockResponses)).rejects.toThrow(
      'process.exit called',
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error writing to HTML file:'),
    );
  });
});
