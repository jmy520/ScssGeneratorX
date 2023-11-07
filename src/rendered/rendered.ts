import { JSDOM } from 'jsdom';
import { uniqBy, values } from 'lodash';
import { CompletionBasic } from '../basic/basic';
import { beside } from '../beside/beside';
import { CompletionElement } from '../element/element';
import { CompletionItem, CompletionList, ProviderResult } from 'vscode';

export class Rendered {
  constructor(readonly html: string) {}

  private readonly childrenPropName = `children`;

  private readonly getHTMLChildren = () => {
    const htmlChildren = values(new JSDOM(this.html, {
      contentType: 'text/html'
    }).window.document.body[this.childrenPropName]);
    return htmlChildren;
  };

  public getSnippets(): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    const snippets = [
      CompletionBasic.for(this.getHTMLChildren()),
      ...uniqBy(beside(this.getHTMLChildren(), this.childrenPropName).map(element => new CompletionElement(element)), `insertText.value`)
    ];
    return snippets;
  }
}