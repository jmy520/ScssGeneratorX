# Super Scss Generator for  VSCode

This extension is used to generate scss structured style code based on html tag code. Also supported for vue SFCs.

## Features

- Add snippet to your scss files (for angular projects and html projects).
- Add snippet to your vue SFCs (for vue projects).


## Usage

Start typing selectors as you know and you see it as a snippet.

For getting scss for the entire template, use the label - `generate x-scss`.

## Settings

* `scssgeneratorx.autoChildSelector`: Set whether to add child selector symbol, default is `false`.
* `scssgeneratorx.ignore`: Set tags that will be skipped if encountered, default is `["template", "slot", "ng-template", "ng-container", "ng-content"]`.
* `scssgeneratorx.mappingRules`: Set tag-to-style mapping rules, the key is RegExp string, the value used to replace tag, default is `{"^el-": ".${tagName}"}`.


## Donate

If you find this extension useful, you can buy author a coffee.

![MyQRCode.png](https://s2.loli.net/2023/11/08/Bpog1uzSQfJ2T95.png)

### 1.0.0

Enjoy!