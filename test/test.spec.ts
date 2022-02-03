import { describe, expect, it  } from "vitest";
import mdi from "markdown-it";
import collapse from "~/plugin";

describe("markdown-it-collapsible", () => {
	const md = new mdi().use(collapse);
	
	it("using +++ starts out OPEN", () => {
		const result = md.render(`
# Hello
+++ this is my section
- one
- two
- three
+++
		`);
		
		expect(/<details class="collapsible" open>/.test(result)).toBeTruthy();
	});

	
	it("using ++> starts out CLOSED", () => {
		const result = md.render(`
# Hello
>>> this is my section
- one
- two
- three
>>>
`);
		expect(/<details class="collapsible">/.test(result)).toBeTruthy();
	});
});
