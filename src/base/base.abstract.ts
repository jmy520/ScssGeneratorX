import { JSDOM } from 'jsdom';
import { defaultsDeep, values } from 'lodash';
import prefix from 'utilizes/prefix';
import { CompletionItem, MarkdownString, Uri, window, workspace } from 'vscode';

export abstract class CompletionBase extends CompletionItem {
  protected generate?(domChildren: Array<Element>): CompletionItem['insertText'];

  protected static for(html: Array<Element>): CompletionBase {
    const
      constructor = this as any,
      instance: CompletionBase = new constructor,
      generateResult = instance.generate ? instance.generate(html) : null;

    if (generateResult) {
      instance.insertText = generateResult;

      if (typeof generateResult === `string`) {
        instance.documentation = new MarkdownString().appendCodeblock(generateResult, `scss`);
        instance.filterText = instance.sortText = `${instance.label}`;
      }
    }

    return instance;
  }

  constructor({ label, kind = 14, ...rest }: CompletionItem) {
    super(label, kind);

    defaultsDeep(
      this,
      <Partial<CompletionItem>>{
        keepWhitespace: true,
        preselect: true,
        detail: `[scss generator x]`
      },
      rest
    );
  }

  protected equalBrothers(of: Element) {
    const { localName, parentElement, id, classList } = of;

    return (values(parentElement?.children) as Array<Element>).filter(sibling => {
      if (localName === sibling.localName)
        {if (!id || id && id === sibling.id)
          {if (!classList.length || classList.length <= sibling.classList.length && !values(classList).some(token => !sibling.classList.contains(token)))
            {return true;}}};
    });
  }

  protected nthSelector(of: Element) {
    let result = ``;

    const
      { localName, parentElement, id, classList } = of,
      same = Array.from(parentElement?.children || []).filter(sibling => {
        if (localName === sibling.localName)
          {if (!id || id && id === sibling.id)
            {if (!classList.length || classList.length <= sibling.classList.length && !Array.from(classList).some(token => !sibling.classList.contains(token)))
              {return true;}}};
      });

    if (same.length > 1) {result += `:nth-of-type(${same.findIndex(item => of === item) + 1})`;};
    return result;
  }

  protected classSelectors({ classList }: Element) {
    return Array.from(classList).map(token => `.${token}`);
  }

  protected idSelector({ id }: Element) {
    return prefix(`#`, id);
  }
}