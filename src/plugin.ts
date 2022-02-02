import { PluginSimple } from "markdown-it";
import { RuleBlock } from "markdown-it/lib/parser_block";
import { RenderRule } from "markdown-it/lib/renderer";
import StateBlock from "markdown-it/lib/rules_block/state_block";
import Token from "markdown-it/lib/token";

const renderSummary: RenderRule = (tokens, idx, options, env, slf) => {
	return (
		'<summary><span class="details-marker">&nbsp;</span>' +
		slf.renderInline(tokens[idx].children as Token[], options, env) +
		"</summary>"
	);
};

function isWhitespace(state: StateBlock, start: number, end: number) {
	for (start; start < end; start++) {
		if (!state.md.utils.isWhiteSpace(state.src.charCodeAt(start))) return false;
	}
	return true;
}

const plugin: RuleBlock = (state, startLine, endLine, silent) => {
	const MARKER = 43; // +
	let autoClosed = false;
	let start = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];

	if (state.src.charCodeAt(start) !== MARKER) return false;

	// Check out the rest of the marker string
	let pos = state.skipChars(start, MARKER);

	const markerCount = pos - start;
	if (markerCount < 3) return false;

	const markup = state.src.slice(start, pos);
	const params = state.src.slice(pos, max).trim();

	// Title must not be empty
	if (isWhitespace(state, pos, max)) return false;

	// The title must not end with the marker (no inline)
	if (params.endsWith(String.fromCharCode(MARKER).repeat(markerCount))) {return false;}

	// Since start is found, we can report success here in validation mode
	if (silent) return true;

	// Search the end of the block
	let nextLine = startLine;
	let isEmpty = true;

	for (;;) {
		nextLine++;

		// Unclosed block should be autoclosed by end of document.
		if (nextLine >= endLine) break;

		start = state.bMarks[nextLine] + state.tShift[nextLine];
		max = state.eMarks[nextLine];

		// Non-empty line with negative indent should stop the list:
		// - ```
		//  test
		if (start < max && state.sCount[nextLine] < state.blkIndent) break;

		if (state.src.charCodeAt(start) !== MARKER) {
			if (isEmpty) isEmpty = isWhitespace(state, start, max);
			continue;
		}

		// Closing marker should be indented less than 4 spaces
		if (state.sCount[nextLine] - state.blkIndent >= 4) continue;

		pos = state.skipChars(start, MARKER);

		// Closing marker must be at least as long as the opening one
		if (pos - start < markerCount) continue;

		// Make sure tail has spaces only
		pos = state.skipSpaces(pos);

		if (pos < max) continue;

		autoClosed = true;
		break;
	}

	if (isEmpty) return false;

	const oldParent = state.parentType;
	const oldLineMax = state.lineMax;
	state.parentType = "container";

	// This will prevent lazy continuations from ever going past our end marker
	state.lineMax = nextLine;

	let token = state.push("collapsible_open", "details", 1);
	token.block = true;
	token.info = params;
	token.markup = markup;
	token.map = [startLine, nextLine];

	const tokens: Token[] = [];
	state.md.inline.parse(params, state.md, state.env, tokens);
	token = state.push("collapsible_summary", "summary", 0);
	token.content = params;
	token.children = tokens;

	state.md.block.tokenize(state, startLine + 1, nextLine);

	token = state.push("collapsible_close", "details", -1);
	token.markup = state.src.slice(start, pos);
	token.block = true;

	state.parentType = oldParent;
	state.lineMax = oldLineMax;
	state.line = nextLine + (autoClosed ? 1 : 0);

	return true;
};

const collapsiblePlugin: PluginSimple = (md) => {
	md.block.ruler.before("fence", "collapsible", plugin, {
		alt: ["paragraph", "reference", "blockquote", "list"],
	});
	md.renderer.rules.collapsible_summary = renderSummary;
};

export default collapsiblePlugin;
