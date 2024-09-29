#!/usr/bin/env node

import { Command } from "commander";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import "dotenv/config";

// https://www.npmjs.com/package/commander
const program = new Command();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

program
  .name("genereadme")
  .usage("[command] [options]")
  .description(
    "CLI tool to generate a README file explaining a source code file"
  )
  .version("1.0.0");

program
  .command("generate")
  .description("Generate a README for the provided source code file")
  .argument("<file>", "Source code file to process")
  .action(async (file) => {
    try {
      const codeContent = fs.readFileSync(file, "utf-8");

      const prompt = `Please generate a README.md file explaining the contents of the following file.
      The README should have a title, description, and code snippets with explanations.
      The code snippet should be pieces of code from the source code file. Not the entire code.
      The title should be # tag, subheadings should be ## tags, and code snippets should be in a code block.
      Do not use "Title" as the title header. Just use directly the title for the documentation as the title header.
      Code snippets should be in a code block using the triple backticks.
      The generated README must be according to documentation stanrdards.
      This README will be used to document the source code file. Generate the README as if you are documenting the source code for a project.

      ${codeContent}`;

      const response = await client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-70b-versatile",
        temperature: 2,
      });

      const fileDir = path.dirname(file);
      const outputPath = path.join(fileDir, "README.md");
      console.log(response);

      fs.writeFileSync(
        outputPath,
        response.choices[0].message.content,
        "utf-8"
      );
      console.log("README.md has been generated successfully!");
    } catch (error) {
      console.error("Error generating README:", error);
    }
  });

program.parse(process.argv);
