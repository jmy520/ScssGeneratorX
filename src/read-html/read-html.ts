import { readFile } from 'fs';
import { size, sortBy } from 'lodash';
import { promisify } from 'util';
import { Uri, window, workspace } from 'vscode';
import { splitPath } from '../split-path/split-path';
import { parseComponent } from 'vue-sfc-parser';

export const readHtml = async () => {
  const activeTextEditor = window.activeTextEditor;
  const document = activeTextEditor?.document;
  const titleOf = (fileName: string) => {
    const [, title] = splitPath(fileName);
    return title;
  };
  const compare = (fileName: string) => document && titleOf(fileName) === titleOf(document.fileName),
  fileHtml = workspace.textDocuments.find(({ fileName, languageId }) => languageId === `html` && compare(fileName));

  let html: string = '';

  if (fileHtml) {html = fileHtml.getText().trim();};
  if ((!fileHtml || !html) && document) {
    let files: Uri[] = [];

    try {
      files = await workspace.findFiles(`**/*${titleOf(document.fileName)}.{htm,html}`, `**/node_modules/**`);

      if (!files.length) {
        const [, , folder] = splitPath(document.fileName);
        files = await workspace.findFiles(`**/${folder}/*.{htm,html}`, `**/node_modules/**`);
      }
    }
    catch (error) {
      console.error(error);
    }

    if (size(files)) {
      sortBy(files, ({ path }) => {
        const
          [, , folder, ...rest] = splitPath(path),
          [, , fileFolder, ...fileRest] = splitPath(document.fileName);

        return folder === fileFolder ? -1 : Math.abs(fileRest.length - rest.length);
      });

      const file = files.length > 1 ? files.find(({ path }) => compare(path)) : files[0];

      if (file) {try {
        html = await promisify(readFile)(file.fsPath, `utf8`);
      } catch (error) {
        console.error(error);
      }}
    }
  }

  return html.trim();
};

export const readVueTemplate = async () => {
  let html: string = '';
  const activeTextEditor = window.activeTextEditor;
  const document = activeTextEditor?.document;
  if (document) {
    const result = parseComponent(document.getText());
    const templateContent = result.template?.content;
    if (templateContent) {
      html = templateContent;
    }
  }

  return html.trim();
};