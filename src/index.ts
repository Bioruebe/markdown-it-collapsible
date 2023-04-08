import type MarkdownIt from "markdown-it";
import type Renderer from "markdown-it/lib/renderer";
import type StateBlock from "markdown-it/lib/rules_block/state_block";
import type Token from "markdown-it/lib/token";



function renderPlugin(tokens: Token[], idx: number, options: any, env: any, self: Renderer) {
	return self.renderToken(tokens, idx, options, env, self);
}

function plugin(state: StateBlock, startLine: number, endLine: number, silent: boolean) {

}

export default function myPlugin(md: MarkdownIt) {
	md.block.ruler.after("list", "my_plugin", plugin);
	md.renderer.rules.plugin_open = renderPlugin;
};