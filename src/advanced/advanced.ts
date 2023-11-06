import { filter, flatten, isEqual, map, pull, uniqWith } from 'lodash';
import { CompletionBase } from '../base/base.abstract';

class Level {
  constructor(
    public localName: string,
    public classList: Array<Array<string>>,
    public id: Array<string>,
    public nth: Array<string>,
    public sons: Array<Level>,
    public mutation?: boolean
  ) {}
}

export class CompletionAdvanced extends CompletionBase {
  static for(html: Array<Element>) {
    return super.for(html);
  }

  protected constructor() {
    super({
      label: `scss boilerplate(advanced) for current file`
    });
  }

  private readyToManipulate(domChildren: Array<Element> | HTMLCollection): Array<Level> {
    return this.reduce(map(domChildren, item => {
      const { localName, children } = item;

      return {
        localName,
        id: [this.idSelector(item)].filter(Boolean),
        classList: [this.classSelectors(item)].filter(Boolean),
        nth: [this.nthSelector(item)].filter(Boolean),
        sons: this.readyToManipulate(children)
      };

    }));
  }

  private reduce(tree: Array<Level|any>) {
    const toSkip: typeof tree = [];

    for (const item of tree) {
      if (toSkip.includes(item)) {continue;};
      for (const iterator of tree) {
        // if (iterator === item) continue
        if (iterator.localName === item.localName) {
          for (const key of [`classList`, `id`, `nth`, `sons`]) {
            item[key].push(...iterator[key]);
            item[key] = uniqWith(item[key], isEqual);
            if (key !== `sons`) {item[key] = filter(item[key], `length`);};
          }

          if (item !== iterator) {toSkip.push(iterator);};
        }
      }
      item.sons = this.reduce(item.sons);
    }

    return tree.filter(item => !toSkip.includes(item));
  }

  private beside<T extends { [prop: string]: any }>(tree: Array<T>, prop: keyof T) {
    const result = [...tree];

    for (const iterator of tree) {
      const inner = iterator[prop];
      if (Array.isArray(inner)) {result.push(...this.beside(inner, prop));};
    }

    return result;
  }

  private expand(tree: Array<Level>) {
    return tree;
  }

  protected generate(domChildren: Array<Element>) {
    this.readyToManipulate(domChildren).reduce(
      (scss, { localName, classList, id, nth, sons }) => {
        scss += localName;
        scss += classList.reduce((result, list) => {
          list.join(``);
          return result;
        }, ``);
        return scss;
      },
      ``
    );

    let scss = ``;
    return scss;
  }
}