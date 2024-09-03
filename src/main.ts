#!/usr/bin/env node

import * as path from 'path';
import fileParser from './file_parser';
import GroqChat from './groq';
import argHandler from './args';
import fileWriter from './file_writer';
import type { MarkDownPayload } from './interfaces';
import markDownFileWriter from './markdown_file_writer';

/**
 * Main function to run the program.
 */
async function main() {
  const {
    fileNames,
    model,
    temperature,
    apiKey,
    output,
    outputFiles,
    markDown,
  } = argHandler();

  const groqClient = GroqChat.getInstance(apiKey);

  let allResponses: MarkDownPayload[] = [];

  for (let i = 0; i < fileNames.length; ++i) {
    const filePath = path.resolve(fileNames[i]);

    const data = fileParser(filePath);

    console.log(`\nOptimizing ${fileNames[i]}...\n`);

    const response = await groqClient.run(
      fileNames[i],
      data,
      model,
      temperature,
    );

    if (response === 'Unable To Process') continue;

    if (markDown) {
      allResponses.push({
        before: data,
        after: response as string,
        fileName: fileNames[i],
      });
    }

    if (output && i < outputFiles.length) {
      fileWriter(response as string, outputFiles[i]);
    }
  }

  if (markDown) markDownFileWriter(allResponses);
}

main();
