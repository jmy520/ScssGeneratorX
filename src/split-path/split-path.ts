import { trim } from 'lodash';

export const splitPath = (value: string) => {
  const
    trimIt = (string?: string, chars?: string) => trim(string?.trim(), chars),
    seperator = value.includes(`/`) ? `/` : `\\`,
    [title, ...rest] = trimIt(value, seperator).split(seperator).reverse(),
    titleSeparator = `.`,
    titleArray = trim(trimIt(title, titleSeparator), `_`).split(titleSeparator);

  return [title.indexOf(titleSeparator) !== -1 ? titleArray.pop() : null, titleArray.join(titleSeparator), ...rest];
};