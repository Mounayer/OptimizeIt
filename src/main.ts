#!/usr/bin/env node

import GroqChat from './groq';
import argHandler from './args';
import handleOutput from './helpers/handle_output';
import processFiles from './helpers/process_files';

/**
 * Main function to run the program.
 */
async function main() {
  const args = argHandler();
  const groqClient = GroqChat.getInstance(args.apiKey);

  const allResponses = await processFiles(args.fileNames, args, groqClient);

  handleOutput(allResponses, args, groqClient);
}

main();
