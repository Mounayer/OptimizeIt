import * as fs from 'fs';
import path from 'path';
import markDownFileWriter from '../../../src/helpers/markdown_file_writer';
import MarkDownPayload from '../../../src/interfaces/markDownPayload';

jest.mock('fs');
jest.mock('path');

const mockResponses: MarkDownPayload[] = [
  {
    fileName: 'file1.md',
    before: 'Original content',
    after: 'Updated content',
  },
  {
    fileName: 'file2.md',
    before: 'Old content',
    after: 'New content',
  },
];

describe('markDownFileWriter', () => {
  const mockedOutputDir =
    'C:\\Users\\Professional\\Desktop\\Seventh Semester\\DPS909\\Repo\\OptimizeIt\\output';
  const mockedMarkdownFilePath = `${mockedOutputDir}\\changes.md`;

  beforeEach(() => {
    jest.clearAllMocks();

    (path.resolve as jest.Mock).mockReturnValue(mockedOutputDir);
    (path.join as jest.Mock).mockReturnValue(mockedMarkdownFilePath);

    (fs.existsSync as jest.Mock).mockReturnValue(true);
  });

  test('writes markdown file with changes for each response', () => {
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    const expectedContent = `# Changes\n\n## file1.md\n\n### Before\n\n\`\`\`\nOriginal content\n\`\`\`\n\n### After\n\nUpdated content\n\n## file2.md\n\n### Before\n\n\`\`\`\nOld content\n\`\`\`\n\n### After\n\nNew content`;

    markDownFileWriter(mockResponses);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockedMarkdownFilePath,
      expectedContent,
    );
  });

  test('creates output directory if it does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    markDownFileWriter(mockResponses);

    expect(fs.mkdirSync).toHaveBeenCalledWith(mockedOutputDir, {
      recursive: true,
    });
  });

  test('logs an error and exits if writing to markdown file fails', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation((code?: number): never => {
      throw new Error(`process.exit called with "${code}"`);
    });

    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Write error');
    });

    expect(() => markDownFileWriter(mockResponses)).toThrow(
      'process.exit called with "1"',
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error writing to MarkDown file'),
    );

    consoleErrorSpy.mockRestore();
  });

  test('logs success message if markdown file is created successfully', () => {
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    markDownFileWriter(mockResponses);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Markdown file created containing all changes'),
    );

    consoleLogSpy.mockRestore();
  });
});
