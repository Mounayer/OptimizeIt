While it is recommended to use [Visual Studio Code](https://code.visualstudio.com/) when developing OptimizeIt, feel free to use any IDE of your choice.

For `Visual Studio Code`, there exists a `extensions.json` file with extensions recommendations, that you should be prompted to install if you don't already have them!

## How to setup

Create a .env file, and provide your api key, i.e.:

```
GROQ_API_KEY=YOUR_API_KEY_HERE
```

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Link:

```bash
npm link
```

you can then use it as such:

```bash
optimizeit examples/main.cpp
```

## Linting & Formatting

### Prerequisites

For your IDE, please install the following extensions:
- ESLint
- Prettier - Code formatter

### Formatting

For formatting, OptimizeIt uses both [Prettier](https://prettier.io/) `.prettierrc` file for config, to run manually:

```bash
npm run prettier
```

Or you can set your IDE to format with prettier on save, which is more optimal for a development environment.

To enable this in Visual Studio Code, simply go to `Preferences`, then search for `Format on save`, make sure that is ticked `on`.

For other IDEs, please check the [official documentation](https://prettier.io/docs/en/editors.html).

### Linting

For linting, OptimizeIt uses both [Eslint](https://eslint.org/) and [Oxc](https://oxc.rs/) with a pre-defined `eslint.config.mjs` file for config, to run manually:

```bash
npm run lint
```

This will run both `Eslint` and `Oxc`.

### Pre-commit Linting & Formatting

Both [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) packages are being used to lint and format on pre-commits.

If any error happens, your IDE will inform you and display logs.

The following config in `package.json` tells `husky` what to do on pre-commits:

```json
{
  "lint-staged": {
    "*.{js,ts,json}": [
      "prettier --write",
      "eslint --fix",
      "npx oxlint --fix"
    ]
  }
}
```

## Notable Dependencies

### Groq

This [library](https://www.npmjs.com/package/groq-sdk) provides convenient and easy access to the Groq REST API from server-side TypeScript or JavaScript which allows using their LLM's for chat completion

### Marked

A [markdown parser](https://www.npmjs.com/package/marked) which converts markdown into HTML -- this was used for generating html pages after comparison. Marked is built for speed and super light-weight!

### Prettier

[Prettier](https://www.npmjs.com/package/prettier?activeTab=readme) is a code formatted which enforces consistent style by parsing the code and re-printing it with the rules set in `.prettierrc` file.

### Eslint

[Eslint](https://www.npmjs.com/package/eslint) is used to identify issues in and evaluate the code.