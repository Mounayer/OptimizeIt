export default interface TomlConfig {
  model?: string;
  temperature?: number;
  apiKey?: string;
  output?: string[];
  markdown?: boolean;
  html?: boolean;
  tokenUsage?: boolean;
}
