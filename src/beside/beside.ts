import { values } from 'lodash';

export const beside = <T extends { [prop: string]: any }>(tree: Array<T>, prop: keyof T) => {
  tree = values(tree);
  const result = [...tree];
  for (const iterator of tree) {if (iterator[prop]) {result.push(...beside(iterator[prop], prop));}};
  return result;
};