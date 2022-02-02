const renderSummary = (tokens, idx, options, env, slf) => {
  return '<summary><span class="details-marker">&nbsp;</span>' + slf.renderInline(tokens[idx].children, options, env) + "</summary>";
};
function isWhitespace(state, start, end) {
  for (start; start < end; start++) {
    if (!state.md.utils.isWhiteSpace(state.src.charCodeAt(start)))
      return false;
  }
  return true;
}
const plugin = (state, startLine, endLine, silent) => {
  const MARKER = 43;
  let autoClosed = false;
  let start = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.src.charCodeAt(start) !== MARKER)
    return false;
  let pos = state.skipChars(start, MARKER);
  let markerCount = pos - start;
  if (markerCount < 3)
    return false;
  let markup = state.src.slice(start, pos);
  let params = state.src.slice(pos, max).trim();
  if (isWhitespace(state, pos, max))
    return false;
  if (params.endsWith(String.fromCharCode(MARKER).repeat(markerCount)))
    return false;
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
    if (state.src.charCodeAt(start) !== MARKER) {
      if (isEmpty)
        isEmpty = isWhitespace(state, start, max);
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4)
      continue;
    pos = state.skipChars(start, MARKER);
    if (pos - start < markerCount)
      continue;
    pos = state.skipSpaces(pos);
    if (pos < max)
      continue;
    autoClosed = true;
    break;
  }
  if (isEmpty)
    return false;
  let oldParent = state.parentType;
  let oldLineMax = state.lineMax;
  state.parentType = "container";
  state.lineMax = nextLine;
  let token = state.push("collapsible_open", "details", 1);
  token.block = true;
  token.info = params;
  token.markup = markup;
  token.map = [startLine, nextLine];
  let tokens = [];
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
const collapsiblePlugin = (md) => {
  md.block.ruler.before("fence", "collapsible", plugin, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  });
  md.renderer.rules.collapsible_summary = renderSummary;
};
export { collapsiblePlugin as default };
