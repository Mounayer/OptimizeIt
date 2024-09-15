import 'dotenv/config';
import Groq from 'groq-sdk';

/**
 * Singleton
 */
export default class GroqChat {
  private static instance: GroqChat;
  private groqClient: Groq;

  // Token usage information
  private totalPromptTokens: number = 0;
  private totalCompletionTokens: number = 0;
  private totalTokens: number = 0;

  private constructor(apiKey: string) {
    this.groqClient = new Groq({
      apiKey,
    });
  }

  /**
   * Get the instance of the GroqChat class.
   *
   * @param { string } apiKey - The API key for the Groq API.
   * @returns { GroqChat } The instance of the GroqChat class.
   */
  public static getInstance(apiKey = process.env.GROQ_API_KEY): GroqChat {
    if (!GroqChat.instance) {
      GroqChat.instance = new GroqChat(apiKey as string);
    }
    return GroqChat.instance;
  }

  /**
   * Get the chat completion from the Groq API.
   *
   * @param { string } fileName - The name of the file.
   * @param { string } context - The context of the code.
   * @param { string }model - The model to use for the chat completion.
   * @param { string } temperature - The temperature for the chat completion.
   * @returns { Promise<Groq.Chat.Completions.ChatCompletion> } The chat completion from the Groq API.
   */
  private async getGroqChatCompletion(
    fileName: string,
    context: string,
    model: string,
    temperature: number,
  ): Promise<Groq.Chat.Completions.ChatCompletion> {
    return this.groqClient.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Please fix/enhance the performance of the following code in the file
          (and if you are not given code, reply with: Unable To Process) [${fileName}]:
          Context: ${context}

          Important note: If the Context given to you above is not code, reply with 'Unable To Process'.

          Some extra rules to keep in mind:
            - Code replies only, without any text or explanations.
            - Ensure adherence to best practices and standards in every instance.
            - Eliminate all redundancy, maintain clarity and readability.
            - Prioritize code optimization for performance at all times.
            - Respect existing comments in provided code; do not modify or remove them.
            - Avoid adding any new comments, even if they provide insight or clarification.
            - Focus on reducing time and space complexity, for example: aiming for O(n) or O(1) wherever possible.
            - Maximize code efficiency, valuing speed and optimization above all else.
            - You will only give 1 solution, so make it count!
            - If you are not given code above, reply with 'Unable To Process'.
          `,
        },
      ],
      model,
      temperature,
    });
  }

  /**
   * Run the GroqChat instance.
   *
   * @param fileName - The name of the file.
   * @param context - The context of the code.
   * @param model - The model to use for the chat completion.
   * @param temperature - The temperature for the chat completion.
   * @returns { Promise<string | undefined> } The chat data from the Groq API.
   */
  public async run(
    fileName: string,
    context: string,
    model: string,
    temperature: number,
    tokenUsageInformation: boolean,
  ): Promise<string | undefined> {
    try {
      const chatCompletion = await this.getGroqChatCompletion(
        fileName,
        context,
        model,
        temperature,
      );

      if (tokenUsageInformation && chatCompletion?.usage) {
        this.saveTokenUsageInfo(chatCompletion?.usage);
      } else {
        throw new Error(`
        Token Usage Information is not available for file: ${fileName}
        `);
      }

      const chatData = chatCompletion.choices[0]?.message?.content || '';
      console.log(chatData);

      return chatData;
    } catch (err: any) {
      if (err.error && err.error.error && typeof err.error.error === 'object') {
        const errorMessage = err.error.error.message;
        const errorType = err.error.error.type;

        console.error(
          `Error Message: ${errorMessage}, Error Type: ${errorType}`,
        );
      } else {
        console.error('An unexpected error occurred:', err);
      }
    }
  }

  /**
   * Logs the token usage information to the console. by args --token-usage or -tu
   *
   * @param tokenUsageInfo - The token usage information object.
   */
  public saveTokenUsageInfo(tokenUsageInfo: Groq.CompletionUsage): void {
    this.totalCompletionTokens += tokenUsageInfo.completion_tokens;
    this.totalPromptTokens += tokenUsageInfo.prompt_tokens;
    this.totalTokens += tokenUsageInfo.total_tokens;
  }

  /**
   * Logs the total token usage information to the console.
   */
  public logTotalTokenUsage(fileNames: string[]): void {
    if (fileNames && fileNames.length > 0) {
      for (const fileName of fileNames) console.log(`File: ${fileName}`);
      console.log('\nHas the following token usage information:\n');
    }

    // Available properties:
    //console.error(`queue_time: ${tokenUsageInfo.queue_time}`);
    //console.error(`usage_prompt_tokens: ${tokenUsageInfo.prompt_tokens}`);
    //console.error(`prompt_time: ${tokenUsageInfo.prompt_time}`);
    //console.error(`completion_tokens: ${tokenUsageInfo.completion_tokens}`);
    //console.error(`completion_time: ${tokenUsageInfo.completion_time}`);
    //console.error(`total_time: ${tokenUsageInfo.total_time}`);
    //console.error(`total_tokens: ${tokenUsageInfo.total_tokens}`);

    console.error(`Completion Tokens: ${this.totalCompletionTokens}`);
    console.error(`Usage Prompt Tokens: ${this.totalPromptTokens}`);
    console.error(`Total Tokens: ${this.totalTokens}\n`);
  }
}
