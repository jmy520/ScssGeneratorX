import * as vscode from 'vscode';

export class Config {
  static instance: Config;

  private constructor(public autoChildSelector: boolean, public ignore: string[] | undefined, public mappingRules: object | undefined) {}

  public static getInstance(): Config {
    if (!Config.instance) {
      const mConfig = vscode.workspace.getConfiguration();
      const autoChildSelector: boolean = !!mConfig.get('autoChildSelector');
      const ignore: string[] | undefined = mConfig.get('ignore');
      const mappingRules: object | undefined = mConfig.get('mappingRules');
      Config.instance = new Config(autoChildSelector, ignore, mappingRules);
    }

    vscode.workspace.onDidChangeConfiguration((event) => {
      Config.instance.handleConfigChange(event);
    });

    return Config.instance;
  }

  private handleConfigChange(event: vscode.ConfigurationChangeEvent) {
    const configList = ['autoChildSelector', 'ignore', 'mappingRules'];
    const affected = configList.some(item => event.affectsConfiguration(item));

    if (affected) {
      const mConfig = vscode.workspace.getConfiguration();
      const autoChildSelector: boolean = !!mConfig.get('autoChildSelector');
      const ignore: string[] | undefined = mConfig.get('ignore');
      const mappingRules: object | undefined = mConfig.get('mappingRules');

      this.autoChildSelector = autoChildSelector;
      this.ignore = ignore;
      this.mappingRules = mappingRules;
    }
  }
}