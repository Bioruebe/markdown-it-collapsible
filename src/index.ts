import type MarkdownIt from "markdown-it";
import type StateBlock from "markdown-it/lib/rules_block/state_block";
import type Token from "markdown-it/lib/token";



function renderPlugin(tokens: Token[], idx: number, _options: any, env: any, self: any) {
	return self.renderToken(tokens, idx, _options, env, self);
}

function plugin(state: StateBlock, startLine: number, endLine: number, silent: boolean) {

}

export default function my_plugin(md: MarkdownIt) {
	md.block.ruler.after("list", "my_plugin", plugin);
	md.renderer.rules.plugin_open = renderPlugin;
};