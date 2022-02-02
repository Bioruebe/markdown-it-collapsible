import { describe,  } from "vitest";
import generate from "markdown-it-testgen";
import mdi from "markdown-it";
import collapse from "~/plugin";


describe("markdown-it-collapsible", () => {
	const md = new mdi({
		html: true,
		linkify: true,
		typography: true,
	}).use(collapse);
	generate(
		"test/fixtures/collapsible.txt"),
		{
			header: true,
		},
		md
	);
});
