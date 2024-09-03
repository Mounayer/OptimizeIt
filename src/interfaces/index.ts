export interface MarkDownPayload {
  before: string;
  after: string;
  fileName: string;
}

export interface OutputFlagPayload {
  output: boolean;
  outputFiles: string[];
}
