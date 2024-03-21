# markdown-it-collapsible

[![npm](https://img.shields.io/npm/v/markdown-it-collapsible)](https://www.npmjs.com/package/markdown-it-collapsible) [![Node.js CI](https://github.com/Bioruebe/markdown-it-collapsible/actions/workflows/node.js.yml/badge.svg)](https://github.com/Bioruebe/markdown-it-collapsible/actions/workflows/node.js.yml) ![markdown-it](https://img.shields.io/npm/dependency-version/markdown-it-collapsible/peer/markdown-it)

> A markdown-it plugin, which adds collapsibles via the HTML `<details>` and `<summary>` elements

## Preview

![preview](docs/preview.png)

## Usage

### Install

```bash
npm install markdown-it-collapsible
```

### Enable

```js
// ESM
import MarkdownIt from "markdown-it";
import MarkdownItCollapsible from "markdown-it-collapsible";
const md = new MarkdownIt().use(MarkdownItCollapsible, options);

// CommonJS
const MarkdownIt = require("markdown-it");
const MarkdownItCollapsible = require("markdown-it-collapsible");
const md = MarkdownIt().use(MarkdownItCollapsible, options);
```

### Syntax

```md
+++ <visible_text>
<hidden_text>
+++
```

e.g.

```md
+++ Click me!
Hidden text
+++
```

is interpreted as

```html
<details>
    <summary>
        <span class="details-marker"></span>
        Click me!
    </summary>
    <p>
        Hidden text
    </p>
</details>
```

#### Open state

To start in open state, use `++>` instead:

```js
++> Click me!
Hidden text
++>
```

#### Nesting

You can nest collapsibles by adding more `+` characters to the outer elements:

```md
## Closed
++++ Click me!
Hidden text
+++ Nested
Inner hidden text
+++
++++

## Open
+++> Click me!
Hidden text
+++ Nested
Inner hidden text
+++
+++>
```

### Example CSS

Modern browsers don't need additional styling. For better UX you can add a few lines of CSS:

```css
summary {
  display: flex;
  align-items: start;
  outline: none;
  list-style: none;
  user-select: none;
  cursor: pointer;
}

summary > h1, summary > h2, summary > h3, summary > h4, summary > h5, summary > h6 {
  display: inline-block;
  margin: 0;
}

details > *:not(summary) {
  margin-top: 0;
  margin-bottom: 0.5rem;
  margin-left: 1.25rem;
```

To make the marker scale with headings, an empty span element is created in the parsed HTML. Style the CSS class `details-marker` in any way you like, for example: 

```css
.details-marker::before {
  content: "▶︎";
  display: inline-block;
  margin-right: 0.5ch;
  flex-shrink: 0;
  transition: 0.3s;
}

details[open] > summary .details-marker::before {
  transform: rotate(90deg);
  transform-origin: 40% 45% 0;
}
```
