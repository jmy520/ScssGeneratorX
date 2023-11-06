import { repeat } from 'lodash';
import { MarkdownString, SnippetString } from 'vscode';
import { CompletionBase } from '../base/base.abstract';

export class CompletionElement extends CompletionBase {
  constructor(item: Element) {
    super({
      label: ``
    });

    this.label = this.generatePrefix(item, false);
    this.insertText = this.generate3(item);
    this.documentation = new MarkdownString().appendCodeblock(this.insertText.value.replace(/(\\|\$\d+)/g, ``), `scss`);
    this.documentation.isTrusted = true;
    const id = this.idSelector(item);
    this.filterText = `${item.localName} ${id || this.classSelectors(item).join(` `)}`;
  }

  private generatePrefix(item: Element, nth = true) {
    return `${item.localName}${this.idSelector(item) || this.classSelectors(item).join(``)}${nth ? this.nthSelector(item) : ``}`;
  }

  private generate3(item: Element, level = 0, scss = new SnippetString) {
    scss.appendText(`${this.generatePrefix(item, !!level)} {`);

    scss.appendTabstop();
    const start = `\n${repeat(`  `, ++level)}`;

    for (const child of Array.from(item.children)) {
      scss.appendText(`${start}>`);
      this.generate3(child, level, scss);
    }

    scss.appendText(`\n${repeat(`  `, --level)}}`);
    return scss;
  }
}