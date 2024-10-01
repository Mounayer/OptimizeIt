export interface MarkDownPayload {
  before: string;
  after: string;
  fileName: string;
}

export interface OutputFlagPayload {
  output: boolean;
  outputFiles: string[];
}

export interface Config {
  model?: string;
  temperature?: number;
  apiKey?: string;
  output?: string[];
  markdown?: boolean;
  html?: boolean;
  tokenUsage?: boolean;
}
