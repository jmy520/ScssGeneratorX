export function resolveMapping(mappingRules: object | undefined, tagName: string): string {
  let result = tagName;

  if (mappingRules) {
    const keys = Object.keys(mappingRules);
    if (keys && keys.length > 0) {
      keys.forEach(item => {
        const ruleRegExp = new RegExp(`${item}`);
        if (ruleRegExp.test(tagName)) {
          result = ((mappingRules as any)[item] as string).replaceAll('${tagName}', tagName);
        }
      });
    }
  }
  return result;
}

export function resolveIgnore(ignore: string[] | undefined, html: string): string {
  let result = html;

  if (ignore && ignore.length > 0) {
    ignore.forEach(item => {
      const ignoreRegExp = new RegExp(`<\/?${item}[^>]*>`, 'g');
      result = result.replace(ignoreRegExp, '');
    });
  }
  return result;
}