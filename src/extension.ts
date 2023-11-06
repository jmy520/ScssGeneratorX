import * as vscode from 'vscode';
import { readHtml, readVueTemplate } from './read-html/read-html';
import { Rendered } from './rendered/rendered';
import { parseComponent } from 'vue-sfc-parser';

const pervious: Array<Rendered> = [];

export function activate(context: vscode.ExtensionContext) {
	console.log('[scss-generator-x] actived!');

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(`scss`, {
		async provideCompletionItems() {
			const html = await readHtml();
			
			let rendered = pervious.find(item => {
					const clean = (value: string) => value.replace(/[\s\n\t]/g, ``);
					return clean(item.html) === clean(html);
			});

			if (!rendered) {
				pervious.push(rendered = new Rendered(html));
			};
			
			return rendered.getSnippets();
		}
	}));

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(`vue`, {
		async provideCompletionItems() {
			const document = vscode.window.activeTextEditor?.document;
			const selection = vscode.window.activeTextEditor?.selection;
			let matchState = false;

			if (document && selection) {
				const result = parseComponent(document.getText());
				const styles = result.styles;
				Array.from(styles).forEach(item => {
					const start = item.start;
					const end = item.end;

					const selectionStart = document.offsetAt(selection.start);
					const selectionEnd = document.offsetAt(selection.end);
					
					if (selectionStart > start && selectionEnd < end) {
						matchState = true;
					}
				});
			}

			if (matchState) {
				const html = await readVueTemplate();
				
				let rendered = pervious.find(item => {
						const clean = (value: string) => value.replace(/[\s\n\t]/g, ``);
						return clean(item.html) === clean(html);
				});

				if (!rendered) {
					pervious.push(rendered = new Rendered(html));
				};

				return rendered.getSnippets();
			}
		}
	}));
}

export function deactivate() {}
