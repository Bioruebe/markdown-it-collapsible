const renderSummary = (tokens, idx, options, env, slf) => {
  return '<summary><span class="pre-summary">&nbsp;</span>' + slf.renderInline(tokens[idx].children, options, env) + "</summary>";
};
function isWhitespace(state, start, end) {
  for (start; start < end; start++) {
    if (!state.md.utils.isWhiteSpace(state.src.charCodeAt(start)))
      return false;
  }
  return true;
}
const PLUS_MARKER = 43;
const RIGHT_CHEVRON_MARKER = 62;
const coreRule = (state, startLine, endLine, silent) => {
  let isOpen = true;
  let isClosed = true;
  let autoClosedBlock = false;
  let start = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.src.charCodeAt(start) !== PLUS_MARKER) {
    isOpen = false;
  }
  if (state.src.charCodeAt(start) !== RIGHT_CHEVRON_MARKER) {
    isClosed = false;
  }
  if (!isOpen && !isClosed)
    return false;
  let pos = state.skipChars(start, isOpen ? PLUS_MARKER : RIGHT_CHEVRON_MARKER);
  const markerCount = pos - start;
  if (markerCount < 3)
    return false;
  const markup = state.src.slice(start, pos);
  const params = state.src.slice(pos, max).trim();
  if (isWhitespace(state, pos, max))
    return false;
  if (params.endsWith(String.fromCharCode(isOpen ? PLUS_MARKER : RIGHT_CHEVRON_MARKER).repeat(markerCount))) {
    return false;
  }
  if (silent)
    return true;
  let nextLine = startLine;
  let isEmpty = true;
  for (; ; ) {
    nextLine++;
    if (nextLine >= endLine)
      break;
    start = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (start < max && state.sCount[nextLine] < state.blkIndent)
      break;
    if (state.src.charCodeAt(start) !== (isOpen ? PLUS_MARKER : RIGHT_CHEVRON_MARKER)) {
      if (isEmpty)
        isEmpty = isWhitespace(state, start, max);
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4)
      continue;
    pos = state.skipChars(start, isOpen ? PLUS_MARKER : RIGHT_CHEVRON_MARKER);
    if (pos - start < markerCount)
      continue;
    pos = state.skipSpaces(pos);
    if (pos < max)
      continue;
    autoClosedBlock = true;
    break;
  }
  if (isEmpty)
    return false;
  const oldParent = state.parentType;
  const oldLineMax = state.lineMax;
  state.parentType = "reference";
  state.lineMax = nextLine;
  const details = isOpen ? `details class="collapsible" open` : `details class="collapsible"`;
  let token = state.push("collapsible_open", details, 1);
  token.block = true;
  token.info = params;
  token.markup = markup;
  token.map = [startLine, nextLine];
  const tokens = [];
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
  state.line = nextLine + (autoClosedBlock ? 1 : 0);
  return true;
};
const collapsiblePlugin = (md) => {
  md.block.ruler.before("fence", "collapsible", coreRule, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  });
  md.renderer.rules.collapsible_summary = renderSummary;
};
export { collapsiblePlugin as default };
