/// <reference types="vite/client" />

import MarkdownIt from "markdown-it";
import { describe, expect, it, test } from "vitest";

import plugin from "../src";
const mdFiles = import.meta.glob("./**/*.md", { eager: true, as: "raw" });
const htmlFiles = import.meta.glob("./**/*.html", { eager: true, as: "raw" });


type TestCase = {
	name: string;
	input: string;
	output: string;
};

const ROOT_SUITE_NAME = "root";

const md = MarkdownIt({ breaks: true }).use(plugin);
const suites = createTestDefinitions();

for (const suite in suites) {
	const tests = suites[suite];
	if (suite === ROOT_SUITE_NAME) {
		tests.forEach((t) => test(t.name, createTestFunction(t)));
	}
	else {
		describe(suite, () => {
			tests.forEach((t) => it(t.name, createTestFunction(t)));
		});
	}
}

/**
 * Reads the input/output files and creates an object of test suites from them.
 * @returns An object with the test suite names as keys and an array of test cases as values.
 */
function createTestDefinitions() {
	const suites: Record<string, TestCase[]> = {};
	for (const file in mdFiles) {
		const filePath = file.substring(2);
		const parts = filePath.split("/");
		const fileName = parts.pop()!;
		const suite = parts.pop() ?? ROOT_SUITE_NAME;
		const name = fileName.split(".")[0];
		const input = mdFiles[file];
		let output = htmlFiles[file.replace(".md", ".html")];

		if (output === undefined) {
			console.error("Missing output for test case", name);
			continue;
		}

		output = output.replace(/\r/g, "");
		output = output.replace(/\t/g, "");
		let tests = suites[suite];
		if (!tests) tests = suites[suite] = [];

		tests.push({
			name,
			input,
			output
		});
	}

	return suites;
}

/**
 * Creates a test function from a test case definition.
 * @param testCase The test case definition
 * @returns A function to be passed to the test runner.
 */
function createTestFunction({ input, output }: TestCase) {
	return () => {
		const parsed = md.render(input).trim();
		expect(parsed).toEqual(output);
	};
}