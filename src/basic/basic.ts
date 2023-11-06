import { repeat } from 'lodash';
import { CompletionBase } from '../base/base.abstract';

export class CompletionBasic extends CompletionBase {
  static for(html: Array<Element>) {
    return super.for(html);
  }

  protected constructor() {
    super({
      label: `generate x-scss`
    });
  }

  protected generate(domChildren: Array<Element>) {
    let scss = ``;
    const append = (current: Element, count = 0) => {
      scss += `${current.localName}${this.idSelector(current) || this.classSelectors(current).join(``)}${this.nthSelector(current)} {`;
      const start = `\n${repeat(`  `, ++count)}`;
      for (const element of Array.from(current.children)) {
        scss += `${start}>`;
        append(element, count);
      }

      scss += `\n${repeat(`  `, --count)}}`;
    };

    for (const element of domChildren) {
      append(element);
      scss += `\n\n`;
    }

    return scss.trim();
  }
}