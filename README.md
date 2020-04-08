# markdown-it-collapsible
![npm](https://img.shields.io/npm/v/markdown-it-collapsible) ![Tests](https://github.com/Bioruebe/markdown-it-collapsible/workflows/Tests/badge.svg) ![markdown-it](https://img.shields.io/npm/dependency-version/markdown-it-collapsible/peer/markdown-it)

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



### Example CSS

```css
details > summary:first-of-type {
	list-style-type: none;
}

::-webkit-details-marker {
	display: none;
}

summary {
	outline: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-khtml-user-select: none;
	-ms-user-select: none;
	cursor: pointer;
}

details > summary .details-marker:before {
	content: "\25BA";
}

details[open] > summary .details-marker:before {
	content: "\25BC";
}

details > *:not(summary) {
	padding-left: 1.25em;
}
```
