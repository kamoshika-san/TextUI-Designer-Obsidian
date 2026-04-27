import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

export interface PluginSettings {
  defaultDslPath: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  defaultDslPath: '',
};

export class TextUISettingTab extends PluginSettingTab {
  private plugin: Plugin & { settings: PluginSettings; saveData(data: unknown): Promise<void> };

  constructor(app: App, plugin: Plugin & { settings: PluginSettings; saveData(data: unknown): Promise<void> }) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    new Setting(containerEl)
      .setName('Default DSL file path')
      .setDesc('Path to the default .tui.yml file to preview')
      .addText(text => text
        .setPlaceholder('e.g. screens/home.tui.yml')
        .setValue(this.plugin.settings.defaultDslPath)
        .onChange(async (value) => {
          this.plugin.settings.defaultDslPath = value;
          await this.plugin.saveData(this.plugin.settings);
        }));
  }
}
