# markdown-it-collapsible

![npm](https://img.shields.io/npm/v/markdown-it-collapsible) [![Node.js CI](https://github.com/Bioruebe/markdown-it-collapsible/actions/workflows/node.js.yml/badge.svg)](https://github.com/Bioruebe/markdown-it-collapsible/actions/workflows/node.js.yml) ![markdown-it](https://img.shields.io/npm/dependency-version/markdown-it-collapsible/peer/markdown-it)

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
const markdown_it = require("markdown-it");
const markdown_it_collapsible = require("markdown-it-collapsible");
const md = markdown_it().use(markdown_it_collapsible, options);
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
        <span class="details-marker">
            &nbsp;
        </span>
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

Modern browser don't need additional styling. For better UX you can add a few lines of CSS:

```css
summary {
    outline: none;
    user-select: none;
    -moz-user-select: none;
    cursor: pointer;
}


details > *:not(summary) {
    margin-left: 1.25em;
}
```

If you want to customize the marker:

```css
details > summary:first-of-type {
    list-style-type: none;
}

::-webkit-details-marker {
    display: none;
}

details > summary .details-marker:before {
    content: "\25BA";
}

details[open] > summary .details-marker:before {
    content: "\25BC";
}
```
