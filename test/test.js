/* eslint-disable camelcase */
const path = require("path");
const generate = require("markdown-it-testgen");
const markdown_it = require("markdown-it");
const markdown_it_collapsible = require("../");

describe("markdown-it-collapsible", () => {
	const md = markdown_it({
		html: true,
		linkify: true,
		typography: true
	}).use(markdown_it_collapsible);
	generate(path.join(__dirname, "fixtures/collapsible.txt"), {
		header: true
	}, md);
});