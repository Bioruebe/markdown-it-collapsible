# markdown-it-plugin-template

This repository provides a template for creating plugins for [markdown-it](https://github.com/markdown-it/markdown-it), a popular Markdown parser for JavaScript.

## Features

- Standardized project structure
- Vite and Typescript
- Automatic test case generation based on input (`.md`)  and output (`.html`) files
- Fast testing via Vitest, allowing test-first development and quick iterations

## Getting Started

To create a new markdown-it plugin using this template, simply click the button `Use this template` above.

## Project structure

- `src/index.ts` is the plugin entry point
- `docs` may be used for additional documentation files, such as a preview image
- `test` contains the fixtures used to test the plugin

### Automatic testing

This template uses file-based test definitions (fixtures). For each test, you create an input markdown file and the corresponding HTML output. Both files must have the same name, which is then used as the name of the test case. Folders can be used to create test suites, e.g. `test/invalid-syntax` containing different cases of wrong usage of the plugin.

## Developing Your Plugin

1. Install the required dependencies by running `npm install`.
2. Specify the desired input/output by creating Markdown and HTML files inside the `/test` directory. Use sub-directories to group them.
3. Start vitest watch mode: `npm run dev`
4. Customize the file `src/index.ts` to provide the functionality you need.
5. Build the plugin: `npm run build`
