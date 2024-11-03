import GroqChat from '../../src/groq';
import { Groq } from 'groq-sdk';

jest.mock('groq-sdk');

describe('GroqChat', () => {
  let groqChatInstance: GroqChat;
  const mockApiKey = 'mock-api-key';

  const mockFileName = 'testFile.js';
  const mockContext = 'const a = 1;';
  const mockModel = 'llama-3.1-70b-versatile';
  const mockTemperature = 0.7;

  // Mock response based on an actual response format from the Groq Chat Completion API
  const mockResponse = {
    id: 'chatcmpl-279ebfd1-6045-4520-a9fc-d4978f6d0dbf',
    object: 'chat.completion',
    created: 1730670561,
    model: mockModel,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content:
            '```cpp\n#include <iostream>\n\nint main() {\n    std::cout << "Welcome to the program!" << std::endl;\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n```',
        },
        logprobs: null,
        finish_reason: 'stop',
      },
    ],
    usage: {
      queue_time: 0.003841073,
      prompt_tokens: 297,
      prompt_time: 0.051556976,
      completion_tokens: 50,
      completion_time: 0.2,
      total_tokens: 347,
      total_time: 0.251556976,
    },
    system_fingerprint: 'fp_b6828be2c9',
    x_groq: {
      id: 'req_01jbt022jge8jafg4egrcn3ed3',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    groqChatInstance = GroqChat.getInstance(mockApiKey);

    // Mock Groq API client's chat.completions.create
    (Groq.prototype as any).chat = {
      completions: {
        create: jest.fn().mockResolvedValue(mockResponse),
      },
    };
  });

  test('returns singleton instance with the same API key', () => {
    const anotherInstance = GroqChat.getInstance(mockApiKey);
    expect(groqChatInstance).toBe(anotherInstance);
  });

  test('calls Groq API and returns chat data', async () => {
    const result = await groqChatInstance.run(
      mockFileName,
      mockContext,
      mockModel,
      mockTemperature,
      false,
    );

    expect(Groq.prototype.chat.completions.create).toHaveBeenCalledWith({
      messages: expect.arrayContaining([
        expect.objectContaining({
          role: 'user',
          content: expect.stringContaining(
            'Please fix/enhance the performance',
          ),
        }),
      ]),
      model: mockModel,
      temperature: mockTemperature,
    });
    expect(result).toBe(mockResponse.choices[0].message.content);
  });

  test('accumulates token usage information when tokenUsageInformation is true', async () => {
    await groqChatInstance.run(
      mockFileName,
      mockContext,
      mockModel,
      mockTemperature,
      true,
    );

    expect(groqChatInstance.totalCompletionTokens).toBe(
      mockResponse.usage.completion_tokens,
    );
    expect(groqChatInstance.totalPromptTokens).toBe(
      mockResponse.usage.prompt_tokens,
    );
    expect(groqChatInstance.totalTokens).toBe(mockResponse.usage.total_tokens);
  });

  test('logs error and exits on unexpected errors', async () => {
    (Groq.prototype.chat.completions.create as jest.Mock).mockRejectedValue(
      new Error('API error'),
    );

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    await expect(
      groqChatInstance.run(
        mockFileName,
        mockContext,
        mockModel,
        mockTemperature,
        false,
      ),
    ).rejects.toThrow('process.exit called');

    expect(consoleSpy).toHaveBeenCalledWith(
      'An unexpected error occurred:',
      expect.any(Error),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);

    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test('logs total token usage correctly', () => {
    groqChatInstance.totalCompletionTokens =
      mockResponse.usage.completion_tokens;
    groqChatInstance.totalPromptTokens = mockResponse.usage.prompt_tokens;
    groqChatInstance.totalTokens = mockResponse.usage.total_tokens;

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    groqChatInstance.logTotalTokenUsage([mockFileName]);

    expect(consoleSpy).toHaveBeenCalledWith(`File: ${mockFileName}`);
    expect(consoleSpy).toHaveBeenCalledWith(
      '\nHas the following token usage information:\n',
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      `Completion Tokens: ${mockResponse.usage.completion_tokens}`,
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      `Usage Prompt Tokens: ${mockResponse.usage.prompt_tokens}`,
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      `Total Tokens: ${mockResponse.usage.total_tokens}\n`,
    );

    // restore mocks
    consoleSpy.mockRestore();
  });
});
