# OptimizeIt

OptimizeIt is a tool that is meant to help you Optimize your code. You simply run this command-line application and give it a source code file name which it then optimizes for peak performance and readability.

![ezgif-4-f1aeeea586](https://github.com/user-attachments/assets/b5385492-bcd8-4ba9-bc6a-ceef14c43e0c)

If you'd like to see more, here is a link to a thorough [Demo](https://www.youtube.com/watch?v=VFKODkI7xw4).

If you'd like to read more about how this project was approached, feel free to check out my [Blog Post](https://dev.to/majd_almnayer_2101/from-good-to-great-code-with-optimizeit-4p0n).

## Installation

```bash
npm install -g optimizeit
```

## How to use

You can use some of the examples that already exist:

```bash
optimizeit examples/main.cpp
optimizeit examples/main.cpp examples/main.py
```

Or you can run it using one of your own files placed in the root directory, or any other directory you might make:

```bash
optimizeit test.py
optimizeit test.py examples/main.cpp
```

or

```bash
optimizeit newDirectory/index.html
optimizeit newDirectory/index.html styles.css examples/main.py
```

## Different Flags

OptimizeIt supports several flags:

### Version info

This flag prints the current version of OptimizeIt and the name of the tool, usage:

```bash
optimizeit --version
optimizeit -v
```

### HTML

This is a great feature which generates a `changes.html` html file in the output directory, displaying side-by-side the before and after of each processed file, usage:

```bash
optimizeit file1 --html
optimizeit file1 file2 --html
```

### Markdown

This is a nifty feature, where optimizeit creates a `changes.md` file for you in the output directory, displaying the `before` and `after` of every file provided after execution, usage:

```bash
optimizeit file1 --markdown
optimizeit file1 file2 --markdown
optimizeit file1 -md
optimizeit file1 file2 -md
```

### Output

This creates an output folder in the current directory, if it doesn't exist, then it creates a file in the output folder containing all the changes, you may provide more than 1 output file per file given, usage:

```bash
optimizeit file1 --output file1
optimizeit file1 file2 --output file1 file2
optimizeit file1 -o file1
optimizeit file1 file2 -o file1 file2
```

### Model

This specifies the model name that OptimizeIt uses, you may choose any model name from [groq](https://console.groq.com/docs/models), usage:

```bash
optimizeit file1 --model model_name
optimizeit file1 file2 --model model_name
optimizeit file1 -m model_name
optimizeit file1 file2 -m model_name
```

### Temperature

This specifies the temperature of the model that OptimizeIt is using, you may specify values from `0.1` to `2.0` although, the higher the temperature the more [hallucinations](https://www.iguazio.com/glossary/llm-hallucination/), usage:

```bash
optimizeit file1 --temperature 0.1
optimizeit file1 file2 --temperature 0.1
optimizeit file1 -t 0.1
optimizeit file1 file2 -t 0.1
```

### API Key

This allows you to set your own `groq api key` for OptimizeIt to use! This can be very helpful with pay-gated models that groq provides, usage:

```bash
optimizeit file1 --api-key your_api_key
optimizeit file1 file2 --api-key your_api_key
optimizeit file1 -a your_api_key
optimizeit file1 file2 -a your_api_key
```

### Help

This flag displays all of the details and configurations that OptimizeIt has, usage:

```bash
optimizeit --help
optimizeit -h
```

### Token Usage

This flag allows you print the completion token, prompt token, and total token that OptimizeIt is using from your prompt, usage:

```bash
optimizeit file1 --token-usage
optimizeit file1 file2 -u
```

### Directory

This flag is very helpful if you want to optimize all files in a given directory, rather than specify them one by one. OptimizeIt will parse through every file that exists in the directory, and if the file can be `Optimized`, it will optimize it, usage:

```bash
optimizeit -d examples
optimizeit --dir ./examples
```

This can also be conveniently combined with other flags, i.e.:

```bash
optimizeit -d examples --html
```

## TOML config

Optimizeit supports reading a `.toml` config file in the user's home directory to use as option flags when provided.

Create a `.optimizeit-config.toml` file in the home directory, and provide options to use.
Currently supports the following options:

```toml
# model <string>: Specify the model name to use
model = "model-name"

# temperature <number>: Set model temperature (0.1 to 2)
temperature = 0.5

# apiKey <string>: Provide your API key
apiKey = "your-api-key"

# output: Specify output file(s) to save changes
output = ["test1.cpp", "test2.cpp", "test3.cpp"]

# markdown <boolean>: Generate a markdown file with all changes
markdown = true

# html <boolean>: Generate an HTML file with all changes
html = true

# tokenUsage <boolean>: Get token usage information
tokenUsage = true
```

NOTE: `apiKey` still must be provided either through `.env`, command-line argument, or `.optimizeit-config.toml`. The rest are all optional.
